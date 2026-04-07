import graphene
from graphene_django import DjangoObjectType
from django.contrib.auth.models import User
from ..models import Profile, Friendship

class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name")

class ProfileType(DjangoObjectType):
    class Meta:
        model = Profile
        fields = "__all__"

class FriendshipType(DjangoObjectType):
    class Meta:
        model = Friendship
        fields = "__all__"
