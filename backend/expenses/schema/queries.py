import graphene
from .types import ExpenseType, SettlementType
from ..models import Expense, Settlement

class Query(graphene.ObjectType):
    all_expenses = graphene.List(ExpenseType)
    my_settlements = graphene.List(SettlementType)

    def resolve_all_expenses(self, info):
        return Expense.objects.all()

    def resolve_my_settlements(self, info):
        user = info.context.user
        if user.is_anonymous:
            return Settlement.objects.none()
        return Settlement.objects.filter(payer=user) | Settlement.objects.filter(payee=user)
