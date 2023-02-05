import { Expense } from './Expense';
import { ExpenseCategory, ExpenseCategoryInput } from './ExpenseCategory';

export class Sorter {
  private expenseCategories: ExpenseCategory[] = [];
  private misc = new ExpenseCategory({ title: 'misc', matches: [] });

  constructor(categories: ExpenseCategoryInput[]) {
    for (const category of categories) {
      this.expenseCategories.push(new ExpenseCategory(category));
    }
  }

  addExpense(expense: Expense): void {
    for (const category of this.expenseCategories) {
      if (category.addIfMatches(expense)) return;
    }
    this.misc.addIfMatches(expense);
  }

  getExpenses(): Record<string, unknown>[] {
    return [...this.expenseCategories.map(e => e.getSummary()), this.misc.getSummary()];
  }
}
