import { HangmanSpiel } from "./antihangman.js";
import { Option } from "./options.js";
const SUBMIT_BUTTON = document.getElementById("submitGuess");
const START_BUTTON = document.getElementById("startButton");
const GAME_AREA = document.getElementById("gameArea");
const HANGMAN_AREA = document.getElementById("hangmanArea");
const WORT_AREA = document.getElementById("wortArea");
const GUESS_INPUT = document.getElementById("guessInput");
START_BUTTON.disabled = false;
let multiguess = false;

const QWERTZ_KEYBOARD = ["qwertzuiopü", "asdfghjklöä", "yxcvbnm", "êéèâáàß", "ûúùôóòîíìý"];
const KEYBOARD_LAYOUTS = {
    "qwertz": QWERTZ_KEYBOARD,};
const KEYBOARD = document.getElementById("keyboard");
var gewonnen = false;
const SPIEL = new HangmanSpiel();

const OPTIONS = {
    multiguessOption: new Option("checkbox","Rate mehrere Buchstaben aufeinmal","multiguess","Lässt dich bei der manuellen Eingabe mehrere Buchstaben auf einmal raten", {}, "desktop-only"),
    get multiguess() {
        return this.multiguessOption.value;
    },
    godmodeOption: new Option("checkbox", "Godmode", "godmode","Was, durch Genickbruch soll ich sterben???"),
    get godmode() {
        return this.godmodeOption.value;
    }
}

console.error(OPTIONS);

function updateHangman() {
    HANGMAN_AREA.innerHTML = SPIEL.male_hangman(SPIEL.falsch_geraten.length);
}

function updateOverlay() {
    WORT_AREA.innerHTML = SPIEL.male_wort(" ");
    updateHangman();
}

function keyboardGuess(letter) {
    let correct = guess(letter);
    updateOverlay();
    changeKey(letter, correct)
}

function changeKey(letter, correct) {
    const BUTTON = document.getElementById(`keyletter-${letter.toLowerCase()}`);
    if (correct) {
        BUTTON.classList.add("correct-guess");
    } else {
        BUTTON.classList.add("wrong-guess");
    }
    BUTTON.disabled = "true";
}

function createKeyboard(layout) {
    const ROWS = [];
    let MAX_LENGTH = 0;
    layout = KEYBOARD_LAYOUTS[layout];

    layout.forEach(row => {
        if (MAX_LENGTH < row.length) {
            MAX_LENGTH = row.length;
        };
        const ROW_DIV = document.createElement("div");
        ROW_DIV.classList.add("keyboard-row");
        [...row].forEach(letter => {
            const BUTTON = document.createElement("button");
            BUTTON.ariaLabel = `${letter.toLowerCase()} raten`;
            BUTTON.type = "button";
            BUTTON.id = `keyletter-${letter.toLowerCase()}`;
            BUTTON.textContent = letter.toUpperCase();
            BUTTON.classList.add("key");
            BUTTON.addEventListener("click", () => {
                keyboardGuess(letter);
            });

            ROW_DIV.appendChild(BUTTON);
        });
        ROWS.push(ROW_DIV);
    })
    ROWS.forEach(row => {
        let LEN_DIFF = row.childElementCount - MAX_LENGTH;
        if (LEN_DIFF < 0) {
            for (let i=LEN_DIFF; i < 0; i++) {
                let SPACE_DIV = document.createElement("div");
                SPACE_DIV.classList.add("halfkey");
                row.insertBefore(SPACE_DIV, row.firstChild);
            }
            for (let i = LEN_DIFF; i < 0; i++) {
                let SPACE_DIV = document.createElement("div");
                SPACE_DIV.classList.add("halfkey");
                row.appendChild(SPACE_DIV);
            }
        };
        KEYBOARD.appendChild(row);
    })
}

function spiel() {
    while (!gewonnen) {
        HANGMAN_AREA.innerHTML = SPIEL.erstelle_overlay()
    }
}

createKeyboard("qwertz")

START_BUTTON.addEventListener("click", () => {
    START_BUTTON.disabled = true;
    SUBMIT_BUTTON.disabled = false;
    GAME_AREA.classList.remove("hidden");
    START_BUTTON.classList.add("hidden");
    GUESS_INPUT.disabled = false;
    GUESS_INPUT.focus();
});

function guess(letter) {
    return SPIEL.raten(letter);
}

SUBMIT_BUTTON.addEventListener("click", () => {
    const GUESSD = GUESS_INPUT.value.trim();
    if (multiguess) {
        GUESSD.forEach((letter) => {
            let correct = guess(letter);
            changeKey(letter, correct);
        });
        return;
    }

    if (GUESSD.length !== 1) {
        return
    }
    let correct = guess(GUESSD);
    changeKey(GUESSD, correct);
})
