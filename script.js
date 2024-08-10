document.addEventListener('DOMContentLoaded', () => {
    const componentType = document.getElementById('componentType');
    const formContainer = document.getElementById('formContainer');
    const preview = document.getElementById('cardPreview');
    const downloadButton = document.createElement('button');

    downloadButton.textContent = 'Download as PNG';
    downloadButton.style.display = 'none'; // Sākotnēji slēpj pogu
    downloadButton.addEventListener('click', () => {
        html2canvas(preview).then(canvas => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'card-preview.png';
            link.click();
        });
    });

    document.getElementById('app').appendChild(downloadButton);

    componentType.addEventListener('change', function() {
        const type = this.value;
        formContainer.innerHTML = generateForm(type);
    });

    formContainer.addEventListener('submit', (event) => {
        event.preventDefault();
        const type = componentType.value;
        generatePreview(type);
        downloadButton.style.display = 'block'; // Rāda pogu pēc priekšskatījuma ģenerēšanas
    });

    function generateForm(type) {
        switch (type) {
            case 'character':
                return `
                    <form id="characterForm">
                        <label for="charTitle">Character Name:</label>
                        <input type="text" id="charTitle" required>
                        
                        <label for="charImage">Upload Image:</label>
                        <input type="file" id="charImage" accept="image/*" required>
                        
                        <label for="charDescription">Description:</label>
                        <textarea id="charDescription" required></textarea>
                        
                        <label for="charBonuses">Bonuses:</label>
                        <textarea id="charBonuses" required></textarea>
                        
                        <button type="submit">Generate Character Sheet</button>
                    </form>
                `;
            case 'event':
                return `
                    <form id="eventForm">
                        <label for="eventTitle">Event Title:</label>
                        <input type="text" id="eventTitle" required>
                        
                        <label for="eventDescription">Description:</label>
                        <textarea id="eventDescription" required></textarea>
                        
                        <button type="submit">Generate Event Card</button>
                    </form>
                `;
            case 'custom':
                return `
                    <form id="customForm">
                        <label for="customTitle">Card Title:</label>
                        <input type="text" id="customTitle" required>
                        
                        <label for="customImage">Upload Image:</label>
                        <input type="file" id="customImage" accept="image/*">
                        
                        <label for="customDescription">Description:</label>
                        <textarea id="customDescription" required></textarea>
                        
                        <button type="submit">Generate Custom Card</button>
                    </form>
                `;
            default:
                return '';
        }
    }

    function generatePreview(type) {
        let title, description, imageFile, bonuses;

        switch (type) {
            case 'character':
                title = document.getElementById('charTitle').value;
                description = document.getElementById('charDescription').value;
                bonuses = document.getElementById('charBonuses').value;
                imageFile = document.getElementById('charImage').files[0];
                break;
            case 'event':
                title = document.getElementById('eventTitle').value;
                description = document.getElementById('eventDescription').value;
                break;
            case 'custom':
                title = document.getElementById('customTitle').value;
                description = document.getElementById('customDescription').value;
                imageFile = document.getElementById('customImage').files[0];
                break;
        }

        preview.innerHTML = `
            <div class="content">
                <h3>${title}</h3>
                <p>${description}</p>
                ${bonuses ? `<div class="bonuses"><h4>Bonuses:</h4><p>${bonuses}</p></div>` : ''}
            </div>
        `;

        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                preview.insertBefore(img, preview.firstChild);
            };
            reader.readAsDataURL(imageFile);
        }
    }
});
