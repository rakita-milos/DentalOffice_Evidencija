# DentalOffice Evidencija

Full-stack aplikacija za evidenciju stomatološke ordinacije: usluge, cenovnik, doktori, troškovi, izveštaji, export i obračun plata.

## Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- DB: PostgreSQL
- ORM: Prisma
- Dev DB: Docker Compose

## Lokalno pokretanje

```bash
npm install
npm run db:up
cp backend/.env.example backend/.env
npm run db:migrate
npm run db:seed
npm run dev
```

Frontend: http://localhost:5173  
Backend API: http://localhost:4000/api/health

## GitHub push

```bash
git init
git add .
git commit -m "Initial full-stack dental office evidencija app"
git branch -M main
git remote add origin https://github.com/rakita-milos/DentalOffice_Evidencija.git
git push -u origin main
```

## Glavna pravila aplikacije

1. Cena usluge se menja samo u Admin delu.
2. Kada se napravi unos usluge, cena se kopira kao `priceSnapshot`.
3. Promena cene ne menja stare istorijske unose.
4. Kategorija/usluga ne može da se obriše ako je već korišćena.
5. Delete akcije imaju potvrdu.
6. Izveštaji mogu da se filtriraju po doktoru i skinu kao CSV/PDF.

## API endpointi

- `GET /api/health`
- `GET /api/dashboard/summary`
- `GET /api/doctors`
- `POST /api/doctors`
- `GET /api/service-categories`
- `POST /api/service-categories`
- `DELETE /api/service-categories/:id`
- `POST /api/services`
- `PATCH /api/services/:id/price`
- `DELETE /api/services/:id`
- `GET /api/service-entries`
- `POST /api/service-entries`
- `GET /api/expenses`
- `POST /api/expenses`
- `GET /api/reports/by-doctor`
- `GET /api/reports/by-month`
- `GET /api/reports/by-category`
- `GET /api/reports/by-service`
- `GET /api/reports/payroll`
