import graphene
from .types import ExpenseType
from ..models import Expense
from datetime import date

class CreateExpense(graphene.Mutation):
    expense = graphene.Field(ExpenseType)

    class Arguments:
        description = graphene.String(required=True)
        amount = graphene.Decimal(required=True)
        group_id = graphene.Int()

    def mutate(self, info, description, amount, group_id=None):
        user = info.context.user
        if user.is_anonymous:
            raise Exception("Unauthorized")
        expense = Expense.objects.create(
            description=description,
            total_amount=amount,
            payer=user,
            group_id=group_id,
            date_incurred=date.today()
        )
        return CreateExpense(expense=expense)

class Mutation(graphene.ObjectType):
    create_expense = CreateExpense.Field()
