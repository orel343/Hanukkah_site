// Menorah Puzzle Game
const puzzleCanvas = document.getElementById('puzzle-canvas');
const puzzleCtx = puzzleCanvas.getContext('2d');
const puzzleSize = 3;
const pieceSize = 100;
puzzleCanvas.width = puzzleSize * pieceSize;
puzzleCanvas.height = puzzleSize * pieceSize;

const menorahImage = new Image();
menorahImage.src = '/placeholder.svg?height=300&width=300'; // Replace with actual menorah image
menorahImage.onload = () => initializePuzzle();

let puzzlePieces = [];
let emptyPiece = { x: puzzleSize - 1, y: puzzleSize - 1 };

function initializePuzzle() {
    puzzlePieces = [];
    for (let y = 0; y < puzzleSize; y++) {
        for (let x = 0; x < puzzleSize; x++) {
            if (x !== puzzleSize - 1 || y !== puzzleSize - 1) {
                puzzlePieces.push({ x, y, correctX: x, correctY: y });
            }
        }
    }
    shufflePuzzle();
    drawPuzzle();
}

function shufflePuzzle() {
    for (let i = puzzlePieces.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [puzzlePieces[i], puzzlePieces[j]] = [puzzlePieces[j], puzzlePieces[i]];
    }
}

function drawPuzzle() {
    puzzleCtx.clearRect(0, 0, puzzleCanvas.width, puzzleCanvas.height);
    puzzlePieces.forEach(piece => {
        puzzleCtx.drawImage(
            menorahImage,
            piece.correctX * pieceSize, piece.correctY * pieceSize, pieceSize, pieceSize,
            piece.x * pieceSize, piece.y * pieceSize, pieceSize, pieceSize
        );
    });
}

puzzleCanvas.addEventListener('click', (e) => {
    const rect = puzzleCanvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / pieceSize);
    const y = Math.floor((e.clientY - rect.top) / pieceSize);

    if (isAdjacent(x, y, emptyPiece.x, emptyPiece.y)) {
        const pieceIndex = puzzlePieces.findIndex(p => p.x === x && p.y === y);
        if (pieceIndex !== -1) {
            [puzzlePieces[pieceIndex].x, puzzlePieces[pieceIndex].y] = [emptyPiece.x, emptyPiece.y];
            emptyPiece = { x, y };
            drawPuzzle();
            checkWin();
        }
    }
});

function isAdjacent(x1, y1, x2, y2) {
    return (Math.abs(x1 - x2) === 1 && y1 === y2) || (Math.abs(y1 - y2) === 1 && x1 === x2);
}

function checkWin() {
    const win = puzzlePieces.every(piece => piece.x === piece.correctX && piece.y === piece.correctY);
    if (win) {
        const message = document.getElementById('puzzle-message');
        message.textContent = message.getAttribute(`data-${document.documentElement.lang}`).replace('Complete', 'Congratulations! You completed');
    }
}

// 3D Dreidel Game
let scene, camera, renderer, dreidel;
let isSpinning = false;
let points = 0;

function initDreidelGame() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('dreidel-canvas') });
    renderer.setSize(300, 300);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xffd700 });
    dreidel = new THREE.Mesh(geometry, material);
    scene.add(dreidel);

    camera.position.z = 5;

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    if (isSpinning) {
        dreidel.rotation.x += 0.1;
        dreidel.rotation.y += 0.1;
    }
    renderer.render(scene, camera);
}

document.getElementById('spin-dreidel').addEventListener('click', spinDreidel);

function spinDreidel() {
    if (!isSpinning) {
        isSpinning = true;
        const spinDuration = Math.random() * 3000 + 2000; // 2-5 seconds
        setTimeout(() => {
            isSpinning = false;
            const result = Math.floor(Math.random() * 4);
            const sides = ['נ', 'ג', 'ה', 'ש'];
            const pointValues = [0, 1, 2, 3];
            const dreidelResult = document.getElementById('dreidel-result');
            const currentLang = document.documentElement.lang;
            dreidelResult.textContent = `${dreidelResult.getAttribute('data-' + currentLang)}: ${sides[result]}`;
            points += pointValues[result];
            updatePointsDisplay();
        }, spinDuration);
    }
}

function updatePointsDisplay() {
    const pointsDisplay = document.getElementById('points-display');
    const currentLang = document.documentElement.lang;
    pointsDisplay.textContent = `${pointsDisplay.getAttribute('data-' + currentLang).split(':')[0]}: ${points}`;
}

// Initialize games
document.addEventListener('DOMContentLoaded', () => {
    initializePuzzle();
    initDreidelGame();
});
