import { updateMapLayer } from './updateMap.js';
import { displayTable } from './table.js';
import { setupPresentationButton } from './presentation.js';

let latestSearchTerm = '';
let latestFilteredData = {
    layer1: null,
    layer2: null
};

export { latestSearchTerm, latestFilteredData };

export function setupSearch(selectedLayer, map, geojsonData, csvData) {
    const searchInput = document.getElementById('table-search-input');
    if (!searchInput) return;

    const savedSearchTerm = sessionStorage.getItem('searchTerm');
    if (savedSearchTerm) {
        searchInput.value = savedSearchTerm;
        latestSearchTerm = savedSearchTerm; 
        const {
            filteredGeojsonData,
            filteredCsvData
        } = filterTable(savedSearchTerm, selectedLayer, map, geojsonData, csvData);
            latestFilteredData.layer1 = filteredGeojsonData;
            latestFilteredData.layer2 = filteredCsvData;
        setupPresentationButton(selectedLayer, filteredGeojsonData, filteredCsvData, map);
    } else {
        setupPresentationButton(selectedLayer, geojsonData, csvData, map);
            latestFilteredData.layer1 = null;
            latestFilteredData.layer2 = null;
    }

    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value;
        sessionStorage.setItem('searchTerm', searchTerm);
        latestSearchTerm = searchTerm; 
        const {
            filteredGeojsonData,
            filteredCsvData
        } = filterTable(searchTerm, selectedLayer, map, geojsonData, csvData);
        latestFilteredData.layer1 = filteredGeojsonData;
        latestFilteredData.layer2 = filteredCsvData;
        setupPresentationButton(selectedLayer, filteredGeojsonData, filteredCsvData, map);
    });
}

export function filterTable(searchTerm, selectedLayer, map, geojsonData, csvData) {
    let dataToFilter;
    let features = [];

    if (selectedLayer === 'layer1') {
        dataToFilter = geojsonData;
    } else if (selectedLayer === 'layer2') {
        dataToFilter = csvData;
    } else {
        console.warn("Unknown layer for filtering.");
        return;
    }

    const filteredData = dataToFilter.filter(item => {
        return Object.values(item).some(value => {
            if (typeof value === 'number') {
                value = value.toString();
            }
            return value && value.toLowerCase().includes(searchTerm.toLowerCase());
        });
    });

    if (selectedLayer === 'layer1') {
        features = filteredData.map(item => {
            const feature = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(item.longitude), parseFloat(item.latitude)])),
                name: item.name,
                address: item.address
            });
            return feature;
        });
    } else if (selectedLayer === 'layer2') {
        features = filteredData.map(item => {
            const feature = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(item.longitude), parseFloat(item.latitude)])),
                name_en: item.name_en,
                name_ru: item.name_ru
            });
            return feature;
        });
    }

    updateMapLayer(map, features, selectedLayer);

    displayTable(selectedLayer, filteredData, map);

    return {
        filteredGeojsonData: selectedLayer === 'layer1' ? filteredData : null,
        filteredCsvData: selectedLayer === 'layer2' ? filteredData : null
    };
}