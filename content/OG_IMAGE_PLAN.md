# Plan OG images — CarFix Paint

Format recomandat pentru toate imaginile: **1200 × 630 px**, JPG/WebP optimizat, cu text puțin și lizibil, logo CarFix Paint și accentele roșu/negru ale site-ului.

## Acoperire existentă

- `/og-image.png` — imagine implicită folosită de homepage și de paginile fără imagine dedicată.
- Cele 6 articole de blog folosesc deja cover-ul propriu drept OG image.
- Cele 6 pagini individuale de portofoliu folosesc momentan imaginea „după”. Deoarece acestea sunt concepte AI ilustrative, este preferabilă ulterior o imagine OG neutră, branduită, care să nu sugereze că lucrarea a fost executată efectiv.

## Prioritate mare

1. `public/og/home.jpg` — homepage; poate înlocui imaginea implicită actuală.
2. `public/og/servicii.jpg` — pagina `/servicii`.
3. `public/og/daune-rca-casco.jpg` — pagina `/daune`.
4. `public/og/portofoliu.jpg` — pagina `/portofoliu`, etichetată vizual ca „exemple ilustrative”.
5. `public/og/despre.jpg` — pagina `/despre`.
6. `public/og/recenzii.jpg` — pagina `/recenzii`, ideal cu ratingul public și fără texte atribuite artificial clienților.
7. `public/og/faq.jpg` — pagina `/faq`.
8. `public/og/blog.jpg` — pagina index `/blog`; articolele individuale sunt deja acoperite.
9. `public/og/contact.jpg` — pagina `/contact`.

## Prioritate mică / opțional

10. `public/og/politica-confidentialitate.jpg`.
11. `public/og/politica-cookies.jpg`.
12. `public/og/termeni-conditii.jpg`.

Paginile legale pot folosi fără probleme imaginea implicită a site-ului; imaginile dedicate au valoare redusă.

## Pagini dinamice

### Blog

Nu sunt necesare imagini OG suplimentare: fiecare dintre cele 6 articole folosește deja cover-ul propriu.

### Portofoliu

Pentru demo, recomand o singură imagine neutră `public/og/portofoliu-exemplu.jpg` pentru toate cele 6 pagini individuale, cu formularea vizuală „Exemplu ilustrativ de intervenție auto”. Aceasta este mai sigură decât folosirea imaginilor „după”, care ar putea fi interpretate ca fotografii ale unor lucrări reale.

Când sunt adăugate fotografii reale și confirmate, fiecare proiect poate primi propriul OG image.

### Servicii

În prezent există o singură pagină index `/servicii`, fără rute individuale pentru fiecare serviciu. Este suficient un singur `og-servicii.jpg`. Dacă se adaugă ulterior pagini precum `/servicii/vopsitorie` sau `/servicii/tinichigerie`, fiecare ar trebui să primească o imagine dedicată.

## Ordine recomandată de generare

Pentru următoarea etapă, generează mai întâi cele 9 imagini din secțiunea „Prioritate mare”, apoi imaginea neutră pentru paginile individuale de portofoliu. Imaginile legale pot rămâne pe default.
