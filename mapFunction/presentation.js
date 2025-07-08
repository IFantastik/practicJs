let isPresentationRunning = false;
let currentTimeoutId;
let currentPopup = null;

export function startPresentation(selectedLayer, filteredGeojsonData, filteredCsvData, map) { 
    if (!isPresentationRunning) {
        if (!selectedLayer) {
            console.warn('Не выбран слой для презентации.');
            return;
        }

        let data;
        if (selectedLayer === 'layer1') {
            data = filteredGeojsonData || geojsonData; 
        } else if (selectedLayer === 'layer2') {
            data = filteredCsvData || csvData; 
        } else {
            console.warn('Неизвестный слой для презентации.');
            return;
        }

        if (!data || data.length === 0) {
            console.warn('Нет данных для презентации.');
            return;
        }

        isPresentationRunning = true;
        document.getElementById('presentbutton').textContent = 'Остановить презентацию';

        let currentFeatureIndex = 0;
        const view = map.getView();

        function showNextFeature() {
            if (!isPresentationRunning) {
                return;
            }
            if (currentFeatureIndex < data.length) {
                const feature = data[currentFeatureIndex];
                const latitude = parseFloat(feature.latitude);
                const longitude = parseFloat(feature.longitude);

                const coordinates = ol.proj.fromLonLat([longitude, latitude]);

                const popupContent = `<h3>${feature.name_ru || feature.name_en || feature.name || 'Без названия'}</h3>
                                      <p>Широта: ${latitude.toFixed(5)}, Долгота: ${longitude.toFixed(5)}</p>`;
                const popup = new ol.Overlay({
                    element: document.createElement('div'),
                    offset: [10, -10],
                    positioning: 'bottom-left'
                });
                popup.getElement().className = 'ol-popup';
                popup.getElement().innerHTML = popupContent;

                if (currentPopup) {
                    map.removeOverlay(currentPopup);
                }
                currentPopup = popup;

                map.addOverlay(popup);

                view.animate({
                    center: coordinates,
                    zoom: 16,
                    duration: 2000
                }, () => {
                    popup.setPosition(coordinates);
                });

                currentFeatureIndex++;

                currentTimeoutId = setTimeout(showNextFeature, 3500);
            } else {
                alert('Презентация завершена!');
                stopPresentation(map);
            }
        }

        showNextFeature();
    } else {
        stopPresentation(map);
    }
}

export function stopPresentation(map) {
    isPresentationRunning = false;
    clearTimeout(currentTimeoutId);
    if (currentPopup) {
        map.removeOverlay(currentPopup);
        currentPopup = null;
    }
    document.getElementById('presentbutton').textContent = 'Запустить презентацию';
}

export function setupPresentationButton(selectedLayer, filteredGeojsonData, filteredCsvData, map) { 
    const button = document.getElementById('presentbutton');
    button.removeEventListener('click', button.clickHandler);

    const clickHandler = () => {
        startPresentation(selectedLayer, filteredGeojsonData, filteredCsvData, map);
    };

    button.clickHandler = clickHandler;
    button.addEventListener('click', clickHandler);
}
