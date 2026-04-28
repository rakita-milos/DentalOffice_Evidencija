import { entriesRepository } from '../repositories/entries.repository.js';
import { expensesRepository } from '../repositories/expenses.repository.js';
import { lineTotal } from '../utils/money.js';
function groupSum(entries, keyGetter, label) {
  const map = new Map();
  for (const e of entries) {
    const key = keyGetter(e);
    const current = map.get(key) || { [label]: key, quantity: 0, revenue: 0 };
    current.quantity += e.quantity;
    current.revenue += lineTotal(e.quantity, e.priceSnapshot);
    map.set(key, current);
  }
  return [...map.values()];
}
export const reportsService = {
  async byDoctor(doctorId) {
    const entries = await entriesRepository.findAll();
    return groupSum(doctorId ? entries.filter(e => e.doctorId === Number(doctorId)) : entries, e => e.doctor.name, 'doctor');
  },
  async byCategory() { return groupSum(await entriesRepository.findAll(), e => e.category.name, 'category'); },
  async byMonth() {
    const fmt = new Intl.DateTimeFormat('sr-RS', { month: 'long' });
    return groupSum(await entriesRepository.findAll(), e => fmt.format(new Date(e.entryDate)), 'month');
  },
  async payroll(percent = 30, doctorId) {
    const rows = await this.byDoctor(doctorId);
    return rows.map(r => ({ ...r, percent: Number(percent), salary: Math.round((r.revenue * Number(percent)) / 100) }));
  },
  async summary() {
    const entries = await entriesRepository.findAll();
    const expenses = await expensesRepository.findAll();
    const revenue = entries.reduce((s, e) => s + lineTotal(e.quantity, e.priceSnapshot), 0);
    const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);
    return { revenue, expenses: totalExpenses, profit: revenue - totalExpenses, entriesCount: entries.length };
  },
};
