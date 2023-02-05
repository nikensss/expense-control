export type Expense = {
  accountNumber: number;
  mutationcode: string;
  transactiondate: number;
  valuedate: number;
  startsaldo: number;
  endsaldo: number;
  amount: number;
  description: string;
};

export class Sorter {
  private categories: Record<string, string[]> = {
    treats: ['starbucks', 'apple store', 'thuisbezorgd', 'paypal'],
    banking: ['sepa overboeking'],
    living: ['eneco', 'carmel residential', 'loonzorg', 'infomedics b.v.', 'ziggo', 'dunea duin'],
    playtomic: ['playtomic'],
    food: ['albert heijn', 'mol*muscle meals', 'veritas', 'ah to go', 'smullers'],
    transport: ['ovpay.nl']
  };

  private expenses: Record<string, Pick<Expense, 'description' | 'amount'>[]> = {};

  addExpense(expense: Expense): void {
    const category = this.findCategory(expense.description);
    if (!Array.isArray(this.expenses[category])) this.expenses[category] = [];
    this.expenses[category]?.push({ description: expense.description, amount: expense.amount });
  }

  findCategory(description: unknown): string {
    if (!description || typeof description !== 'string') return 'unknown';

    for (const [category, members] of Object.entries(this.categories)) {
      if (members.some(m => description.toLowerCase().includes(m))) return category;
    }

    return 'unknown';
  }

  getExpenses(): Readonly<Record<string, Pick<Expense, 'description' | 'amount'>[]>> {
    return this.expenses as Readonly<Record<string, Pick<Expense, 'description' | 'amount'>[]>>;
  }
}
