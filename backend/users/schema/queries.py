import graphene
from .types import UserType, ProfileType
from django.contrib.auth.models import User

class Query(graphene.ObjectType):
    me = graphene.Field(UserType)
    all_users = graphene.List(UserType)

    def resolve_me(self, info):
        user = info.context.user
        if user.is_anonymous:
            return None
        return user

    def resolve_all_users(self, info):
        return User.objects.all()
