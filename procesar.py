import os
import re
import json
import subprocess
import urllib.request
import urllib.parse
import tempfile
import requests

# ── Config ────────────────────────────────────────────────────────────────────
ARCHIVE_ACCESS_KEY = 'zOugYIKf9hoBlS5p'
ARCHIVE_SECRET_KEY = 'XwnPRXY7qLk6tee3'
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
    resp = requests.request(method, url, headers=headers, json=body, timeout=30)
    return resp.json()

def upload_to_archive(filepath, filename, identifier):
    print(f"  → Subiendo a Internet Archive: {filename}")
    size_mb = os.path.getsize(filepath) / 1024 / 1024
    print(f"  → Tamaño: {size_mb:.1f} MB")

    url = f"https://s3.us.archive.org/{identifier}/{filename}"
    headers = {
        'Authorization': f'LOW {ARCHIVE_ACCESS_KEY}:{ARCHIVE_SECRET_KEY}',
        'x-archive-auto-make-bucket': '1',
        'x-archive-meta-mediatype': 'movies',
        'x-archive-meta-subject': 'movie',
        'x-archive-ignore-preexisting-bucket': '1',
        'Content-Type': 'video/mp4',
    }

    with open(filepath, 'rb') as f:
        resp = requests.put(url, headers=headers, data=f, timeout=7200)

    print(f"  → Status Archive: {resp.status_code}")
    if resp.status_code not in (200, 201):
        raise Exception(f"Archive error {resp.status_code}: {resp.text[:300]}")

    return f"https://archive.org/download/{identifier}/{filename}"

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

def guardar_en_supabase(tipo, tmdb_id, temporada, episodio, archive_url):
    print(f"  → Guardando link en Supabase...")
    if tipo == 'movie':
        supabase_request('PATCH', f'peliculas?tmdb_id=eq.{tmdb_id}', {
            'url_pixeldrain': archive_url
        })
    else:
        series = supabase_request('GET', f'series?tmdb_id=eq.{tmdb_id}&select=id')
        if not series:
            raise Exception(f"Serie tmdb_id={tmdb_id} no encontrada en Supabase")
        serie_id = series[0]['id']
        supabase_request('PATCH',
            f'episodios?serie_id=eq.{serie_id}&temporada=eq.{temporada}&episodio=eq.{episodio}',
            {'url_pixeldrain': archive_url}
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

            # Identificador único para Archive.org
            identifier = f"netfix-app-{safe_name}-{tmdb_id}"
            if tipo == 'tv':
                identifier += f"-s{temporada:02d}e{episodio:02d}"

            with tempfile.TemporaryDirectory() as tmpdir:
                output_path = os.path.join(tmpdir, f'{safe_name}.mp4')
                download_m3u8(m3u8_url, output_path)
                size_mb = os.path.getsize(output_path) / 1024 / 1024
                print(f"  → Descargado: {size_mb:.1f} MB")
                archive_url = upload_to_archive(output_path, f'{safe_name}.mp4', identifier)
                print(f"  → Archive: {archive_url}")

            guardar_en_supabase(tipo, tmdb_id, temporada, episodio, archive_url)
            print(f"  ✅ Listo: {archive_url}")
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
