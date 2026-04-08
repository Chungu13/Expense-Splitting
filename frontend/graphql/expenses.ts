import { gql } from "@apollo/client";

export const CREATE_EXPENSE_MUTATION = gql`
  mutation CreateExpense($description: String!, $amount: Decimal!, $groupId: Int, $splitType: String, $customSplits: [SplitInput]) {
    createExpense(description: $description, amount: $amount, groupId: $groupId, splitType: $splitType, customSplits: $customSplits) {
      expense {
        id
        description
        totalAmount
      }
    }
  }
`;
