// --- Swiper Başlatma ---
const swiper = new Swiper('.swiper', {
    loop: true,
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
});

// --- Wordle Ayarları ---
const SECRET_WORD = "ZENCİ"; // Hedef kelime (Bilgisayar müh. öğrencisi olduğun için ufak bir selam)
let currentGuess = "";
let guesses = [];

const wordleBtn = document.getElementById('wordleBtn');
const wordleModal = document.getElementById('wordleModal');
const closeModal = document.getElementById('closeModal');
const board = document.getElementById('wordle-board');
const message = document.getElementById('message');

// Modalı Aç/Kapat
wordleBtn.onclick = () => {
    wordleModal.style.display = "block";
    initBoard();
};

closeModal.onclick = () => {
    wordleModal.style.display = "none";
};

// Oyun Tahtasını Hazırla
function initBoard() {
    board.innerHTML = "";
    guesses = [];
    currentGuess = "";
    message.innerText = "";
    for (let i = 0; i < 30; i++) {
        let tile = document.createElement("div");
        tile.classList.add("tile");
        tile.id = "tile-" + i;
        board.appendChild(tile);
        createKeyboard();
    }
}

// Klavye Girişleri
window.onkeydown = (e) => {
    if (wordleModal.style.display !== "block") return;

    if (e.key === "Enter") {
        if (currentGuess.length === 5) checkGuess();
    } else if (e.key === "Backspace") {
        currentGuess = currentGuess.slice(0, -1);
        updateBoard();
    } else if (currentGuess.length < 5 && /^[a-zA-ZçğıöşüÇĞİÖŞÜ]$/.test(e.key)) {
        currentGuess += e.key.toLocaleUpperCase('tr-TR');
        updateBoard();
    }
};

function updateBoard() {
    let rowOffset = guesses.length * 5;
    for (let i = 0; i < 5; i++) {
        let tile = document.getElementById("tile-" + (rowOffset + i));
        tile.innerText = currentGuess[i] || "";
    }
}

function checkGuess() {
    let rowOffset = guesses.length * 5;
    let guessArray = currentGuess.split("");
    
    guessArray.forEach((letter, i) => {
        let tile = document.getElementById("tile-" + (rowOffset + i));
        if (letter === SECRET_WORD[i]) {
            tile.style.backgroundColor = "#538d4e"; // Doğru harf doğru yer
        } else if (SECRET_WORD.includes(letter)) {
            tile.style.backgroundColor = "#b59f3b"; // Doğru harf yanlış yer
        } else {
            tile.style.backgroundColor = "#3a3a3c"; // Harf yok
        }
    });

    if (currentGuess === SECRET_WORD) {
        message.innerText = "Tebrikler! 🎉";
    } else {
        guesses.push(currentGuess);
        currentGuess = "";
        if (guesses.length === 6) message.innerText = "Kelime: " + SECRET_WORD;
    }
}
const keyboardContainer = document.getElementById('keyboard-container');

const KEYS = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "Ğ", "Ü"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ş", "İ"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "Ö", "Ç", "BACK"]
];

function createKeyboard() {
    keyboardContainer.innerHTML = "";
    KEYS.forEach(row => {
        const rowDiv = document.createElement("div");
        rowDiv.className = "keyboard-row";
        
        row.forEach(key => {
            const button = document.createElement("button");
            button.innerText = key;
            button.className = "key";
            if (key === "ENTER" || key === "BACK") button.classList.add("wide-key");
            
            button.onclick = () => handleInput(key);
            rowDiv.appendChild(button);
        });
        keyboardContainer.appendChild(rowDiv);
    });
}

// Klavyeden veya ekrandan gelen girişi tek merkezden yönetelim
function handleInput(key) {
    if (key === "ENTER") {
        if (currentGuess.length === 5) checkGuess();
    } else if (key === "BACK" || key === "Backspace") {
        currentGuess = currentGuess.slice(0, -1);
        updateBoard();
    } else if (currentGuess.length < 5 && key.length === 1) {
        currentGuess += key.toLocaleUpperCase('tr-TR');
        updateBoard();
    }
}

// Mevcut window.onkeydown fonksiyonunu da şununla değiştir:
window.onkeydown = (e) => {
    if (wordleModal.style.display !== "block") return;
    let key = e.key;
    if (key === "Enter") key = "ENTER";
    if (key === "Backspace") key = "BACK";
    handleInput(key);
};

// initBoard fonksiyonunun en sonuna şunu ekle:
// createKeyboard();
