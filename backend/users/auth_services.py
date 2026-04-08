from django.contrib.auth.models import User
from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
import graphql_jwt

def verify_google_id_token(token_str: str):
    """Verifies a Google ID Token and returns the user info."""
    client_id = getattr(settings, 'GOOGLE_OAUTH_CLIENT_ID', None)
    if not client_id:
        raise Exception("Google Client ID not configured on server")
    
    try:
        return id_token.verify_oauth2_token(token_str, requests.Request(), client_id)
    except ValueError:
        raise Exception("Invalid Google Token")

def get_or_create_user_from_google(id_info: dict):
    """Handles the finding or creation of a user from Google info."""
    email = id_info['email']
    username = id_info.get('given_name', email.split('@')[0])
    
    user, created = User.objects.get_or_create(
        email=email, 
        defaults={'username': username}
    )
    return user

def issue_user_jwt(info, user):
    """Generates a JWT and sets the auth cookie."""
    token = graphql_jwt.shortcuts.get_token(user)
    graphql_jwt.shortcuts.set_cookie(info.context, token)
    return token
