# DentalOffice Evidencija — dr Rosa Bašić

Full-stack aplikacija za evidenciju stomatoloških usluga, troškova, cenovnika, izveštaja i obračuna plata.

## Stack
- Frontend: React + Vite + Tailwind
- Backend: Express + Prisma
- DB: PostgreSQL
- Export: CSV/Excel-compatible + browser PDF print

## Brand identity
- Primary Blue: `#1E88E5`
- Light Blue: `#64B5F6`
- Dark Blue: `#0D47A1`
- Soft Green: `#4CAF50`
- Light Teal: `#26C6DA`
- Background: `#F5F7FA`

Logo: `frontend/public/brand/dr-rosa-basic-logo.png`

## Lokalno pokretanje

```bash
npm install
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
npm run db:up
npm run db:migrate
npm run db:seed
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:4000/api/health

## Testiranje

White-box statičke provere:
```bash
npm run test:whitebox
```

Black-box API smoke testovi, prvo pokrenuti DB + backend:
```bash
npm run test:blackbox
```

Kompletan QA rezime: `docs/QA_REPORT.md`

## Pravila aplikacije
- Cena se menja samo u Admin delu.
- Novi unos kopira trenutnu cenu u `priceSnapshot`.
- Istorijski unosi se ne menjaju retroaktivno.
- Korišćena kategorija/usluga ne može da se obriše.
- Brisanje ide preko confirm popup-a i backend provere.
- Izveštaj za platu može da se filtrira po konkretnom lekaru.

## Korisne komande

```bash
npm run db:up
npm run db:migrate
npm run db:seed
npm run db:studio
npm run dev
```

## GitHub push

```bash
git add .
git commit -m "Final rebrand QA fixed version"
git push
```
