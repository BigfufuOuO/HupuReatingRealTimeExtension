import requests

def get_html(url):
    headers = {
        'authorization': '7935be4c41d8760a28c05581a7b1f570',
    }
    response = requests.get(url, headers=headers)
    return response.text

print(get_html('https://open.tjstats.com/match-auth-app/open/v1/compound/matchDetail?matchId=11444'))