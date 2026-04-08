import { gql } from "@apollo/client";

export const ME_QUERY = gql`
  query GetMe {
    me {
      id
      username
      email
    }
  }
`;

export const GROUPS_QUERY = gql`
  query GetAllGroups {
    allGroups {
      id
      name
      description
      createdAt
    }
  }
`;

export const GROUP_DETAIL_QUERY = gql`
  query GetGroupDetail($id: Int!) {
    groupById(id: $id) {
      id
      name
      description
      createdAt
      members {
        id
        role
        user {
          id
          username
          email
        }
      }
      expenses {
        id
        description
        totalAmount
        dateIncurred
        payer {
          username
        }
      }
    }
  }
`;
