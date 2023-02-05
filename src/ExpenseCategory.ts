import { Expense } from './Expense';

export type ExpenseCategoryInput = {
  title: string;
  matches: string[];
};

export class ExpenseCategory {
  private title: string;
  private matches: string[];

  private expenses: Expense[] = [];

  constructor({ title, matches }: ExpenseCategoryInput) {
    this.title = title.toLowerCase();
    this.matches = matches.map(e => e.toLowerCase());
  }

  addIfMatches(expense: Expense): boolean {
    const desc = expense.getDescription();
    const tag = this.matches.find(m => desc.includes(m));
    if (!tag) return false;

    this.add(expense, tag);

    return true;
  }

  addAlways(expense: Expense): void {
    if (this.matches.length > 0) throw new Error('unchecked add');
    this.add(expense, this.title);
  }

  private add(expense: Expense, tag: string): void {
    expense.setTag(tag);
    this.expenses.push(expense);
    this.expenses.sort((a, b) => b.getAmount() - a.getAmount());
  }

  getSummary(): Record<string, unknown> {
    return {
      title: this.title,
      matches: this.matches,
      total: this.expenses.reduce((t, c) => t + c.getAmount(), 0),
      expenses: this.expenses.map(e => e.getSummary())
    };
  }
}
