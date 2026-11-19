# Hoofdstuk 5 · Alle prompts

De Complete AI Opleiding: van A tot I · Je eigen AI-coder met DeepSeek Harness

Dit zijn alle prompts van de oefeningen van hoofdstuk 5, in de versie waarmee ze op 18 en 19 november 2026 in DeepSeek Harness zijn uitgevoerd, met de aanpassingen na die test. Doe de oefeningen na elkaar, elk in een nieuwe sessie in de workspace AI-cursus, met GPT-6.1 Terra op Effort High en de toegang op Workspace Write (behalve bij D11).

Prompts die naar de cursuskit verwijzen (`cursuskit/REGELS.md`, `cursuskit/beelden.mjs`) hebben de map `cursuskit` uit deze repository nodig in je werkmap, en `openrouter_key.txt` in je werkmap.

## Deel A · Installeren en de lus

**A1 · DeepSeek Harness installeren** en **A2 · je OpenRouter-sleutel koppelen**: geen prompt, alleen installatiestappen (zie het handboek).

**A3 · een browser voor de agent**: geen prompt; je zet de browserplugin aan onder Plugins.

### A4 · Je eerste lus: de teller

**Prompt 1 · bouwen en nakijken**

```text
Maak in de map oefeningen/teller een kleine app: index.html met een teller, een knop plus, een knop min en een knop reset. Geef ze een verzorgd uiterlijk. De app moet werken door index.html te dubbelklikken, zonder internet.
Open de app daarna in je browser. Klik alle knoppen, maak een schermafbeelding en kijk of alles werkt en er goed uitziet. Verbeter wat niet klopt en kijk opnieuw. Doe dat hoogstens drie keer. Heb je een tijdelijke lokale server nodig, kijk dan eerst welke poort vrij is en stop de server als je klaar bent.
Zeg op het einde per ronde wat je zag en wat je veranderde, en welk bestand ik moet dubbelklikken. Vraag geen extra rechten.
```

**Prompt 2 · het venster open laten**

```text
Open de teller in je browser en laat het venster open staan. Ik ga er zelf in klikken. Zeg alleen 'klaar' als de pagina zichtbaar is.
```

**Prompt 3 · wat ziet de agent?**

```text
Ik heb zelf een paar keer geklikt. Kijk in je browser, zonder de pagina te herladen: welk getal toont de teller nu?
```

## Deel B · Bouwen met de lus

### B1 · Fruit Ninja

De spelopdracht is in het Engels: het is de testprompt die OpenRouter gebruikt om modellen te vergelijken, zodat je jouw resultaat naast dat van OpenRouter kan leggen. De laatste alinea is de Nederlandse slotzin. Doe deze prompt eerst met GPT-6.1 Terra. Start daarna een nieuwe sessie met DeepSeek V4.1 Flash en verander in de laatste alinea de map naar `oefeningen/fruitninja-deepseek`.

```text
Build a Fruit Ninja style slicing game. Fruit of at least four shapes and colors, are tossed up from below in arcs and fall back out of view. Hold the left mouse button and drag to slice; the slice is the cursor's path between frames, so a fast swipe must cut every fruit it crosses. Sliced fruit splits into two halves that fly apart with spin plus a burst of juice particles. Bombs are tossed among the fruit, and slicing one ends the game, as does letting three fruit fall unsliced. One point per fruit, with a combo bonus for three or more in one swipe. Draw a blade trail while dragging. Show score, misses and a game over screen.

Werk in de map oefeningen/fruitninja. De app moet werken door index.html te dubbelklikken, zonder internet en zonder installatie. Open ze in je browser, klik ze door zoals een gebruiker, maak een schermafbeelding en verbeter wat niet klopt, hoogstens drie rondes. Heb je daarvoor een tijdelijke lokale server nodig, kijk dan eerst welke poort vrij is, gebruik die en stop de server als je klaar bent. Vraag geen extra rechten. Zeg op het einde welk bestand ik moet dubbelklikken.
```

### B2 · QR-studio

```text
Bouw een QR-studio. Ik kies een soort code (link, wifi of visitekaartje), vul de gegevens in en zie de code meteen veranderen. Ik kies de kleuren, de vorm van de blokjes (vierkant, rond of afgerond) en zet een logo in het midden. Ik bewaar de code als PNG en ik kan een kaartje afdrukken met de code, een titel en een korte uitleg.

Zet drie voorbeelden klaar die ik met één klik kan openen:
1. Mijn LinkedIn: https://www.linkedin.com/in/voorbeeld-cursist
2. Een website: https://transformatrons.be
3. Wifi van de les: netwerk SyntraPXL, wachtwoord Welkom@Syntra2026!, beveiliging WPA.

De code moet altijd scanbaar blijven: gebruik de hoogste foutcorrectie zodra er een logo in staat, hou vier blokjes witrand rond de code, en waarschuw mij als mijn kleuren te weinig contrast hebben. Zet de QR-bibliotheek in de map van de app zelf, zodat alles werkt zonder internet.

Werk in de map oefeningen/qr-studio. De app moet werken door index.html te dubbelklikken, zonder internet en zonder installatie. Open ze in je browser, klik ze door zoals een gebruiker, maak een schermafbeelding en verbeter wat niet klopt, hoogstens drie rondes. Heb je daarvoor een tijdelijke lokale server nodig, kijk dan eerst welke poort vrij is, gebruik die en stop de server als je klaar bent. Vraag geen extra rechten. Zeg op het einde welk bestand ik moet dubbelklikken.
```

### B3 · Planbord

```text
Bouw een planbord (kanban) voor een klein team of een eigen project. Kolommen: Te doen, Bezig, Wacht op iemand, Klaar; ik kan kolommen toevoegen, hernoemen en verwijderen. Een kaartje heeft een titel, een beschrijving, een deadline, een prioriteit (laag, gewoon, hoog), gekleurde labels en een persoon. Ik versleep kaartjes tussen kolommen en binnen een kolom, met de muis en op een aanraakscherm. Ik zoek op tekst en filter op label, persoon en prioriteit. Kaartjes met een verstreken deadline vallen op. Onderaan staat hoeveel kaartjes in elke kolom zitten. Alles wordt automatisch bewaard op deze computer, en ik kan een back-up bewaren en terugzetten als bestand. Zet voorbeeldkaartjes klaar voor het project de opendeurdag van een bakkerij.

Werk in de map oefeningen/planbord. De app moet werken door index.html te dubbelklikken, zonder internet en zonder installatie. Open ze in je browser, klik ze door zoals een gebruiker, maak een schermafbeelding en verbeter wat niet klopt, hoogstens drie rondes. Heb je daarvoor een tijdelijke lokale server nodig, kijk dan eerst welke poort vrij is, gebruik die en stop de server als je klaar bent. Vraag geen extra rechten. Zeg op het einde welk bestand ik moet dubbelklikken.
```

### B4 · Kassa-app

```text
Bouw een kassa-app voor het wafelkraam van de jeugdbeweging. Het hoofdscherm toont grote knoppen met een foto, de naam en de prijs van elk product, in groepen (bijvoorbeeld eten, drank, extra). Een tik zet het product op de bestelling rechts; daar pas ik aantallen aan of haal ik iets weg. Onderaan staat het totaal. Bij Afrekenen kies ik contant of kaart; bij contant tik ik het ontvangen bedrag in (met snelknoppen 5, 10, 20, 50 euro) en zie ik groot het wisselgeld. Elke verkoop wordt bewaard met tijdstip. Het dagrapport toont de omzet, het aantal verkopen, de omzet per product en per betaalwijze, en is af te drukken. In Beheer pas ik producten, prijzen en groepen aan. De app werkt met de muis en op een aanraakscherm, ook zonder internet, en bewaart alles op deze computer met een back-up als bestand. Zet twaalf producten klaar, waaronder wafel 3 euro, wafel met slagroom 4 euro, koffie 2 euro, warme chocomelk 2,50 euro, frisdrank 2 euro.

Werk in de map oefeningen/kassa. De app moet werken door index.html te dubbelklikken, zonder internet en zonder installatie. Open ze in je browser, klik ze door zoals een gebruiker, maak een schermafbeelding en verbeter wat niet klopt, hoogstens drie rondes. Heb je daarvoor een tijdelijke lokale server nodig, kijk dan eerst welke poort vrij is, gebruik die en stop de server als je klaar bent. Vraag geen extra rechten. Zeg op het einde welk bestand ik moet dubbelklikken.
```

### B5 · Voorraadteller

```text
Bouw een voorraadteller voor een koffiebar. Elk product heeft een foto, een naam, een groep, een eenheid, de huidige voorraad, een minimum en een leverancier. Bij Tellen loop ik per groep door de producten en pas ik de voorraad aan met grote plus- en minknoppen of door een getal te typen. Producten onder hun minimum krijgen een duidelijke waarschuwing. De Bestellijst toont per leverancier wat ik moet bijbestellen om terug op het dubbele van het minimum te komen, om af te drukken of te kopiëren. Elke telling wordt bewaard met datum, zodat ik het verloop per product in een grafiek zie. Ik exporteer de voorraad naar een bestand dat Excel opent (CSV) en ik kan zo'n bestand ook inlezen. Alles werkt zonder internet en wordt bewaard op deze computer, met een back-up als bestand. Zet twintig producten klaar die bij mijn zaak passen, waarvan vier onder hun minimum.

Werk in de map oefeningen/voorraadteller. De app moet werken door index.html te dubbelklikken, zonder internet en zonder installatie. Open ze in je browser, klik ze door zoals een gebruiker, maak een schermafbeelding en verbeter wat niet klopt, hoogstens drie rondes. Heb je daarvoor een tijdelijke lokale server nodig, kijk dan eerst welke poort vrij is, gebruik die en stop de server als je klaar bent. Vraag geen extra rechten. Zeg op het einde welk bestand ik moet dubbelklikken.
```

### B6 · Offertemaker

```text
Bouw een offertemaker voor een kleine Belgische onderneming: Tuinen Peeters, een tuinaannemer die tuinen aanlegt en onderhoudt. Schermen: Nieuwe offerte, Offertes, Klanten, Artikelen en Instellingen.

Een offerte heeft een nummer dat vanzelf oploopt (2026-001), een datum, een geldigheid (standaard 30 dagen), een klant, en regels met omschrijving, aantal, eenheid, eenheidsprijs, korting en btw-tarief (21, 12, 6 of 0 procent). Toon per regel het bedrag en onderaan de totalen zonder btw, de btw per tarief en het totaal met btw. Reken in centen en rond de btw één keer per tarief af. Ik kies een regel uit mijn artikelenlijst of typ een vrije regel. De offerte krijgt mijn logo, mijn gegevens met ondernemingsnummer, mijn voorwaarden en een vak "Voor akkoord" met datum en handtekening. Ik druk ze af op één A4 of bewaar ze als pdf via de afdrukfunctie van de browser. De lijst Offertes toont de status: concept, verstuurd, aanvaard, geweigerd of verlopen. Alles wordt bewaard op deze computer, met een back-up als bestand. Zet drie voorbeeldklanten, tien artikelen en twee voorbeeldoffertes klaar.

Dit is een offertemaker, geen facturatieprogramma: facturen tussen Belgische bedrijven moeten via Peppol en dat kan een lokale app niet. Zet die uitleg in één zin op het scherm Instellingen.

Werk in de map oefeningen/offertemaker. De app moet werken door index.html te dubbelklikken, zonder internet en zonder installatie. Open ze in je browser, klik ze door zoals een gebruiker, maak een schermafbeelding en verbeter wat niet klopt, hoogstens drie rondes. Heb je daarvoor een tijdelijke lokale server nodig, kijk dan eerst welke poort vrij is, gebruik die en stop de server als je klaar bent. Vraag geen extra rechten. Zeg op het einde welk bestand ik moet dubbelklikken.
```

### B7 · Mini-spreadsheet

```text
Bouw een mini-spreadsheet die in de browser draait, zonder internet.

Rooster: 26 kolommen (A tot Z) en 100 rijen, met vaste kolom- en rijkoppen die blijven staan bij het scrollen. Ik selecteer een cel met een klik en een bereik door te slepen of met Shift en de pijltjes. Pijltjes, Tab en Enter bewegen de selectie. Dubbelklik of F2 bewerkt een cel; Escape annuleert. Boven het rooster staat een formulebalk die de inhoud van de actieve cel toont en bewerkt. Kolommen zijn breder en smaller te slepen.

Formules: een cel die met = begint is een formule. Schrijf zelf een ontleder (geen eval) met: getallen, tekst tussen aanhalingstekens, celverwijzingen (A1), bereiken (A1:B10), absolute verwijzingen ($A$1, A$1, $A1), de bewerkingen + - * / ^, haakjes, vergelijkingen (= <> < > <= >=) en & om tekst te plakken. Functies: SOM, GEMIDDELDE, MIN, MAX, AANTAL, AANTALARG, ALS, EN, OF, AFRONDEN, ABS, VANDAAG, TEKST.SAMENVOEGEN, LINKS, RECHTS, LENGTE, VERT.ZOEKEN, SOM.ALS en AANTAL.ALS, en ook hun Engelse namen (SUM, AVERAGE, COUNT, COUNTA, IF, AND, OR, ROUND, TODAY, CONCAT, LEFT, RIGHT, LEN, VLOOKUP, SUMIF, COUNTIF). Argumenten scheid je met een puntkomma; een komma is het decimaalteken bij invoer en weergave.

Herberekenen: hou bij welke cel van welke afhangt en herbereken na elke wijziging alleen wat nodig is, in de juiste volgorde. Een kringverwijzing geeft #KRING!, delen door nul #DEEL/0!, een onbekende functie #NAAM?, een fout argument #WAARDE!. Een fout in één cel mag de rest niet blokkeren.

Bewerken: kopiëren, knippen en plakken met Ctrl of Cmd C, X en V, binnen het blad en van en naar Excel (tekst met tabs). Bij plakken en bij het vulgreepje schuiven relatieve verwijzingen mee. Ongedaan maken en opnieuw met Ctrl of Cmd Z en Y, minstens vijftig stappen. Rijen en kolommen invoegen en verwijderen past de formules aan.

Opmaak per cel: vet, cursief, links, midden of rechts, tekstkleur, vulkleur, en getalnotatie (standaard, twee decimalen, euro, procent, datum).

Bestanden: meerdere werkbladen met tabs onderaan. Automatisch bewaren op deze computer. Importeren en exporteren als CSV (met puntkomma) en een eigen back-upbestand met formules en opmaak. Afdrukken van het gebruikte bereik.

Voorbeelden: zet drie bladen klaar: Budget (maandbudget met sommen en percentages), Punten (een puntenlijst met gemiddelde en geslaagd of niet met ALS) en Prijslijst (met VERT.ZOEKEN).

Test jezelf voor je klaar meldt: schrijf een testscript dat minstens veertig formules uitrekent en vergelijkt met de juiste uitkomst, waaronder elke functie, elke foutsoort, een kringverwijzing en een keten van tien cellen die van elkaar afhangen. Toon mij de uitkomst van die test.

Werk in de map oefeningen/mini-spreadsheet. De app moet werken door index.html te dubbelklikken, zonder internet en zonder installatie. Open ze in je browser, klik ze door zoals een gebruiker, maak een schermafbeelding en verbeter wat niet klopt, hoogstens drie rondes. Heb je daarvoor een tijdelijke lokale server nodig, kijk dan eerst welke poort vrij is, gebruik die en stop de server als je klaar bent. Vraag geen extra rechten. Zeg op het einde welk bestand ik moet dubbelklikken.
```

### B8 · Urenregistratie met je stem

```text
Bouw een urenregistratie voor één zelfstandige, als lokale app zonder server.

Invoer met de stem: ik druk op een grote microfoonknop, zeg wat ik gedaan heb en druk opnieuw om te stoppen. De app stuurt de opname naar een spraakmodel via OpenRouter, en laat daarna een taalmodel de tekst omzetten in een urenregel met klant, project, datum, duur in minuten, omschrijving en factureerbaar of niet. Ik zie het voorstel en bevestig of verbeter het voor het bewaard wordt. Werkt de microfoon niet in mijn browser, dan typ ik dezelfde zin in een tekstvak en gebeurt de rest op dezelfde manier. Herken zelf, zonder AI, eenvoudige zinnen zoals "2u30", "anderhalf uur", "gisteren" en "van 9 tot 11".

Sleutel: ik plak mijn OpenRouter-sleutel één keer in Instellingen. Bewaar hem alleen in deze browser op deze computer, toon hem nooit volledig en zet hem nooit in een bestand of in de code. Zoek in de modellenlijst van OpenRouter welke modellen audio aannemen en laat mij in Instellingen het spraakmodel en het taalmodel kiezen, met een goedkope standaardkeuze die Nederlands goed verstaat. Toon bij elk dictaat wat het kostte.

Verder: een dagoverzicht, een weekoverzicht per klant en project met totalen, klanten en projecten met een uurtarief en een kleur, en een maandoverzicht per klant met uren en bedrag. Exporteer naar een bestand dat Excel opent (CSV). Alles wordt bewaard op deze computer, met een back-up als bestand. Zet vier voorbeeldklanten en twee weken voorbeelduren klaar.

Werk in de map oefeningen/urenregistratie. De app moet werken door index.html te dubbelklikken, zonder internet en zonder installatie. Open ze in je browser, klik ze door zoals een gebruiker, maak een schermafbeelding en verbeter wat niet klopt, hoogstens drie rondes. Heb je daarvoor een tijdelijke lokale server nodig, kijk dan eerst welke poort vrij is, gebruik die en stop de server als je klaar bent. Vraag geen extra rechten. Zeg op het einde welk bestand ik moet dubbelklikken, en in welke browsers de microfoon werkt.
```

### B9 · Webonderzoek met een team

Zet vóór je verstuurt in het modelmenu **Enable agent teamwork** aan, en daarna weer uit.

```text
Onderzoek de Amerikaanse midterm-verkiezingen van 3 november 2026 en verzamel de gegevens voor een interactief dashboard dat ik in een volgende stap laat bouwen. Blijf strikt neutraal: alleen uitslagen en feiten, geen voorkeur en geen verklaringen voor waarom mensen zo stemden.

Werk als team. Jij bent de hoofdagent. Start vier helpers tegelijk, elk met een eigen deel en een eigen bestand:
1. Senaat: elke zetel die te verkiezen was: staat, kandidaten met partij, stemmen en percentage, winnaar, of de zetel van partij wisselde.
2. Huis van Afgevaardigden: per staat het aantal zetels per partij voor en na, en de districten die van partij wisselden.
3. Gouverneurs: elke verkiezing: staat, kandidaten met partij, percentages, winnaar, wissel of niet.
4. Achtergrond per staat: opkomst in 2026 en bij de midterms van 2022, aantal inwoners, en de uitslag van de presidentsverkiezing van 2024.

Regels voor elke helper: gebruik officiële bronnen (verkiezingsdiensten van de staten) en grote persbureaus die uitslagen tellen. Zet bij elk cijfer het adres van de bron en de datum waarop je het las. Is een race nog niet beslist of vind je een cijfer niet, schrijf dan "nog niet bekend" en verzin niets. Spreken twee bronnen elkaar tegen, noteer beide.

Jij voegt samen in de map oefeningen/midterms/data: één CSV-bestand per deel, één bestand staten.csv met per staat de tweeletterige code, de naam en alle kerncijfers, een bronnenlijst, en OVERZICHT.md met een neutrale samenvatting van hoogstens één pagina, wat ontbreekt, en vijf cijfers die ik zelf best nakijk. Controleer voor je klaar meldt dat de totalen kloppen (aantal zetels in Senaat en Huis) en dat elke staat in elk bestand dezelfde code heeft.

Vraag geen extra rechten.
```

### B10 · Van data naar dashboard

Doe eerst B9.

```text
Bouw met de gegevens in oefeningen/midterms/data een interactief dashboard over de midterms van 2026, in de map oefeningen/midterms/dashboard. Gebruik alleen cijfers uit die bestanden en verzin niets bij; toon "nog niet bekend" waar een cijfer ontbreekt.

Het moet er indrukwekkend uitzien en uitnodigen om te klikken:
- Een kaart van de Verenigde Staten met alle staten, waarop ik kies wat ik zie: Senaat, Huis, gouverneurs of opkomst. Zweven toont de kerncijfers, klikken opent een paneel met alle details en de bronlinks van die staat.
- Bovenaan de zetelverdeling in Senaat en Huis, voor en na, als halve cirkels met zetels.
- Filters: alleen staten waar een zetel van partij wisselde, alleen nipte uitslagen (verschil kleiner dan vijf procentpunten), en zoeken op staat.
- Grafieken die meebewegen met de filters: opkomst 2026 tegenover 2022 per staat, en de marge per race gesorteerd van nipt naar ruim.
- Vloeiende overgangen, een licht en een donker thema, en een neutrale toon: partijkleuren alleen als aanduiding, geen waardeoordelen.
- Een knop Rapport die een afdrukbare pagina opent met de belangrijkste grafieken, de zetelverdeling, een korte neutrale tekst en de bronnenlijst.

Zet de gegevens en de kaartvormen in de map van de app zelf, zodat alles werkt met een dubbelklik en zonder internet. Controleer voor je klaar meldt dat elke staat op de kaart gegevens heeft en dat geen enkele grafiek leeg is.

De app moet werken door index.html te dubbelklikken, zonder internet en zonder installatie. Open ze in je browser, klik ze door zoals een gebruiker, maak een schermafbeelding en verbeter wat niet klopt, hoogstens drie rondes. Heb je daarvoor een tijdelijke lokale server nodig, kijk dan eerst welke poort vrij is, gebruik die en stop de server als je klaar bent. Vraag geen extra rechten. Zeg op het einde welk bestand ik moet dubbelklikken.
```

### B11 · Folio wordt jouw lezer

```text
Folio is een open-source pdf-lezer met een MIT-licentie. Download met Node (fetch) het zip-bestand https://raw.githubusercontent.com/IterationsTransformations/ai-cursus-kit/main/downloads/folio.zip en pak het uit in de map oefeningen/mijn-lezer. Lees eerst README.md en de licentie, en vat in vijf zinnen samen hoe het programma in elkaar zit.

Maak er daarna mijn eigen lezer van:
- Naam: Leeshoek
- Kleuren: donkergroen en goud
- Alle menu's, knoppen en meldingen in het Nederlands.
- Een eigen welkomstscherm met een korte uitleg in het Nederlands.

Laat de licentie en de naam van de makers staan en zet op het welkomstscherm "Gebaseerd op Folio van Forward Future (MIT-licentie)". Schrijf in AANPASSINGEN.md wat je veranderd hebt, per bestand.

Bouw het programma en maak een startbestand voor Windows (start-lezer.cmd) en voor Mac (start-lezer.command) dat de lezer opent in de browser. Lukt een installatiestap niet, probeer het dan met npm install --ignore-scripts. Vraag geen extra rechten.

Open de lezer in je browser, klik de menu's door, maak een schermafbeelding en verbeter wat niet klopt, hoogstens drie rondes. Start je een lokale server, kijk dan eerst welke poort vrij is, gebruik die en stop de server als je klaar bent. Stop elk programma dat je zelf startte. Zeg op het einde hoe ik de lezer start en stop.
```

## Deel C · Beelden met FLUX

### C1 · De cursuskit ophalen en je eerste beeld

```text
Download het zip-bestand https://raw.githubusercontent.com/IterationsTransformations/ai-cursus-kit/main/downloads/cursuskit.zip, pak het uit in de map cursuskit in deze werkmap en lees cursuskit/LEESMIJ.md en cursuskit/REGELS.md.

Gebruik het commando node. Bestaat dat niet op deze computer, gebruik dan de Node die in DeepSeek Harness zit: zet de omgevingsvariabele ELECTRON_RUN_AS_NODE op 1 en start het programma van DeepSeek Harness met het script als argument. Op Windows is dat "%LOCALAPPDATA%\Programs\DeepSeek Harness\DeepSeek Harness.exe", op een Mac "/Applications/DeepSeek Harness.app/Contents/MacOS/DeepSeek Harness".

Test daarna de beeldtool met één proefbeeld: een rode appel in cartoonstijl op een transparante achtergrond, bewaard als cursuskit/proef/appel.png.

Zeg me of het gelukt is en wat het beeld kostte. Vraag geen extra rechten. Lukt iets niet, leg dan in gewone woorden uit wat ik moet nakijken.
```

### C2 · Fruit Ninja krijgt echte beelden

Doe eerst B1 en C1.

```text
Geef mijn spel in oefeningen/fruitninja echte beelden. Bewaar eerst een kopie van de map als oefeningen/fruitninja-zonder-beelden.

Maak het fruit (elk stuk heel en als twee helften), de bom en de achtergrond met FLUX zoals beschreven in cursuskit/REGELS.md. Verander de spelregels en de bediening niet.

Volg de regels in cursuskit/REGELS.md. Zeg op het einde hoeveel beelden je maakte, wat ze kostten en welk bestand ik moet dubbelklikken.
```

### C3 · Tom's Cocktails wordt jouw app

```text
Download met Node (fetch) het zip-bestand https://raw.githubusercontent.com/IterationsTransformations/ai-cursus-kit/main/downloads/toms-cocktails.zip en pak het uit in de map oefeningen/mijn-recepten. Lees eerst hoe de app in elkaar zit en vat dat voor mij samen in vijf zinnen.

Maak er daarna mijn eigen app van:
- Nieuwe naam: Mocktailbar
- Thema: mocktails, smoothies of koffies
- Kleuren: donkergroen en goud
- Vervang de recepten door tien recepten die bij mijn thema passen, met ingrediënten, hoeveelheden en stappen.

Beelden: maak voor elk recept een foto en een nieuwe achtergrond voor het startscherm met FLUX zoals beschreven in cursuskit/REGELS.md.

Verander niets wat ik niet vroeg. Volg de regels in cursuskit/REGELS.md. Zeg op het einde welk bestand ik moet dubbelklikken en som op welke bestanden je veranderd hebt.
```

### C4 · Vliegspel met je eigen held

```text
Bouw een vliegspel zoals Flappy Bird. De speler is een vliegende friet met een cape. De held valt door de zwaartekracht. Met de spatiebalk of een klik vliegt hij een stukje omhoog. Hij moet door de openingen vliegen tussen paren hindernissen die van rechts naar links schuiven. De wereld is de Grote Markt van Hasselt bij zonsondergang en de hindernissen passen daarbij. Een hindernis, de grond of de bovenrand raken beëindigt het spel. Eén punt per gepasseerde hindernis. Toon de score, een startscherm en een game-overscherm met de hoogste score. Stem zwaartekracht en vleugelslag zo af dat het spel speelbaar is: een beginner haalt binnen vijf pogingen minstens drie punten.

Beelden: maak de held (twee houdingen: vleugels op en neer), de hindernissen, de grond en een achtergrond in drie lagen die op verschillende snelheid schuiven met FLUX zoals beschreven in cursuskit/REGELS.md. Teken niets met code wat een beeld kan zijn.

Werk in de map oefeningen/vliegspel. Volg de regels in cursuskit/REGELS.md. Zeg op het einde welk bestand ik moet dubbelklikken.
```

### C5 · Knikkerdoolhof

```text
Bouw een knikkerdoolhof, van bovenaf gezien. Met de pijltjestoetsen of WASD kantel ik een houten bord met opstaande wanden en gaten, tot hoogstens vijftien graden. Je ziet het bord echt kantelen. Een stalen knikker versnelt de helling af met rolwrijving, en draait mee met de afstand die hij rolt. De botsing tussen knikker en wand mag nooit door een wand heen schieten, ook niet bij hoge snelheid: de knikker stuit licht terug en glijdt langs schuine wanden. In een gat vallen kost een leven, je hebt er drie. De groene finish halen opent het volgende doolhof. Er zijn drie doolhoven die telkens voller worden. Toon het nummer van het doolhof, de levens en de verstreken tijd.

Beelden: maak het houten bord, de wanden, de gaten, de stalen knikker en de tafel onder het bord met FLUX zoals beschreven in cursuskit/REGELS.md. Teken niets met code wat een beeld kan zijn.

Werk in de map oefeningen/knikkerdoolhof. Volg de regels in cursuskit/REGELS.md. Zeg op het einde welk bestand ik moet dubbelklikken.
```

### C6 · Doolhofshooter

```text
Bouw een schietspel in eerste persoon in de stijl van de eerste Doom, in één afgesloten level. Thema: een verlaten chocoladefabriek met op hol geslagen robots. WASD beweegt en de pijltjestoetsen draaien; gebruik geen pointer lock. Ik schiet met de spatiebalk op vijanden die mij door het doolhof achtervolgen. Ik raap gezondheid en munitie op en zoek de uitgang om te winnen. Toon gezondheid, munitie en aantal uitgeschakelde vijanden, en een game-overscherm als de gezondheid op nul staat. Lopen tegen een muur glijdt erlangs. Hou het geschikt voor een klas: geen bloed, vijanden vallen uit elkaar of verdwijnen in rook.

Beelden: maak met FLUX zoals beschreven in cursuskit/REGELS.md: vier muurtexturen, vloer en plafond, twee soorten vijanden (elk staand en geraakt), het wapen in de hand (rust en schot), de pakjes gezondheid en munitie, de uitgang en het startscherm. Teken niets met code wat een beeld kan zijn.

Werk in de map oefeningen/doolhofshooter. Volg de regels in cursuskit/REGELS.md. Zeg op het einde welk bestand ik moet dubbelklikken.
```

## Deel D · Meer om te bouwen

**D1 · alleen de beste modellen in je lijst**: geen prompt, maar een instellingenbestand (`modellen/` in deze repository).

### D2 · Ademhalingsapp

```text
Bouw een ademhalingsapp. Ik kies een oefening (kalmeren 4-7-8, focus 4-4-4-4, energie) en een duur. Een grote vorm zet rustig uit bij inademen en krimpt bij uitademen, met de woorden In, Vast en Uit en een zachte toon bij elke wissel. Na afloop zie ik hoeveel minuten ik vandaag en deze week oefende. Kies per oefening een rustige achtergrond: een bos in de ochtend, een meer bij zonsondergang en een sterrenhemel.

Beelden: maak alle beelden met FLUX zoals beschreven in cursuskit/REGELS.md. Teken niets met code wat een beeld kan zijn.

Werk in de map oefeningen/ademhaling. Volg de regels in cursuskit/REGELS.md. Zeg op het einde welk bestand ik moet dubbelklikken.
```

### D3 · Mijnenveger

```text
Bouw een mooie en volledig werkende Mijnenveger met drie niveaus (9 op 9 met 10 mijnen, 16 op 16 met 40, 30 op 16 met 99). Links klikken opent een vak, rechts klikken zet een vlag, de eerste klik is nooit een mijn, en een leeg vak opent zijn buren. Toon een klok, het aantal resterende mijnen en de beste tijd per niveau. Thema: een moestuin met mollen in plaats van mijnen. De vakken, de vlag, de mijn en het bord zijn beelden.

Beelden: maak alle beelden met FLUX zoals beschreven in cursuskit/REGELS.md. Teken niets met code wat een beeld kan zijn.

Werk in de map oefeningen/mijnenveger. Volg de regels in cursuskit/REGELS.md. Zeg op het einde welk bestand ik moet dubbelklikken.
```

### D4 · Prijscalculator

```text
Bouw een calculator waarmee ik aan een klant toon wat mijn aanbod oplevert: zonnepanelen voor een gezin. De klant verschuift drie tot vijf schuifbalken (bijvoorbeeld verbruik, prijs, aantal jaren) en ziet meteen de kost, de besparing per jaar, de terugverdientijd en een grafiek over de jaren. Voeg drie scenario's toe (voorzichtig, verwacht, gunstig) en een knop om het resultaat af te drukken op één pagina met mijn logo. Leg onderaan in gewone woorden uit hoe er gerekend wordt.

Beelden: maak alle beelden met FLUX zoals beschreven in cursuskit/REGELS.md. Teken niets met code wat een beeld kan zijn.

Werk in de map oefeningen/calculator. Volg de regels in cursuskit/REGELS.md. Zeg op het einde welk bestand ik moet dubbelklikken.
```

### D5 · Drumcomputer

```text
Bouw een drumcomputer met acht klanken (kick, snare, hihat dicht, hihat open, clap, tom, rimshot, cowbell) en zestien stappen per klank. Ik klik stappen aan en uit terwijl het patroon loopt. Tempo van 60 tot 180, swing, volume per klank, en vier patronen die ik aan elkaar kan rijgen. Maak de klanken zelf met de geluidsfuncties van de browser, zonder geluidsbestanden. Zet vijf voorbeeldpatronen klaar (rock, house, hiphop, reggae, samba). De machine ziet eruit als een echt toestel: het paneel, de pads en de knoppen zijn beelden.

Beelden: maak alle beelden met FLUX zoals beschreven in cursuskit/REGELS.md. Teken niets met code wat een beeld kan zijn.

Werk in de map oefeningen/drumcomputer. Volg de regels in cursuskit/REGELS.md. Zeg op het einde welk bestand ik moet dubbelklikken.
```

### D6 · Synthesizer

```text
Bouw een synthesizer die ik bespeel met het toetsenbord van de computer en met de muis op een klavier van twee octaven. Twee oscillatoren (sinus, zaagtand, blok, driehoek) met ontstemming, een filter met cutoff en resonantie, een ADSR-omhullende, en de effecten delay en galm. Meerdere toetsen tegelijk moeten klinken. Toon de golfvorm live. Zet acht presets klaar (bas, pad, lead, orgel, klokjes en drie eigen vondsten) en laat mij eigen presets bewaren. Het paneel, de draaiknoppen en het klavier zijn beelden; de knoppen draaien echt mee.

Beelden: maak alle beelden met FLUX zoals beschreven in cursuskit/REGELS.md. Teken niets met code wat een beeld kan zijn.

Werk in de map oefeningen/synthesizer. Volg de regels in cursuskit/REGELS.md. Zeg op het einde welk bestand ik moet dubbelklikken.
```

### D7 · Beeldsnijder voor sociale media

```text
Bouw een beeldsnijder. Ik sleep één foto in de app en krijg ze in het juiste formaat voor: LinkedIn-bericht, LinkedIn-banner, Instagram vierkant, Instagram story, Facebook-omslag en YouTube-thumbnail. Per formaat verschuif en zoom ik de uitsnede. Ik kan mijn logo in een hoek zetten en een korte tekst toevoegen met een leesbare band erachter. Ik download elk formaat apart of alles samen. De foto verlaat mijn computer niet. Maak drie logo's om uit te kiezen en twee voorbeeldfoto's om mee te oefenen.

Beelden: maak alle beelden met FLUX zoals beschreven in cursuskit/REGELS.md. Teken niets met code wat een beeld kan zijn.

Werk in de map oefeningen/beeldsnijder. Volg de regels in cursuskit/REGELS.md. Zeg op het einde welk bestand ik moet dubbelklikken.
```

### D8 · Weekplanner

```text
Bouw een weekplanner voor afspraken voor een kapsalon met twee stoelen. Een weekrooster met tijdvakken van een kwartier; ik sleep om een afspraak te maken, te verplaatsen of langer te maken. Een afspraak heeft een klant, een dienst met vaste duur en kleur, en een notitie. Dubbele boekingen krijgen een waarschuwing. Ik zie een dagoverzicht om af te drukken en ik exporteer afspraken naar een agendabestand (ICS) dat Outlook en Google Agenda openen. Alles wordt bewaard op deze computer, met een back-up als bestand.

Beelden: maak alle beelden met FLUX zoals beschreven in cursuskit/REGELS.md. Teken niets met code wat een beeld kan zijn.

Werk in de map oefeningen/weekplanner. Volg de regels in cursuskit/REGELS.md. Zeg op het einde welk bestand ik moet dubbelklikken.
```

### D9 · Schaken tegen de computer

```text
Bouw een schaakspel tegen de computer met alle regels: rokade, en passant, promotie, schaak, mat, pat en remise door herhaling. De computer denkt met minimax en alfa-bèta-snoei op vier niveaus. Toon de geldige zetten van een gekozen stuk, de laatste zet, de geslagen stukken en de zettenlijst in notatie. Ik kan een zet terugnemen en een tip vragen. Test de regels met een script voor je klaar meldt. De twaalf stukken en het bord zijn beelden: één set in dezelfde stijl, middeleeuwse houten figuren, duidelijk te onderscheiden op klein formaat.

Beelden: maak alle beelden met FLUX zoals beschreven in cursuskit/REGELS.md. Teken niets met code wat een beeld kan zijn.

Werk in de map oefeningen/schaken. Volg de regels in cursuskit/REGELS.md. Zeg op het einde welk bestand ik moet dubbelklikken.
```

### D10 · Rubiks kubus

```text
Bouw een Rubiks kubus in 3D die ik met de muis ronddraai. Ik draai lagen door te slepen of met de toetsen U, D, L, R, F en B (met Shift de andere kant op). Elke draai is een vloeiende animatie. Een knop Schudden doet twintig willekeurige draaien. Een knop Oplossen lost de kubus stap voor stap op en toont de zetten; ik kan pauzeren en de snelheid kiezen. Toon een klok en het aantal zetten. Controleer met een script dat de oplosser honderd geschudde kubussen oplost. De kubus zelf is 3D in kleur; de kamer eromheen en de tafel zijn een beeld. Zet een 3D-bibliotheek, als je er een gebruikt, in de map van de app zelf.

Beelden: maak alle beelden met FLUX zoals beschreven in cursuskit/REGELS.md. Teken niets met code wat een beeld kan zijn.

Werk in de map oefeningen/rubik. Volg de regels in cursuskit/REGELS.md. Zeg op het einde welk bestand ik moet dubbelklikken.
```

### D11 · Fall Guys-kloon in Unity

Je hebt een gratis Unity-account nodig. Staan Blender of ComfyUI met een FLUX-model op je computer, dan gebruikt de agent die ook. Zet de toegang voor deze sessie op Full access, alleen op een computer waar je over de gevolgen hebt nagedacht: de agent installeert Unity als het er nog niet staat.

Aanbeveling: bouw spellen met veel 3D op dit moment met Claude Fable 5.2, of ten minste met Claude Opus 5.5. Die zijn duurder dan GPT-6.1 Terra: kijk vooraf je tegoed na.

```text
Ik wil een spel bouwen in de stijl van Fall Guys met de game-engine Unity. Help me stap voor stap en doe zelf wat je kan.

Installeren. Kijk eerst of Unity Hub en een Unity-editor al op deze computer staan. Zo niet: installeer Unity Hub en daarna de nieuwste Unity 6 LTS-editor met de bouwmodule voor dit besturingssysteem (Windows of Mac). Leg bij elke stap in gewone woorden uit wat je doet. Stop en vraag het mij telkens als iets alleen ik kan doen: aanmelden met mijn Unity-account, de gratis Personal-licentie aanvaarden, een wachtwoord typen of een installatie goedkeuren. Typ zelf nooit een wachtwoord.

Het spel. Maak een Unity-project met één level: een hindernisbaan in vrolijke kleuren met draaiende balken, bewegende platformen, slingerende hamers en een finish. De speler is een rond, wiebelig figuurtje dat rent, springt en duikt, met een camera die volgt. Tien computerspelers lopen mee. Wie valt, begint opnieuw bij het laatste controlepunt. Toon de plaats van de speler tijdens de race, een startscherm met de bediening en een eindscherm. Alle tekst in het Nederlands.

Beelden en 3D-vormen. Maak alle beelden die nodig zijn om er een prachtig spel van te maken: de baan en de platformen, de obstakels, de lucht, de patronen op de figuurtjes en het startscherm, allemaal in één stijl, en gebruik ze ook echt in het spel. Staat ComfyUI met een FLUX-model op deze computer, gebruik dat dan. Anders gebruik je de beeldtool cursuskit/beelden.mjs. Staat Blender op deze computer, gebruik het dan voor 3D-vormen die moeilijk in code te maken zijn, zoals wolken, een finishboog en de figuurtjes.

Bouwen. Bouw het project vanaf de opdrachtregel, zonder het venster van Unity te openen. Lees het bouwlogboek en los fouten op tot de bouw slaagt.

Testen. Start het gebouwde spel, maak een schermafbeelding van het startscherm en van een lopende race, en verbeter wat niet klopt, hoogstens drie rondes.

Zeg op het einde waar het project staat, welk bestand ik moet starten, hoe ik speel en hoe ik het project later in Unity open.
```

## Deel E · Gevorderd: bouwen naar een voorbeeld

### E1 · Zeg het maar: live quiz en peilingen

**Prompt 1 · lokaal bouwen, met een voorbeeld dat de agent kan bekijken**

```text
Ik wil een app voor live sessies met een publiek: een presentator toont vragen op een groot scherm en de deelnemers antwoorden op hun telefoon. Er bestaat een voorbeeld dat doet wat ik wil: https://nspeakup.manus.space

Stap 1, bekijk het voorbeeld. Open het in je browser en loop het door zoals een gebruiker: de startpagina, de studio op /studio, en een lopende sessie. Start daarvoor in de studio de voorbeeldsessie, open het grote scherm, doe in een tweede tabblad mee als deelnemer op telefoonbreedte en speel enkele dia's. Maak schermafbeeldingen van de startpagina, de studio, de wachtruimte, een quizvraag, het scorebord, een peiling en het scherm van de deelnemer. Bewaar ze in oefeningen/zeghetmaar/voorbeeld. Wijzig of verwijder niets in het voorbeeld. Schrijf daarna in vijf regels op wat het voorbeeld kan en hoe het is opgebouwd.

Stap 2, bouw mijn eigen versie in de map oefeningen/zeghetmaar. De naam is "Zeg het maar". Neem de werking en de opbouw van het voorbeeld over, niet de naam, de teksten, het logo of de beelden. Alles in het Nederlands, in een eigen verzorgde stijl met een donker groot scherm en grote knoppen op de telefoon. Wat erin moet:
- Soorten dia's: quiz (timer, 1000 punten met meer punten voor wie sneller is, 100 extra per juist antwoord op rij tot hoogstens 500, daarna het juiste antwoord en een scorebord), peiling, woordenwolk, schaal van 1 tot 5, open vraag, vragen uit de zaal met stemmen, en een tekstdia.
- Pagina's: / om mee te doen met een code van zes cijfers en een bijnaam, /studio om sessies te maken en te bewaren, /scherm/CODE voor het grote scherm (spatie gaat verder), /speel/CODE voor de deelnemer.
- De wachtruimte toont de code, het adres en een QR-code naar /speel/CODE. Teken de QR-code met eigen code, zonder bibliotheek. Is het grote scherm geopend op localhost, gebruik dan in het adres en de QR-code het netwerkadres van de computer, zodat telefoons op dezelfde wifi kunnen meedoen; in elk ander geval het adres uit de adresbalk.
- Einde: een podium voor de top drie en een knop om de resultaten als csv-bestand te downloaden.
- Een voorbeeldsessie "Opwarmer voor de les" met negen dia's die alle soorten gebruikt, met neutrale vragen over algemene kennis.
- Wie de pagina herlaadt, blijft dezelfde speler. Vraag alleen een bijnaam, geen e-mailadres of andere persoonsgegevens.

Techniek:
- Eén server in het bestand server.mjs die alleen de ingebouwde modules van Node gebruikt (http, fs, path, crypto, os). Geen npm, geen bouwstap, geen bestanden van internet. De pagina's zijn gewone HTML, CSS en JavaScript in de map public. Live updates lopen via Server-Sent Events.
- De server luistert op alle netwerkadressen, op de poort uit de omgevingsvariabele PORT, anders 3210. Is die poort bezet, neem dan de eerstvolgende vrije. Bij het starten toont hij het adres voor deze computer en het adres voor andere toestellen op hetzelfde netwerk. GET /api/health antwoordt met JSON waarin ok op true staat.
- Sessies staan in data/sessies.json, lopende sessies in het geheugen.
- Staat de omgevingsvariabele STOP_NA_MINUTEN ingesteld, dan sluit de server zichzelf na zoveel minuten af. Gebruik die met de waarde 30 telkens als je de server zelf start voor een test, zodat er nooit een testserver blijft draaien.
- Maak start-windows.bat en start-mac.command. Ze starten de server met het commando node. Bestaat dat niet, dan gebruiken ze de Node die in DeepSeek Harness zit: omgevingsvariabele ELECTRON_RUN_AS_NODE op 1 en het programma van DeepSeek Harness met server.mjs als argument. Op Windows is dat "%LOCALAPPDATA%\Programs\DeepSeek Harness\DeepSeek Harness.exe", op een Mac "/Applications/DeepSeek Harness.app/Contents/MacOS/DeepSeek Harness". Daarna openen ze de studio in de browser, op de poort waarop de server echt draait. Gebruik in de startbestanden geen PowerShell-script: open de browser met het gewone commando start op Windows en open op een Mac.

Stap 3, test en vergelijk. Start je server op de achtergrond. Open het grote scherm in je browser en doe in twee extra tabbladen mee als "Test 1" en "Test 2". Speel de hele voorbeeldsessie door en kijk of het grote scherm live meegaat, of de punten kloppen en of het podium verschijnt. Maak van jouw versie dezelfde schermafbeeldingen als van het voorbeeld en leg ze ernaast: wat doet het voorbeeld beter? Verbeter dat, hoogstens drie rondes. Stop de server als je klaar bent.

Zeg op het einde per ronde wat je zag in de vergelijking en wat je veranderde, welk bestand ik moet dubbelklikken om te starten en hoe ik de server stop. Vraag geen extra rechten.
```

**Hulpprompt · mijn telefoon vindt de app niet**

```text
Mijn telefoon zit op dezelfde wifi als deze computer, maar kan de app "Zeg het maar" niet openen. Kijk na of de server draait, op welk adres en welke poort hij luistert, en of een firewall op deze computer die poort blokkeert. Verander zelf niets aan de firewall of aan andere instellingen van de computer. Leg me in gewone woorden uit wat je vond en welke stappen ik zelf moet zetten. Vraag geen extra rechten.
```

**Prompt 2 · een presentatorcode**

```text
Bescherm de studio en het grote scherm van "Zeg het maar" met een presentatorcode. De code komt uit de omgevingsvariabele STUDIO_CODE. Is die niet ingesteld, dan maakt de server bij de eerste start zelf een code van acht tekens, bewaart ze in data/studiocode.txt en toont ze in het venster waarin de server draait. Wie /studio of /scherm opent zonder de code, krijgt een vak om ze in te geven. Deelnemers hebben de code niet nodig. Test het in je browser: zonder code mag je geen sessie kunnen bekijken of wijzigen, ook niet rechtstreeks via de adressen onder /api. Kijk ook na dat het adres om mee te doen en de QR-code het adres uit de adresbalk gebruiken wanneer het grote scherm niet op localhost geopend is. Kan je de server niet starten, test dan zonder netwerk en zeg wat ik zelf moet nakijken. Vraag geen extra rechten.
```

**Prompt 3 · voor Manus (upload eerst zeghetmaar.zip)**

```text
Zet de bijgevoegde Node.js-app online en geef me een openbaar adres.

1. Pak zeghetmaar.zip uit en ga naar de map zeghetmaar.
2. Er is niets te installeren en niets te bouwen: de app gebruikt alleen de ingebouwde modules van Node (versie 18 of nieuwer).
3. Start ze als een proces dat blijft draaien: PORT=3000 node server.mjs
   Zet de omgevingsvariabele STUDIO_CODE op een code van acht tekens die je zelf kiest, en geef me die code.
4. Maak poort 3000 openbaar bereikbaar over HTTPS. De app gebruikt Server-Sent Events: de verbinding moet open blijven en antwoorden mogen niet gebufferd worden.
5. Controleer dat GET /api/health JSON teruggeeft waarin ok op true staat, en dat / laadt.
6. Houd de map data bij tussen herstarts.
7. Verander geen bronbestanden. Lukt er iets niet, toon me dan de foutmelding in plaats van code te herschrijven.

Stuur me het openbare adres en de presentatorcode als de app draait.
```

**Prompt 4 · mooier maken met FLUX**

```text
Maak "Zeg het maar" mooier met beelden van FLUX. Lees eerst cursuskit/LEESMIJ.md en cursuskit/REGELS.md en gebruik de beeldtool van de cursuskit. Maak hoogstens acht beelden in één stijl: een achtergrond voor de startpagina, een achtergrond voor de wachtruimte, een feestelijk beeld voor het podium, een omslagbeeld voor de voorbeeldsessie en vier kleine illustraties voor de soorten dia's. Geen tekst in de beelden, geen merken en geen echte personen. Zet ze in de map public/img en gebruik ze in de app, zo dat alle tekst goed leesbaar blijft. De app moet blijven werken als een beeld ontbreekt. Start daarna de server op een vrije poort, bekijk de startpagina, de wachtruimte en het podium in je browser, maak schermafbeeldingen en verbeter wat niet klopt, hoogstens twee rondes. Zeg wat de beelden samen kostten. Vraag geen extra rechten.
```

## Uitbreiding · AI op je eigen computer

ComfyUI is het gratis, open-source programma dat een beeldmodel op je eigen computer laat draaien. Zelf installeren en instellen is redelijk complex; laat DeepSeek Harness het doen. Een goed vertrekpunt is FLUX.1 schnell (licentie Apache 2.0).

**ComfyUI en het beste beeldmodel installeren**

```text
Ik wil op deze computer zelf beelden maken met ComfyUI, zonder internetdienst.
Onderzoek eerst mijn computer: welke grafische kaart of chip, hoeveel videogeheugen en werkgeheugen, en hoeveel vrije schijfruimte. Zoek daarna op welk open beeldmodel voor deze computer het beste is, bijvoorbeeld FLUX.1 schnell of een kleinere versie ervan. Zeg me eerlijk of het zin heeft, welk model en welke versie je kiest en waarom, hoe lang een beeld ongeveer zal duren, hoeveel je moet downloaden en onder welke licentie het model valt. Wacht daarna op mijn akkoord.
Na mijn akkoord: installeer ComfyUI en dat model in de map lokale-beelden in deze werkmap, zonder iets buiten de werkmap te veranderen. Stel ComfyUI zo in dat het goed werkt op deze computer. Maak een proefbeeld van een rode appel in cartoonstijl en toon het. Maak een startbestand voor Windows en voor Mac en een kort LEESMIJ waarin staat hoe ik later zelf een beeld vraag.
Vraag geen extra rechten. Lukt iets niet binnen de werkmap, leg dan in gewone woorden uit wat ik zelf moet doen.
```

**Daarna beelden vragen**

```text
Maak met ComfyUI in de map lokale-beelden vier beelden voor mijn spel in oefeningen/fruitninja: een watermeloen, een sinaasappel, een ananas en een bom, in dezelfde cartoonstijl. Kies zelf de instellingen die op deze computer het beste resultaat geven. Zet de beelden in de map img van het spel en gebruik ze in het spel. Gebruik niet de cursuskit en geen internetdienst.
```

**ComfyUI laten optimaliseren**

```text
Open ComfyUI in de map lokale-beelden en kijk hoe de werkstroom voor beelden is ingesteld. Zoek de instellingen die op deze computer het beste beeld geven in een redelijke tijd: het aantal stappen, de beeldgrootte, de sampler en de juiste versie van het model. Maak met elke instelling die je probeert hetzelfde proefbeeld, toon de beelden naast elkaar met de tijd die elk beeld duurde, en bewaar de beste instelling als vaste werkstroom. Leg in het LEESMIJ in gewone woorden uit wat elke instelling doet. Vraag geen extra rechten.
```

**Een eigen beeldstudio bovenop ComfyUI**

```text
Bouw in de map oefeningen/mijn-beeldstudio een eenvoudige webapp die beelden maakt met ComfyUI uit de map lokale-beelden. ComfyUI draait op deze computer en heeft een eigen API op http://127.0.0.1:8188. De app heeft één tekstvak voor de beschrijving, een keuze voor het formaat (vierkant, liggend of staand), een keuze uit vijf stijlen en een knop Maak beeld. Het resultaat verschijnt groot, met een knop om het te bewaren, en eronder staat een galerij van de vorige beelden. Gebruik de beste instelling uit het LEESMIJ als standaard en verberg de technische instellingen achter een knop Geavanceerd. Alle tekst in het Nederlands. Maak een startbestand dat ComfyUI start als het nog niet draait en daarna de app opent. Test de app in je browser met drie beelden en verbeter wat niet klopt, hoogstens drie rondes. Stop elk programma dat je zelf startte. Vraag geen extra rechten.
```
