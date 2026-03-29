# Flask backend (local)

## Setup

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Backend runs on `http://localhost:5000`.

## Endpoints

- `GET /api/health`
- `POST /api/event-details` (JSON)
- `POST /api/uploads/logos` (multipart form-data `files`, max 2)
- `DELETE /api/uploads/logos/<id>`
- `POST /api/uploads/ministers` (multipart form-data `files`)
- `DELETE /api/uploads/ministers/<id>`
- `GET /uploads/<path>` serves uploaded files

