const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let lastX, lastY;
let strokeColor = '#000000'; // Default color
let strokeWidth = 2; // Default thickness
let strokes = []; // To store all the strokes
let redoStack = []; // To store strokes for redo

// Update stroke color
document.getElementById('colorPicker').addEventListener('input', (e) => {
    strokeColor = e.target.value;
});

// Update stroke thickness
document.getElementById('thicknessSlider').addEventListener('input', (e) => {
    strokeWidth = parseInt(e.target.value);
});

function startDrawing(x, y) {
    isDrawing = true;
    [lastX, lastY] = [x, y];
}

function stopDrawing() {
    isDrawing = false;
}

function draw(x, y) {
    if (!isDrawing) return;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
    [lastX, lastY] = [x, y];
    strokes.push({ x1: lastX, y1: lastY, x2: x, y2: y, color: strokeColor, width: strokeWidth });
}

// Undo function
function undo() {
    if (strokes.length === 0) return;
    redoStack.push(strokes.pop());
    redrawCanvas();
}

// Redo function
function redo() {
    if (redoStack.length === 0) return;
    strokes.push(redoStack.pop());
    redrawCanvas();
}

// Function to redraw the canvas based on the strokes array
function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokes.forEach(stroke => {
        ctx.beginPath();
        ctx.moveTo(stroke.x1, stroke.y1);
        ctx.lineTo(stroke.x2, stroke.y2);
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.width;
        ctx.stroke();
    });
}

canvas.addEventListener('mousedown', (e) => {
    const { left, top } = canvas.getBoundingClientRect();
    startDrawing(e.clientX - left, e.clientY - top);
});

canvas.addEventListener('mousemove', (e) => {
    const { left, top } = canvas.getBoundingClientRect();
    draw(e.clientX - left, e.clientY - top);
});

canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent default behavior
    const touch = e.touches[0];
    const { left, top } = canvas.getBoundingClientRect();
    startDrawing(touch.clientX - left, touch.clientY - top);
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault(); // Prevent default behavior
    if (e.touches.length > 1) return; // Ignore if multiple touches
    const touch = e.touches[0];
    const { left, top } = canvas.getBoundingClientRect();
    draw(touch.clientX - left, touch.clientY - top);
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault(); // Prevent default behavior
    stopDrawing();
});

document.getElementById('submitBtn').addEventListener('click', function () {
    const dataURL = canvas.toDataURL('image/png');
    fetch('https://llum-fireapp-backend-90a9524ac9d2.herokuapp.com/saveDrawing', { // Replace with your Heroku app's URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: dataURL })
    })
        .then(response => response.json())
        .then(data => console.log('Success:', data))
        .catch(error => console.error('Error:', error));
});

// Add event listeners to the new buttons
document.getElementById('undoBtn').addEventListener('click', undo);
document.getElementById('redoBtn').addEventListener('click', redo);
