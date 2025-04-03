import('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js')
    .then((module) => {
        
        const colorWheel = document.getElementById('colorWheel');
        const colorCanvas = document.getElementById('colorCanvas');
        const colorBox = document.getElementById('colorBox');
        const canvasContext = colorCanvas.getContext('2d');


        const wheelRadius = 150;  // The radius of the color wheel

        // Draw the color wheel on the canvas with lightness variation
        function drawColorWheel() {
            const imageData = canvasContext.createImageData(colorCanvas.width, colorCanvas.height);
            const data = imageData.data;
        
            for (let y = 0; y < colorCanvas.height; y++) {
                for (let x = 0; x < colorCanvas.width; x++) {
                    // Calculate the distance from the center (radius)
                    const dx = x - wheelRadius;
                    const dy = y - wheelRadius;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const angle = Math.atan2(dy, dx);
                    const hue = (angle * 180 / Math.PI + 360) % 360;  // Map the angle to hue (0-360)
        
                    // Calculate lightness based on the distance (center is lighter)
                    const lightness = Math.max(0, Math.min(100, 100 - (distance / wheelRadius) * 100));
        
                    // Calculate saturation based on the distance (full saturation at the edge)
                    const saturation = Math.max(0, Math.min(100, (distance / wheelRadius) * 100));
        
                    // Convert HSL to RGB
                    const color = hslToRgb(hue, saturation, lightness);
                    const index = (y * colorCanvas.width + x) * 4;
        
                    data[index] = color.r;   // Red
                    data[index + 1] = color.g; // Green
                    data[index + 2] = color.b; // Blue
                    data[index + 3] = 255; // Alpha
                }
            }
        
            canvasContext.putImageData(imageData, 0, 0);
        }
        
        // Convert HSL to RGB
        function hslToRgb(h, s, l) {
            s /= 100;
            l /= 100;
        
            const c = (1 - Math.abs(2 * l - 1)) * s;
            const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
            const m = l - c / 2;
        
            let r = 0, g = 0, b = 0;
        
            if (h >= 0 && h < 60) {
                r = c;
                g = x;
            } else if (h >= 60 && h < 120) {
                r = x;
                g = c;
            } else if (h >= 120 && h < 180) {
                g = c;
                b = x;
            } else if (h >= 180 && h < 240) {
                g = x;
                b = c;
            } else if (h >= 240 && h < 300) {
                r = x;
                b = c;
            } else {
                r = c;
                b = x;
            }
        
            return {
                r: Math.round((r + m) * 255),
                g: Math.round((g + m) * 255),
                b: Math.round((b + m) * 255)
            };
        }
        
        // observer for background color changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === "attributes" && mutation.attributeName === "style") {
                    updateSecondaryPalette();
                }
            });
        });
        // this is used to update the secondary palette when the colorBox is changed when
        // picking a recently used color
        observer.observe(document.getElementById("colorBox"), { attributes: true, attributeFilter: ["style"] });
        
        // Function to extract color from the clicked pixel
        colorWheel.addEventListener('click', function(e) {
            const rect = colorWheel.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            const pixel = canvasContext.getImageData(clickX, clickY, 1, 1).data;
        
            // Convert the rgba value to a color string
            const rgbaColor = `rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]}, ${pixel[3] / 255})`;
        
            // Update the color value and color box
            colorBox.style.backgroundColor = rgbaColor;
            updateSecondaryPalette();
        });

        function getTimestamp() {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');            
            return `${year}_${month}_${day}_${hours}_${minutes}_${seconds}`;
        }
        
        function saveCanvas() {
            html2canvas(document.getElementById("pixel-art-grid")).then((canvas) => {
                const link = document.createElement("a");
                let timestamp_str = getTimestamp();
                link.download = timestamp_str + `_pixel-art.png`;
                link.href = canvas.toDataURL(`image/png`);
                link.click();
            });
        }
        document.getElementById("saveButton").addEventListener('click', saveCanvas);
                
        function rgbStringToHex(rgbString) {
            // parses a rgb string of the kind rgb(rrr, ggg, bbb) and converts it to #RRGGBB hexa format
            // Extract the RGB values using a regular expression
            const rgbArray = rgbString.match(/\d+/g); // This matches all numbers (digits)
        
            // Convert each value to hex and ensure it is 2 digits
            const toHex = (x) => {
                const hex = parseInt(x).toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            };
        
            // Combine the hexadecimal values in #RRGGBB format
            return `#${toHex(rgbArray[0])}${toHex(rgbArray[1])}${toHex(rgbArray[2])}`;
        }
        
        function updateSecondaryPalette() {
            const mainColorCss = document.getElementById("colorBox").style["background-color"];
            const secondaryPalette = document.getElementById("secondaryColorPalette");
            secondaryPalette.innerHTML = "";
        
            mainColor = rgbStringToHex(mainColorCss);
            const shades = generateColorShades(mainColor);
            shades.forEach(color => {
                const colorDiv = document.createElement("div");
                colorDiv.classList.add("color-option");
                colorDiv.style.backgroundColor = color;
                colorDiv.addEventListener("click", () => {
                    selectedColor = color;
                    document.getElementById("colorBox").style["background-color"] = color;
                });
                secondaryPalette.appendChild(colorDiv);
            });
        }
        
        function generateColorShades(color) {
            // create 25 shades of similar colors for the secondary palette
            let shades = [];
            for (let i = 0; i < 25; i++) {
                let shade = shadeColor(color, i * 4 - 8); 
                shades.push(shade);
            }
            return shades;
        }
        
        function shadeColor(color, percent) {
            let R = parseInt(color.substring(1,3),16);
            let G = parseInt(color.substring(3,5),16);
            let B = parseInt(color.substring(5,7),16);
            
            R = parseInt(R * (100 + percent) / 100);
            G = parseInt(G * (100 + percent) / 100);
            B = parseInt(B * (100 + percent) / 100);
            
            R = (R<255)?R:255;  
            G = (G<255)?G:255;  
            B = (B<255)?B:255;  
            
            R = (R>0)?R:0;  
            G = (G>0)?G:0;  
            B = (B>0)?B:0;  
            
            let RR = ((R.toString(16).length===1) ? "0" + R.toString(16) : R.toString(16));
            let GG = ((G.toString(16).length===1) ? "0" + G.toString(16) : G.toString(16));
            let BB = ((B.toString(16).length===1) ? "0" + B.toString(16) : B.toString(16));
            
            return "#" + RR + GG + BB;
        }
        
        drawColorWheel();
        createGrid();
        updateSecondaryPalette();
        updateRecentColors();

    })
    .catch((err) => console.error('Failed to load script:', err));