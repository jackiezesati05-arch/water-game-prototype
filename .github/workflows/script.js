// GAME SETTINGS
const totalFullBottles = 8;
const totalEmptyBottles = 2;

let score = 0;
let timeLeft = 30;
let fullBottlesCollected = 0;
let timerInterval;
let gameActive = false;

// GET HTML ELEMENTS
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const remainingDisplay = document.getElementById("remaining");
const livingRoom = document.getElementById("living-room");
const message = document.getElementById("message");

const endScreen = document.getElementById("end-screen");
const endTitle = document.getElementById("end-title");
const endMessage = document.getElementById("end-message");

const resetButton = document.getElementById("reset-button");
const playAgainButton = document.getElementById("play-again");

// START THE GAME
function startGame() {
    clearInterval(timerInterval);

    score = 0;
    timeLeft = 30;
    fullBottlesCollected = 0;
    gameActive = true;

    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLeft;
    remainingDisplay.textContent = totalFullBottles;

    message.textContent = "Find all 8 full water bottles!";
    endScreen.classList.add("hidden");

    // Remove old bottles but keep living room decorations
    document.querySelectorAll(".bottle").forEach(bottle => {
        bottle.remove();
    });

    // Remove old confetti
    document.querySelectorAll(".confetti").forEach(piece => {
        piece.remove();
    });

    createBottles();

    // Start the countdown
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame(false);
        }
    }, 1000);
}

// CREATE WATER BOTTLES
function createBottles() {

    const bottles = [];

    // Add full bottles
    for (let i = 0; i < totalFullBottles; i++) {
        bottles.push("full");
    }

    // Add empty bottles
    for (let i = 0; i < totalEmptyBottles; i++) {
        bottles.push("empty");
    }

    // Mix up bottle locations
    bottles.sort(() => Math.random() - 0.5);

    bottles.forEach(type => {

        const bottle = document.createElement("button");

        bottle.classList.add("bottle");

        if (type === "full") {
            bottle.textContent = "💧";
            bottle.setAttribute("aria-label", "Full water bottle");
        } else {
            bottle.textContent = "🫙";
            bottle.classList.add("empty");
            bottle.setAttribute("aria-label", "Empty bottle");
        }

        // Random bottle location
        const x = Math.random() * 85 + 5;
        const y = Math.random() * 65 + 20;

        bottle.style.left = x + "%";
        bottle.style.top = y + "%";

        // What happens when a bottle is clicked?
        bottle.addEventListener("click", () => {

            if (!gameActive) return;

            bottle.disabled = true;

            if (type === "full") {

                score++;
                fullBottlesCollected++;

                message.textContent = "Great job! You found clean water! 💧";

            } else {

                score = Math.max(0, score - 1);

                message.textContent = "Oops! That bottle was empty! -1 point.";

            }

            // Update score
            scoreDisplay.textContent = score;

            // Update remaining full bottles
            remainingDisplay.textContent =
                totalFullBottles - fullBottlesCollected;

            // Remove collected bottle
            bottle.remove();

            // Check for a win
            if (fullBottlesCollected === totalFullBottles) {
                endGame(true);
            }
        });

        livingRoom.appendChild(bottle);
    });
}

// WIN OR LOSE
function endGame(won) {

    gameActive = false;
    clearInterval(timerInterval);

    endScreen.classList.remove("hidden");

    if (won) {

        endTitle.textContent = "🎉 YOU WIN! 🎉";

        endMessage.textContent =
            "Amazing! You collected all 8 full water bottles! " +
            "You helped make a difference! 💧";

        message.textContent = "Congratulations!";

        // Start confetti celebration
        createConfetti();

    } else {

        endTitle.textContent = "⏰ TIME'S UP!";

        endMessage.textContent =
            "You ran out of time! Try again to collect all the water bottles.";

        message.textContent = "Game over!";

    }
}

// CONFETTI EFFECT
function createConfetti() {

    const colors = [
        "#168b78",
        "#f4cf55",
        "#ff7b7b",
        "#72c9ed",
        "#bd8be8"
    ];

    for (let i = 0; i < 100; i++) {

        const piece = document.createElement("div");

        piece.classList.add("confetti");

        piece.style.left = Math.random() * 100 + "vw";

        piece.style.backgroundColor =
            colors[Math.floor(Math.random() * colors.length)];

        piece.style.animationDelay =
            Math.random() * 2 + "s";

        document.body.appendChild(piece);

        // Remove confetti after animation
        setTimeout(() => {
            piece.remove();
        }, 5000);
    }
}

// RESET BUTTON
resetButton.addEventListener("click", startGame);

// PLAY AGAIN BUTTON
playAgainButton.addEventListener("click", startGame);

// START GAME WHEN PAGE LOADS
startGame();