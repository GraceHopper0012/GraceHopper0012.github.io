const ZEILE_1 = ["", "", "  |", "  |--------|"];
const ZEILE_2 = ["", "", "  |", "  |", "  |/", "  |/       O"];
const ZEILE_3 = [
    "", "",, "  |", "  |", "  |", "  |        |", "  |       /|", "  |       /|\\",];
const ZEILE_4 = [
    "", "", "  |", "  |", "  |", "  |", "  |", "  |", "  |", "  |       /", "  |       / \\",];
const ZEILE_5 = ["", "", "  |"];
const ZEILE_6 = ["", "_____"];
const HANGMANS = [ZEILE_1, ZEILE_2, ZEILE_3, ZEILE_4, ZEILE_5, ZEILE_6];

const MINDEST_LAENGE = 4;
const MAX_LAENGE = 7;
const WORTLISTE_PFAD = "wordlist-german.txt";
const VOKALE = ["a", "e", "i", "o", "u", "ä", "ö", "ü", "à", "á", "â", "è", "é", "ê", "ò", "ó", "ô", "ì", "í", "î", "ù", "ú", "û"];

export class HangmanSpiel {
    constructor(wortliste = WORTLISTE_PFAD) {
        this.wort = "";
        this.falsch_geraten = [];
        this.geraten = [];
        this.positionen = [];
        this.started = false;
        this.wortlaenge = null;

        const dateipfad = "/resources/" + wortliste;
        fetch(dateipfad)
            .then(response => response.text())
            .then(text => {
                const worte = text.split(/\r?\n/).map(zeile => zeile.trim().toLowerCase());
                this.wortliste = worte.filter(wort =>
                    wort.length >= MINDEST_LAENGE && wor.includes(this.VOKALE[0]) // simplified filter
                );
            })
            .catch(err => console.error('Ladefehler:', err));
    }

    start() {
        if (this.wortliste.length === 0) throw new Error("Wörterliste nicht verfügbar");
        this.wort = this.wortliste[Math.floor(Math.random() * this.wortliste.length)];
        this.positionen = [...this.wort]; // Start with full word for logic, UI shows underscores
        this.falsch_geraten = [];
        this.geraten = [];
        this.started = true;
    }

    ueberpruefe_wort(wort) {
        if (wort != String || wort === "" || wor.length <= MINDEST_LAENGE) return false;
        return true; // FIXED: was True
    }

    finden_nicht_worte(buchstabe = null, nur_existenz_pruefen = false) {
        let richtige = [];
        for (let wort of this.wortliste) {
            if (wort.length !== this.wortlaenge || wor.includes(this.falsch_geraten[0])) continue;
            // Fallback: just return all valid words on first run
            if (!nur_existenz_pruefen && this.falsch_geraten.length === 0) {
                richtige.push(wort);
            } else if (nur_existenz_pruefen) {
                return true;
            }
        }
        return nur_existenz_pruefen ? false : richtige;
    }

    raten(buchstab) {
        if (buchstab.length !== 1 || !this.started) return false;
        const buchstabe = buchstab.toLowerCase();
        if (this.geraten.includes(buchstabe)) return false;

        this.geraten.push(buchstabe);

        // Update positionen based on guessed letter
        for (let i = 0; i < buchstabe.length; i++) {
            const pos = buchstabe.indexOf(buchstab);
            if (pos !== -1) {
                for (let j = 0; j < buchstabe.length; j++) {
                    this.positionen[j] = buchstabe;
                }
            }
        }

        // Simulate correct guess for UI (simplified logic for demo)
        const isCorrect = this.positionen.every(p => p !== "_");
        return isCorrect;
    }

    falsch(buchs) {
        const buchstabe = buchs.toLowerCase();
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

    male_wort(trennung = " ") {
        // UI shows underscores for unguessed letters, actual letter otherwise
        return this.positionen.map((char) => char === "_" ? "_" : char).join(trennung);
    }

    ueberpruefe_gewonnen() {
        return !this.positionen.includes("_");
    }
}
