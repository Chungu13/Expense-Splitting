import { gql } from "@apollo/client";

export const CREATE_GROUP_MUTATION = gql`
  mutation CreateGroup($name: String!, $description: String) {
    createGroup(name: $name, description: $description) {
      group {
        id
        name
      }
    }
  }
`;

export const ADD_MEMBER_MUTATION = gql`
  mutation AddMember($groupId: Int!, $email: String!) {
    addMember(groupId: $groupId, email: $email) {
      membership {
        id
        user {
          id
          username
          email
        }
      }
    }
  }
`;

export const REMOVE_MEMBER_MUTATION = gql`
  mutation RemoveMember($groupId: Int!, $userId: Int!) {
    removeMember(groupId: $groupId, userId: $userId) {
      success
    }
  }
`;
