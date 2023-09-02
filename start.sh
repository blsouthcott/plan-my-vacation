# custom startup script for heroku
#!/bin/sh
cd backend && gunicorn run:app