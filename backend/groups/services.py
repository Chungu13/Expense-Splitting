from django.contrib.auth.models import User
from .models import Group, GroupMember
from django.core.exceptions import PermissionDenied

def validate_admin_access(group, user):
    """Ensures the user has ADMIN rights in the group."""
    is_admin = GroupMember.objects.filter(group=group, user=user, role='ADMIN').exists()
    if not is_admin:
        raise PermissionDenied("Only admins can perform this action.")

def create_initial_group(name: str, description: str, requester: User):
    """Creates a group and adds the requester as an ADMIN member."""
    group = Group.objects.create(name=name, description=description, created_by=requester)
    # Automatically add the creator as the first ADMIN
    GroupMember.objects.create(group=group, user=requester, role='ADMIN')
    return group

def add_user_to_group(group_id: int, email: str, requester: User):
    """Adds a user to a group if the requester is an admin."""
    group = Group.objects.get(pk=group_id)
    validate_admin_access(group, requester)
    
    target_user = User.objects.get(email=email)
    
    # Check if already a member
    if GroupMember.objects.filter(group=group, user=target_user).exists():
        raise Exception(f"User {email} is already a member of this group.")
    
    return GroupMember.objects.create(group=group, user=target_user, role='MEMBER')

def remove_user_from_group(group_id: int, user_id: int, requester: User):
    """Removes a user from a group. Requester must be admin OR removing themselves."""
    group = Group.objects.get(pk=group_id)
    
    # Target is self or requester is admin
    if user_id != requester.id:
        validate_admin_access(group, requester)
    
    membership = GroupMember.objects.get(group=group, user_id=user_id)
    membership.delete()
    return True

def update_member_role(group_id: int, user_id: int, new_role: str, requester: User):
    """Promotes or demotes a member. Requester must be admin."""
    group = Group.objects.get(pk=group_id)
    validate_admin_access(group, requester)
    
    membership = GroupMember.objects.get(group=group, user_id=user_id)
    membership.role = new_role
    membership.save()
    return membership
