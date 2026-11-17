# Vaste regels voor elke oefening

Lees dit voor je begint. Deze regels gelden altijd, ook als de opdracht ze niet herhaalt.

## 1. Het resultaat is een lokale app

- De app staat in één map en opent door `index.html` te dubbelklikken, op Windows en op Mac. Geen server, geen installatie, geen internet nodig bij het gebruik.
- Daarom: gewone `<script src="...">`-tags met gewone .js-bestanden. Geen ES-modules met `import`, geen `fetch` of `XMLHttpRequest` naar lokale bestanden, geen CDN. Gegevens staan als JavaScript in een .js-bestand (`window.DATA = {...}`).
- Bibliotheken zet je in een map `vendor` in de app zelf. Alleen open source (MIT, Apache, BSD, SIL OFL).
- Lettertypes: systeemlettertypes, of open lettertypes die je in de map van de app zet. Kopieer niets uit de lettertypemap van het systeem.
- Wat de gebruiker invoert, bewaar je automatisch in de browser (localStorage). Geef altijd een knop om een back-up als bestand te bewaren en terug te zetten.
- Schrijf de app in het Nederlands, tenzij de opdracht iets anders vraagt.

## 2. Beelden komen van FLUX

- Alles wat een beeld kan zijn, is een beeld van FLUX: figuren, voorwerpen, achtergronden, texturen, foto's, logo's. Teken geen figuren met cirkels, rechthoeken of emoji.
- Gebruik de beeldtool zoals beschreven in `cursuskit/LEESMIJ.md`.
- Bepaal eerst welke beelden de app nodig heeft en schrijf ze in één lijst. Hoogstens 12 beelden per keer en hoogstens 24 per oefening, tenzij de opdracht meer vraagt.
- Kies één stijlzin en zet die letterlijk in elke beeldprompt, zodat alle beelden bij elkaar passen. Schrijf beeldprompts in het Engels en eindig met "no text, no letters, no logos, no watermark".
- Figuren en voorwerpen: transparant, 512 pixels. Achtergronden en foto's: `"transparant": false`, een passende verhouding en `"max": 1600`.
- Geen merken, geen echte personen, geen beschermde figuren of gebouwen.
- Bekijk elk beeld voor je het gebruikt. Is een beeld mislukt, maak het één keer opnieuw.
- De app moet blijven werken als een beeld ontbreekt (toon dan een effen kleur).
- Lukt de beeldtool niet (geen sleutelbestand, geen tegoed), bouw dan verder zonder beelden en zeg duidelijk wat de gebruiker moet nakijken.

## 3. Werken in de sandbox

- Werk alleen in de map die de opdracht noemt. Vraag nooit om meer rechten en probeer een blokkade niet te omzeilen. Lukt iets niet, kies een andere weg of sla het over en zeg het.
- Downloaden doe je met Node.js `fetch` in een klein .mjs-script.
- Windows: start programma's met `cmd /c "programma argumenten > uit.txt 2> fout.txt"` en lees daarna die bestanden. Uitpakken van een zip: `tar -xf bestand.zip -C map`.
- Mac: gebruik zsh. Uitpakken: `unzip bestand.zip -d map`.
- Een browser starten lukt niet in de sandbox. Probeer het niet. Test de logica met kleine Node-scripts en laat de gebruiker het scherm beoordelen.
- npm alleen als de opdracht het vraagt, in de map van de oefening, met `--ignore-scripts` als een installatie faalt.
- De OpenRouter-sleutel staat in `openrouter_key.txt` op het bureaublad. Alleen de beeldtool leest hem. Kopieer, toon of log de sleutel nooit.
- Niets publiceren, niets versturen, geen accounts aanmaken, nooit een wachtwoord typen.

## 4. Afwerken

- Test wat je kan testen en schrijf de echte uitkomst op, niet wat je verwacht.
- Zoek voor je klaar meldt naar vergeten tekst zoals "TODO", "Lorem" of "voorbeeld hier".
- Stop elk programma dat je zelf startte.
- Schrijf een korte `LEESMIJ.md` in de map van de oefening: hoe je de app start, wat werkt, wat niet werkt of niet getest is, hoeveel beelden je maakte.
- Eindig je antwoord met: het bestand dat de gebruiker moet dubbelklikken, en drie dingen die hij best eerst uitprobeert.
