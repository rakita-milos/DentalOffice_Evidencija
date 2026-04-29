import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));
const checks = [];
function check(name, condition) {
  checks.push({ name, passed: Boolean(condition) });
}

check('Logo asset exists', exists('frontend/public/brand/dr-rosa-basic-logo.png'));
check('Brand blue is defined', read('frontend/src/index.css').includes('#1E88E5'));
check('Brand dark blue is defined', read('frontend/src/index.css').includes('#0D47A1'));
check('Frontend API URL uses VITE_API_URL fallback', read('frontend/src/services/apiClient.js').includes('VITE_API_URL'));
check('Zod validation writes coerced values back to req.body', read('backend/src/middlewares/validateRequest.js').includes('req.body = result.data.body'));
check('Service entry uses priceSnapshot', read('backend/prisma/schema.prisma').includes('priceSnapshot'));
check('Service entry derives category from service', read('backend/src/services/entries.service.js').includes('categoryId: service.categoryId'));
check('Price history model exists', read('backend/prisma/schema.prisma').includes('model ServicePriceHistory'));
check('Admin delete uses ConfirmModal', read('frontend/src/pages/AdminPage.jsx').includes('ConfirmModal'));
check('Reports can filter by selected doctor', read('frontend/src/pages/ReportsPage.jsx').includes('selectedDoctor'));
check('CORS supports multiple origins', read('backend/src/config/env.js').includes('corsOrigins'));

const failed = checks.filter((x) => !x.passed);
console.table(checks);
if (failed.length) {
  console.error(`White-box checks failed: ${failed.map((x) => x.name).join(', ')}`);
  process.exit(1);
}
console.log('White-box checks passed.');
