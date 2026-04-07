import graphene
from .types import GroupType
from ..models import Group

class Query(graphene.ObjectType):
    all_groups = graphene.List(GroupType)
    group_by_id = graphene.Field(GroupType, id=graphene.Int(required=True))

    def resolve_all_groups(self, info):
        return Group.objects.all()

    def resolve_group_by_id(self, info, id):
        return Group.objects.get(pk=id)
