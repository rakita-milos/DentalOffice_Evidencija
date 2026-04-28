const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const doctors = ['Dr. Slobodan', 'Dr. Marta', 'Dr. Rosa', 'Dr. Draško'];
const expenseCategories = ['Doprinosi', 'Plata', 'Materijal', 'Majstori', 'Komunalije', 'Keramika', 'Proteze', 'Privremene', 'Skelet', 'Atečmeni', 'Implanti', 'Hirurgija', 'Ostalo'];

const serviceGroups = {
  Konzervativa: [
    ['Plombe', 3500], ['Lečenje', 6000], ['IPP', 2500], ['DPP', 3000], ['UZK', 1800],
    ['Izbeljivanje zuba', 18000], ['RTG', 1200], ['Zalivanje fisura', 2000], ['Plomba MZ', 2800],
    ['Prva pomoć', 1500], ['Florizacija', 1800], ['Ostalo', 0]
  ],
  Hirurgija: [
    ['Vađenja zuba', 4000], ['Impakcija umnjaka', 18000], ['Impakcija očnjaka', 20000], ['Apikotomija', 15000],
    ['Parodontologija', 9000], ['Kiretaža', 5000], ['Zatvaranje sinusa', 18000], ['Frenulum', 6000],
    ['Implant', 45000], ['Mini implanti', 30000], ['Hirurško vađenje', 9000]
  ],
  Protetika: [
    ['Keramička kruna', 16000], ['Cirkonijum kruna', 22000], ['Totalna proteza', 45000], ['Skeletirana proteza', 55000],
    ['Parcijalna proteza', 35000], ['Reparatura proteze', 5000], ['Privremene krune', 3000], ['Splintevi', 12000],
    ['Nadogradnja', 8000], ['Atečmeni', 18000], ['Krunica na implantu', 26000], ['Podlaganje proteze', 9000]
  ],
  Ortodoncija: [['Mobilna', 30000], ['Fiksna', 90000], ['Pozicioner', 15000], ['Monoblok', 25000], ['Ostalo', 0]],
};

async function main() {
  for (const name of doctors) {
    await prisma.doctor.upsert({ where: { name }, update: {}, create: { name } });
  }

  for (const name of expenseCategories) {
    await prisma.expenseCategory.upsert({ where: { name }, update: {}, create: { name } });
  }

  for (const [categoryName, services] of Object.entries(serviceGroups)) {
    const category = await prisma.serviceCategory.upsert({
      where: { name: categoryName },
      update: {},
      create: { name: categoryName },
    });

    for (const [serviceName, currentPrice] of services) {
      await prisma.service.upsert({
        where: { categoryId_name: { categoryId: category.id, name: serviceName } },
        update: { currentPrice },
        create: { categoryId: category.id, name: serviceName, currentPrice },
      });
    }
  }

  const slobodan = await prisma.doctor.findUnique({ where: { name: 'Dr. Slobodan' } });
  const marta = await prisma.doctor.findUnique({ where: { name: 'Dr. Marta' } });
  const rosa = await prisma.doctor.findUnique({ where: { name: 'Dr. Rosa' } });
  const drasko = await prisma.doctor.findUnique({ where: { name: 'Dr. Draško' } });

  const plombe = await prisma.service.findFirst({ where: { name: 'Plombe' }, include: { category: true } });
  const kruna = await prisma.service.findFirst({ where: { name: 'Keramička kruna' }, include: { category: true } });
  const vadjenje = await prisma.service.findFirst({ where: { name: 'Vađenja zuba' }, include: { category: true } });
  const fiksna = await prisma.service.findFirst({ where: { name: 'Fiksna' }, include: { category: true } });

  const entries = [
    ['2013-01-04', slobodan, plombe, 4],
    ['2013-01-05', marta, kruna, 2],
    ['2013-01-08', rosa, vadjenje, 3],
    ['2013-01-10', drasko, fiksna, 1],
  ];

  for (const [entryDate, doctor, service, quantity] of entries) {
    const exists = await prisma.serviceEntry.findFirst({ where: { entryDate: new Date(entryDate), doctorId: doctor.id, serviceId: service.id } });
    if (!exists) {
      await prisma.serviceEntry.create({
        data: {
          entryDate: new Date(entryDate),
          doctorId: doctor.id,
          categoryId: service.categoryId,
          serviceId: service.id,
          quantity,
          priceSnapshot: service.currentPrice,
        },
      });
    }
  }

  const plata = await prisma.expenseCategory.findUnique({ where: { name: 'Plata' } });
  const materijal = await prisma.expenseCategory.findUnique({ where: { name: 'Materijal' } });
  const komunalije = await prisma.expenseCategory.findUnique({ where: { name: 'Komunalije' } });

  const expenses = [
    ['2013-01-02', plata.id, 'Vesna', 65000],
    ['2013-01-07', materijal.id, 'Dobavljač', 42000],
    ['2013-01-12', komunalije.id, 'Računi', 18000],
  ];

  for (const [expenseDate, categoryId, vendor, amount] of expenses) {
    const exists = await prisma.expense.findFirst({ where: { expenseDate: new Date(expenseDate), categoryId, vendor } });
    if (!exists) await prisma.expense.create({ data: { expenseDate: new Date(expenseDate), categoryId, vendor, amount } });
  }

  console.log('Seed completed');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
