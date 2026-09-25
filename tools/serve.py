"""Dev server: same as `python -m http.server` but always revalidates HTML so
edits show up on a normal reload instead of needing Ctrl+F5."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import os

os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        if self.path.endswith('.html') or self.path == '/':
            self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def log_message(self, *args):
        pass


print('serving on http://127.0.0.1:8019 (no-store for html)')
ThreadingHTTPServer(('127.0.0.1', 8019), Handler).serve_forever()
