"""Read existing Hits counters without incrementing them; publish verified snapshots."""
import json
import time
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

target = Path(__file__).with_name('visit-stats.json')
try:
    snapshot = json.loads(target.read_text(encoding='utf-8'))
except (FileNotFoundError, ValueError):
    snapshot = {'pages': {}}
snapshot['source'] = 'https://hits.sh'
snapshot['periodBasis'] = 'Hits 집계 기준 최근 7일 / 최근 1개월'
snapshot['attemptedAt'] = datetime.now(timezone.utc).isoformat()
for page in ['index.html', 'blog.html']:
    for attempt in range(3):
        try:
            url = 'https://hits.sh/api/urns/keunjkim.github.io/100-Mountains-Isliands/' + page
            request = urllib.request.Request(url, headers={'User-Agent': 'JK-Hiking-Statistics/1.0'})
            with urllib.request.urlopen(request, timeout=20) as response:
                result = json.load(response)
            if not all(type(result.get(key)) is int and result[key] >= 0 for key in ['total', 'weekly', 'monthly']):
                raise ValueError('Invalid statistics response')
            if not result['weekly'] <= result['monthly'] <= result['total']:
                raise ValueError('Inconsistent statistics response')
            snapshot['pages'][page] = {key: result[key] for key in ['total', 'weekly', 'monthly']}
            snapshot['pages'][page]['updatedAt'] = datetime.now(timezone.utc).isoformat()
            print(page, snapshot['pages'][page])
            break
        except Exception as error:
            print(page, 'retry', attempt + 1, str(error))
            if attempt < 2:
                time.sleep(2)
            else:
                print('Keeping previous verified values; never substitute zero.')
snapshot['updatedAt'] = max((v['updatedAt'] for v in snapshot['pages'].values()), default=None)
target.write_text(json.dumps(snapshot, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
if len(snapshot['pages']) != 2:
    raise SystemExit('Statistics not available for both pages')
