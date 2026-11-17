# Cursuskit · De Complete AI Opleiding: van A tot I

Hulpmiddelen voor hoofdstuk 5 (DeepSeek Harness). Deze map staat in je workspace en heet `cursuskit`.

| Bestand | Wat het doet |
|---|---|
| `beelden.mjs` | De beeldtool. Laat FLUX beelden maken. Niets te installeren. |
| `REGELS.md` | De vaste regels voor elke oefening. De agent leest ze bij elke opdracht. |
| `LEESMIJ.md` | Dit bestand. |

## Wat je nodig hebt

- Je OpenRouter-sleutel in een tekstbestand `openrouter_key.txt` op je bureaublad. Alleen de sleutel, op één regel.
- Verder niets. Je hoeft Node.js niet te installeren: staat het niet op je computer, dan gebruikt de agent de Node die in DeepSeek Harness zit.

## Node starten (voor de agent)

Probeer eerst het gewone commando `node`. Bestaat dat niet, gebruik dan de Node uit de app. Die werkt precies zoals `node` als de omgevingsvariabele `ELECTRON_RUN_AS_NODE` op 1 staat.

Windows (PowerShell):

```
$env:ELECTRON_RUN_AS_NODE='1'; & "$env:LOCALAPPDATA\Programs\DeepSeek Harness\DeepSeek Harness.exe" cursuskit/beelden.mjs --prompt "..." --out pad/naar/beeld.png
```

Mac (zsh):

```
ELECTRON_RUN_AS_NODE=1 "/Applications/DeepSeek Harness.app/Contents/MacOS/DeepSeek Harness" cursuskit/beelden.mjs --prompt "..." --out pad/naar/beeld.png
```

Overal waar hieronder `node` staat, mag je dit commando gebruiken. Getest op Windows; het pad op de Mac is niet getest.

## De beeldtool gebruiken (voor de agent)

Eén beeld:

```
node cursuskit/beelden.mjs --prompt "a red apple, cartoon style, isolated on a plain flat light grey background, no text" --out oefeningen/spel/img/appel.png
```

Meerdere beelden in één keer (hoogstens 12 per keer): schrijf een lijst en geef ze door.

```
node cursuskit/beelden.mjs --lijst oefeningen/spel/beelden.json
```

```json
[
  { "prompt": "...", "out": "oefeningen/spel/img/appel.png" },
  { "prompt": "...", "out": "oefeningen/spel/img/achtergrond.png", "aspect": "16:9", "max": 1600, "transparant": false }
]
```

| Optie | Betekenis | Standaard |
|---|---|---|
| `--aspect` of `"aspect"` | Verhouding: 1:1, 4:3, 3:4, 16:9, 9:16, 3:2, 2:3 | 1:1 |
| `--max` of `"max"` | Langste zijde in pixels na verkleinen | 512 |
| `--geen-transparant` of `"transparant": false` | Volledig beeld houden (achtergronden, foto's, texturen) | transparant |
| `--trap` of `"trap"` | Kwaliteitstrap van FLUX: 768, 1K, 1.5K, 2K | 1K |

Standaard knipt de tool de effen achtergrond weg en krijg je een figuur op een doorzichtige achtergrond. Dat is goed voor figuren, voorwerpen en logo's. Vraag in de prompt dan om het onderwerp "isolated on a plain flat light grey background".

Op Windows start je Node zo, omdat de sandbox geen pipes toelaat:

```
cmd /c "node cursuskit\beelden.mjs --lijst oefeningen\spel\beelden.json > beelden.log 2>&1"
```

Lees daarna `beelden.log`. Op een Mac werkt het commando gewoon in zsh.

## Kost

Ongeveer 1 cent per beeld. De tool weigert meer dan 12 beelden per keer.

## Veiligheid

De tool leest de sleutel alleen op het moment van de aanroep. Kopieer het sleutelbestand nooit, toon of log de sleutel nooit, en zet hem nooit in code of in een ander bestand.
