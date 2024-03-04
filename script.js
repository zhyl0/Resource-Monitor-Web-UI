document.addEventListener('DOMContentLoaded', function() {
    fetch('printer_data.json')
        .then(response => response.json())
        .then(printerData => {
            const container = document.getElementById('printerInfo');

            printerData.forEach(printer => {
                const printerDiv = document.createElement('div');
                printerDiv.className = 'printer';

                // Create ink level bars
                const createInkLevelBar = (color, width) => {
                    return `
                        <div class="ink-level-bar-container">
                            <div class="ink-level-bar ink-${color}" style="width: ${width};"></div>
                        </div>
                    `;
                };

                // Skipping the second ink level as it is unknown
                const inkLevelsHtml = `
                    ${createInkLevelBar('black', printer['Ink Levels'][0])}
                    ${createInkLevelBar('cyan', printer['Ink Levels'][2])}
                    ${createInkLevelBar('magenta', printer['Ink Levels'][3])}
                    ${createInkLevelBar('yellow', printer['Ink Levels'][4])}
                `;

                // Create tray counters
                const trayCountersHtml = printer['Tray Information']
                    .slice(0, -1) // Ignore the last tray information
                    .map((count, index) => `
                        <div class="tray-counter">
                            <strong>Tray ${index + 1}:</strong>
                            <span class="tray-number">${count} sheets</span>
                        </div>
                    `).join('');

                printerDiv.innerHTML = `
                    <div class="printer-icon"></div>
                    <h2>${printer.Name} (${printer.Model})</h2>
                    <div class="details">
                        <div class="detail"><strong>IP:</strong> ${printer.IP}</div>
                        <div class="detail"><strong>Serial:</strong> ${printer.Serial || 'N/A'}</div>
                        <div class="ink-levels">
                            <strong>Ink Levels:</strong>
                            ${inkLevelsHtml} <!-- Now correctly defined in the scope -->
                        </div>
                        <div class="tray-counters">
                            <strong>Tray Paper Count:</strong>
                            ${trayCountersHtml}
                        </div>
                        <ul class="errors-list"><strong>Errors:</strong> ${printer.Errors.map(error => `<li class="error">${error}</li>`).join('')}</ul>
                    </div>
                `;

                container.appendChild(printerDiv);
            });
        })
        .catch(error => console.error('Error loading the printer data:', error));
});
