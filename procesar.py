import os
import re
import subprocess
import urllib.parse
import tempfile
import requests

# ── Config ────────────────────────────────────────────────────────────────────
B2_KEY_ID          = 'fd1505cd100c'
B2_APP_KEY         = '005b9ab6794f863e7a5e280be75b94cb1b5785b04b'
B2_BUCKET_NAME     = 'netfix-vidios'
SUPABASE_URL       = 'https://ngnutcjeuknwiaebduun.supabase.co'
SUPABASE_KEY       = os.environ['SUPABASE_KEY']
PENDIENTES_FILE    = 'pendientes.txt'

# ── Backblaze B2 ──────────────────────────────────────────────────────────────
def b2_authorize():
    resp = requests.get(
        'https://api.backblazeb2.com/b2api/v2/b2_authorize_account',
        auth=(B2_KEY_ID, B2_APP_KEY)
    )
    data = resp.json()
    return data['authorizationToken'], data['apiUrl'], data['downloadUrl']

def b2_get_upload_url(api_url, auth_token, bucket_id):
    resp = requests.post(
        f'{api_url}/b2api/v2/b2_get_upload_url',
        headers={'Authorization': auth_token},
        json={'bucketId': bucket_id}
    )
    data = resp.json()
    return data['uploadUrl'], data['authorizationToken']

def b2_get_bucket_id(api_url, auth_token):
    resp = requests.post(
        f'{api_url}/b2api/v2/b2_list_buckets',
        headers={'Authorization': auth_token},
        json={'accountId': requests.get(
            'https://api.backblazeb2.com/b2api/v2/b2_authorize_account',
            auth=(B2_KEY_ID, B2_APP_KEY)
        ).json()['accountId']}
    )
    buckets = resp.json()['buckets']
    for b in buckets:
        if b['bucketName'] == B2_BUCKET_NAME:
            return b['bucketId']
    raise Exception(f"Bucket {B2_BUCKET_NAME} no encontrado")

def upload_to_b2(filepath, filename):
    print(f"  → Autorizando Backblaze B2...")
    auth_token, api_url, download_url = b2_authorize()

    print(f"  → Obteniendo bucket...")
    resp = requests.post(
        f'{api_url}/b2api/v2/b2_list_buckets',
        headers={'Authorization': auth_token},
        json={'accountId': requests.get(
            'https://api.backblazeb2.com/b2api/v2/b2_authorize_account',
            auth=(B2_KEY_ID, B2_APP_KEY)
        ).json()['accountId'], 'bucketName': B2_BUCKET_NAME}
    )
    bucket_id = resp.json()['buckets'][0]['bucketId']

    upload_url, upload_token = b2_get_upload_url(api_url, auth_token, bucket_id)

    size = os.path.getsize(filepath)
    size_mb = size / 1024 / 1024
    print(f"  → Subiendo a B2: {filename} ({size_mb:.1f} MB)")

    import hashlib
    with open(filepath, 'rb') as f:
        data = f.read()
    sha1 = hashlib.sha1(data).hexdigest()

    resp = requests.post(
        upload_url,
        headers={
            'Authorization': upload_token,
            'X-Bz-File-Name': urllib.parse.quote(filename),
            'Content-Type': 'video/mp4',
            'Content-Length': str(size),
            'X-Bz-Content-Sha1': sha1,
        },
        data=data
    )

    if resp.status_code != 200:
        raise Exception(f"B2 error {resp.status_code}: {resp.text[:300]}")

    print(f"  → Status B2: {resp.status_code}")
    return f"{download_url}/file/{B2_BUCKET_NAME}/{filename}"

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

def download_video(url, output_path):
    print(f"  → Descargando video...")
    parsed = urllib.parse.urlparse(url)
    referer = f"{parsed.scheme}://{parsed.netloc}/"
    cmd = [
        'ffmpeg', '-y',
        '-reconnect', '1',
        '-reconnect_streamed', '1',
        '-reconnect_delay_max', '5',
        '-headers', (
            f'Referer: {referer}\r\n'
            'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
            'AppleWebKit/537.36 (KHTML, like Gecko) '
            'Chrome/120.0.0.0 Safari/537.36\r\n'
            f'Origin: {referer}\r\n'
        ),
        '-i', url,
        '-c:v', 'copy',
        '-c:a', 'ac3',
        output_path
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise Exception(f"ffmpeg error: {result.stderr[-800:]}")

def guardar_en_supabase(tipo, tmdb_id, temporada, episodio, b2_url):
    print(f"  → Guardando link en Supabase...")
    if tipo == 'movie':
        supabase_request('PATCH', f'peliculas?tmdb_id=eq.{tmdb_id}', {
            'url_pixeldrain': b2_url
        })
    else:
        series = supabase_request('GET', f'series?tmdb_id=eq.{tmdb_id}&select=id')
        if not series:
            raise Exception(f"Serie tmdb_id={tmdb_id} no encontrada en Supabase")
        serie_id = series[0]['id']
        supabase_request('PATCH',
            f'episodios?serie_id=eq.{serie_id}&temporada=eq.{temporada}&episodio=eq.{episodio}',
            {'url_pixeldrain': b2_url}
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
            video_url = params['url']
            titulo    = params.get('titulo', f'{tipo}_{tmdb_id}')
            temporada = int(params.get('temporada', 1))
            episodio  = int(params.get('episodio', 1))

            safe_name = re.sub(r'[^\w]', '_', titulo.lower())
            if tipo == 'tv':
                safe_name += f'_s{temporada:02d}e{episodio:02d}'

            with tempfile.TemporaryDirectory() as tmpdir:
                output_path = os.path.join(tmpdir, f'{safe_name}.mp4')
                download_video(video_url, output_path)
                size_mb = os.path.getsize(output_path) / 1024 / 1024
                print(f"  → Descargado: {size_mb:.1f} MB")
                b2_url = upload_to_b2(output_path, f'{safe_name}.mp4')
                print(f"  → B2: {b2_url}")

            guardar_en_supabase(tipo, tmdb_id, temporada, episodio, b2_url)
            print(f"  ✅ Listo: {b2_url}")
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