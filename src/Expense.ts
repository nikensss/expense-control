export type ExpenseRaw = {
  accountNumber: number;
  mutationcode: string;
  transactiondate: number;
  valuedate: number;
  startsaldo: number;
  endsaldo: number;
  amount: number;
  description: string;
};
export class Expense {
  private expenseRaw: ExpenseRaw;
  private tag = '';

  constructor(expenseRaw: ExpenseRaw) {
    this.expenseRaw = expenseRaw;
    // expenses are negative in the XLS file, and since this represents an expense, the sign should be swapped
    this.expenseRaw.amount = -this.expenseRaw.amount;
  }

  setTag(tag: string): void {
    this.tag = tag.toLowerCase();
  }

  getDescription(): string {
    return (this.expenseRaw.description || '').toLowerCase();
  }

  getAmount(): number {
    return this.expenseRaw.amount || 0;
  }

  getSummary(): ExpenseRaw & { tag: string } {
    return { ...this.expenseRaw, tag: this.tag };
  }
}
