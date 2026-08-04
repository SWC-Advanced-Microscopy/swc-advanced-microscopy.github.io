// Mirrors the --color-text / --color-text-dim / --color-border custom properties
// in assets/css/main.css. Plotly renders to canvas/SVG, so it can't read CSS
// variables directly — keep these in sync by hand if the palette changes.
const XS_TEXT_COLOR = '#e8e8e8';
const XS_TEXT_DIM_COLOR = '#b7bbc2';
const XS_BORDER_COLOR = '#51555d';
const XS_GRID_COLOR = '#3a3f48';


function readDataFromFile(filePath) {
    // Function for reading spectra from csv file
    return fetch(filePath)
        .then(response => response.text())
        .then(data => {
            const lines = data.split('\n');
            const xData = [];
            const yData = [];

            lines.forEach(line => {
                const [x, y] = line.split(',');
                xData.push(x);
                yData.push(parseFloat(y));
            });

            return { x: xData, y: yData };
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}


function readAllFilesIntoStructure(fileDict) {
    // Read data from each file and return the promises, in the order of fileDict so
    // that trace index matches file index. The filter buttons rely on this.
    return fileDict.map(file =>
        readDataFromFile(file.filename)
            .then(data => ({
                x: data.x,
                y: data.y,
                mode: 'lines+markers',
                name: file.name,
                line: { color: file.color },
                marker: {
                    color: file.color,
                    opacity: 0.75,
                    symbol: file.marker,
                },
            }))
    );
}


// The following functions define button behavior. Visibility is set from the "files"
// list rather than from hardcoded trace numbers, so adding or reordering a curve
// there needs no change here.
function setTraceVisibility(isVisible) {
    const chart = document.getElementById('chart');
    if (!chart || !chart.data) return;
    // 'legendonly' rather than false, so a hidden curve keeps its legend entry and can
    // be clicked back on.
    const visible = chart.data.map((trace, i) => isVisible(files[i], i) ? true : 'legendonly');
    Plotly.restyle(chart, { visible: visible });
}

function showAllTraces() {
    setTraceVisibility(() => true);
}

function removeAllTraces() {
    setTraceVisibility(() => false);
}

function enableAlexa() {
    setTraceVisibility(file => file.name.startsWith('AF'));
}

function enableZipfel() {
    setTraceVisibility(file => file.source === 'zipfel');
}

function enableDrobizhev() {
    setTraceVisibility(file => file.source === 'drobizhev');
}
