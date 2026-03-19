import os
import re
import json
import subprocess
import urllib.parse
import tempfile
import requests
import time

# ── Config ────────────────────────────────────────────────────────────────────
ARCHIVE_ACCESS_KEY = 'zOugYIKf9hoBlS5p'
ARCHIVE_SECRET_KEY = 'XwnPRXY7qLk6tee3'
SUPABASE_URL       = 'https://ngnutcjeuknwiaebduun.supabase.co'
SUPABASE_KEY       = os.environ.get('SUPABASE_KEY')
PENDIENTES_FILE    = 'pendientes.txt'

# ── Helpers ───────────────────────────────────────────────────────────────────
def supabase_request(method, path, body=None):
    url = f"{SUPABASE_URL}/rest/v1/{path}"
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
    }
    resp = requests.request(method, url, headers=headers, json=body, timeout=30)
    return resp.json()

def upload_to_archive(filepath, filename, identifier):
    print(f"  → Subiendo a Internet Archive: {filename}")
    url = f"https://s3.us.archive.org/{identifier}/{filename}"
    headers = {
        'Authorization': f'LOW {ARCHIVE_ACCESS_KEY}:{ARCHIVE_SECRET_KEY}',
        'x-archive-auto-make-bucket': '1',
        'x-archive-meta-mediatype': 'movies',
        'x-archive-meta-subject': 'movie',
        'Content-Type': 'video/mp4',
    }

    with open(filepath, 'rb') as f:
        # Timeout largo para archivos grandes
        resp = requests.put(url, headers=headers, data=f, timeout=None)

    if resp.status_code not in (200, 201):
        raise Exception(f"Archive error {resp.status_code}: {resp.text[:200]}")
    
    return f"https://archive.org/download/{identifier}/{filename}"

def download_m3u8(m3u8_url, output_path):
    print(f"  → Descargando con ffmpeg...")
    parsed = urllib.parse.urlparse(m3u8_url)
    referer = f"{parsed.scheme}://{parsed.netloc}/"
    
    # Headers optimizados para evitar bloqueos
    cmd = [
        'ffmpeg', '-y', '-hide_banner', '-loglevel', 'error',
        '-headers', f'Referer: {referer}\r\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36\r\n',
        '-i', m3u8_url,
        '-c', 'copy',
        '-bsf:a', 'aac_adtstoasc',
        output_path
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise Exception(f"ffmpeg error: {result.stderr[-500:]}")

def actualizar_pendientes(linea_completada, error=None):
    """Elimina la línea procesada del archivo inmediatamente."""
    if not os.path.exists(PENDIENTES_FILE): return
    
    with open(PENDIENTES_FILE, 'r') as f:
        lineas = f.readlines()
    
    with open(PENDIENTES_FILE, 'w') as f:
        for l in lineas:
            if l.strip() == linea_completada.strip():
                if error:
                    f.write(f"# ERROR: {error}\n# {l}")
                continue # No escribir la línea si se procesó o dio error
            f.write(l)

# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    if not SUPABASE_KEY:
        print("Error: SUPABASE_KEY no configurada.")
        return

    if not os.path.exists(PENDIENTES_FILE):
        print("No hay pendientes.")
        return

    with open(PENDIENTES_FILE, 'r') as f:
        lineas = [l.strip() for l in f.readlines() if l.strip() and not l.startswith('#')]

    for linea in lineas:
        print(f"\n🚀 PROCESANDO: {linea[:70]}...")
        try:
            # Parsing de parámetros
            params = dict(p.split('=', 1) for p in linea.split('|'))
            tmdb_id   = params['tmdb_id']
            tipo      = params.get('tipo', 'movie')
            m3u8_url  = params['url']
            titulo    = params.get('titulo', f'video_{tmdb_id}')
            
            # Formatear nombre seguro
            safe_name = re.sub(r'\W+', '_', titulo.lower()).strip('_')
            identifier = f"netfix-{safe_name}-{tmdb_id}"

            with tempfile.TemporaryDirectory() as tmpdir:
                output_path = os.path.join(tmpdir, 'video.mp4')
                
                # Ejecución
                download_m3u8(m3u8_url, output_path)
                archive_url = upload_to_archive(output_path, f"{safe_name}.mp4", identifier)
                
                # Guardar en DB
                guardar_en_supabase(tipo, tmdb_id, params.get('temporada', 1), params.get('episodio', 1), archive_url)
                
                print(f"  ✅ ÉXITO: {archive_url}")
                actualizar_pendientes(linea) # Guardado inmediato
                
        except Exception as e:
            print(f"  ❌ FALLÓ: {e}")
            actualizar_pendientes(linea, error=str(e))
        
        # Pausa de cortesía para Internet Archive S3
        time.sleep(2)

def guardar_en_supabase(tipo, tmdb_id, temporada, episodio, url):
    if tipo == 'movie':
        supabase_request('PATCH', f'peliculas?tmdb_id=eq.{tmdb_id}', {'url_pixeldrain': url})
    else:
        series = supabase_request('GET', f'series?tmdb_id=eq.{tmdb_id}&select=id')
        if series:
            s_id = series[0]['id']
            supabase_request('PATCH', f'episodios?serie_id=eq.{s_id}&temporada=eq.{temporada}&episodio=eq.{episodio}', {'url_pixeldrain': url})

if __name__ == '__main__':
    main()
