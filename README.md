# Text-Utilities — Django Full-Stack Demo

A modern, beginner-friendly Django web app that lets you **capitalize** text, **remove punctuations**, and **remove extra spaces** — with a polished Bootstrap 5 UI, animations, live JavaScript previews, and database-backed history.

## Features

| Area | Details |
|------|---------|
| **UI** | Bootstrap 5, custom CSS, smooth animations, toggle switches, glassmorphic cards |
| **JavaScript** | Live character & word counter, live preview, disabled submit when empty |
| **Backend** | Django views, CSRF-protected POST, text processing pipeline |
| **Database** | SQLite + Django ORM — every transformation is saved to `TextHistory` |
| **History page** | Browse all past transformations with timestamps |
| **Admin** | `TextHistory` registered in Django admin |

## Project Structure

```
DjangoBlog/
├── manage.py
├── db.sqlite3
├── firstproject/          # Django project settings & root URLs
│   ├── settings.py
│   ├── urls.py
│   └── ...
├── textutils/             # Our main app
│   ├── models.py          # TextHistory model
│   ├── views.py           # index, analyze, history
│   ├── urls.py            # app-level routes
│   ├── admin.py           # admin registration
│   └── templates/textutils/
│       ├── base.html      # shared layout
│       ├── home.html      # form page
│       ├── analyzed.html  # result page
│       └── history.html   # history table
├── static/
│   ├── css/style.css      # custom styles
│   └── js/main.js         # live counters & preview
└── templates/             # (legacy templates — kept for reference)
```

## Requirements

- Python 3.x
- Django 5.x (`pip install django`)

## Running the Project
reate virtual environment
python -m venv venv
```bash
Activate it

PowerShell:

venv\Scripts\Activate
# 1. Install Django (if not already)
pip install django

# 2. Apply migrations
python manage.py migrate

# 3. Start the dev server
python manage.py runserver

# 4. Open http://127.0.0.1:8000/
```

## Dockerizing (Optional)

Create a `Dockerfile` in the project root:

```dockerfile
# ---------- Dockerfile ----------
FROM python:3.13-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Run migrations & collect static files
RUN python manage.py migrate --run-syncdb
RUN python manage.py collectstatic --noinput || true

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

Create a `requirements.txt`:

```
django>=5.2,<6
```

Build & run:

```bash
docker build -t text-utilities .
docker run -p 8000:8000 text-utilities
```

## Notes

- Do not commit `db.sqlite3` if you plan to use a shared repository; it is a local database.
- Update this README with more details about your apps, models, and views as your project grows.
