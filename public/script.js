﻿// PART 1: SETUP AND INITIAL VARIABLES

// Get the canvas element and set up the 2D drawing context
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

// Variables to track drawing state
let isDrawing = false; // Boolean to check if drawing is in progress
let lastX, lastY; // Coordinates of the last point drawn
let strokeColor = '#000000'; // Default color for the stroke
let strokeWidth = 2; // Default thickness of the stroke
let strokes = []; // Array to store all the strokes for undo functionality

// PART 2: EVENT LISTENERS FOR COLOR AND THICKNESS ADJUSTMENTS

// Update stroke color based on user input
document.getElementById('colorPicker').addEventListener('input', (e) => {
    strokeColor = e.target.value;
});

// Update stroke thickness based on user input
document.getElementById('thicknessSlider').addEventListener('input', (e) => {
    strokeWidth = parseInt(e.target.value);
});

// PART 3: DRAWING FUNCTIONS

// Function to start drawing
function startDrawing(x, y) {
    isDrawing = true;
    [lastX, lastY] = [x, y];
}

// Function to stop drawing
function stopDrawing() {
    isDrawing = false;
    if (lastX !== undefined && lastY !== undefined) {
        // Record the stroke when drawing stops
        strokes.push({ x1: lastX, y1: lastY, x2: x, y2: y, color: strokeColor, width: strokeWidth });
    }
}

// Function to draw on the canvas
function draw(x, y) {
    if (!isDrawing) return;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
    [lastX, lastY] = [x, y];
}

// PART 4: UNDO FUNCTIONALITY

// Undo function
function undo() {
    if (strokes.length === 0) return;
    strokes.pop(); // Remove the last stroke
    redrawCanvas(); // Redraw the canvas without the last stroke
}

// Function to redraw the canvas based on the strokes array
function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    strokes.forEach(stroke => {
        ctx.beginPath();
        ctx.moveTo(stroke.x1, stroke.y1);
        ctx.lineTo(stroke.x2, stroke.y2);
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.width;
        ctx.stroke();
    });
}


// PART 5: MOUSE AND TOUCH EVENT LISTENERS

// Mouse event listeners
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

// Touch event listeners
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

// PART 6: ADDITIONAL FUNCTIONALITY

// Event listener for image submission
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

// Event listener for the undo button
document.getElementById('undoBtn').addEventListener('click', undo);
