export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense'
}

export enum Category {
  FOOD = 'Food & Drink',
  TRANSPORT = 'Transportation',
  SHOPPING = 'Shopping',
  HOUSING = 'Housing',
  UTILITIES = 'Utilities',
  ENTERTAINMENT = 'Entertainment',
  HEALTH = 'Health & Wellness',
  INCOME = 'Salary & Income',
  OTHER = 'Other'
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: TransactionType;
  category: Category | string;
}

export interface SpendingInsight {
  title: string;
  description: string;
  type: 'positive' | 'warning' | 'neutral';
}
