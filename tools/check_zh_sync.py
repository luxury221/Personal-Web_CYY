import html
import io
import re
import glob

issues = []
for path in glob.glob('*.html'):
    s = io.open(path, encoding='utf-8').read()
    # elements carrying data-zh
    for m in re.finditer(r'<([a-z0-9]+)\b[^>]*?data-zh="([^"]*)"[^>]*>(.*?)</\1>', s, re.S):
        tag, dz, inner = m.group(1), m.group(2), m.group(3)
        if tag == 'meta' or 'data-en' not in m.group(0):
            continue
        # normalize: inner HTML -> text (br -> newline), unescape, collapse
        text = re.sub(r'<br\s*/?>', '\n', inner)
        text = re.sub(r'<[^>]+>', '', text)
        text = html.unescape(text)
        want = dz.replace('\\n', '\n')
        norm = lambda t: re.sub(r'\s+', ' ', t).strip()
        if norm(text) != norm(want):
            issues.append((path, tag, norm(want)[:70], norm(text)[:70]))

print(f'{len(issues)} mismatches:')
for path, tag, want, got in issues:
    print(f'\n[{path}] <{tag}>')
    print(f'  data-zh: {want}')
    print(f'  inner  : {got}')
