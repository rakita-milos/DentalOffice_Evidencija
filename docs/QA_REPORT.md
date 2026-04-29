# QA Report — dr Rosa Bašić DentalOffice Evidencija

## White-box test summary
Pregledana je struktura koda, API slojevi, Prisma model, frontend API client, validacija i poslovna pravila.

### Dobro
- Frontend je podeljen na pages, components, hooks, services i utils.
- Backend je podeljen na routes, controllers, services, repositories, validators i middlewares.
- Cena usluge se čuva kao `priceSnapshot`, što štiti istorijske unose od retroaktivne promene.
- Promena cene ima `ServicePriceHistory` model.
- Brisanje kategorije/usluge ima UI confirm popup i backend proveru.
- Branding je ubačen kroz CSS varijable i logo asset.

### Pronađeno i popravljeno
- Zod validacija je ranije proveravala podatke, ali nije vraćala coerced vrednosti u `req.body`, pa su ID-jevi iz formi mogli da ostanu stringovi i padnu u Prismi. Popravljeno u `validateRequest.js`.
- `useApiData` je mogao da uđe u refresh loop kada loader funkcija dolazi inline iz React komponente. Popravljeno preko `useRef` loader pattern-a.
- `POST /service-entries` je verovao `categoryId` sa klijenta. Sada backend izvodi `categoryId` iz izabrane usluge i sprečava mismatch.
- CORS je bio vezan za jedan origin. Sada podržava `CORS_ORIGINS` listu.
- Admin UI sada koristi `_count.entries` da zaključa brisanje korišćenih kategorija/usluga.
- Izveštaji sada imaju izbor konkretnog lekara za payroll/byDoctor export.

## Black-box test summary
Dodati su API smoke testovi:
- `GET /api/health`
- `GET /api/doctors`
- `GET /api/service-categories`
- `GET /api/reports/summary`

Pokretanje:
```bash
npm run test:whitebox
npm run test:blackbox
```

Za black-box test prvo pokrenuti bazu, migracije, seed i backend.
