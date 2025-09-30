const imageInput = document.getElementById('imageInput');
const canvas = document.getElementById('canvas');
const asciiArtOutput = document.getElementById('ascii-art');
const ctx = canvas.getContext('2d');

// ASCII characters from darkest to lightest. You can customize this.
const density = "@%#*+=-:. ";

imageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            // 1. RESIZE THE IMAGE
            // Adjust the max width to control the output size.
            // A larger width gives more detail but creates a larger text block.
            const maxWidth = 150; 
            const scaleFactor = maxWidth / img.width;
            const newHeight = img.height * scaleFactor;
            canvas.width = maxWidth;
            canvas.height = newHeight;
            
            // 2. DRAW IMAGE ON CANVAS
            ctx.drawImage(img, 0, 0, maxWidth, newHeight);

            // 3. GET PIXEL DATA
            const imageData = ctx.getImageData(0, 0, maxWidth, newHeight);
            const data = imageData.data;
            
            let asciiString = "";

            // 4. ITERATE THROUGH PIXELS
            for (let i = 0; i < data.length; i += 4) {
                const red = data[i];
                const green = data[i + 1];
                const blue = data[i + 2];

                // 5. CONVERT TO GRAYSCALE
                // Using the luminosity method for a more accurate brightness perception
                const gray = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
                
                // 6. MAP GRAYSCALE TO ASCII CHARACTER
                const charIndex = Math.floor((gray / 255) * (density.length - 1));
                const char = density.charAt(charIndex);
                
                asciiString += char;

                // Add a newline character at the end of each row
                if ((i / 4 + 1) % maxWidth === 0) {
                    asciiString += "\n";
                }
            }
            
            // 7. DISPLAY THE RESULT
            asciiArtOutput.textContent = asciiString;
        };
        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
});