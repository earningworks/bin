// GitHub Pages Favourable Script - V1.2
document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const elements = {
        canvas: document.getElementById('spinWheel'),
        spinBtn: document.getElementById('spinBtn'),
        withdrawBtn: document.getElementById('withdrawBtn'),
        headerWithdraw: document.getElementById('headerWithdraw'),
        balanceValue: document.getElementById('balanceValue'),
        toast: document.getElementById('toast'),
        gameOverlay: document.getElementById('gameOverlay'),
        gameTitle: document.getElementById('gameTitle'),
        gameTimer: document.getElementById('gameTimer'),
        gameFailBtn: document.getElementById('gameTryAgain'),
    };

    let state = {
        balance: 0,
        ang: 0,
        angVel: 0,
        gameInt: null
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
        const TAU = 2 * Math.PI;
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

            // Label
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
            sectors.forEach(drawSector);
        };

        const spinEngine = () => {
            if (state.angVel > 0.002) {
                state.angVel *= 0.985;
                state.ang += state.angVel;
                state.ang %= TAU;
                elements.canvas.style.transform = `rotate(${state.ang - Math.PI / 2}rad)`;
                requestAnimationFrame(spinEngine);
            } else {
                state.angVel = 0;
                elements.spinBtn.disabled = false;
                const index = Math.floor(tot - (state.ang / TAU) * tot) % tot;
                handleResult(sectors[index].label);
            }
        };

        const handleResult = (label) => {
            if (label === "Try Again") {
                showToast("Try Again! One more spin?");
            } else {
                const amount = parseInt(label.replace('₹', ''));
                state.balance += amount;
                if (elements.balanceValue) elements.balanceValue.innerText = `₹${state.balance}`;
                showToast(`Congrats! Won ${label}`);

                // Show Withdraw Buttons (As Requested)
                if (elements.withdrawBtn) elements.withdrawBtn.style.display = "flex";
                if (elements.headerWithdraw) elements.headerWithdraw.style.display = "flex";
            }
        };

        elements.spinBtn.addEventListener('click', () => {
            if (state.angVel > 0) return;
            elements.spinBtn.disabled = true;
            state.angVel = Math.random() * (0.45 - 0.35) + 0.35;
            spinEngine();
        });

        renderWheel();
    }

    // --- Interactive Games (The Fail Mechanic) ---
    window.startMegaGame = (type) => {
        if (!elements.gameOverlay) return;
        elements.gameOverlay.style.display = "flex";
        elements.gameFailBtn.style.display = "none";

        let timer = 10;
        elements.gameTimer.innerText = `Time: ${timer}s`;

        state.gameInt = setInterval(() => {
            timer--;
            elements.gameTimer.innerText = `Time: ${timer}s`;
            if (timer <= 0) {
                clearInterval(state.gameInt);
                elements.gameFailBtn.style.display = "block";
                showToast("MISSION FAILED!");
            }
        }, 1000);
    };

    window.closeGame = () => {
        clearInterval(state.gameInt);
        if (elements.gameOverlay) elements.gameOverlay.style.display = "none";
    };

    function showToast(msg) {
        if (!elements.toast) return;
        elements.toast.innerText = msg;
        elements.toast.style.display = "block";
        setTimeout(() => { elements.toast.style.display = "none"; }, 3000);
    }
});
