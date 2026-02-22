const canvas = document.getElementById('spinWheel');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const balanceValue = document.getElementById('balanceValue');
const toast = document.getElementById('toast');

// Arcade Elements
const gameOverlay = document.getElementById('gameOverlay');
const gameTitle = document.getElementById('gameTitle');
const gameTimer = document.getElementById('gameTimer');
const gameFailBtn = document.getElementById('gameTryAgain');
const gameStatus = document.getElementById('gameStatus');

let currentBalance = 0;
let gameInterval = null;

// --- Spin Wheel Logic ---
const sectors = [
    { label: "₹1", color: "#166534" },
    { label: "₹10", color: "#1e1e1e" },
    { label: "₹100", color: "#166534" },
    { label: "₹1000", color: "#fbbf24" },
    { label: "₹1000", color: "#166534" },
    { label: "Try Again", color: "#1e1e1e" }
];

const tot = sectors.length;
const rad = canvas.width / 2;
const PI = Math.PI;
const TAU = 2 * PI;
const arc = TAU / tot;

let ang = 0;
let angVel = 0;

function drawSector(sector, i) {
    const angle = arc * i;
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = sector.color;
    ctx.moveTo(rad, rad);
    ctx.arc(rad, rad, rad, angle, angle + arc);
    ctx.lineTo(rad, rad);
    ctx.fill();
    ctx.translate(rad, rad);
    ctx.rotate(angle + arc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    if (sector.label === "₹1000") ctx.fillStyle = "#000";
    ctx.font = "bold 18px Outfit";
    ctx.fillText(sector.label, rad - 15, 7);
    ctx.restore();
}

function render() { sectors.forEach(drawSector); }

function rotate() {
    ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;
}

function getIndex() { return Math.floor(tot - (ang / TAU) * tot) % tot; }

function engine() {
    if (angVel > 0.002) {
        angVel *= 0.985;
        ang += angVel;
        ang %= TAU;
        rotate();
        requestAnimationFrame(engine);
    } else {
        angVel = 0;
        const result = sectors[getIndex()];
        if (spinBtn) spinBtn.disabled = false;
        handleSpinResult(result.label);
    }
}

function handleSpinResult(label) {
    if (label === "Try Again") {
        showToast("Oops! Try Again.");
    } else {
        const amount = parseInt(label.replace('₹', ''));
        currentBalance += amount;
        balanceValue.innerText = "₹" + currentBalance;
        showToast("Won " + label + "!");
    }
}

if (spinBtn) {
    spinBtn.addEventListener('click', () => {
        if (angVel > 0) return;
        spinBtn.disabled = true;
        angVel = Math.random() * (0.45 - 0.35) + 0.35;
        engine();
    });
}

// --- Arcade Game Logic (The Trap) ---
function startMegaGame(type) {
    gameOverlay.style.display = 'flex';
    gameFailBtn.style.display = 'none';
    gameStatus.style.display = 'block';

    let timer = 10;
    gameTimer.innerText = "Time: " + timer + "s";

    const titles = {
        'dodge': "Dodge Master", 'jump': "Sky Jumper", 'click': "Click Speedster",
        'gold': "Gold Miner", 'match': "Perfect Match", 'link': "Pattern Link",
        'flash': "Flash Cards", 'seq': "Sequence Repeat", 'math': "Mega Math",
        'trivia': "Fast Trivia", 'brick': "Brick Buster", 'space': "Space Shooter"
    };

    const goals = {
        'dodge': "Dodge 50 enemies to win ₹500",
        'click': "Click 200 times in 5 seconds to win ₹2000",
        'math': "Solve 100 calculus problems to win ₹1000",
        'match': "Find 50 hidden pairs to win ₹2500"
    };

    gameTitle.innerText = titles[type] || "Mini Game";
    gameStatus.innerText = goals[type] || "Score 5,000,000 points to win reward!";

    // Start Fail Timer
    gameInterval = setInterval(() => {
        timer--;
        gameTimer.innerText = "Time: " + timer + "s";

        // Trigger Fail
        if (timer <= 0) {
            clearInterval(gameInterval);
            triggerFail();
        }
    }, 1000);
}

function triggerFail() {
    gameStatus.style.display = 'none';
    gameFailBtn.style.display = 'block';
    showToast("MISSION FAILED!");
}

function closeGame() {
    clearInterval(gameInterval);
    gameOverlay.style.display = 'none';
}

function showToast(msg) {
    if (!toast) return;
    toast.innerText = msg;
    toast.style.display = "block";
    setTimeout(() => { toast.style.display = "none"; }, 3000);
}

render();
rotate();
