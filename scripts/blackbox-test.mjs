const API_URL = process.env.API_URL || 'http://localhost:4000/api';

async function get(path) {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) throw new Error(`${path} returned ${response.status}`);
  return response.json();
}

const checks = [];
async function check(name, fn) {
  try {
    await fn();
    checks.push({ name, passed: true });
  } catch (error) {
    checks.push({ name, passed: false, error: error.message });
  }
}

await check('Health endpoint responds', async () => {
  const data = await get('/health');
  if (!data.ok) throw new Error('health.ok is not true');
});

await check('Doctors endpoint returns array', async () => {
  const data = await get('/doctors');
  if (!Array.isArray(data)) throw new Error('doctors is not array');
});

await check('Service categories include services', async () => {
  const data = await get('/service-categories');
  if (!Array.isArray(data)) throw new Error('categories is not array');
  if (data.length && !Array.isArray(data[0].services)) throw new Error('category.services missing');
});

await check('Reports summary contains revenue/profit', async () => {
  const data = await get('/reports/summary');
  if (!('revenue' in data) || !('profit' in data)) throw new Error('summary fields missing');
});

console.table(checks);
const failed = checks.filter((x) => !x.passed);
if (failed.length) {
  console.error(`Black-box checks failed against ${API_URL}. Start DB/backend first, then retry.`);
  process.exit(1);
}
console.log('Black-box checks passed.');
