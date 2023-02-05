import { promises as fs } from 'fs';
import { readFile, utils } from 'xlsx';
import { Expense, ExpenseRaw } from './Expense';
import { Sorter } from './Sorter';

const analyzeFile = async (filename: string): Promise<void> => {
  console.log(`analyzing "${filename}"...`);

  const xls = readFile(filename);
  const sheetName = xls.SheetNames[0];
  if (!sheetName) throw new Error('no sheet name');
  const sheet = xls.Sheets[sheetName];
  if (!sheet) throw new Error('no sheet found');

  const expenses = utils.sheet_to_json<ExpenseRaw>(sheet).map(e => new Expense(e));

  const sorter = new Sorter([
    { title: 'treats', matches: ['starbucks', 'apple store', 'paypal', 'tikkie'] },
    { title: 'basic-fit', matches: ['basic fit international'] },
    {
      title: 'living',
      matches: [
        'eneco',
        'carmel residential',
        'loonzorg',
        'infomedics b.v.',
        'dunea duin',
        'ziggo',
        'hbo max',
        't-mobile netherlands b.v.',
        'chubb european group',
        'sportcity'
      ]
    },
    { title: 'playtomic', matches: ['playtomic'] },
    { title: 'food', matches: ['albert heijn', 'mol*muscle meals', 'veritas', 'ah to go', 'smullers'] },
    { title: 'thuisbezorgd', matches: ['thuisbezorgd'] },
    { title: 'transport', matches: ['ns groep iz ns reizigers', 'ovpay.nl'] },
    { title: 'banking', matches: ['sepa overboeking'] }
  ]);
  expenses.forEach(e => sorter.addExpense(e));

  const categorized = sorter.getExpenses();
  await fs.writeFile(filename.replace('.xls', '.json'), JSON.stringify(categorized, null, 2));
};

const main = async (): Promise<void> => {
  const files = await fs.readdir('.');
  const xls = files.filter(f => f.endsWith('.xls'));
  for (const file of xls) {
    await analyzeFile(file);
  }
};

main()
  .then(() => console.log('Done!'))
  .catch(console.error);
