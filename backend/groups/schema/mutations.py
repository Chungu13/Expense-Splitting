import graphene
from .types import GroupType
from ..models import Group

class CreateGroup(graphene.Mutation):
    group = graphene.Field(GroupType)

    class Arguments:
        name = graphene.String(required=True)
        description = graphene.String()

    def mutate(self, info, name, description=""):
        user = info.context.user
        if user.is_anonymous:
            raise Exception("Log in to create a group!")
        group = Group.objects.create(name=name, description=description, created_by=user)
        return CreateGroup(group=group)

class Mutation(graphene.ObjectType):
    create_group = CreateGroup.Field()
