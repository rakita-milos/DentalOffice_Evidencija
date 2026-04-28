# DentalOffice Evidencija

Refaktorisana full-stack aplikacija za stomatološku ordinaciju.

## Stack
- Frontend: React + Vite + Tailwind
- Backend: Express + Prisma
- DB: PostgreSQL

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

## Pravila
- Cena se menja samo u Admin delu.
- Novi unos kopira trenutnu cenu u `priceSnapshot`.
- Istorija se ne menja retroaktivno.
- Korišćena kategorija/usluga ne može da se obriše.
- Brisanje ide preko confirm popup-a i backend provere.
