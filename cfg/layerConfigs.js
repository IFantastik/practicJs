import { csvData, geojsonData } from "../main.js";

export const layerConfigs = {
    'layer1': {
        features: geojsonFeatures => geojsonFeatures,
        data: () => geojsonData,
        view: {
            center: ol.proj.fromLonLat([-77.1, 38.9]),
            zoom: 8
        },
        icon: 'point.png'
    },
    'layer2': {
        features: csvFeatures => csvFeatures, 
        data: () => csvData,
        view: { 
            center: ol.proj.fromLonLat([37.6, 55.7]),
            zoom: 9
        },
        icon: 'metropoint.png'
    }
};