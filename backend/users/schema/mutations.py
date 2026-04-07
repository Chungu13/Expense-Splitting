import graphene
import graphql_jwt
from django.contrib.auth.models import User
from .types import UserType
from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings

class CreateUser(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)
        email = graphene.String(required=True)

    def mutate(self, info, username, password, email):
        user = User.objects.create_user(username=username, email=email, password=password)
        return CreateUser(user=user)

class GoogleLogin(graphene.Mutation):
    user = graphene.Field(UserType)
    token = graphene.String()

    class Arguments:
        id_token_str = graphene.String(required=True)

    def mutate(self, info, id_token_str):
        try:
            client_id = getattr(settings, 'GOOGLE_OAUTH_CLIENT_ID', None)
            if not client_id:
                 raise Exception("Google Client ID not configured on server")

            idinfo = id_token.verify_oauth2_token(id_token_str, requests.Request(), client_id)
            
            email = idinfo['email']
            username = idinfo.get('given_name', email.split('@')[0])
            
            user, created = User.objects.get_or_create(email=email, defaults={'username': username})
            
            # 1. Generate the JWT
            token = graphql_jwt.shortcuts.get_token(user)
            
            # 2. Set the JWT as an HTTP-only Cookie in the response
            # Note: Graphene-Django-JWT handles this for the response object in info.context
            graphql_jwt.shortcuts.set_cookie(info.context, token)
            
            return GoogleLogin(user=user, token=token)
            
        except ValueError:
            raise Exception("Invalid Google Token")

class Mutation(graphene.ObjectType):
    # Standard JWT Mutations (these now automatically handle cookies via settings.py)
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.VerifyToken.Field()
    refresh_token = graphql_jwt.RefreshToken.Field()
    delete_cookie = graphql_jwt.DeleteCookie.Field() # Add this to allow Logout
    
    # Custom Mutations
    create_user = CreateUser.Field()
    google_login = GoogleLogin.Field()
