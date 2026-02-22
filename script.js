// Utility: Wait for DOM before execution
document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const elements = {
        canvas: document.getElementById('spinWheel'),
        spinBtn: document.getElementById('spinBtn'),
        balanceValue: document.getElementById('balanceValue'),
        toast: document.getElementById('toast'),
        gameOverlay: document.getElementById('gameOverlay'),
        gameTitle: document.getElementById('gameTitle'),
        gameTimer: document.getElementById('gameTimer'),
        gameFailBtn: document.getElementById('gameTryAgain'),
        gameStatus: document.getElementById('gameStatus')
    };

    // --- State Variables ---
    let state = {
        currentBalance: 0,
        ang: 0,
        angVel: 0,
        animId: null,
        gameInterval: null
    };

    // --- Spin Wheel Config ---
    const sectors = [
        { label: "₹1", color: "#166534" },
        { label: "₹10", color: "#1e1e1e" },
        { label: "₹100", color: "#166534" },
        { label: "₹1000", color: "#fbbf24" },
        { label: "₹1000", color: "#166534" },
        { label: "Try Again", color: "#1e1e1e" }
    ];

    if (elements.canvas) {
        const ctx = elements.canvas.getContext('2d');
        const tot = sectors.length;
        const rad = elements.canvas.width / 2;
        const PI = Math.PI;
        const TAU = 2 * PI;
        const arc = TAU / tot;

        const drawSector = (sector, i) => {
            const angle = arc * i;
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = sector.color;
            ctx.moveTo(rad, rad);
            ctx.arc(rad, rad, rad, angle, angle + arc);
            ctx.lineTo(rad, rad);
            ctx.fill();

            // Text Label
            ctx.translate(rad, rad);
            ctx.rotate(angle + arc / 2);
            ctx.textAlign = "right";
            ctx.fillStyle = "#fff";
            if (sector.label === "₹1000") ctx.fillStyle = "#000";
            ctx.font = "bold 18px Outfit";
            ctx.fillText(sector.label, rad - 15, 7);
            ctx.restore();
        };

        const renderWheel = () => {
            ctx.clearRect(0, 0, elements.canvas.width, elements.canvas.height);
            sectors.forEach(drawSector);
        };

        const rotateWheel = () => {
            elements.canvas.style.transform = `rotate(${state.ang - PI / 2}rad)`;
        };

        const getWheelIndex = () => {
            return Math.floor(tot - (state.ang / TAU) * tot) % tot;
        };

        const spinEngine = () => {
            if (state.angVel > 0.002) {
                state.angVel *= 0.985;
                state.ang += state.angVel;
                state.ang %= TAU;
                rotateWheel();
                requestAnimationFrame(spinEngine);
            } else {
                state.angVel = 0;
                if (elements.spinBtn) elements.spinBtn.disabled = false;
                const result = sectors[getWheelIndex()];
                handleSpinResult(result.label);
            }
        };

        const handleSpinResult = (label) => {
            if (label === "Try Again") {
                showToast("Oops! Try Again.");
            } else {
                const amount = parseInt(label.replace('₹', ''));
                state.currentBalance += amount;
                if (elements.balanceValue) elements.balanceValue.innerText = `₹${state.currentBalance}`;
                showToast(`Congrats! Won ${label}`);
            }
        };

        if (elements.spinBtn) {
            elements.spinBtn.addEventListener('click', () => {
                if (state.angVel > 0) return;
                elements.spinBtn.disabled = true;
                state.angVel = Math.random() * (0.45 - 0.35) + 0.35;
                spinEngine();
            });
        }

        renderWheel();
        rotateWheel();
    }

    // --- Arcade Game Logic ---
    window.startMegaGame = (type) => {
        if (!elements.gameOverlay) return;

        elements.gameOverlay.style.display = 'flex';
        if (elements.gameFailBtn) elements.gameFailBtn.style.display = 'none';
        if (elements.gameStatus) elements.gameStatus.style.display = 'block';

        let timer = 10;
        if (elements.gameTimer) elements.gameTimer.innerText = `Time: ${timer}s`;

        const titles = {
            'dodge': "Dodge Master", 'jump': "Sky Jumper", 'click': "Click Speedster",
            'gold': "Gold Miner", 'match': "Perfect Match", 'link': "Pattern Link",
            'flash': "Flash Cards", 'seq': "Sequence Repeat", 'math': "Mega Math",
            'trivia': "Fast Trivia", 'brick': "Brick Buster", 'space': "Space Shooter"
        };

        if (elements.gameTitle) elements.gameTitle.innerText = titles[type] || "Reward Game";

        clearInterval(state.gameInterval);
        state.gameInterval = setInterval(() => {
            timer--;
            if (elements.gameTimer) elements.gameTimer.innerText = `Time: ${timer}s`;
            if (timer <= 0) {
                clearInterval(state.gameInterval);
                if (elements.gameStatus) elements.gameStatus.style.display = 'none';
                if (elements.gameFailBtn) elements.gameFailBtn.style.display = 'block';
                showToast("TIME EXPIRED! FAILED.");
            }
        }, 1000);
    };

    window.closeGame = () => {
        clearInterval(state.gameInterval);
        if (elements.gameOverlay) elements.gameOverlay.style.display = 'none';
    };

    // --- Global Notifications ---
    function showToast(msg) {
        if (!elements.toast) return;
        elements.toast.innerText = msg;
        elements.toast.style.display = "block";
        setTimeout(() => {
            elements.toast.style.display = "none";
        }, 3000);
    }
});
