import graphene
import graphql_jwt
from django.contrib.auth.models import User
from .types import UserType
from .. import auth_services

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
        # 1. Verify the token (Separated Concern)
        id_info = auth_services.verify_google_id_token(id_token_str)
        
        # 2. Handle User Logic (Separated Concern)
        user = auth_services.get_or_create_user_from_google(id_info)
        
        # 3. Handle Token Issuance & Cookies (Separated Concern)
        token = auth_services.issue_user_jwt(info, user)
        
        return GoogleLogin(user=user, token=token)

class Mutation(graphene.ObjectType):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.VerifyToken.Field()
    refresh_token = graphql_jwt.RefreshToken.Field()
    delete_cookie = graphql_jwt.DeleteCookie.Field()
    
    create_user = CreateUser.Field()
    google_login = GoogleLogin.Field()
