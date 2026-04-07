from django.contrib import admin
from .models import Expense, ExpenseSplit, Settlement

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('description', 'total_amount', 'payer', 'group', 'date_incurred')
    list_filter = ('group', 'date_incurred')
    search_fields = ('description',)

@admin.register(ExpenseSplit)
class ExpenseSplitAdmin(admin.ModelAdmin):
    list_display = ('expense', 'user', 'amount_owed')

@admin.register(Settlement)
class SettlementAdmin(admin.ModelAdmin):
    list_display = ('payer', 'payee', 'amount', 'status', 'date_settled')
    list_filter = ('status',)
