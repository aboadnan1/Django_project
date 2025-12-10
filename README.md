Local development — Django + Vite React

Quick steps to run project locally (Windows PowerShell)

1. Create and activate Python virtual environment

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

2. Install Python dependencies

```powershell
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
# if additional packages are needed install them, e.g.:
python -m pip install djangorestframework_simplejwt
```

3. Prepare database

```powershell
python manage.py makemigrations
python manage.py migrate
```

4. Create a superuser (interactive)

```powershell
python manage.py createsuperuser
```

Admin UI: http://127.0.0.1:8000/admin/

(If you previously used a helper script to create a superuser, that script has been removed from the repository for security — create users interactively instead.)

5. Start Django backend

```powershell
python manage.py runserver 0.0.0.0:8000
```

6. Start frontend dev server (in separate terminal)

```powershell
cd front
npm install
npm run dev
# default Vite dev URL: http://localhost:5173/
```

7. Proxying API requests (optional)

- If you want the React dev server to proxy API calls to Django, configure `vite.config.js` or use the `proxy` option in the dev server configuration. I can add this for you.

Security notes

- Do not commit virtual environment folders (`env/`, `.venv/`, `venv/`). Those are ignored by `.gitignore`.
- Do not store plaintext credentials in scripts; use `createsuperuser` or environment variables.

If you want, I can:

- Add a Vite dev proxy for `http://127.0.0.1:8000`
- Add a GitHub Actions workflow to build/deploy the frontend automatically
- Recreate a superuser interactively for you (I can run `createsuperuser` in the running environment if you want a different email)
