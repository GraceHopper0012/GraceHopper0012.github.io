const ZEILE_1 = ["", "", "  |", "  |--------|"]
const ZEILE_2 = ["", "", "  |", "  |", "  |/", "  |/       O"]
const ZEILE_3 = [
    "",
    "",
    "  |",
    "  |",
    "  |",
    "  |",
    "  |        |",
    "  |       /|",
    "  |       /|\\",
]
const ZEILE_4 = [
    "",
    "",
    "  |",
    "  |",
    "  |",
    "  |",
    "  |",
    "  |",
    "  |",
    "  |       /",
    "  |       / \\",
]
const ZEILE_5 = ["", "", "  |"]
const ZEILE_6 = ["", "_____"]
const HANGMANS = [ZEILE_1, ZEILE_2, ZEILE_3, ZEILE_4, ZEILE_5, ZEILE_6]

const MINDEST_LAENGE = 4;
const MAX_LAENGE = 7;
const WORTLISTE_PFAD = "wordlist-german.txt";
const VOKALE = ["a", "e", "i", "o", "u", "ä", "ö", "ü", "à", "á", "â", "è", "é", "ê", "ò", "ó", "ô", "ì", "í", "î", "ù", "ú", "û"]


export class HangmanSpiel {
    constructor(wortliste = WORTLISTE_PFAD, wortlaenge = null) {
        this.wort = "";
        this.falsch_geraten = [];
        this.geraten = [];
        if (wortlaenge === null || wortlaenge > 7 || wortlaenge < 4) {
            wortlaenge = Math.floor(Math.random() * (MAX_LAENGE - MINDEST_LAENGE + 1) + MINDEST_LAENGE);
        }
        this.wortlaenge = wortlaenge;
        this.positionen = [..."_".repeat(wortlaenge)];
        let dateipfad = "/resources/" + wortliste;
        fetch(dateipfad)
            .then(response => response.text())
            .then(text => {
                const worte = text
                    .split(/\r?\n/)
                    .map(zeile => zeile.trim().toLowerCase());

                const gefiltert = worte.filter(wort =>
                    wort.length === wortlaenge &&
                    VOKALE.some(v => wort.includes(v))
                );

                this.wortliste = gefiltert;
            })
            .catch(err => console.error('Ladefehler:', err));

    }

    ueberpruefe_passt_positionen(wort) {
        this.positionen.forEach((position, idx) => {
            if (position !== "_") {
                if (wort[idx] !== position) {
                    return false;
                }
            }
        })

        for (const buchstabe of this.geraten) {
            if (!this.positionen.includes(buchstabe)) {
                continue;
            }

            if (wort.includes(buchstabe)) {
                for (let idx = 0; idx < wort.length; idx++) {
                    if (wort[idx] === buchstabe) {
                        if (this.positionen[idx] !== buchstabe) {
                            return false;
                        }
                    }
                }
            }
        }

        return true;        
    }
    
    finde_nicht_worte(buchstabe = null, nur_existenz_pruefen = false) {
        let richtige = [];
        for (let wort of this.wortliste) {
            if (wort.trim().toLowerCase().length !== this.wortlaenge) {
                continue;
            }

            let gehtnich = false;
            for (let stuchbabe of this.falsch_geraten) {
                if (wort.includes(stuchbabe)) {
                    gehtnich = true;
                }
            }
            if (gehtnich) {
                continue;
            }
            if (buchstabe !== null && wort.includes(buchstabe)) {
                continue;
            }
            if (!this.ueberpruefe_passt_positionen(wort)) {
                continue;
            }
            if (nur_existenz_pruefen) {
                return true;
            }
            richtige.push(wort)
        }
        if (nur_existenz_pruefen) {
            return false;
        } else {
            return richtige;
        }
    }

    ueberpruefe_wort(wort) {
        if (wort != String || wort === "" || wort.length <= MINDEST_LAENGE) {
            return false;
        }
        return True
    }

    raten(buchstab) {
        if (buchstab.length !== 1) {
            console.error("Wrong length");
            console.error(buchstab);
            return false;
        }
        
        let buchstabe = buchstab.toLowerCase()
        if (this.geraten.includes(buchstabe)) {
            return false;
        }

        this.geraten.push(buchstabe);

        if (this.finde_nicht_worte(buchstabe, true)) {
            console.log("Gibt Wörter ohne den Buchstaben")
            this.falsch(buchstabe);
            return false;
        } else {
            let worte = this.finde_nicht_worte(this.nur_existenz_pruefen = false);
            let positions_liste = this.finde_position(buchstabe, worte, this.check_freie_pos());
            console.error(positions_liste);
            console.error(this.wortliste.length);
            for (let position of positions_liste[0]) {
                this.positionen[position] = buchstabe;
            }
            return true;
        }
    }

    check_freie_pos() {
        return this.positionen
            .map((buchstabe, i) => buchstabe === "_" ? i : -1)
            .filter(i => i !== -1);      
    }

    falsch(buchs) {
        let buchstabe = buchs.toLowerCase();
        if (!this.falsch_geraten.includes(buchstabe)) {
            this.falsch_geraten.push(buchstabe);
            return true;
        }
        return false;
    }

    male_hangman(falsche) {
        let hangman = "";
        for (const zeile of HANGMANS) {
            if (falsche < zeile.length) {
                hangman += zeile[falsche] + "<br />";
            } else {
                hangman += zeile[zeile.length - 1] + "<br />";
            }
        }
        return hangman.trimEnd();
    }

    finde_position(buchstabe, woerter, freiePos) {
        const positionen = woerter.map(wort =>
            [...wort].map((ch, i) => (ch === buchstabe && freiePos.includes(i) ? i : -1)).filter(i => i !== -1)
        );

        // Counter: Häufigkeit pro Position
        const gesamtCounter = new Map();
        for (const posListe of positionen) {
            for (const pos of posListe) {
                gesamtCounter.set(pos, (gesamtCounter.get(pos) || 0) + 1);
            }
        }

        // Sortiert nach Häufigkeit (häufigste zuerst)
        const haeufigkeitSortiert = [...gesamtCounter.entries()]
            .sort((a, b) => b[1] - a[1])
            .map(([pos]) => pos);

        // Suche eindeutige Positionen
        const posl = [];
        for (const pos of haeufigkeitSortiert) {
            const nurDiesePos = positionen.filter(posListe =>
                posListe.length === 1 && posListe[0] === pos
            );
            if (nurDiesePos.length > 0) {
                posl.push([pos]);
            }
        }

        if (posl.length > 0) {
            return posl;
        }

        if (haeufigkeitSortiert.length > 0) {
            return [haeufigkeitSortiert];
        }

        return []; // Falls gar nichts gefunden wurde
    }

    male_wort(trennung = "") {
        return this.positionen.join(trennung);
    }

    ueberpruefe_gewonnen() {
        if (this.positionen.includes("_")) {
            return false;
        }
        return true;
    }
}