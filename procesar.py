import os
import re
import json
import base64
import subprocess
import urllib.request
import urllib.parse
import tempfile
import requests

# ── Config ────────────────────────────────────────────────────────────────────
PIXELDRAIN_API_KEY = '79cb2d33-ee92-4835-8e14-eacd61c61451'
SUPABASE_URL       = 'https://ngnutcjeuknwiaebduun.supabase.co'
SUPABASE_KEY       = os.environ['SUPABASE_KEY']
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
    resp = requests.request(method, url, headers=headers, json=body)
    return resp.json()

def upload_to_pixeldrain(filepath, filename):
    print(f"  → Subiendo a Pixeldrain con curl: {filename}")
    # Usar curl directamente — maneja mejor SSL para archivos grandes
    cmd = [
        'curl', '-X', 'POST',
        '-u', f':{PIXELDRAIN_API_KEY}',
        '-F', f'file=@{filepath};filename={filename}',
        '-F', f'name={filename}',
        '--retry', '3',
        '--retry-delay', '5',
        '-s',
        'https://pixeldrain.com/api/file/'
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise Exception(f"curl error: {result.stderr}")
    
    response = json.loads(result.stdout)
    if 'id' not in response:
        raise Exception(f"Pixeldrain error: {result.stdout}")
    
    return f"https://pixeldrain.com/u/{response['id']}"

def download_m3u8(m3u8_url, output_path):
    print(f"  → Descargando m3u8...")
    parsed = urllib.parse.urlparse(m3u8_url)
    referer = f"{parsed.scheme}://{parsed.netloc}/"
    cmd = [
        'ffmpeg', '-y',
        '-headers', (
            f'Referer: {referer}\r\n'
            'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
            'AppleWebKit/537.36 (KHTML, like Gecko) '
            'Chrome/120.0.0.0 Safari/537.36\r\n'
            f'Origin: {referer}\r\n'
        ),
        '-i', m3u8_url,
        '-c', 'copy',
        '-bsf:a', 'aac_adtstoasc',
        output_path
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise Exception(f"ffmpeg error: {result.stderr[-800:]}")

def guardar_en_supabase(tipo, tmdb_id, temporada, episodio, pixeldrain_url):
    print(f"  → Guardando link en Supabase...")
    if tipo == 'movie':
        supabase_request('PATCH', f'peliculas?tmdb_id=eq.{tmdb_id}', {
            'url_pixeldrain': pixeldrain_url
        })
    else:
        series = supabase_request('GET', f'series?tmdb_id=eq.{tmdb_id}&select=id')
        if not series:
            raise Exception(f"Serie tmdb_id={tmdb_id} no encontrada en Supabase")
        serie_id = series[0]['id']
        supabase_request('PATCH',
            f'episodios?serie_id=eq.{serie_id}&temporada=eq.{temporada}&episodio=eq.{episodio}',
            {'url_pixeldrain': pixeldrain_url}
        )

# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    if not os.path.exists(PENDIENTES_FILE):
        print("No hay archivo pendientes.txt")
        return

    with open(PENDIENTES_FILE, 'r') as f:
        lineas = [l.strip() for l in f.readlines() if l.strip() and not l.startswith('#')]

    if not lineas:
        print("No hay pendientes.")
        return

    procesadas = []
    errores = []

    for linea in lineas:
        print(f"\n── Procesando: {linea[:80]}...")
        try:
            params = dict(p.split('=', 1) for p in linea.split('|'))
            tmdb_id   = params['tmdb_id']
            tipo      = params.get('tipo', 'movie')
            m3u8_url  = params['url']
            titulo    = params.get('titulo', f'{tipo}_{tmdb_id}')
            temporada = int(params.get('temporada', 1))
            episodio  = int(params.get('episodio', 1))

            safe_name = re.sub(r'[^\w]', '_', titulo.lower())
            if tipo == 'tv':
                safe_name += f'_s{temporada:02d}e{episodio:02d}'

            with tempfile.TemporaryDirectory() as tmpdir:
                output_path = os.path.join(tmpdir, f'{safe_name}.mp4')
                download_m3u8(m3u8_url, output_path)
                size_mb = os.path.getsize(output_path) / 1024 / 1024
                print(f"  → Descargado: {size_mb:.1f} MB")
                pixeldrain_url = upload_to_pixeldrain(output_path, f'{safe_name}.mp4')
                print(f"  → Pixeldrain: {pixeldrain_url}")

            guardar_en_supabase(tipo, tmdb_id, temporada, episodio, pixeldrain_url)
            print(f"  ✅ Listo: {pixeldrain_url}")
            procesadas.append(linea)

        except Exception as e:
            print(f"  ❌ Error: {e}")
            errores.append(f"# ERROR: {e}\n# {linea}")

    restantes = [l for l in lineas if l not in procesadas]
    with open(PENDIENTES_FILE, 'w') as f:
        if restantes:
            f.write('\n'.join(restantes) + '\n')
        if errores:
            f.write('\n'.join(errores) + '\n')

    print(f"\n── Resumen: {len(procesadas)} procesadas, {len(errores)} errores")

if __name__ == '__main__':
    main()
