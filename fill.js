const pixelCanvas = document.getElementById('pixel-art-grid');
const fillButton = document.getElementById('fillButton');
const thresholdSlider = document.getElementById('threshold');
let fillMode = false;

// Function to color a cell
function colorCell(cell, color) {
    cell.style.backgroundColor = color;
}        

function rgbStringToDict(rgbString) {
    // Extract the RGB values using a regular expression
    const match = rgbString.match(/rgb\((\d+), (\d+), (\d+)\)/);
    return match ? { r: +match[1], g: +match[2], b: +match[3] } : { r: 0, g: 0, b: 0 };
}

// Function to flood fill (fill all adjacent similar cells)
function floodFill(startCell, originalColor, targetColor) {
    const threshold = parseInt(thresholdSlider.value);
    // convert rgb(rrr, ggg, bbb) to {r: RRR, g:GGG, b:BBB}
    const originalRGB = rgbStringToDict(originalColor);
    
    const visited = new Set();
    const stack = [startCell];

    
    const cells = document.querySelectorAll('.cell');

    while (stack.length > 0) {
        const cell = stack.pop();
        const cellIndex = Array.from(cells).indexOf(cell);
        const row = Math.floor(cellIndex / gridSize);
        const col = cellIndex % gridSize;

        if (visited.has(cellIndex)) continue;
        visited.add(cellIndex);

        // Check if the current cell's color is within the threshold of the target color        
        const cell_color = window.getComputedStyle(cell).backgroundColor;
        const isSimilar = isColorSimilar(rgbStringToDict(cell_color), originalRGB, threshold);

        if (isSimilar) {
            colorCell(cell, targetColor);
            // Add all adjacent cells (up, down, left, right) to the stack
            if (row > 0) stack.push(cells[(row - 1) * gridSize + col]);
            if (row < gridSize - 1) stack.push(cells[(row + 1) * gridSize + col]);
            if (col > 0) stack.push(cells[row * gridSize + col - 1]);
            if (col < gridSize - 1) stack.push(cells[row * gridSize + col + 1]);
        }
    }
}

function isColorSimilar(c1, c2, threshold) {
    const rDiff = Math.abs(c1.r - c2.r);
    const gDiff = Math.abs(c1.g - c2.g);
    const bDiff = Math.abs(c1.b - c2.b);
    return rDiff <= threshold && gDiff <= threshold && bDiff <= threshold;
}

// Handle mouse events for coloring
pixelCanvas.addEventListener('click', (e) => {
    isMouseDown = true;
    const targetCell = e.target;
    if (targetCell.classList.contains('pixel')) {
        // If fill mode is on, perform flood fill, else, color just the cell
        const targetColor = window.getComputedStyle(document.getElementById('colorBox')).backgroundColor;
        if (fillMode) {
            // fill with the colorBox selected color all the cells that are the same color as the clicked one
            const originalColor = window.getComputedStyle(targetCell).backgroundColor;
            floodFill(targetCell, originalColor, targetColor);
        } else {
            colorCell(targetCell, targetColor);
        }        
        addRecentColor(targetColor)
    }
});



// Toggle button functionality for fill tool
fillButton.addEventListener('click', () => {
    fillMode = !fillMode;
    fillButton.textContent = fillMode ? 'Disable Fill Tool' : 'Enable Fill Tool';
});

// Update threshold value display
thresholdSlider.addEventListener('input', () => {
    thresholdValue.textContent = thresholdSlider.value;
});