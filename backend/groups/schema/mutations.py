import graphene
from .types import GroupType, GroupMemberType
from .. import services

class CreateGroup(graphene.Mutation):
    group = graphene.Field(GroupType)

    class Arguments:
        name = graphene.String(required=True)
        description = graphene.String()

    def mutate(self, info, name, description=""):
        user = info.context.user
        if user.is_anonymous:
            raise Exception("Log in to create a group!")
        group = services.create_initial_group(name, description, user)
        return CreateGroup(group=group)

class AddMember(graphene.Mutation):
    membership = graphene.Field(GroupMemberType)

    class Arguments:
        group_id = graphene.Int(required=True)
        email = graphene.String(required=True)

    def mutate(self, info, group_id, email):
        user = info.context.user
        if user.is_anonymous:
            raise Exception("Unauthorized")
        membership = services.add_user_to_group(group_id, email, user)
        return AddMember(membership=membership)

class RemoveMember(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        group_id = graphene.Int(required=True)
        user_id = graphene.Int(required=True)

    def mutate(self, info, group_id, user_id):
        user = info.context.user
        if user.is_anonymous:
            raise Exception("Unauthorized")
        success = services.remove_user_from_group(group_id, user_id, user)
        return RemoveMember(success=success)

class UpdateRole(graphene.Mutation):
    membership = graphene.Field(GroupMemberType)

    class Arguments:
        group_id = graphene.Int(required=True)
        user_id = graphene.Int(required=True)
        role = graphene.String(required=True)

    def mutate(self, info, group_id, user_id, role):
        user = info.context.user
        if user.is_anonymous:
            raise Exception("Unauthorized")
        membership = services.update_member_role(group_id, user_id, role, user)
        return UpdateRole(membership=membership)

class Mutation(graphene.ObjectType):
    create_group = CreateGroup.Field()
    add_member = AddMember.Field()
    remove_member = RemoveMember.Field()
    update_member_role = UpdateRole.Field()
