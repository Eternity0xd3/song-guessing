import json
from bs4 import BeautifulSoup

def read_HTML_table():
    with open('./python-analyse-tools/table.txt', 'r', encoding="utf-8") as file:
        html_content = file.read()
    return html_content

def fetch_songlist():
    html_content = read_HTML_table()
    soup = BeautifulSoup(html_content, 'html.parser')
    table = soup.find('table')

    # collect song data
    tabel_rows = table.find_all('tr')[1:]  # Skip the header row
    song_list = []
    id_counter = 0
    for row in tabel_rows:
        cells = row.find_all('td')
        if len(cells) >= 3:
            id = id_counter
            song_name = cells[1].get_text(strip=True)
            artist_name = cells[2].get_text(strip=True)
            past_level = cells[3].get_text(strip=True)
            present_level = cells[4].get_text(strip=True)
            future_level = cells[5].get_text(strip=True)
            eternal_level = cells[6].get_text(strip=True)
            beyond_level = cells[7].get_text(strip=True)
            song_length= cells[8].get_text(strip=True)
            bpm = cells[9].get_text(strip=True)
            album_name = cells[10].find("a").get("title")
            append_version_raw = cells[11].find_all(text=True, recursive=False)
            if append_version_raw:
                append_version = append_version_raw[0].strip()
            else:
                append_version = cells.get_text(strip=True)
            song_list.append({
                'id': id,
                'song_name': song_name,
                'artist_name': artist_name,
                'past_level': past_level,
                'present_level': present_level,
                'future_level': future_level,
                'eternal_level': eternal_level,
                'beyond_level': beyond_level,
                'song_length': song_length,
                'bpm': bpm,
                'album_name': album_name,
                'append_version': append_version
            })
            id_counter += 1

    return song_list

def save_json(data, filename):
    with open(f"{filename}.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    songs = fetch_songlist()
    save_json(songs, "songs")