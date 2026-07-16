# CarFix Paint — Etapa 2: lead generation, pagini de servicii și programări

## Scop

Această etapă transformă site-ul actual dintr-un website de prezentare cu CMS într-un instrument mai puternic de atragere și gestionare a solicitărilor.

Obiectivele sunt:

1. formular de evaluare cu fotografii ale daunei;
2. câte o pagină SEO dedicată pentru cele șase servicii existente;
3. paginare și filtrare pentru cele 148 de recenzii;
4. calendar online pentru solicitarea unei programări de constatare/evaluare;
5. ajustarea textelor principale pentru mai multă claritate și conversie.

Implementarea trebuie făcută în PR-uri separate. Nu se recomandă un singur PR mare pentru toate funcționalitățile.

---

## 1. Situația actuală din repository

### Servicii

În `content/services.json` și colecția Payload `services` există deja șase servicii:

- Tinichigerie și caroserie;
- Vopsitorie auto;
- Mecanică auto;
- Diagnoză computerizată;
- Gestionare daune RCA/CASCO;
- Mașină la schimb.

În prezent există numai pagina index `/servicii`. Nu există rută publică individuală pentru fiecare serviciu.

Câmpurile curente din `src/collections/Services.ts` sunt suficiente pentru cardurile de pe pagina index, dar nu pentru landing pages SEO complete.

### Formular contact

`ContactRequests` are deja câmpul `photos`, însă acesta este legat de colecția generală `media`.

Colecția `media` are `read: () => true`, deci este potrivită pentru imagini publice de blog, portofoliu și branding, nu pentru fotografii private trimise de clienți.

Endpointul actual `POST /api/contact`:

- primește JSON;
- limitează requestul la 16 KB;
- validează datele;
- aplică rate limiting;
- salvează cererea în Payload;
- trimite notificare email.

Pentru fotografii trebuie introdus un flux multipart și o colecție privată separată.

### Recenzii

Pagina `/recenzii` cere momentan până la 250 de rezultate și le afișează pe toate într-un singur grid.

Colecția `reviews` obligă existența câmpului `text`, inclusiv pentru evaluările Google fără comentariu. În seed acestea sunt reprezentate printr-un marcaj editorial. Pentru filtrare și afișare corectă trebuie adăugat un câmp explicit `hasComment`.

### Programări

Nu există în prezent:

- colecție de programări;
- configurare a programului de lucru;
- endpoint de disponibilitate;
- calendar public;
- notificări de confirmare/reprogramare.

---

# 2. Decizii funcționale

## 2.1 Programarea este o solicitare, nu o confirmare automată a reparației

Durata unei reparații auto nu poate fi stabilită corect înainte de constatare. Calendarul trebuie folosit pentru:

- constatare;
- evaluare inițială;
- diagnoză programată;
- discuție și predarea mașinii.

Mesajul public trebuie să fie clar:

> Programarea devine valabilă după confirmarea service-ului prin telefon sau email.

Nu trebuie afișat „Programare confirmată” imediat după completarea formularului.

## 2.2 Fotografiile clienților sunt private

Fotografiile cu mașini, numere de înmatriculare și daune nu se salvează în colecția publică `media`.

Se creează o colecție separată, de exemplu:

```text
contact-attachments
```

Acces recomandat:

- `create`: numai prin endpointul server-side;
- `read`: numai utilizatori autentificați;
- `update`: numai utilizatori autentificați;
- `delete`: admin sau utilizator autorizat;
- fără URL public permanent indexabil.

Dacă storage-ul S3/R2 folosit de proiect este public, fotografiile de contact trebuie ținute într-un bucket/prefix privat și livrate prin URL-uri semnate sau printr-o rută protejată.

## 2.3 Slugurile interne ale serviciilor rămân stabile

Slugurile existente, precum `tinichigerie`, `vopsitorie` și `daune-rca-casco`, sunt deja folosite în relații, seed și formular.

Nu trebuie schimbate direct.

În colecția `services` se adaugă un câmp separat:

```text
pageSlug
```

Acesta va controla URL-ul public SEO.

---

# 3. Modificări de text

## 3.1 Homepage hero

### Badge

```text
Service auto în Brașov din 2014
```

### H1

```text
Tinichigerie și vopsitorie auto în Brașov
```

### Accent / al doilea rând

```text
Daune RCA/CASCO, mecanică și diagnoză într-un singur service
```

### Descriere

```text
Te ajutăm de la evaluarea inițială și pregătirea documentelor până la reparație și predarea mașinii. Trimite fotografiile daunei pentru o primă orientare sau solicită o programare pentru constatare.
```

### CTA principal

```text
Trimite poze pentru evaluare
```

Destinație:

```text
/contact#evaluare
```

### CTA secundar

```text
Solicită o programare
```

Destinație:

```text
/programare
```

Telefonul rămâne vizibil în header și în CTA-urile secundare ale paginilor.

## 3.2 Secțiunea de recenzii de pe homepage

Titlu recomandat, construit din date reale:

```text
4,8/5 din 148 de recenzii Google
```

Subtitlu:

```text
Experiențe publicate de clienți pe profilul Google Car Fix & Paint.
```

Se afișează maximum șase recenzii `featured`, preferabil numai cele care au comentariu real.

Nu se folosește formularea „148+ clienți mulțumiți”, deoarece baza de date conține 148 de recenzii, inclusiv evaluări negative și evaluări fără comentariu.

## 3.3 Pagina Contact

### Titlu

```text
Trimite detaliile și fotografiile mașinii
```

### Subtitlu

```text
Descrie problema și încarcă până la 5 fotografii clare ale zonei afectate. Imaginile ne ajută la o primă orientare, dar soluția finală se stabilește după verificarea mașinii.
```

### Ajutor upload

```text
Formate acceptate: JPG, PNG sau WebP. Maximum 5 fotografii și 5 MB pentru fiecare fișier.
```

### Checkbox GDPR

```text
Sunt de acord ca datele și fotografiile trimise să fie folosite pentru analizarea solicitării și pentru a fi contactat în legătură cu aceasta.
```

### Mesaj succes

```text
Cererea și fotografiile au fost trimise. Revenim cât mai curând posibil în programul de lucru.
```

## 3.4 Pagina Programare

### H1

```text
Solicită o programare pentru constatare
```

### Subtitlu

```text
Alege serviciul, ziua și intervalul preferat. Cererea este verificată de echipă, iar programarea devine valabilă după confirmarea telefonică sau prin email.
```

### Mesaj după trimitere

```text
Solicitarea a fost înregistrată. Te contactăm pentru confirmarea orei sau pentru a propune un interval alternativ.
```

### Notă calendar

```text
Intervalele afișate sunt pentru constatare și evaluare. Durata reparației se stabilește separat după verificarea mașinii și aprobarea lucrărilor.
```

## 3.5 Pagina Servicii

### H1

```text
Servicii auto în Brașov
```

### Subtitlu

```text
Tinichigerie, vopsitorie, mecanică, diagnoză și sprijin pentru daune RCA/CASCO. Alege serviciul pentru a vedea procesul, situațiile în care este recomandat și răspunsurile la întrebările frecvente.
```

Cardurile trebuie să aibă CTA:

```text
Vezi detalii
```

## 3.6 Pagina Recenzii

### H1

```text
Recenziile clienților Car Fix & Paint
```

### Subtitlu dinamic

```text
4,8/5 din 148 de recenzii Google verificate
```

### Etichetă pentru evaluări fără text

Nu se mai afișează un citat artificial.

Se afișează numai:

```text
Evaluare de 4 stele fără comentariu public.
```

Textul trebuie randat normal, fără ghilimele și fără stil italic de testimonial.

---

# 4. Funcționalitatea 1 — Upload fotografii

## 4.1 UX

Formularul permite:

- drag and drop;
- selectare multiplă;
- preview înainte de trimitere;
- eliminarea unei fotografii;
- progres de upload;
- mesaje de eroare individuale;
- maximum 5 fotografii.

Formate MVP:

- JPEG/JPG;
- PNG;
- WebP.

HEIC poate fi adăugat ulterior numai după introducerea unei conversii server-side testate.

Limite:

- maximum 5 MB per fișier;
- maximum 20 MB total;
- latura maximă după procesare: 1920 px;
- thumbnail pentru admin: aproximativ 400 px.

## 4.2 Securitate și confidențialitate

La upload:

- se verifică MIME-ul real, nu doar extensia;
- numele original nu este folosit drept nume public;
- se generează UUID;
- se elimină EXIF, inclusiv coordonatele GPS;
- imaginile se redimensionează cu `sharp`;
- fișierele nevalide sunt respinse;
- endpointul are rate limiting separat;
- fotografiile nu sunt incluse ca atașamente grele în email;
- emailul către service conține link către solicitarea din admin.

Trebuie verificată configurarea Nginx/Hestia:

```nginx
client_max_body_size 25M;
```

## 4.3 Model Payload propus

Colecție nouă:

```text
ContactAttachments
```

Câmpuri:

- `contactRequest` — relationship către `contact-requests`;
- `originalFilename` — vizibil numai în admin;
- `mimeType`;
- `sizeBytes`;
- `width`;
- `height`;
- `uploadedAt`;
- `retentionUntil`;
- upload image.

În `ContactRequests`:

- relația `photos` se mută de la `media` la `contact-attachments`;
- se adaugă `photoCount` opțional pentru listarea rapidă în admin.

Este necesară migrare PostgreSQL.

## 4.4 API recomandat

Se păstrează un singur endpoint atomic:

```text
POST /api/contact
Content-Type: multipart/form-data
```

Flux:

1. verifică `Content-Length`;
2. parsează câmpurile;
3. validează formularul cu Zod;
4. validează și procesează imaginile;
5. creează cererea în `contact-requests`;
6. creează atașamentele și le leagă de cerere;
7. trimite notificarea;
8. dacă apare o eroare, șterge fișierele create parțial.

Endpointul poate păstra compatibilitatea cu JSON pentru cereri fără fotografii.

## 4.5 Retenție

Recomandare inițială:

- cereri `spam`: ștergere automată a fotografiilor după 30 de zile;
- cereri `closed`: ștergere după 180 de zile, dacă nu există un motiv justificat de păstrare;
- ștergere manuală disponibilă pentru admin.

Politica de confidențialitate trebuie actualizată cu scopul și durata păstrării imaginilor.

## 4.6 Criterii de acceptare

- un vizitator poate trimite 1–5 fotografii valide;
- fișierele prea mari sau nepermise sunt respinse clar;
- cererea apare în Payload cu toate fotografiile;
- fotografiile nu pot fi accesate public fără autorizare;
- EXIF-ul este eliminat;
- formularul fără fotografii continuă să funcționeze;
- nu rămân fișiere orfane după o eroare.

---

# 5. Funcționalitatea 2 — Pagini individuale de servicii

## 5.1 Rută

Se adaugă:

```text
src/app/(frontend)/servicii/[pageSlug]/page.tsx
```

Pagina trebuie să încarce serviciul după `pageSlug`, nu după slugul intern.

## 5.2 URL-uri recomandate

| Serviciu intern | `pageSlug` public | H1 |
|---|---|---|
| `tinichigerie` | `tinichigerie-auto-brasov` | Tinichigerie auto în Brașov |
| `vopsitorie` | `vopsitorie-auto-brasov` | Vopsitorie auto în Brașov |
| `mecanica` | `mecanica-auto-brasov` | Mecanică auto în Brașov |
| `diagnoza` | `diagnoza-auto-brasov` | Diagnoză auto în Brașov |
| `daune-rca-casco` | `daune-rca-casco-brasov` | Service pentru daune RCA și CASCO în Brașov |
| `masina-schimb` | `masina-la-schimb-brasov` | Mașină la schimb pe durata reparației |

## 5.3 Extinderea colecției Services

Câmpuri recomandate:

- `pageSlug` — text, unique, indexed;
- `heroTitle`;
- `heroSubtitle`;
- `heroImage` — relationship către media;
- `intro` — richText;
- `whenNeededTitle`;
- `whenNeededItems` — array;
- `processTitle`;
- `processSteps` — array cu title și description;
- `faqItems` — array sau relationship către FAQ;
- `ctaTitle`;
- `ctaDescription`;
- `ctaPrimaryLabel`;
- `ctaSecondaryLabel`;
- `ogImage` — relationship către media;
- `appointmentEnabled` — checkbox;
- `appointmentDurationMinutes` — number, default 30.

Câmpurile actuale `description` și `features` rămân folosite ca fallback.

## 5.4 Copy propus pentru pagini

### Tinichigerie auto în Brașov

Meta title:

```text
Tinichigerie auto Brașov | Reparații caroserie | Car Fix & Paint
```

Meta description:

```text
Tinichigerie auto în Brașov pentru aripi, uși, capote, praguri și elemente de caroserie afectate de lovituri, deformări sau coroziune.
```

Hero subtitle:

```text
Evaluăm elementele afectate și stabilim dacă soluția corectă este îndreptarea, repararea sau înlocuirea lor.
```

Intro:

```text
O deformare vizibilă poate ascunde prinderi, ranforsări sau elemente aliniate incorect. Verificăm zona afectată, explicăm operațiunile necesare și pregătim caroseria pentru protecție și vopsire.
```

CTA:

```text
Trimite fotografiile daunei pentru o primă evaluare sau solicită o programare pentru constatare.
```

### Vopsitorie auto în Brașov

Meta title:

```text
Vopsitorie auto Brașov | Potrivire culoare | Car Fix & Paint
```

Meta description:

```text
Vopsitorie auto în Brașov pentru elemente locale sau lucrări extinse, cu pregătirea suprafeței și potrivirea atentă a nuanței.
```

Hero subtitle:

```text
Pregătirea corectă a suprafeței, potrivirea nuanței și controlul finisajului în fiecare etapă.
```

Intro:

```text
Rezultatul final depinde de ceea ce se întâmplă înainte de aplicarea culorii. Curățăm, corectăm și pregătim suprafața, alegem formula potrivită și verificăm aspectul în raport cu elementele vecine.
```

CTA:

```text
Trimite fotografii clare ale elementului și spune-ne dacă mașina a mai fost vopsită în zona respectivă.
```

### Mecanică auto în Brașov

Meta title:

```text
Mecanică auto Brașov | Frâne, suspensie și întreținere | Car Fix & Paint
```

Meta description:

```text
Service de mecanică auto în Brașov pentru frâne, suspensie, direcție, răcire, revizii și verificări după impact.
```

Hero subtitle:

```text
Pornim de la simptome și verificări, nu de la înlocuirea la întâmplare a pieselor.
```

Intro:

```text
Zgomotele, vibrațiile, martorii sau schimbările de comportament trebuie analizate în context. Verificăm sistemele relevante și explicăm ce este urgent, ce poate fi monitorizat și ce operațiuni sunt recomandate.
```

CTA:

```text
Descrie simptomele și solicită o programare pentru verificarea mașinii.
```

### Diagnoză auto în Brașov

Meta title:

```text
Diagnoză auto Brașov | Citire și interpretare erori | Car Fix & Paint
```

Meta description:

```text
Diagnoză computerizată în Brașov, cu citirea codurilor, analiza parametrilor și verificări suplimentare înainte de înlocuirea pieselor.
```

Hero subtitle:

```text
Un cod de eroare este un punct de pornire, nu întotdeauna diagnosticul final.
```

Intro:

```text
Citirea erorilor trebuie corelată cu simptomele, datele în timp real și verificările componentelor sau circuitelor implicate. Scopul este identificarea cauzei, nu simpla ștergere a martorilor.
```

CTA:

```text
Spune-ne ce martori sunt aprinși și când apare problema, apoi solicită o programare pentru diagnoză.
```

### Daune RCA și CASCO în Brașov

Meta title:

```text
Daune RCA și CASCO Brașov | Constatare și reparație | Car Fix & Paint
```

Meta description:

```text
Sprijin pentru dosare de daună RCA/CASCO în Brașov: fotografii, documente, evaluare tehnică, deviz și reparația mașinii.
```

Hero subtitle:

```text
Te ajutăm să înțelegi pașii, documentele și operațiunile necesare pentru repararea mașinii.
```

Intro:

```text
Fiecare dosar depinde de poliță, asigurător și avariile constatate. Organizăm informațiile tehnice, documentăm zonele afectate și comunicăm ce aprobări sunt necesare înainte de începerea lucrărilor.
```

CTA:

```text
Trimite numărul dosarului, documentele disponibile și fotografiile zonelor afectate.
```

### Mașină la schimb în Brașov

Meta title:

```text
Mașină la schimb Brașov | Pe durata reparației | Car Fix & Paint
```

Meta description:

```text
Informații despre disponibilitatea unei mașini la schimb pe durata reparației, în funcție de lucrare, dosar și condițiile aplicabile.
```

Hero subtitle:

```text
Mobilitate pe durata reparației, în funcție de disponibilitate și de condițiile confirmate înainte de predare.
```

Intro:

```text
Pentru anumite lucrări sau dosare poate fi disponibil un autoturism de înlocuire. Perioada, regulile de utilizare, responsabilitățile și eventualele costuri se confirmă în scris înainte de predarea mașinii.
```

CTA:

```text
Întreabă despre disponibilitate atunci când trimiți cererea de evaluare sau programare.
```

## 5.5 Structura fiecărei pagini

1. hero cu H1, subtitlu și CTA;
2. introducere;
3. „Când este recomandat acest serviciu”;
4. operațiuni incluse;
5. proces în 4–5 pași;
6. proiecte relevante, numai când există fotografii reale;
7. întrebări frecvente specifice;
8. articole de blog relevante;
9. CTA pentru fotografii și programare.

## 5.6 SEO tehnic

- metadata din serviciu;
- canonical;
- OG image individual;
- schema.org `Service`;
- breadcrumb `Acasă > Servicii > Serviciu`;
- includere în sitemap;
- linkuri interne din homepage, pagina servicii, blog și FAQ;
- 404 pentru servicii inactive sau inexistente.

## 5.7 Criterii de acceptare

- toate cele șase servicii au pagină proprie;
- textele sunt editabile din Payload;
- fiecare pagină are metadata, canonical, OG și JSON-LD;
- cardurile din `/servicii` duc către paginile individuale;
- sitemap-ul include numai serviciile active;
- formularul și programarea pot fi preselectate cu serviciul curent.

---

# 6. Funcționalitatea 3 — Paginare și filtrare recenzii

## 6.1 Comportament public

Default:

- 12 recenzii pe pagină;
- recenziile cu text înaintea celor fără text;
- ordonare după data recenziei, descrescător;
- summary vizibil în partea de sus.

Filtre:

- toate ratingurile;
- 5 stele;
- 4 stele;
- 3 stele;
- 2 stele, numai dacă există;
- 1 stea;
- „Doar recenzii cu comentariu”.

Sortare:

- cele mai noi;
- rating descrescător;
- rating crescător.

URL-uri:

```text
/recenzii?page=2
/recenzii?rating=5
/recenzii?rating=4&withText=1
/recenzii?sort=rating-asc&page=3
```

Filtrele trebuie păstrate când utilizatorul schimbă pagina.

## 6.2 Modificări în colecție

Se adaugă:

```text
hasComment: boolean
```

Pentru seed:

- `true` când sursa conține comentariu real;
- `false` pentru evaluare fără text;
- textul editorial dintre paranteze poate fi eliminat după migrare sau păstrat numai intern.

Câmpul `text` ar trebui să devină opțional, iar componenta să nu afișeze ghilimele când nu există comentariu.

Este necesară migrare și regenerarea tipurilor Payload.

## 6.3 Query layer

Se înlocuiește apelul actual:

```text
getApprovedReviews(250)
```

cu un helper de forma:

```ts
getApprovedReviewsPage({
  page,
  limit: 12,
  rating,
  withText,
  sort,
})
```

Rezultatul trebuie să conțină:

- `docs`;
- `page`;
- `totalPages`;
- `totalDocs`;
- `hasNextPage`;
- `hasPrevPage`;
- count per rating pentru filtre.

## 6.4 JSON-LD

Nu este necesar să fie injectate toate cele 148 de texte în HTML pe fiecare request.

Se păstrează:

- `aggregateRating` cu ratingul și numărul total;
- numai recenziile afișate pe pagina curentă sau un subset reprezentativ verificat.

## 6.5 Homepage

- maximum 6 recenzii `featured`;
- preferabil numai `hasComment = true`;
- link „Vezi toate recenziile”.

## 6.6 Criterii de acceptare

- pagina nu mai randază 148 de carduri simultan;
- filtrele funcționează și pot fi distribuite prin URL;
- pagina poate fi navigată cu back/forward;
- evaluările fără text nu apar ca testimoniale inventate;
- summary-ul rămâne corect indiferent de filtrul activ;
- filtrele sunt accesibile de la tastatură și pe mobil.

---

# 7. Funcționalitatea 4 — Calendar și solicitări de programare

## 7.1 MVP recomandat

Calendarul rezervă intervale de 30 de minute pentru constatare/evaluare.

Nu încearcă să programeze durata completă a unei reparații.

Flux client:

1. selectează serviciul;
2. selectează data;
3. selectează intervalul disponibil;
4. completează nume și telefon;
5. completează marca/modelul și numărul mașinii;
6. adaugă observații;
7. poate atașa fotografii;
8. trimite solicitarea;
9. primește mesaj că solicitarea așteaptă confirmarea.

## 7.2 Colecție Appointments

Câmpuri recomandate:

- `name`;
- `phone`;
- `email`;
- `service` — relationship;
- `carBrand`;
- `carModel`;
- `licensePlate`;
- `requestedStart`;
- `requestedEnd`;
- `timezone`, default `Europe/Bucharest`;
- `status`;
- `customerMessage`;
- `adminNotes`;
- `photos` — relationship către `contact-attachments`;
- `contactRequest` — relationship opțional;
- `source`, default `website`;
- `submittedAt`;
- `confirmedAt`;
- `cancelledAt`;
- `cancellationReason`;
- `ip` și `userAgent`, vizibile numai adminului.

Statusuri:

```text
pending
confirmed
reschedule-proposed
cancelled
rejected
completed
no-show
```

## 7.3 Global AvailabilitySettings

Global Payload nou:

```text
availability-settings
```

Câmpuri:

- timezone: `Europe/Bucharest`;
- durata slotului: 30 minute;
- program pe fiecare zi a săptămânii;
- pauze în timpul zilei;
- timp minim înainte de programare;
- număr maxim de zile în avans, recomandat 60;
- zile complet blocate;
- intervale blocate;
- capacitate per slot, default 1;
- email notificări;
- text de confirmare.

## 7.4 Endpointuri

```text
GET /api/appointments/availability?date=YYYY-MM-DD&service=slug
POST /api/appointments
POST /api/appointments/[token]/cancel
```

Disponibilitatea se calculează server-side în `Europe/Bucharest`.

Trebuie tratate explicit:

- schimbarea orei de vară/iarnă;
- zilele închise;
- pauzele;
- sloturile deja confirmate;
- sloturile blocate manual;
- timpul minim până la programare;
- concurența între două solicitări trimise simultan.

## 7.5 Confirmare și concurență

Pentru MVP, slotul este marcat ocupat la crearea cererii `pending` sau se aplică un hold scurt, astfel încât două persoane să nu primească același interval.

Trebuie folosită o protecție la nivel de bază de date, nu doar verificare în frontend.

Variantă simplă pentru sloturi fixe de 30 minute:

```text
slotKey = YYYY-MM-DDTHH:mm + timezone
```

`slotKey` trebuie să fie unic pentru statusurile care blochează slotul.

Dacă se permit durate diferite per serviciu, trebuie verificată suprapunerea intervalelor într-o tranzacție; aceasta poate fi lăsată pentru o versiune ulterioară.

## 7.6 Admin

MVP admin:

- listă Payload cu coloane: dată, oră, client, telefon, serviciu, status;
- filtre după dată, status și serviciu;
- schimbare status;
- note interne;
- buton telefon/email;
- blocarea zilelor și intervalelor din global settings.

Un calendar lunar/săptămânal custom în admin este util, dar poate fi un PR separat după MVP. Lista filtrabilă este suficientă pentru prima lansare.

## 7.7 Emailuri

La trimitere:

- email către service cu datele și linkul spre admin;
- email către client: solicitarea a fost primită, nu este încă confirmată.

La confirmare:

- dată și oră;
- adresă;
- serviciu;
- telefon;
- instrucțiuni;
- link de anulare.

La reprogramare:

- noul interval propus;
- instrucțiune de confirmare telefonică/email.

## 7.8 Protecții

- Zod pentru toate datele;
- rate limiting pe IP și telefon;
- honeypot;
- opțional Turnstile dacă apare spam;
- token de anulare aleator și stocat hash-uit;
- fără expunerea ID-ului Payload în URL public;
- audit minim al schimbărilor de status.

## 7.9 Criterii de acceptare

- utilizatorul vede numai intervale valide;
- nu se poate selecta o zi închisă;
- nu se pot crea două programări care blochează același slot;
- programarea apare în Payload;
- clientul primește mesaj clar că așteaptă confirmarea;
- service-ul primește notificare;
- adminul poate confirma, propune reprogramare sau anula;
- timezone-ul rămâne corect inclusiv la schimbarea orei;
- formularul funcționează pe mobil.

---

# 8. Navigație și legături interne

Header:

- se adaugă link `Programare`;
- CTA-ul telefon poate rămâne separat;
- pe mobil, `Programare` trebuie să fie vizibil fără scroll excesiv.

Homepage:

- hero către Contact și Programare;
- fiecare card de serviciu către pagina proprie;
- reviews către `/recenzii`;
- blog către paginile de servicii relevante.

Pagini servicii:

- CTA evaluare foto;
- CTA programare cu serviciul preselectat:

```text
/programare?service=tinichigerie
```

Blog:

- articolele despre accidente duc către pagina daune;
- articolele despre vopsire duc către vopsitorie;
- articolele despre diagnoză duc către diagnoză.

---

# 9. Sitemap, metadata și OG

Trebuie actualizate:

- sitemap cu cele șase pagini de servicii;
- canonical pentru filtrele de recenzii;
- paginile de filtre pot avea canonical către `/recenzii`;
- pagina Programare trebuie să aibă OG dedicat sau să folosească OG Contact;
- fiecare serviciu folosește `ogImage` propriu;
- schema `Service` pentru paginile individuale;
- breadcrumb structured data;
- `noindex` pentru URL-uri invalide și stări tehnice.

Pentru `/programare`, meta propus:

```text
Programare service auto Brașov | Car Fix & Paint
```

```text
Solicită online o programare pentru constatare, diagnoză sau evaluarea mașinii la Car Fix & Paint Brașov.
```

---

# 10. Ordinea recomandată a implementării

## PR 1 — Copy și pagini individuale de servicii

- câmpuri Payload;
- migrare;
- seed;
- rută `[pageSlug]`;
- metadata, JSON-LD, sitemap;
- linkuri interne;
- textele noi din acest document.

## PR 2 — Recenzii paginate și filtrabile

- `hasComment`;
- migrare și seed;
- query server-side;
- filtre și pagination;
- homepage cu maximum șase recenzii.

## PR 3 — Upload privat de fotografii

- colecție privată;
- storage;
- endpoint multipart;
- procesare imagini;
- UI formular;
- politică de retenție;
- actualizare texte GDPR.

## PR 4 — Calendar și programări

- Appointments;
- AvailabilitySettings;
- endpoint disponibilitate;
- endpoint creare/anulare;
- pagină `/programare`;
- emailuri;
- admin list și statusuri.

## PR 5 opțional — Admin calendar și integrare Google Calendar

Nu este necesar pentru MVP.

---

# 11. Estimare orientativă de lucru

Cu infrastructura actuală și lucru asistat de AI:

| Componentă | Estimare |
|---|---:|
| Copy + șase pagini servicii + SEO | 10–16 ore |
| Paginare și filtre recenzii | 4–8 ore |
| Upload privat fotografii | 8–16 ore |
| Programări MVP | 16–28 ore |
| Teste, migrare, deploy și corecții | 6–12 ore |
| **Total** | **44–80 ore** |

Estimarea nu include:

- realizarea fotografiilor reale în atelier;
- introducerea a 20–30 de lucrări reale de portofoliu;
- integrare bidirecțională Google Calendar;
- plăți online;
- conturi de client;
- CRM sau istoric complet al reparațiilor.

---

# 12. Comenzi de validare

După fiecare PR:

```bash
npm run generate:types
npm run typecheck
npm run lint
npm run build
```

Când există modificări de schemă:

```bash
npm run migrate:create
npm run migrate
npm run seed
```

Teste manuale obligatorii:

- desktop și mobil;
- Chrome, Safari și Firefox;
- formular cu și fără imagini;
- imagini prea mari și tipuri invalide;
- filtre recenzii și query params;
- sloturi ocupate și cereri simultane;
- emailurile de cerere și confirmare;
- timezone Europe/Bucharest;
- mutarea de pe subdomeniul temporar pe domeniul principal.

---

# 13. Materiale necesare de la client

Pentru a crește încrederea site-ului, clientul trebuie să furnizeze separat:

- fotografii reale ale atelierului;
- fotografii cu echipa, numai cu acordul persoanelor;
- fotografii ale cabinei de vopsire și echipamentelor;
- minimum 5–8 lucrări reale înainte/după pentru prima versiune;
- programul exact de lucru pentru calendar;
- durata dorită pentru sloturile de constatare;
- zilele și intervalele în care nu se fac programări;
- emailul și persoanele care primesc notificările.

Imaginile AI existente pot rămâne ca exemple ilustrative până la înlocuire, dar nu trebuie prezentate drept lucrări reale executate de service.
