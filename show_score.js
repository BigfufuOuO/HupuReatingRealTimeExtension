// JavaScript to make the window draggable
const draggableWindow = document.getElementById('score-board');
let isDragging = false;
let offsetX, offsetY;

draggableWindow.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - draggableWindow.offsetLeft;
    offsetY = e.clientY - draggableWindow.offsetTop;
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        draggableWindow.style.left = `${e.clientX - offsetX}px`;
        draggableWindow.style.top = `${e.clientY - offsetY}px`;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

// Function to update the content of the window
function updateContent(scoreDisplayArray) {
    console.log(scoreDisplayArray);
}

// Example usage
window.addEventListener('message', (event) => {
    if (event.data.type === 'updateContent') {
        updateContent(event.data.data);
    }
});