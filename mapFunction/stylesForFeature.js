export function createVectorLayer(features,icon) {
    const vectorSource = new ol.source.Vector({
        features: features
    });

    const clusterSource = new ol.source.Cluster({
        distance: 30,
        source: vectorSource
    });

    const vectorLayer = new ol.layer.Vector({
        source: clusterSource,
        style: function(feature) {
            const features = feature.get("features");
            let iconClaster, colornum, position, fonttext;
            if (icon === 'img/metropoint.png'){
                iconClaster = 'img/metro.png';
                colornum = "black";
                position = 5;
                fonttext = '14px sans-serif';
            } else {
                iconClaster = 'img/point.png';
                colornum = "aliceblue";
                position = -11;
                fonttext = '12px sans-serif';
            };
           if (features && features.length > 1) {
                const size = features.length;
                let style;
                    style = new ol.style.Style({
                        image: new ol.style.Icon({
                            anchor: [0.5, 46],
                            anchorXUnits: "fraction",
                            anchorYUnits: "pixels",
                            src: iconClaster
                        }),
                        text: new ol.style.Text({
                            text: size.toString(),
                            fill: new ol.style.Fill({
                                color: colornum
                            }),
                            font: fonttext,
                            offsetY: position 
                        })
                    });
                return style;
           } else {
                return new ol.style.Style({
                    image: new ol.style.Icon({
                        anchor: [0.5, 46],
                        anchorXUnits: "fraction",
                        anchorYUnits: "pixels",
                        src: icon
                    })
                });
           }
        }
    });
    return vectorLayer;
}