FROM python:3.11-slim

WORKDIR /app

COPY . .

ENV PORT 8080

# Run a simple HTTP server on the expected port to serve the static frontend
CMD python -c "import os; import http.server; import socketserver; port = int(os.environ.get('PORT', 8080)); Handler = http.server.SimpleHTTPRequestHandler; httpd = socketserver.TCPServer(('', port), Handler); print(f'Serving at port {port}'); httpd.serve_forever()"
