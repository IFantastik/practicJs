import { createVectorLayer } from './stylesForFeature.js';

let currentVectorLayer = null;

export { currentVectorLayer };

export function updateMapLayer(map, features, selectedLayer) {
    if (currentVectorLayer) {
        map.removeLayer(currentVectorLayer);
    }

    if (features && features.length > 0) {
        let icon = 'img/point.png'; 
        if (selectedLayer === 'layer2') {
            icon = 'img/metropoint.png';
        }
        currentVectorLayer = createVectorLayer(features, icon);
        map.addLayer(currentVectorLayer);
    }
}