import { loadMarkersFromGeoJSON, loadMarkersFromCsv } from './data/loaddata.js';
import { setupMapEventListeners } from './mapFunction/setupMapEvent.js';
import { updateLayers } from './mapFunction/updateLayers.js';
import { layer1, layer1View } from './cfg/mapConfig.js';
export { csvData, geojsonData };

let geojsonData = null;
let csvData = null;
let map; 

function initializeMap() {
    let geojsonFeatures = [];
    let csvFeatures = [];

    loadMarkersFromGeoJSON('./data/bars.geojson')
        .then(result => {
            geojsonFeatures = result.features;
            geojsonData = result.data;

            loadMarkersFromCsv('./data/stations.csv')
                .then(result => {
                    csvFeatures = result.features;
                    csvData = result.data;

                    map = new ol.Map({ 
                        target: 'map',
                        layers: [layer1],
                        view: new ol.View({
                            center: layer1View.center,
                            zoom: layer1View.zoom
                        })
                    });

                    setupMapEventListeners(map); 

                    function saveMapState() {
                        const view = map.getView();
                        const center = view.getCenter();
                        const zoom = view.getZoom();
                        sessionStorage.setItem('mapCenter', JSON.stringify(center));
                        sessionStorage.setItem('mapZoom', zoom);
                    }

                    function restoreMapState() {
                        const center = sessionStorage.getItem('mapCenter');
                        const zoom = sessionStorage.getItem('mapZoom');
                        if (center && zoom) {
                            map.getView().setCenter(JSON.parse(center));
                            map.getView().setZoom(parseFloat(zoom));
                        }
                    }

                    function saveSelectedLayer(selectedLayer) {
                        sessionStorage.setItem('selectedLayer', selectedLayer);
                    }

                    function restoreSelectedLayer() {
                        const selectedLayer = sessionStorage.getItem('selectedLayer');
                        return selectedLayer;
                    }

                    map.on('moveend', saveMapState);

                    let selectedLayer = restoreSelectedLayer();
                    if (!selectedLayer) {
                        selectedLayer = 'layer1';
                    }

                    const layerSwitcher = document.getElementById("layer-switcher");
                    const radioButtons = layerSwitcher.querySelectorAll('input[type="radio"]');

                    radioButtons.forEach(radioButton => {
                        radioButton.addEventListener('change', function() {
                            const selectedLayer = this.value;
                            saveSelectedLayer(selectedLayer);
                            updateLayers(selectedLayer, map, csvFeatures, geojsonFeatures);
                        });
                    });

                    updateLayers(selectedLayer, map, csvFeatures, geojsonFeatures);

                    restoreMapState();
                    radioButtons.forEach(radioButton => {
                        if (radioButton.value === selectedLayer) {
                            radioButton.checked = true;
                        }
                    });
                });
        });
}


initializeMap();