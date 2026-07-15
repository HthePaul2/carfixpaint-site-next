/**
 * Date demo pentru seed — nu importa în runtime-ul paginilor publice.
 */
import type {
  SeedBlogPost,
  SeedFaqItem,
  SeedPortfolioProject,
  SeedReview,
  SeedService,
} from '@/seed/types'

export const SERVICES: SeedService[] = [
  {
    id: 'tinichigerie',
    name: 'Tinichigerie & Caroserie',
    icon: 'Hammer',
    description: 'Reparații complete de caroserie pentru orice tip de daună. Echipament profesional și tehnici moderne pentru restaurarea perfectă a structurii autovehiculului.',
    features: [
      'Îndreptare caroserie cu bancă de trasare',
      'Sudură puncte de caroserie',
      'Înlocuire elemente caroserie',
      'Reparații aripi, uși, capote',
      'Tratament anticorозiune'
    ]
  },
  {
    id: 'vopsitorie',
    name: 'Vopsitorie Auto Profesională',
    icon: 'PaintBrush',
    description: 'Cabină de vopsitorie modernă cu sistem de filtrare aer. Vopsea originală, finisaj perfect, culori identificate cu precizie prin computer.',
    features: [
      'Vopsire completă sau parțială',
      'Identificare culoare computerizată',
      'Cabină de vopsit cu filtrare',
      'Vopsea de calitate premium',
      'Finisaj lustruit profesional'
    ]
  },
  {
    id: 'mecanica',
    name: 'Mecanică Auto',
    icon: 'Wrench',
    description: 'Service mecanic complet pentru toate mărcile. Diagnosticare, reparații și întreținere preventivă la standarde înalte de calitate.',
    features: [
      'Reparații motor și transmisie',
      'Sistem de frânare',
      'Suspensie și direcție',
      'Sistem de răcire',
      'Întreținere periodică'
    ]
  },
  {
    id: 'diagnoza',
    name: 'Diagnoză Computerizată',
    icon: 'ComputerTower',
    description: 'Echipamente de diagnoză de ultimă generație pentru identificarea rapidă și precisă a oricăror probleme tehnice.',
    features: [
      'Testare computer de bord',
      'Citire și ștergere coduri eroare',
      'Diagnoză electronică completă',
      'Testare senzori și actuatori',
      'Raport detaliat probleme'
    ]
  },
  {
    id: 'daune-rca-casco',
    name: 'Gestionare Daune RCA/CASCO',
    icon: 'Shield',
    description: 'Suport complet pentru daunele asigurate. Decontare directă cu toate companiile de asigurări, fără birocrație pentru tine.',
    features: [
      'Constatare și evaluare daune',
      'Documentație completă asigurare',
      'Decontare directă cu asigurători',
      'Mașină la schimb (unde se aplică)',
      'Fără avans din partea ta'
    ]
  },
  {
    id: 'masina-schimb',
    name: 'Mașină la Schimb',
    icon: 'Car',
    description: 'Nu rămâi fără mașină pe perioada reparațiilor. Îți oferim un autovehicul de înlocuire pentru mobilitate constantă.',
    features: [
      'Mașini noi și întreținute',
      'Disponibilitate imediată',
      'Asigurare inclusă',
      'Procedură simplificată',
      'Fără costuri ascunse'
    ]
  }
]

export const REVIEWS: SeedReview[] = []

export const PORTFOLIO_PROJECTS: SeedPortfolioProject[] = [
  {
    id: '1',
    title: 'Audi A4 - Reparație Daună Laterală Completă',
    description: 'Reparație complexă după impact lateral: înlocuire uși, îndreptare caroserie, vopsire completă laterală. Vehiculul a fost restaurat la specificațiile originale cu decontare directă CASCO.',
    services: ['Tinichigerie', 'Vopsitorie', 'Daune CASCO'],
    beforeImage: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=800&h=600&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=600&fit=crop',
    duration: '7 zile'
  },
  {
    id: '2',
    title: 'BMW X5 - Vopsire Capotă și Aripă Față',
    description: 'Vopsire profesională capotă și aripă față dreaptă cu identificare computerizată culoare. Finisaj perfect, fără diferențe de nuanță față de restul caroseriei.',
    services: ['Vopsitorie'],
    beforeImage: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&h=600&fit=crop',
    duration: '3 zile'
  },
  {
    id: '3',
    title: 'Mercedes C-Class - Reparație Daună Spate RCA',
    description: 'Impact spate cu înlocuire haion, stopuri, bara și senzori. Calibrare sisteme asistență parcare după reparație. Decontare RCA fără avans.',
    services: ['Tinichigerie', 'Vopsitorie', 'Daune RCA'],
    beforeImage: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop',
    duration: '5 zile'
  },
  {
    id: '4',
    title: 'Volkswagen Golf - Vopsire Completă',
    description: 'Renovare completă vopsea exterior după uzura în timp. Pregătire caroserie, tratament anticorозiune, vopsire completă în cabină profesională.',
    services: ['Vopsitorie'],
    beforeImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop',
    duration: '10 zile'
  },
  {
    id: '5',
    title: 'Ford Focus - Îndreptare Caroserie După Accident',
    description: 'Îndreptare caroserie cu bancă de trasare după impact frontal. Restaurare geometrie originală, verificare suspensie și direcție.',
    services: ['Tinichigerie', 'Mecanică'],
    beforeImage: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&h=600&fit=crop',
    duration: '6 zile'
  },
  {
    id: '6',
    title: 'Dacia Duster - Reparație Gardă și Praguri',
    description: 'Înlocuire gardă, praguri și tratament anticorозiune complet. Vopsire cu vopsea texturată originală pentru protecție maximă.',
    services: ['Tinichigerie', 'Vopsitorie'],
    beforeImage: 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800&h=600&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop',
    duration: '4 zile'
  }
]

export const FAQ_ITEMS: SeedFaqItem[] = [
  {
    question: 'Cât durează o reparație de tinichigerie și vopsitorie?',
    answer: 'Durata depinde de complexitatea lucrării. O vopsitorie simplă (1-2 elemente) durează între 2-3 zile. Reparații complexe de caroserie cu vopsitorie pot dura între 5-10 zile. La evaluare îți oferim un termen exact și te ținem la curent zilnic cu progresul.'
  },
  {
    question: 'Lucrați cu toate companiile de asigurări?',
    answer: 'Da, lucrăm cu toate companiile de asigurări din România. Avem contracte de decontare directă cu majoritatea asigurătorilor, ceea ce înseamnă că nu trebuie să plătești tu nimic în avans. Ne ocupăm noi de toată relația cu asiguratorul.'
  },
  {
    question: 'Pot primi mașină la schimb pe perioada reparației?',
    answer: 'Da, oferim mașini la schimb în cazul daunelor RCA/CASCO și pentru alte reparații mai lungi. Mașinile sunt asigurate și întreținute corespunzător. În cazul daunelor asigurate, costul mașinii de înlocuire este acoperit de asigurare.'
  },
  {
    question: 'Cum funcționează procesul de decontare pentru daune RCA/CASCO?',
    answer: 'Procesul este foarte simplu: (1) Aduci mașina la noi pentru constatare, (2) Facem evaluarea și întocmim documentația, (3) Trimitem dosarul la asigurare, (4) După aprobare începem reparațiile, (5) La final ridici mașina fără să plătești nimic (asigurarea achită direct către noi).'
  },
  {
    question: 'Oferiți garanție pentru lucrările efectuate?',
    answer: 'Da, toate lucrările noastre sunt garantate. Oferim garanție de 1 an pentru lucrările de tinichigerie și vopsitorie, 6 luni pentru mecanică. Garanția acoperă defectele de execuție și materialele folosite.'
  },
  {
    question: 'Trebuie să fac programare sau pot veni direct?',
    answer: 'Recomandăm să ne suni înainte pentru o programare, astfel ne asigurăm că avem disponibilitate și putem să te ajutăm rapid. Pentru evaluări și consultații poți trece și fără programare în programul de lucru.'
  },
  {
    question: 'Lucrați cu mașini de toate mărcile?',
    answer: 'Da, suntem service auto multimarcă. Lucrăm cu toate mărcile și modelele, de la mașini de serie la vehicule premium. Avem echipamentele și experiența necesare pentru orice tip de autovehicul.'
  },
  {
    question: 'Cât costă o reparație / vopsitorie?',
    answer: 'Prețurile variază în funcție de complexitatea lucrării, piesele necesare și materialele folosite. După evaluarea gratuită îți oferim o ofertă detaliată și transparentă, fără costuri ascunse. Pentru daune asigurate, costul este acoperit de asigurare.'
  },
  {
    question: 'Ce tipuri de vopsea folosiți?',
    answer: 'Folosim exclusiv vopsea de calitate premium de la producători recunoscuți în industrie. Culoarea este identificată computerizat pentru a obține nuanța exactă a mașinii tale. Vopsim în cabină profesională cu sistem de filtrare pentru finisaj perfect.'
  },
  {
    question: 'Pot urmări progresul reparației mașinii mele?',
    answer: 'Da, comunicăm constant cu clienții noștri. Te ținem la curent cu stadiul lucrărilor prin telefon sau WhatsApp. Dacă apar probleme suplimentare sau schimbări în termen, te anunțăm imediat. Transparența este foarte importantă pentru noi.'
  }
]

export const BLOG_POSTS: SeedBlogPost[] = [
  {
    id: '1',
    title: 'Cum Procedezi După un Accident Auto: Ghid Complet RCA/CASCO',
    excerpt: 'Pașii esențiali pe care trebuie să îi urmezi imediat după un accident pentru a nu pierde drepturile la despăgubiri. Constatare, documentație, relație cu asiguratorul.',
    date: '2026-01-20',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&h=600&fit=crop',
    content: `Un accident auto poate fi o experiență stresantă, dar cunoașterea pașilor corecți poate face diferența între o despăgubire rapidă și probleme prelungite cu asiguratorul.

## Pașii Imediați După Accident

1. **Asigură siguranța** - Pornește avariile, folosește triunghiul reflectorizant și asigură-te că toți ocupanții sunt în siguranță.

2. **Apelează 112** - În cazul accidentelor cu victime sau daune materiale majore, anunță autorităț

ile.

3. **Documentează scena** - Fă fotografii detaliate din mai multe unghiuri: poziția vehiculelor, daunele, plăcuțele de înmatriculare, semnalizarea rutieră.

4. **Completează constatarea amiabilă** - Dacă ambele părți sunt de acord, completați formularul de constatare amiabilă. Atenție la detalii!

5. **Contactează asiguratorul** - Anunță compania de asigurări în maximum 3-5 zile (verifică polița pentru termen exact).

## Documentația Necesară

- Poliță de asigurare validă
- Constatare amiabilă sau proces verbal de la poliție
- Permis de conducere
- Certificat de înmatriculare
- Fotografii detaliate

## Greșeli de Evitat

❌ Nu admite vina la fața locului
❌ Nu pleca de la locul accidentului fără documentare
❌ Nu repara mașina înainte de constatarea asiguratorului
❌ Nu semna documente pe care nu le înțelegi

## CarFix Paint Te Poate Ajuta

La CarFix Paint, ne ocupăm de întreg procesul: evaluare daune, documentație completă, comunicare cu asiguratorul, și bineînțeles, reparația profesională a autovehiculului. Sună acum pentru o consultație gratuită!`
  },
  {
    id: '2',
    title: '5 Semne Că Mașina Ta Are Nevoie de Tinichigerie Profesională',
    excerpt: 'Detectarea timpurie a problemelor de caroserie poate preveni daune mai mari. Află care sunt semnele de alarmă și când trebuie să mergi la service.',
    date: '2026-01-12',
    readTime: '4 min',
    image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=1200&h=600&fit=crop',
    content: `Caroseria mașinii tale face mult mai mult decât să arate bine - ea protejează structura vehiculului și siguranța pasagerilor. Iată semnele că ai nevoie de atenție profesională.

## 1. Rugină Vizibilă

Rugina nu dispare singură - ea se extinde. Chiar și pete mici de rugină pot indica probleme mai profunde care necesită intervenție profesională urgentă.

## 2. Deformări sau Balonări ale Caroseriei

Dacă observi zone unde caroseria pare bombată sau deformată, acesta poate fi un semn de impact anterior nereparat corect sau de rugină sub vopsea.

## 3. Spații Inegale Între Panouri

Dacă distanța dintre capotă și aripă, sau între ușă și caroserie nu e uniformă, poate indica o problemă structurală ce necesită îndreptare profesională pe bancă de trasare.

## 4. Zgomote Neobișnuite

Trosnete, scârțâituri sau zgomote metalice pot indica că elementele de caroserie s-au slăbit sau deteriorat.

## 5. Vopsea Crăpată sau Cojită

Vopseaua deteriorată expune metalul la umiditate și sare, accelerând corozia. Intervenția rapidă previne daune costisitoare.

## Concluzie

Nu ignora aceste semne! O intervenție timpurie la un service profesionist precum CarFix Paint poate salva mașina ta de reparații mult mai costisitoare în viitor. Programează o evaluare gratuită astăzi!`
  },
  {
    id: '3',
    title: 'Vopsitorie vs Folie: Ce Alegere Este Potrivită Pentru Mașina Ta?',
    excerpt: 'Analiză comparativă între vopsirea clasică și aplicarea foliilor. Avantaje, dezavantaje, costuri și durabilitate pentru fiecare metodă.',
    date: '2026-01-05',
    readTime: '6 min',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1200&h=600&fit=crop',
    content: `Vrei să schimbi culoarea mașinii sau să o protejezi? Hai să comparăm cele două opțiuni principale: vopsitorie profesională și wrap cu folie.

## Vopsitorie Clasică

### Avantaje
✅ Durabilitate superioară (10-15+ ani cu întreținere corectă)
✅ Rezistență la intemperii și substanțe chimice
✅ Valoare de revânzare mai bună
✅ Aspect OEM de calitate
✅ Reparații locale posibile

### Dezavantaje
❌ Cost inițial mai mare
❌ Timp de execuție mai lung (5-10 zile)
❌ Imposibil de revers la culoarea originală
❌ Necesită pregătire extensivă

### Cost: 2,500 - 8,000 lei (funcție de calitatea vopselei)

## Folie Auto (Wrap)

### Avantaje
✅ Aplicare mai rapidă (2-3 zile)
✅ Reversibil - poți reveni la culoarea originală
✅ Varietate mare de culori și finisaje (mat, lucios, chrome)
✅ Protecție împotriva zgarieturilor mici
✅ Cost inițial mai mic

### Dezavantaje
❌ Durabilitate limitată (3-7 ani)
❌ Se poate deteriora la marginii
❌ Necesită îngrijire specială
❌ Poate afecta valoarea de revânzare
❌ Reparații greu de realizat

### Cost: 1,800 - 5,000 lei (funcție de calitatea foliei)

## Ce Să Alegi?

**Alege vopsitoria dacă:**
- Vrei o soluție permanentă și durabilă
- Îți pasă de valoarea de revânzare
- Mașina are daune de caroserie ce trebuie reparate
- Vrei cel mai autentic aspect

**Alege folia dacă:**
- Vrei să experimentezi cu culori temporar
- Mașina e nouă și vrei protecție
- Bugetul e limitat
- Plănuiești să vinzi mașina în 2-3 ani

La CarFix Paint, oferim servicii profesionale de vopsitorie cu garanție și echipamente de ultimă generație. Contactează-ne pentru o consultație personalizată!`
  },
  {
    id: '4',
    title: 'Întreținerea Caroseriei: Cum Protejezi Vopseaua Mașinii Pe Timp de Iarnă',
    excerpt: 'Sfaturi practice pentru protejarea vopselei în sezonul rece. Sare, umiditate și temperaturi scăzute - cum le combați eficient.',
    date: '2025-12-28',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1612892483236-52d32a0e0ac1?w=1200&h=600&fit=crop',
    content: `Iarna în România aduce nu doar zăpadă și ger, ci și o amenințare serioasă pentru caroseria mașinii tale: sarea de dezăpezire. Iată cum să o protejezi eficient.

## De Ce Este Sarea Atât de Dăunătoare?

Sarea accelerează dramatic procesul de coroziune, mai ales când se combină cu umiditatea și ciclurile îngheț-dezgheț. Zonele cele mai vulnerabile sunt: pragurile, guardele, arcurile roților și partea inferioară a ușilor.

## Sfaturi Esențiale de Protecție

### 1. Spălări Frecvente (Cel Puțin O Dată Pe Săptămână)

Concentrează-te pe:
- Partea inferioară a mașinii
- Arcurile roților
- Pragurile și guardele
- Spațiile dintre panouri

**Pro tip:** Folosește apă călduță când e posibil și asigură-te că speli și sub mașină.

### 2. Ceară Protectoare

Aplică un strat de ceară de calitate înaintea iernii. Acesta creează o barieră protectoare între vopsea și elementele dăunătoare.

### 3. Tratament Anticorозiune

Investește într-un tratament profesional anticorозiune pentru partea inferioară a mașinii. Un singur tratament poate proteja mașina pentru 1-2 ani.

### 4. Verifică și Repară Micile Defecte

Zgarieturile și cioburile de vopsea sunt puncte de intrare pentru coroziune. Repară-le rapid, chiar dacă sunt mici!

### 5. Evită Bălțile de Apă Sărată

Pe cât posibil, ocolește zonele unde s-a acumulat apă cu sare topită.

## Calendar de Întreținere Iarnă

**Săptămânal:**
- Spălare completă cu accent pe partea inferioară

**Lunar:**
- Verificare zone vulnerabile
- Aplicare spray ceară în arcurile roților

**Sfârșitul Sezonului:**
- Spălare profesională detaliată
- Tratament ceară completă
- Inspectție pentru semne de coroziune

## Semne Că Ai Deja Probleme

🚨 Pete de rugină
🚨 Vopsea ridicată sau balonată
🚨 Bule sub vopsea
🚨 Zgomote neobișnuite de la suspensie

Dacă observi oricare dintre aceste semne, programează o verificare la CarFix Paint. Intervenția rapidă poate preveni reparații costisitoare!

## Serviciile Noastre de Protecție

La CarFix Paint oferim:
- Tratament anticorозiune profesional
- Reparații vopsea și caroserie
- Aplicare ceară protectoare
- Verificări gratuite post-iarnă

Sună acum și pregătește-ți mașina pentru iarnă!`
  },
  {
    id: '5',
    title: 'Decontare Directă vs Decontare în Regres: Care Este Diferența?',
    excerpt: 'Înțelege diferența dintre cele două tipuri de decontare la daune RCA/CASCO și alege varianta cea mai avantajoasă pentru tine.',
    date: '2025-12-15',
    readTime: '4 min',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=600&fit=crop',
    content: `Când vine vorba de daune auto asigurate, termenul "decontare" apare frecvent. Dar știi exact ce înseamnă decontare directă versus decontare în regres? Hai să clarificăm.

## Decontare Directă

### Ce Înseamnă?

În cazul decontării directe, repari mașina la un service agreat de asigurător, iar service-ul primește banii direct de la compania de asigurări. **Tu nu plătești nimic în avans.**

### Avantaje

✅ **Zero avans din partea ta** - nu scoți bani din buzunar
✅ **Proces mai simplu** - service-ul se ocupă de documentație
✅ **Reparație imediată** - nu aștepți să primești banii
✅ **Service verificat** - ești sigur că service-ul e agreat

### Dezavantaje

❌ Alegere limitată de service-uri
❌ Posibil să aștepți aprobarea asiguratorului

### Când Se Aplică?

- Daune RCA (dacă service-ul are contract cu asiguratorul vinov

atului)
- Daune CASCO (la service-uri partenere)
- Când asiguratorul acceptă această modalitate

## Decontare în Regres

### Ce Înseamnă?

Tu plătești reparația la service, apoi ceri banii înapoi de la asigurator. După ce primești despăgubirea, asiguratorul tău recuperează banii de la asiguratorul vinvatului (de aici "regres").

### Avantaje

✅ **Libertate totală** de alegere a service-ului
✅ **Control complet** asupra procesului
✅ **Posibil să obții despăgubiri suplimentare** (depreciere, închiriere mașină)

### Dezavantaje

❌ **Avans substanțial** - plătești tu întreaga reparație
❌ **Timp de așteptare** - pot trece săptămâni până primești banii
❌ **Mai multă birocrație** - trebuie să gestionezi singur documentația
❌ **Risc** - posibil să primești mai puțin decât ai plătit

### Când Are Sens?

- Vrei un service specific care nu e agreat
- Ai buget disponibil pentru avans
- Vrei să adaugi îmbunătățiri pe lângă reparația standard

## Comparație Directă

| Aspect | Decontare Directă | Decontare Regres |
|--------|------------------|------------------|
| **Avans necesar** | ❌ Nu | ✅ Da |
| **Alegere service** | Limitată | Orice service |
| **Viteză reparație** | Rapidă | Depinde de tine |
| **Birocrație** | Minimă | Moderată |
| **Risc financiar** | Minim | Moderat |

## Recomandarea CarFix Paint

Pentru majoritatea șoferilor, **decontarea directă este opțiunea optimă** - simplu, rapid, fără stres financiar. 

**Vestea bună:** CarFix Paint lucrează cu toate companiile majore de asigurări și oferim decontare directă pentru majoritatea daunelor RCA/CASCO!

### De Ce CarFix Paint?

- Contract cu toate asigurările majore
- Proces simplificat - ne ocupăm noi de tot
- Mașină la schimb gratuită (în majoritatea cazurilor)
- Comunicare transparentă pe tot parcursul
- Garanție 1 an pentru toate lucrările

## Ai Fost în Accident?

Nu te stresa cu birocrația! Sună la CarFix Paint și lasă-ne pe noi să ne ocupăm de:
- Evaluarea daunelor
- Documentația pentru asigurator
- Comunicarea cu compania de asigurări
- Reparația profesională

**Programează o constatare gratuită: 0760 686 384**`
  },
  {
    id: '6',
    title: 'Top 3 Greșeli Care Îți Depreciază Mașina (Și Cum Le Eviți)',
    excerpt: 'Erori comune pe care proprietarii de mașini le fac și care duc la depreciere accelerată. Sfaturi pentru menținerea valorii autovehiculului.',
    date: '2025-12-01',
    readTime: '7 min',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&h=600&fit=crop',
    content: `Mașina ta este probabil una dintre cele mai mari investiții. Din păcate, multe greșeli comune pot reduce dramatic valoarea ei de revânzare. Iată ce să eviți.

## Greșeala #1: Amânarea Reparațiilor de Caroserie

### Problema

"E doar o zgârietură mică, o repar când am timp..." Sună cunoscut? Această atitudine poate costa scump!

### De Ce E Gravă

- Zgârieturile expun metalul la umiditate și sare
- Rugina se extinde rapid sub vopsea
- O reparație mică de 200 lei devine una de 2,000 lei
- Potențialii cumpărători văd neglijență

### Soluția

✅ Repară imediat orice daună de vopsea sau caroserie
✅ Tratează preventiv zonele vulnerabile
✅ Verificări regulate la service profesionist
✅ Documentează toate reparațiile (crește încrederea cumpărătorilor)

**Impact financiar:** Poate scădea valoarea cu 10-20% la revânzare!

## Greșeala #2: Vopsitorie Ieftină și Neprofesionistă

### Problema

Alegerea celui mai ieftin service de vopsitorie, fără verificarea calității lucrărilor.

### Semnele Unei Vopsitorii Proaste

🚫 Diferențe de nuanță vizibile
🚫 Textura aspră sau "coaja de portocală"
🚫 Vopsea care se cojește după câteva luni
🚫 Urme de praf sau insecte în vopsea
🚫 Margini văzute la tranziții

### De Ce Contează

Un cumpărător experimentat (sau expertul său) va detecta imediat o vopsitorie proastă. Acest lucru ridică întrebări:
- "A fost implicată în accidente grave?"
- "Ce alte lucrări au fost făcute prost?"
- "Care e starea reală a mașinii?"

### Soluția

✅ Alege service-uri cu reputație și echipament profesional
✅ Cere mostre de lucrări anterioare
✅ Verifică garanția oferită
✅ Investește în vopsea de calitate
✅ Asigură-te că au cabină de vopsit cu filtrare

**La CarFix Paint:** Cabină modernă, vopsea premium, identificare computerizată culoare, garanție 1 an.

**Impact financiar:** Poate scădea valoarea cu 15-30% față de o vopsitorie profesională!

## Greșeala #3: Lipsa Documentației pentru Întreținere și Reparații

### Problema

"Nu mai am facturile, dar am făcut toate service-urile la timp!"

### De Ce E Esențial

Un istoric complet și documentat de service:
- Crește încrederea cumpărătorului
- Dovedește îngrijirea constantă
- Justifică prețul cerut
- Accelerează procesul de vânzare
- Poate aduce cu 10-15% mai mult

### Ce Documentație Să Păstrezi

📄 **Esențial:**
- Facturi service-uri regulate
- Dovezi schimb ulei și filtre
- Reparații majore (motor, transmisie, suspensie)
- Lucrări caroserie și vopsitorie
- ITP-uri și revizii tehnice

📄 **Bonus (diferențiază mașina ta):**
- Istoric complet de proprietari
- Fotografii before/after reparații
- Certificări de la service-uri autorizate
- Dovezi piese originale

### Soluția

✅ Creează un dosar fizic + digital
✅ Scanează toate documentele importante
✅ Păstrează facturile organizat (cronologic)
✅ Folosește aplicații de management auto
✅ Service-uri la centre autorizate care țin evidența

**Impact financiar:** Mașini cu istoric complet se vând cu 10-20% mai mult!

## Greșeli Bonus de Evitat

### 4. Neglijarea Interiorului

🔴 Pete netratate pe tapițerie
🔴 Zgârieturi și uzură excesivă
🔴 Miros neplăcut persistent
🔴 Elemente interioare rupte

### 5. Modificări Neprofesioniste

🔴 Tuning ieftin care arată prost
🔴 Sistem audio instalat prost
🔴 Vopsitorie în culori extreme
🔴 Modificări care afectează siguranța

### 6. Lipsa Curățeniei Regulate

🔴 Murdărie acumulată cronic
🔴 Rugină începătoare netratată
🔴 Lichide auto murdare sau neînlocuite
🔴 Aspect general neglijent

## Concluzie: Protejează-ți Investiția

Mașina ta poate păstra mult mai mult din valoare dacă:
1. ✅ Intervii rapid la orice problemă
2. ✅ Folosești servicii profesioniste de calitate
3. ✅ Păstrezi documentația completă
4. ✅ Întreții regulat, nu doar când se strică ceva

## CarFix Paint - Partenerul Tău Pentru Valoare Maximă

Oferim:
- Reparații caroserie cu garanție
- Vopsitorie profesională în cabină modernă
- Documentație completă pentru fiecare lucrare
- Consultanță pentru menținerea valorii mașinii
- Rapoarte foto before/after

**Nu lăsa lucrările proaste să îți deprecieze mașina. Alege CarFix Paint - calitate dovedită, rezultate garantate.**

📞 **Programează evaluare gratuită: 0760 686 384**`
  }
]

export const COMPANY_INFO = {
  name: 'CarFix Paint',
  tagline: 'Service Auto Premium Brașov',
  address: 'Calea Făgărașului nr. 8, Brașov',
  phone: '0760 686 384',
  email: 'office@carfixpaint.ro',
  schedule: 'Luni-Vineri 08:00-18:00',
  whatsappNumber: '40760686384',
  whatsappMessage: 'Bună ziua! Aș dori mai multe informații despre serviciile CarFix Paint.'
}
