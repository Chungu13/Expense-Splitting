import graphene
from graphene_django import DjangoObjectType
from ..models import Expense, ExpenseSplit, Settlement

class ExpenseType(DjangoObjectType):
    class Meta:
        model = Expense
        fields = "__all__"

class ExpenseSplitType(DjangoObjectType):
    class Meta:
        model = ExpenseSplit
        fields = "__all__"

class SettlementType(DjangoObjectType):
    class Meta:
        model = Settlement
        fields = "__all__"
