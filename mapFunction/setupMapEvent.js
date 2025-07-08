export function setupMapEventListeners(map) { 
    let popup = null;

    map.on('click', function(evt) {
        if (popup) {
            map.removeOverlay(popup);
            popup = null;
        }

        const pixel = evt.pixel;
        const features = [];

        map.forEachFeatureAtPixel(pixel, function(feature) {
            features.push(feature);
        });

        if (features.length > 0) {
            const feature = features[0]; 
            const featuresInCluster = feature.get('features');

            if (featuresInCluster && featuresInCluster.length > 1) {
                const clusterSize = featuresInCluster.length;
                const names = featuresInCluster.map(f => f.get('name_ru') || f.get('name') || f.get('name_en')).join(', ');

                const popupContent = `Кластер содержит ${clusterSize} меток: ${names}`;

                popup = new ol.Overlay({
                    element: document.createElement('div'),
                    offset: [10, -10],
                    positioning: 'bottom-left'
                });
                popup.getElement().className = 'ol-popup';
                popup.getElement().innerHTML = popupContent;
                popup.setPosition(evt.coordinate);
                map.addOverlay(popup);

            } else {
                let name = featuresInCluster && featuresInCluster.length === 1 ?
                    (featuresInCluster[0].get('name_ru') || featuresInCluster[0].get('name') || featuresInCluster[0].get('name_en')) :
                    (feature.get('name_ru') || feature.get('name') || feature.get('name_en'));

                const popupContent = `Метка: ${name}`;

                popup = new ol.Overlay({
                    element: document.createElement('div'),
                    offset: [10, -10],
                    positioning: 'bottom-left'
                });
                popup.getElement().className = 'ol-popup';
                popup.getElement().innerHTML = popupContent;
                popup.setPosition(evt.coordinate); 
                map.addOverlay(popup);
            }
        }
    });
}