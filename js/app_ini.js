function doMap(){
    /*
    http://leaflet-extras.github.io/leaflet-providers/preview/
    */
    window.map = L.map('map',{
        center: [41, 0],
        zoom: 3,
        minZoom:3,
        zoomControl:false
    });
    
    var Esri_WorldTerrain = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS',
        maxZoom: 13
    });

    var OpenMapSurfer_Grayscale = L.tileLayer('https://korona.geog.uni-heidelberg.de/tiles/roadsg/x={x}&y={y}&z={z}', {
        maxZoom: 19,
        attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    
    var Stamen_TonerLite = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 20,
        ext: 'png'
    });
    var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
    
    
    //window.map.addLayer(Stamen_TonerLite);
     window.map.addLayer(OpenTopoMap);
}


window.colors= ['pink', 'cyan', 'yellow','red','lime',  ];
function colorize(labels, colors, p, property){
    
        setInterval(function(){
            if(animate){
                le = $(labels[0]).length
                r = parseInt(Math.random()*le);
                color = colors[parseInt(Math.random()*colors.length)]
                for(l in labels){
                    $(labels[l]).eq(r).css(property, color)
                }
            }
        }, p);
    
}


function mapColorize(){
    
        setInterval(function(){
            if (animate){
                degrees= Math.random()*360;
                filter = 'contrast(3) hue-rotate('+degrees+'deg) saturate(5)';
                $('img.leaflet-tile.leaflet-tile-loaded').css('filter', filter);
            }
        },1000)  
    
}


function colorRandom(labels, colors, p, property){
    
}


function loadMarkers(){
    Papa.parse("data/portales.csv", {
        download: true,
        header: true,
        //step: function(row) {},
        complete: function(results) {

            var myIcon  = L.divIcon({className: 'my-div-icon'});

            var LeafIcon = new L.Icon({
                    iconUrl: 'img/es16_2_red_f.gif',
                    iconSize:     [150, 150],
                    iconAnchor:   [75, 75],
                    popupAnchor:  [0, 0]
                }
            );

            var myIconStar  = L.divIcon({
                className: 'star-five',
            });

            var markers = L.markerClusterGroup({
                showCoverageOnHover:false,
                maxClusterRadius:80,
                
                iconCreateFunction: function (cluster) {
                    console.log(cluster)
                    var n = cluster.getChildCount();
                    if(n>80){n=80}else if(n<30){n=30};
                    return L.divIcon({ 
                        html: '<div style="line-height:'+n+'px"><span>'+n+'</span></div>', 
                        className: 'leaflet-marker-icon2', 
                        iconSize:L.point(n, n) ,
                        //iconAnchor	:L.point(n/2, n/2) ,
                    });
                },
                

            });

            map.addLayer(markers);

            re = results['data'];

            for(r in re){
                if(re[r]['location']){
                    marker = L.marker(re[r]['location'].split(','), {
                        icon: L.divIcon({className: 'my-div-icon',
                                           html: '<div class="ciutat">'+re[r].name+'</div>'
                                         }), 
                        title: re[r].name,
                    });
                    marker.bindPopup('<a target="_blank" href="'+re[r].url+'">visit: <br>'+re[r].name+'<br>'+re[r].country+'</a>');
                    markers.addLayer(marker);
                };

                if (re[r]['url_api']!='' && re[r]['location']){
                    marker = L.marker(re[r]['location'].split(','), {icon: LeafIcon, title: re[r].name, opacity:0.8,} );
                    url = 'data.html?city='+re[r].name+'&url='+re[r].url_api
                    marker.bindPopup('<a href="'+url+'">'+re[r].name+'<br>BROWSE!</a>');
                    map.addLayer(marker)
                };
            };

            //colorize(['.marker-cluster div'], window.colors, 2, 'background');
            colorize(['.leaflet-marker-icon2'], window.colors, 2, 'background');
            
            colorize(['.my-div-icon'], window.colors, 20, 'background');
            colorize(['#map'], window.colors, 200, 'border-color');
            mapColorize();
        }
        
    });
}


$(document).ready(function () {
    animate = true;
    doMap()
    loadMarkers()
    colorize(['#welcome'], window.colors, 500, 'color');
    
    //colorize(['.leaflet-popup-content-wrapper'], window.colors, 500, 'background');
})
