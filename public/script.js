const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let lastX, lastY;
let strokeColor = '#000000'; // Default color
let strokeWidth = 2; // Default thickness

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
    const touch = e.touches[0];
    const { left, top } = canvas.getBoundingClientRect();
    startDrawing(touch.clientX - left, touch.clientY - top);
});

canvas.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const { left, top } = canvas.getBoundingClientRect();
    draw(touch.clientX - left, touch.clientY - top);
});

canvas.addEventListener('touchend', stopDrawing);

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

// Handle the transition from initial state to drawing state
document.addEventListener('DOMContentLoaded', () => {
    // Your existing transition code...
});


document.addEventListener('DOMContentLoaded', () => {
    let transitionHandled = false; // Flag to track if the transition is already handled

    setTimeout(() => {
        const initialState = document.querySelector('.initial-state');
        const secondState = document.querySelector('.second-state');

        if (!transitionHandled) {
            transitionHandled = true;
            initialState.style.opacity = 0;
            initialState.addEventListener('transitionend', () => {
                initialState.style.display = 'none';
                secondState.style.display = 'block';
                setTimeout(() => {
                    secondState.style.opacity = 1;
                }, 50); // Add a slight delay to improve the transition effect
            });
        }
    }, 2000); // Wait 2 seconds before fading out the initial state
});

