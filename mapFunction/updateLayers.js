import { stopPresentation, setupPresentationButton } from './presentation.js';
import { displayTable } from './table.js';
import { setupSearch, filterTable, latestSearchTerm, latestFilteredData } from './search.js';
import { updateMapLayer } from './updateMap.js';
import { layer1 } from '../cfg/mapConfig.js'; 
import { csvData, geojsonData } from '../main.js';
import { layerConfigs } from '../cfg/layerConfigs.js';

export function updateLayers(selectedLayer, map, csvFeatures, geojsonFeatures) {
    map.getLayers().clear();
    map.addLayer(layer1); 

    const config = layerConfigs[selectedLayer];

    if (!config) {
        console.warn(`Неизвестный слой: ${selectedLayer}`);
        return;
    }

    const features = config.features(selectedLayer === 'layer1' ? geojsonFeatures : csvFeatures); 
    const data = config.data(); 

    updateMapLayer(map, features, selectedLayer, config.icon);
    map.getView().setCenter(config.view.center);
    map.getView().setZoom(config.view.zoom);

    stopPresentation(map);

    const filterData = latestSearchTerm ? (selectedLayer === 'layer1' ? latestFilteredData.layer1 : latestFilteredData.layer2) : data;

    if (latestSearchTerm) {
        const { filteredGeojsonData, filteredCsvData } = filterTable(
            latestSearchTerm,
            selectedLayer,
            map,
            geojsonData,
            csvData
        );

        if (selectedLayer === 'layer1') {
            latestFilteredData.layer1 = filteredGeojsonData;
        } else if (selectedLayer === 'layer2') {
            latestFilteredData.layer2 = filteredCsvData;
        }

        setupPresentationButton(selectedLayer, config.data(), map);
        displayTable(selectedLayer, filterData, map);
    } else {
        setupPresentationButton(selectedLayer, data, map);
        displayTable(selectedLayer, data, map);
    }
    setupSearch(selectedLayer, map, geojsonData, csvData);
}