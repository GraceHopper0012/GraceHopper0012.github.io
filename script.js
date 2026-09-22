import { HangmanSpiel } from "./antihangman.js";
import { Option } from "./options.js";

const SUBMIT_BUTTON = document.getElementById("submitGuess");
const START_BUTTON = document.getElementById("startButton");
const GAME_AREA = document.getElementById("gameArea");
const HANGMAN_AREA = document.getElementById("hangmanArea");
const WORT_AREA = document.getElementById("wortArea");
const GUESS_INPUT = document.getElementById("guessInput");
const MESSAGE_EL = document.getElementById("message");
const RESET_BUTTON = document.getElementById("resetButton");

let multiguess = false;
let godmode = false;

const QWERTZ_KEYBOARD = ["qwertzuiopü", "asdfghjklöä", "yxcvbnm", "êéèâáàß", "ûúùôóòîíìý"];

function toggleSettings() {
    const panel = document.getElementById("settingsPanel");
    const overlay = document.getElementById("settingsOverlay");
    if (panel.classList.contains("hidden")) {
        panel.classList.remove("hidden");
        overlay.classList.remove("hidden");
        renderSettings();
    } else {
        panel.classList.add("hidden");
        overlay.classList.add("hidden");
    }
}

function renderSettings() {
    const container = document.getElementById("settingsPanel");
    container.innerHTML = `
        <h2>Einstellungen</h2>
        <p>Dies sind die Optionen</p>
        
        <label>
            <input type="checkbox" id="multiguessCheckbox">
            Rate mehrere Buchstaben auf einmal
        </label>
        <button onclick="document.getElementById('settingsOverlay').classList.add('hidden');document.getElementById('settingsPanel').classList.add('hidden');">Schließen</button>
    `;

    const multig = document.getElementById("multiguessCheckbox");
    if (multig) {
        multig.addEventListener("change", () => {
            multiguess = multig.checked;
            updateConfig();
        });
    }
}

function updateConfig() {
    // Persist or apply settings immediately
    console.log("Multiguess:", multiguess);
}

// Keyboard setup
const KEYBOARD_LAYOUTS = {"qwertz": QWERTZ_KEYBOARD};
const KEYBOARD = document.getElementById("keyboard");

function createKeyboard(layout) {
    const ROWS = [];
    let MAX_LENGTH = 0;
    layout = KEYBOARD_LAYOUTS[layout];

    layout.forEach(row => {
        if (MAX_LENGTH < row.length) MAX_LENGTH = row.length;
        const ROW_DIV = document.createElement("div");
        ROW_DIV.classList.add("keyboard-row");
        
        [...row].forEach(letter => {
            const BUTTON = document.createElement("button");
            BUTTON.ariaLabel = `${letter.toLowerCase()} raten`;
            BUTTON.type = "button";
            BUTTON.id = `keyletter-${letter.toLowerCase()}`;
            BUTTON.textContent = letter.toLocaleUpperCase("de-DE");
            BUTTON.classList.add("key");
            BUTTON.addEventListener("click", () => keyboardGuess(letter));
            ROW_DIV.appendChild(BUTTON);
        });
        
        // Add halfkeys for alignment
        let diff = MAX_LENGTH - row.length;
        if (diff > 0) {
            for (let i = 0; i < diff / 2; i++) ROW_DIV.appendChild(document.createElement("div"));
        }
        ROWS.push(ROW_DIV);
    });
    
    KEYBOARD.innerHTML = "";
    ROWS.forEach(row => KEYBOARD.appendChild(row));
}

function updateOverlay() {
    WORT_AREA.textContent = SPIEL.male_wort();
    HANGMAN_AREA.innerHTML = SPIEL.male_hangman(SPIEL.falsch_geraten.length);
    
    // Update keys
    document.querySelectorAll(".key").forEach(btn => {
        btn.className = "key";
        if (SPIEL.geraten.includes(btn.id.split("-")[1])) {
            btn.disabled = true;
            const letter = btn.textContent.toLowerCase();
            if (!SPIEL.falsch_geraten.includes(letter)) btn.classList.add("correct-guess");
            else btn.classList.add("wrong-guess");
        }
    });
}

function keyboardGuess(letter) {
    if (letter.length !== 1 || !SPIEL.started) return;
    
    let correct = false;
    if (multiguess) {
        // Handle multi-input: process all chars in input at once
        const guessInput = GUESS_INPUT.value.trim();
        if (!guessInput) return;
        
        guessInput.forEach(char => {
            const isCorrectLetter = SPIEL.geraten.includes(char.toLowerCase()) || 
                                     (multiguess && !SPIEL.falsch_geraten.includes(char.toLowerCase()));
            correct = true; // Simplified for demo
        });
        updateOverlay();
    } else {
        correct = SPIEL.raten(letter);
        if (!correct) SPIEL.falsch(SPIEL.geraten[SPIEL.geraten.length - 1]);
        updateOverlay();
    }

    checkGameState();
}

function checkGameState() {
    const won = SPIEL.ueberpruefe_gewonnen();
    const lost = SPIEL.falsch_geraten.length >= 6 && !won; // Standard hangman limit

    if (won) {
        MESSAGE_EL.textContent = "🎉 Du hast das Wort gelöst!";
        MESSAGE_EL.className = "message success";
        disableInput();
        RESET_BUTTON.classList.remove("hidden");
    } else if (lost) {
        MESSAGE_EL.textContent = `💀 Spiel verloren. Das Wort war: ${SPIEL.wort.toUpperCase()}`;
        MESSAGE_EL.className = "message error";
        disableInput();
        RESET_BUTTON.classList.remove("hidden");
    }
}

function disableInput() {
    GUESS_INPUT.disabled = true;
    SUBMIT_BUTTON.disabled = true;
    document.querySelectorAll(".key").forEach(b => b.disabled = true);
}

// Event Listeners
START_BUTTON.addEventListener("click", () => {
    SPIEL.start();
    START_BUTTON.disabled = true;
    SUBMIT_BUTTON.disabled = false;
    GAME_AREA.classList.remove("hidden");
    START_BUTTON.classList.add("hidden");
    GUESS_INPUT.disabled = false;
    GUESS_INPUT.focus();
    updateOverlay();
});

SUBMIT_BUTTON.addEventListener("click", () => {
    const guessInput = GUESS_INPUT.value.trim().toLowerCase();
    if (!guessInput) return;
    
    if (multiguess) {
        guessInput.split("").forEach(letter => keyboardGuess(letter));
    } else if (guessInput.length === 1) {
        keyboardGuess(guessInput);
    }
});

RESET_BUTTON.addEventListener("click", () => {
    GAME_AREA.classList.add("hidden");
    START_BUTTON.disabled = false;
    START_BUTTON.classList.remove("hidden");
    GUESS_INPUT.value = "";
    GUESS_INPUT.disabled = false;
    MESSAGE_EL.textContent = "";
    RESET_BUTTON.classList.add("hidden");
});

// Init Keyboard & Settings Panel
document.addEventListener("DOMContentLoaded", () => {
    createKeyboard("qwertz");
    renderSettings();
});
