import graphene
from .types import ExpenseType
from .. import services

class SplitInput(graphene.InputObjectType):
    user_id = graphene.Int(required=True)
    value = graphene.Decimal(required=True)

class CreateExpense(graphene.Mutation):
    expense = graphene.Field(ExpenseType)

    class Arguments:
        description = graphene.String(required=True)
        amount = graphene.Decimal(required=True)
        group_id = graphene.Int()
        split_type = graphene.String() # EQUAL, FIXED, PERCENT
        custom_splits = graphene.List(SplitInput)

    def mutate(self, info, description, amount, group_id=None, split_type='EQUAL', custom_splits=None):
        user = info.context.user
        if user.is_anonymous:
            raise Exception("Login required to add expenses")
        
        expense = services.create_expense_with_splits(
            description=description,
            total_amount=amount,
            payer_id=user.id,
            group_id=group_id,
            split_type=split_type,
            custom_splits=custom_splits
        )
        return CreateExpense(expense=expense)

class SettleUp(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        payee_id = graphene.Int(required=True)
        amount = graphene.Decimal(required=True)
        group_id = graphene.Int()

    def mutate(self, info, payee_id, amount, group_id=None):
        user = info.context.user
        if user.is_anonymous:
            raise Exception("Unauthorized")
        
        from ..models import Settlement
        Settlement.objects.create(
            payer=user,
            payee_id=payee_id,
            amount=amount,
            group_id=group_id,
            status='COMPLETED'
        )
        return SettleUp(success=True)

class Mutation(graphene.ObjectType):
    create_expense = CreateExpense.Field()
    settle_up = SettleUp.Field()
