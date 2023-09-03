from flask import request

def get_forwarded_for():
    return (request.headers.get("X-Forwarded-For", "").split(",")[0] or "127.0.0.1").strip()
