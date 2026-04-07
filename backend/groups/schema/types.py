import graphene
from graphene_django import DjangoObjectType
from ..models import Group, GroupMember

class GroupType(DjangoObjectType):
    class Meta:
        model = Group
        fields = "__all__"

class GroupMemberType(DjangoObjectType):
    class Meta:
        model = GroupMember
        fields = "__all__"
