export const layer1 = new ol.layer.Tile({
    source: new ol.source.OSM()
});

export const layer1View = {
    center: ol.proj.fromLonLat([-77.1, 38.9]),
    zoom: 8
};
