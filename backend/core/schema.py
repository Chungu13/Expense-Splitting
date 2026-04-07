import graphene
import users.schema
import groups.schema
import expenses.schema

class Query(
    users.schema.Query,
    groups.schema.Query,
    expenses.schema.Query,
    graphene.ObjectType
):
    pass

class Mutation(
    users.schema.Mutation,
    groups.schema.Mutation,
    expenses.schema.Mutation,
    graphene.ObjectType
):
    pass

schema = graphene.Schema(query=Query, mutation=Mutation)
