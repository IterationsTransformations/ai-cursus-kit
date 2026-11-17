# Tom's Cocktails

Een moderne cocktailapp voor de fictieve cocktailbar **Tom's Cocktails** in Hasselt. Het is de opvolger van een oud Windows-receptenprogramma uit 1999: dezelfde functies, maar dan met geanimeerde glazen, een shakermodus, een feestmodus voor op tv en een optionele AI-barman.

De app is gemaakt als voorbeeldproject voor de cursus generatieve AI bij Syntra PXL in Hasselt. Alle recepten zijn klassiekers uit publieke kennis, zelf herschreven. Er staan geen merknamen of logo's in: ingrediënten heten gewoon koffielikeur, vodka, room, enzovoort.

## Openen

1. Open de map `cocktails`.
2. Dubbelklik op `index.html`.

Meer is er niet nodig. De app draait volledig in je browser, zonder server en zonder internet. Lettertypes, scripts en geluiden zitten allemaal in de map. Werkt in recente versies van Chrome, Edge, Firefox en Safari.

Enkel de AI-barman heeft internet nodig, en die staat standaard uit.

## Wat zit erin

### De kaart
- **71 recepten**, aan te vullen met je eigen recepten: een sterke koffielikeursectie (White Russian, Black Russian, Espresso Martini, B-52, Mudslide, Colorado Bulldog, koffielikeur-cola, Irish Coffee, Toasted Almond en meer), klassiekers, alcoholvrije cocktails en Belgische twists met jenever en Belgisch bier (Hasseltse Nachtuil, Jonge Hasselaar, Kriekspritz, Tripelgoud, Witbiermimosa, Speculaas Russian, Panaché).
- Elk recept heeft ingrediënten in cl, glas, methode, ijs, garnituur, smaak, gelegenheid, moeilijkheid, soort (cocktail, longdrink, met bubbels, biercocktail, shot, warm) en een kort verhaal.
- **Geanimeerde SVG-glazen**: twaalf glasvormen, lagen in de juiste kleur die vollopen, een straal bij het inschenken, ijsblokjes die erin vallen, crushed ice, bubbels in bruisende drankjes, schuimkragen, echte lagen bij gelaagde drankjes (B-52) en getekende garnituur (citruswieltjes, munt, koffiebonen, olijf, kers, zoutrandje, slagroom, parapluutje en meer).
- **Zoeken en filteren** op naam, ingrediënt of smaak, op basisdrank, smaak, gelegenheid, sterkte en soort, plus alleen alcoholvrij, maximaal 5 procent en alleen met wat in je bar staat. Sorteren op naam, sterkte, moeilijkheid of prijs.
- **Bewaarde filters**: zeven ingebouwde (zoals drankjes met bubbels, maximaal 5 procent alcohol, eigen recepten met mijn bar) en je eigen filters, die je een naam geeft.
- **Favorieten** met het hartje.

### Per recept
- **Portiecalculator**: kies het aantal glazen, alle hoeveelheden rekenen mee.
- **Alcohol per glas**: aantal standaardglazen (10 gram), geschat alcoholpercentage in het glas na verdunning en volume, met een melding over verantwoord drinken.
- **Kostprijs per glas**, op basis van de prijzen in de ingrediëntendatabase.
- Stap-voor-stap bereiding, automatisch opgebouwd uit de methode.
- Vinkjes bij wat al in je bar staat, en wat je nog mist.

### Shakermodus
Een grote stap-voor-stapweergave om de cocktail meteen te maken: grote tekst, het glas dat stap per stap volloopt, een geanimeerde shaker, mengglas of blender, timers voor shaken, roeren, blenden en kneuzen, en geluiden die live met WebAudio gemaakt worden (inschenken, ijsblokjes, shaken, roeren, een belletje als de timer klaar is). Bedienen kan ook met de pijltjestoetsen, de spatiebalk en Escape.

### Feestmodus
Een diavoorstelling op volledig scherm, ideaal voor op een tv. Kies de hele kaart, koffielikeur, Belgische twists, alcoholvrij of je favorieten. Pijltjes, spatie en Escape werken ook hier.

### Wat kan ik maken?
Vink aan welke flessen en ingrediënten je in huis hebt. Je ziet meteen wat je nu kan maken en welke ene extra fles het meeste nieuwe recepten oplevert. Je houdt tot **drie bars** bij: Thuis, Zomerbar en Feest (namen kan je aanpassen). IJs, suiker en water tellen altijd als aanwezig.

### Boodschappenlijst
Zet recepten met het gewenste aantal glazen op je lijst. De app telt alle ingrediënten op, zegt hoeveel flessen, limoenen of pakken je moet kopen, streept door wat al in je bar staat en schat de aankoopprijs en het verbruik. Kopiëren naar het klembord of afdrukken kan ook.

### Leren
- **Barlexicon**: 40 technieken, gereedschappen en begrippen, elk met een eigen icoon en een tip.
- **Garnituurgids**: 24 garnituren met een tekening en stap-voor-stapuitleg (van limoenwieltje tot stervrucht, kumquat en gevlamde zeste).
- **Ingrediënten**: alle ingrediënten met alcoholgehalte, verpakking, richtprijs (aanpasbaar), een opmerking, in welke bars ze staan en in hoeveel recepten ze voorkomen. Je kan ook eigen ingrediënten toevoegen.

### Eigen recepten
Een recepteditor met tot 20 ingrediënten per recept, glas, methode, ijs, garnituur (ook getekend), smaak, gelegenheid, moeilijkheid, verhaal en extra bereidingstekst. Je ziet je glas live in een voorbeeld, met sterkte en kostprijs. Exporteren en importeren als JSON-bestand.

### AI-barman (optioneel)
Staat standaard uit. Wie een OpenRouter-sleutel heeft, kan hem inschakelen en een stemming of een paar ingrediënten beschrijven. De app vraagt dan aan het model `deepseek/deepseek-v4.1-flash` (via `https://openrouter.ai/api/v1/chat/completions`) een suggestie, bij voorkeur van de eigen kaart. De sleutel blijft enkel in deze browser (localStorage), wordt nergens gelogd en zit niet in de back-up.

### Sfeer en instellingen
- Drie thema's: **Bar** (donkere toog met koperen licht), **Strand** (zonsondergang aan zee) en **Jaren twintig** (groen fluweel en goud).
- Geluidseffecten aan of uit, rustige achtergrondmuziek (live gegenereerd, standaard uit) en een optie voor minder animaties. De app volgt ook de systeeminstelling voor minder beweging.
- Back-up downloaden en terugzetten, of alles wissen.

### Toegankelijkheid en ontwerp
- Werkt van gsm tot breedbeeld: zijmenu op de computer, menu en snelbalk onderaan op de gsm.
- Volledig met het toetsenbord te bedienen, met zichtbare focus. Druk op `/` om te zoeken.
- Voldoende contrast, beschrijvende labels voor schermlezers.
- Alle gegevens worden opgeslagen in localStorage, steeds met try/catch. Ook als opslag geblokkeerd is (bijvoorbeeld in een privévenster) blijft de app werken.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `index.html` | De app |
| `css/style.css` | Volledige opmaak, thema's en animaties |
| `js/data.js` | Ingrediënten, prijzen, recepten en berekeningen (alcohol, kleur, soort) |
| `js/glass.js` | Tekent de geanimeerde glazen, de garnituur en het bargereedschap in SVG |
| `js/lexicon.js` | Barlexicon met iconen en garnituurgids |
| `js/audio.js` | Geluidseffecten en achtergrondmuziek met WebAudio |
| `js/app.js` | Weergaven, filters, bars, shakermodus, feestmodus, editor en AI-barman |
| `fonts/` | Fraunces, Figtree en Yellowtail met hun open licenties |
| `tests/test.js` | Automatische test met Playwright |
| `screenshots/` | Schermafbeeldingen |

## Testen

Met Node.js en Playwright:

```
node tests/test.js
```

De test opent `index.html` via `file://`, klikt door alle weergaven (zoeken, filters, bewaarde filters, favorieten, detail, portiecalculator, shakermodus met timer, wat kan ik maken, drie bars, boodschappenlijst, lexicon, garnituurgids, prijzen aanpassen, eigen recept maken, exporteren en importeren, AI-barman met een nagebootste OpenRouter-respons, thema's, feestmodus), opent elk recept en controleert dat er geen consolefouten zijn, geen externe verzoeken, geen horizontale scroll op de gsm, geen uitroeptekens en geen merknamen. Daarna maakt hij de schermafbeeldingen hieronder.

## Schermafbeeldingen

Computer (1440 x 900):
- `screenshots/desktop-01-kaart.png`: startscherm met de cocktail van de dag en de achterbar
- `screenshots/desktop-02-filters.png`: filters, hier op koffielikeur
- `screenshots/desktop-03-detail-espresso-martini.png`: receptpagina met sterkte, kostprijs en ingrediënten
- `screenshots/desktop-04-detail-b52-gelaagd.png`: gelaagd shotje
- `screenshots/desktop-05-shaker-start.png`: shakermodus, eerste stap
- `screenshots/desktop-06-shaker-timer.png`: shakermodus met lopende shaketimer
- `screenshots/desktop-07-shaker-proost.png`: shakermodus, klaar
- `screenshots/desktop-08-wat-kan-ik-maken.png`: je eigen bar en wat je kan maken
- `screenshots/desktop-09-favorieten.png`: favorieten
- `screenshots/desktop-10-boodschappen.png`: boodschappenlijst met aankoopadvies en prijs
- `screenshots/desktop-11-barlexicon.png`: barlexicon
- `screenshots/desktop-12-garnituurgids.png`: garnituurgids
- `screenshots/desktop-13-ingredienten.png`: ingrediëntendatabase met prijzen en bars
- `screenshots/desktop-14-recepteditor.png`: recepteditor met live voorbeeld
- `screenshots/desktop-15-eigen-recept.png`: een eigen recept op de kaart
- `screenshots/desktop-16-ai-barman.png`: AI-barman ingeschakeld
- `screenshots/desktop-16b-ai-suggestie.png`: AI-suggestie (met nagebootste respons)
- `screenshots/desktop-17-instellingen.png`: instellingen
- `screenshots/desktop-18-thema-strand.png`: thema Strand
- `screenshots/desktop-19-thema-jaren-twintig.png`: thema Jaren twintig
- `screenshots/desktop-20-feestmodus.png`: feestmodus

Gsm (390 x 844):
- `screenshots/telefoon-01-kaart.png`: startscherm
- `screenshots/telefoon-02-achterbar.png`: de kaart met filters
- `screenshots/telefoon-03-detail.png`: receptpagina
- `screenshots/telefoon-03b-detail-recept.png`: receptpagina, ingrediënten
- `screenshots/telefoon-04-menu.png`: menu
- `screenshots/telefoon-05-wat-kan-ik-maken.png`: wat kan ik maken
- `screenshots/telefoon-06-shakermodus.png`: shakermodus met timer
- `screenshots/telefoon-07-barlexicon.png`: barlexicon
- `screenshots/telefoon-08-garnituurgids.png`: garnituurgids
- `screenshots/telefoon-09-feestmodus.png`: feestmodus

Tv (1920 x 1080):
- `screenshots/tv-01-feestmodus-1080p.png`: feestmodus op een groot scherm

## Goed om te weten

- Favorieten, bars, lijsten en eigen recepten staan in de browser waarin je de app opent. Een andere browser of computer begint leeg; neem je gegevens mee met een back-up via Instellingen.
- Prijzen zijn richtprijzen van een Belgische supermarkt. Pas ze aan bij Ingrediënten.
- Alcoholwaarden zijn schattingen op basis van gemiddelde alcoholpercentages en een vaste verdunning per methode.
- De feestmodus vraagt volledig scherm aan; sommige browsers staan dat niet toe vanaf een lokaal bestand. Dan opent hij gewoon over het hele venster.
- Drink met mate en kies voor een BOB.
