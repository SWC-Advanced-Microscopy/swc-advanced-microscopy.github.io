// "2026-01-29T16:45:00" → "29/01/26 16:45"
function formatISODate(isoStr) {
    const d = new Date(isoStr);
    const pad = n => String(n).padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${String(d.getFullYear()).slice(2)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}


// A metric is plottable only if it carries both series names and at least one row.
function hasMetricData(metric) {
    return Boolean(metric)
        && Array.isArray(metric.variable_names) && metric.variable_names.length > 1
        && Array.isArray(metric.data) && metric.data.length > 0;
}


// Show or hide the card wrapping a panel, so that a skipped metric leaves no gap.
function setPanelVisible(divId, visible) {
    const div = document.getElementById(divId);
    if (!div) return;
    const container = div.closest('.card') || div;
    container.style.display = visible ? '' : 'none';
}


// The file names its own series. Which PMTs a microscope reads out, and which power
// ranges lens paper was imaged at, are properties of the acquisition and vary between
// systems and between sessions, so they cannot be hardcoded here. A panel may supply
// "names" to prettify series whose names are fixed by the schema (laserPower), keyed by
// the name in the file rather than by position so that it cannot misalign.
function seriesLabel(panel, variableName) {
    return (panel.names && panel.names[variableName]) || variableName;
}


function buildTracesFromMetric(metric, panel) {
    const dates = metric.data.map(row => formatISODate(row[0]));
    const numSeries = metric.variable_names.length - 1;
    return Array.from({ length: numSeries }, (_, i) => {
        const name = seriesLabel(panel, metric.variable_names[i + 1]);
        return {
            x: dates,
            y: metric.data.map(row => row[i + 1]),
            mode: 'lines+markers',
            name: name,
            line: { color: panel.colors[i], width: 2 },
            marker: { color: panel.colors[i], size: 7, symbol: 'circle' },
            hovertemplate: `<b>${name}</b><br>%{x}<br>%{y:.3f}<extra></extra>`,
            connectgaps: false,
        };
    });
}


function renderPanel(divId, traces, title, yLabel) {
    const layout = {
        title: { text: title, font: { size: 14 } },
        xaxis: {
            type: 'category',
            tickangle: -35,
            ticks: 'outside',
            showline: true,
            mirror: true,
            showgrid: false,
        },
        yaxis: {
            title: { text: yLabel },
            ticks: 'outside',
            showline: true,
            mirror: true,
            gridcolor: '#e8e8e8',
        },
        showlegend: true,
        legend: { orientation: 'h', y: -0.3 },
        plot_bgcolor: '#fafafa',
        paper_bgcolor: '#ffffff',
        margin: { t: 45, b: 100, l: 60, r: 20 },
    };

    Plotly.newPlot(divId, traces, layout, { responsive: true });
}


function setAllVisible(visible) {
    document.querySelectorAll('.panel').forEach(div => {
        const n = div.data ? div.data.length : 0;
        for (let i = 0; i < n; i++) {
            Plotly.restyle(div.id, 'visible', visible ? true : 'legendonly', [i]);
        }
    });
}


// Render every panel whose metric is present in the file. Metrics are optional: a
// recording session may contain no data at all for a given test, in which case the key
// is absent and that panel is hidden rather than plotted.
function loadAndRender(json, panels) {
    const metrics = (json && json.metrics) || {};
    const skipped = [];

    panels.forEach(panel => {
        const metric = metrics[panel.metricKey];

        if (!hasMetricData(metric)) {
            skipped.push(panel.metricKey);
            // Clear any plot left over from a previously loaded file
            if (document.getElementById(panel.divId)) {
                Plotly.purge(panel.divId);
            }
            setPanelVisible(panel.divId, false);
            return;
        }

        setPanelVisible(panel.divId, true);
        const traces = buildTracesFromMetric(metric, panel);
        renderPanel(panel.divId, traces, panel.title, panel.yLabel);
    });

    if (skipped.length) {
        console.info('No data in file for: ' + skipped.join(', ') + '. Panels hidden.');
    }
    if (skipped.length === panels.length) {
        console.warn('None of the known metrics were found in this file.');
    }
}


function handleUpload(event, panels) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        let json;
        try {
            json = JSON.parse(e.target.result);
        } catch (err) {
            alert('Could not parse JSON: ' + err.message);
            return;
        }

        try {
            loadAndRender(json, panels);
            document.getElementById('loaded-filename').textContent = file.name;
        } catch (err) {
            alert('Could not display this file: ' + err.message);
        }
    };
    reader.readAsText(file);
}
