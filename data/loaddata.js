export function loadMarkersFromCsv(url) {
    return fetch(url)
        .then(response => response.text())
        .then(csv => {
            const lines = csv.split("\n");
            const header = lines.shift();

            const results = lines.map(line => createFeatureFromCSV(line));

            const features = results
                .filter(result => result !== null && result.feature !== null) 
                .map(result => result.feature); 
            const data = results
                .filter(result => result !== null && result.data !== null) 
                .map(result => result.data); 

            return { features: features, data: data }; 
    });
}

export function loadMarkersFromGeoJSON(url) {
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            const geojsonFormat = new ol.format.GeoJSON();

            const features = geojsonFormat.readFeatures(data, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            });

            const geojsonData = data.features.map(feature => {
                return {
                    'marker-symbol': feature.properties['marker-symbol'],
                    name: feature.properties.name,
                    address: feature.properties.address,
                    latitude: feature.geometry.coordinates[1],
                    longitude: feature.geometry.coordinates[0],
                    note: feature.properties.note
                };
            });

            return { features: features, data: geojsonData };
        });
}

function createFeatureFromCSV(csvLine) {
    const [id_station, id_line, id_node, name_en, name_ru, lat, lon] = csvLine.split(";");
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude)) {
        console.warn(`Неверные координаты в CSV файле (id_station: ${id_station}):`, csvLine);
        return null;
    }

    const feature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([longitude, latitude])),
        name_en: name_en,
        name_ru: name_ru,
        id_station: id_station
    });

    const data = {
        id_station: id_station,
        id_line: id_line,
        id_node: id_node,
        name_en: name_en,
        name_ru: name_ru,
        latitude: lat,
        longitude: lon
    };

    return { feature: feature, data: data }; 
}