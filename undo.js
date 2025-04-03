
const maxUndoStackSize = 5;
let undoStack = [];

// Function to save current state
function saveState() {
  if (undoStack.length >= maxUndoStackSize) {
    undoStack.shift(); // Remove the oldest state if stack exceeds size
  }
  let cells = document.querySelectorAll('.cell');
  // Save the current state (background colors of cells)
  const currentState = Array.from(cells).map(cell => cell.style.backgroundColor || 'white');
  undoStack.push(currentState);
}

// Event listener for Undo (Ctrl + Z)
window.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 'z') {
        event.preventDefault(); // Prevent the default browser undo behavior

        if (undoStack.length > 0) {
            let cells = document.querySelectorAll('.cell');
            const previousState = undoStack.pop(); // Get the last saved state
            // Revert to the previous state
            previousState.forEach((color, index) => {
                cells[index].style.backgroundColor = color;
            });
        }
  }
});