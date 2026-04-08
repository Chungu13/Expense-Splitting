from django.db import transaction
from django.contrib.auth.models import User
from .models import Expense, ExpenseSplit
from groups.models import Group
from decimal import Decimal
from datetime import date

def create_expense_with_splits(description, total_amount, payer_id, group_id=None, split_type='EQUAL', custom_splits=None):
    """
    Handles the creation of an expense and its individual shares.
    custom_splits: List of dicts [{'user_id': 1, 'value': 20.00}]
    """
    total_amount = Decimal(str(total_amount))
    
    with transaction.atomic():
        # 1. Create the base expense
        expense = Expense.objects.create(
            description=description,
            total_amount=total_amount,
            payer_id=payer_id,
            group_id=group_id,
            date_incurred=date.today()
        )
        
        # 2. Determine who is involved
        if group_id:
            # Get all members of the group
            participants = User.objects.filter(group_memberships__group_id=group_id)
        elif custom_splits:
            # For 1-on-1 or custom groups, use the provided user IDs
            participant_ids = [s['user_id'] for s in custom_splits]
            # Ensure the payer is included if not in custom_splits (optional depending on UX)
            participants = User.objects.filter(id__in=participant_ids)
        else:
            # Fallback to just the payer
            participants = User.objects.filter(id=payer_id)

        # 3. Handle the Split Logic
        shares = []
        if split_type == 'EQUAL':
            share_amount = total_amount / participants.count()
            for user in participants:
                shares.append(ExpenseSplit(expense=expense, user=user, amount_owed=share_amount))
        
        elif split_type == 'FIXED' and custom_splits:
            for split in custom_splits:
                shares.append(ExpenseSplit(
                    expense=expense, 
                    user_id=split['user_id'], 
                    amount_owed=Decimal(str(split['value']))
                ))
                
        elif split_type == 'PERCENT' and custom_splits:
            for split in custom_splits:
                share_amount = (total_amount * Decimal(str(split['value']))) / 100
                shares.append(ExpenseSplit(
                    expense=expense, 
                    user_id=split['user_id'], 
                    amount_owed=share_amount
                ))

        # 4. Save all shares at once
        ExpenseSplit.objects.bulk_create(shares)
        
    return expense
