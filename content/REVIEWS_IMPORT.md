# Import recenzii verificate

`content/reviews.json` trebuie să conțină numai feedback care poate fi verificat într-o sursă publică sau feedback primit direct cu acordul clientului pentru publicare.

## Surse acceptate

- Google Business Profile;
- Facebook;
- alt director public în care apare recenzia;
- mesaj, email sau formular primit direct, numai cu acord pentru publicare.

## Format JSON

```json
[
  {
    "id": "identificator-stabil-din-sursa",
    "name": "Numele public exact sau inițiale aprobate",
    "rating": 5,
    "text": "Textul real al recenziei, fără completări promoționale.",
    "date": "2026-07-01",
    "service": "Vopsitorie auto",
    "source": "google",
    "sourceUrl": "https://link-catre-profil-sau-recenzie",
    "consentConfirmed": false,
    "verified": true,
    "approved": true,
    "featured": true,
    "order": 0
  }
]
```

Pentru feedback primit direct:

```json
{
  "source": "direct",
  "consentConfirmed": true,
  "verified": true,
  "approved": true
}
```

## Reguli

1. Păstrează ratingul real, inclusiv recenzii de 3 sau 4 stele; nu modifica ratingul pentru aspect comercial.
2. Păstrează sensul și tonul textului. Sunt permise doar corecturi minore de ortografie, fără adăugarea unor beneficii pe care clientul nu le-a menționat.
3. Nu inventa nume, date, servicii sau experiențe.
4. Pentru Google, Facebook și alte surse publice, completează `sourceUrl`.
5. Pentru feedback direct, bifează `consentConfirmed` numai după acceptul clientului.
6. O recenzie apare public doar când `verified` și `approved` sunt ambele `true`.
7. Selectează pentru homepage recenzii reprezentative, nu numai evaluările maxime.

## Pași de import

1. Copiază recenziile reale în `content/reviews.json`.
2. Rulează migrarea:

```bash
npm run migrate
```

3. Rulează seed-ul:

```bash
npm run seed
```

4. Verifică în `/admin/collections/reviews` sursa, ratingul și textul fiecărei recenzii.
5. Verifică pagina `/recenzii` și secțiunea de pe homepage.
