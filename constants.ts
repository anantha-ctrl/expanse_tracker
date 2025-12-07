import { Category, TransactionType } from './types';

export const EXPENSE_CATEGORIES = [
  Category.FOOD,
  Category.TRANSPORT,
  Category.SHOPPING,
  Category.HOUSING,
  Category.UTILITIES,
  Category.ENTERTAINMENT,
  Category.HEALTH,
  Category.OTHER
];

export const ALL_CATEGORIES = [
  Category.INCOME,
  ...EXPENSE_CATEGORIES
];

export const CATEGORY_COLORS: Record<string, string> = {
  [Category.FOOD]: '#ea580c', // Orange (Saffron-ish for Food)
  [Category.TRANSPORT]: '#0284c7', // Light Blue
  [Category.SHOPPING]: '#db2777', // Magenta/Pink (Festive)
  [Category.HOUSING]: '#7c3aed', // Violet
  [Category.UTILITIES]: '#475569', // Slate
  [Category.ENTERTAINMENT]: '#9333ea', // Purple
  [Category.HEALTH]: '#16a34a', // Green
  [Category.INCOME]: '#15803d', // Deep Green
  [Category.OTHER]: '#94a3b8', // Gray
};