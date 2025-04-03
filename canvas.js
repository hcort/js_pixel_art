let gridSize = 16;
let isMouseDown = false;

// function to redraw the pixel grid in the selected grid size
function setGridSize(size) {
    gridSize = size;
    createGrid();
}

document.getElementById("customSizeInput").addEventListener('input', function() {
    setGridSize(document.getElementById("customSizeInput").value)
});

// create a grid in a custom size
function applyCustomSize() {
    const size = parseInt(document.getElementById("customSize").value);
    if (size > 0) setGridSize(size);
}


let default_white = "#FFFFFF";
let recentColors = new Array(gridSize).fill(default_white);

// recentColors is an array that holds the last used colors
function addRecentColor(color) {
    if (color == default_white)
        return;
    if (!recentColors.includes(color)) {
        recentColors.unshift(color);
        if (recentColors.length > 16) {
            recentColors.pop();
        }
        updateRecentColors();
    }
}

function updateRecentColors() {
    const recentColorsDiv = document.getElementById("recent-colors");
    recentColorsDiv.innerHTML = "";
    
    // we draw a grid with the contents of recentColors
    recentColors.forEach(color => {
        const colorDiv = document.createElement("div");
        colorDiv.classList.add("color-option");
        colorDiv.style.backgroundColor = color;
        // when clicking on a recent color we change the selected color box
        colorDiv.addEventListener("click", () => {
            if (color != default_white)
                document.getElementById('colorBox').style.backgroundColor = color;
        });
        recentColorsDiv.appendChild(colorDiv);
    });
}

window.addEventListener('mouseup', () => {
    console.log('window mouseup isMouseDown = false');
    isMouseDown = false;
});

function createGrid() {
    const grid = document.getElementById("pixel-art-grid");
    grid.addEventListener('mouseleave', (e) => {
        isMouseDown = false;
    });
    grid.innerHTML = "";
    grid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
    
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement("div");
        cell.classList.add("pixel");
        cell.classList.add("cell");
        cell.style.backgroundColor = "#ffffff";
        grid.appendChild(cell);
        

        cell.addEventListener('mouseenter', (e) => {
            if (isMouseDown){
                const targetColor = window.getComputedStyle(document.getElementById('colorBox')).backgroundColor;
                colorCell(cell, targetColor);
            }
        });

        cell.addEventListener('mousedown', () => {
            isMouseDown = true;
            handleCellClick(cell);
        });

        cell.addEventListener('mouseup', () => {
            isMouseDown = false;
        });
    }
}