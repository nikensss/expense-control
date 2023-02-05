import { readFile, utils } from 'xlsx';
import { Expense, Sorter } from './Sorter';

const main = async (): Promise<void> => {
  const x = readFile('expenses.xls');
  const sheetName = x.SheetNames[0];
  if (!sheetName) throw new Error('no sheet name');
  const sheet = x.Sheets[sheetName];
  if (!sheet) throw new Error('no sheet found');

  const expenses = utils.sheet_to_json<Expense>(sheet);

  const sorter = new Sorter();
  expenses.forEach(e => sorter.addExpense(e));

  const categorized = sorter.getExpenses();
  console.log({ unknown: categorized.unknown?.map(e => e.description) });
};

main()
  .then(() => console.log('Done!'))
  .catch(console.error);
