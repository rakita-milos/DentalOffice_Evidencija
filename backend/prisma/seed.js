import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const doctors = ['Dr. Slobodan', 'Dr. Marta', 'Dr. Rosa', 'Dr. Draško'];
const groups = {
  Konzervativa: [['Plombe',3500],['Lečenje',6000],['IPP',2500],['DPP',3000],['UZK',1800],['RTG',1200],['Ostalo',0]],
  Hirurgija: [['Vađenja zuba',4000],['Impakcija umnjaka',18000],['Apikotomija',15000],['Implant',45000]],
  Protetika: [['Keramička kruna',16000],['Cirkonijum kruna',22000],['Totalna proteza',45000],['Skeletirana proteza',55000]],
  Ortodoncija: [['Mobilna',30000],['Fiksna',90000],['Pozicioner',15000]]
};
const expenseCategories = ['Doprinosi','Plata','Materijal','Majstori','Komunalije','Keramika','Proteze','Ostalo'];
async function main(){
  for (const name of doctors) await prisma.doctor.upsert({ where:{name}, update:{}, create:{name} });
  for (const [name, services] of Object.entries(groups)) {
    const category = await prisma.serviceCategory.upsert({ where:{name}, update:{}, create:{name} });
    for (const [serviceName, currentPrice] of services) await prisma.service.upsert({ where:{ categoryId_name:{categoryId:category.id, name:serviceName}}, update:{currentPrice}, create:{name:serviceName, currentPrice, categoryId:category.id} });
  }
  for (const name of expenseCategories) await prisma.expenseCategory.upsert({ where:{name}, update:{}, create:{name} });
  if (await prisma.serviceEntry.count() === 0) {
    const d = await prisma.doctor.findFirst(); const s = await prisma.service.findFirst({include:{category:true}});
    await prisma.serviceEntry.create({data:{entryDate:new Date('2013-01-04'), doctorId:d.id, categoryId:s.categoryId, serviceId:s.id, quantity:2, priceSnapshot:s.currentPrice}});
  }
}
main().then(()=>console.log('Seed complete')).finally(()=>prisma.$disconnect());
