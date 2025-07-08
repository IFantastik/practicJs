function centerMapOnMarker(latitude, longitude, map) {
    if (!map) {
        console.error("Map object is not available in centerMapOnMarker");
        return;
    }

    const view = map.getView();
    const coordinates = ol.proj.fromLonLat([longitude, latitude]);
    view.animate({
        center: coordinates,
        duration: 1000,
        zoom: 16
    });
}

function createTable(data) {
    if (!data || data.length === 0) {
        return '<p>Нет данных для отображения.</p>';
    }

    let html = '<table border="1">';

    const headers = Object.keys(data[0]);
    html += '<thead><tr>';
    headers.forEach(header => {
        html += `<th>${header}</th>`;
    });
    html += '</tr></thead>';

    html += '<tbody>';
    data.forEach((item, index) => {
        html += `<tr data-index="${index}" style="cursor: pointer;">`;
        headers.forEach(header => {
            let value = item[header];
            if (header === 'latitude' || header === 'longitude') {
                value = parseFloat(value).toFixed(5);
            }
            html += `<td>${value}</td>`;
        });
        html += '</tr>';
    });
    html += '</tbody></table>';

    return html;
}

export function displayTable(selectedLayer, data, map) {
    const tableHtml = createTable(data);
    document.getElementById('table-container').innerHTML = tableHtml;

    const tableRows = document.querySelectorAll('#table-container tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('click', (event) => {
            const index = parseInt(row.dataset.index);
            if (data[index]) {
                const latitude = parseFloat(data[index].latitude);
                const longitude = parseFloat(data[index].longitude);
                centerMapOnMarker(latitude, longitude, map);
            }
        });
    });
}