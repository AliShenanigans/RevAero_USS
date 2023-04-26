import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

//npm install papaparse
import Papa from 'papaparse';

//my map token:
mapboxgl.accessToken = 'pk.eyJ1IjoiYWxpZHVnIiwiYSI6ImNsZTIydjY1cjBtdHYzdm12ZnpvMTZjMWoifQ.-Gc6QMOJQp4BoIYao2_kPg';

//set up a React App:
export default function App() {
    //initial display position of the map:
    const mapContainer = useRef(null);
    const map = useRef(null);

    const [lng, setLng] = useState(140.512155);
    const [lat, setLat] = useState(-20.669637);
    const [zoom, setZoom] = useState(13.19);

    //import waypoints from csv
    const [waypoints, setWaypoints] = useState([]);

  

    //initialise the map
    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/alidug/cldiebbv4003j01p60bnp4c40',
            center: [lng, lat],
            zoom: zoom
        });

        //import the waypoints from your csv
        Papa.parse('https://drive.google.com/file/d/1Er2a_BlLyKQqJ6wzF_jCd8ahfOHAxLIV/view?usp=share_link', {
            download: true,
            header: true,
            complete: (results) => {
                const waypoints = results.data.map((waypoint) => ({
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(waypoint.Latitude), parseFloat(waypoint.Longitude)]
                    },
                    properties: {
                        name: waypoint.Name
                    }
                }));
                console.log("Imported Waypoints:", waypoints); // print the imported waypoints


        
                setWaypoints(waypoints);

                map.current.on('load', () => {
                    map.current.addSource('waypoints', {
                        type: 'geojson',
                        data: {
                            type: 'FeatureCollection',
                            features: waypoints
                        }
                    });

                    map.current.addLayer({
                        id: 'waypoints',
                        type: 'circle',
                        source: 'waypoints',
                        paint: {
                            'circle-color': '#FFA500',
                            'circle-radius': 50,
                            'circle-stroke-width': 1,
                            'circle-stroke-color': '#fff'
                        }
                    });
                });
            }
        });
    }, []);

    //enable interactive map:
    useEffect(() => {
        if (!map.current) return; // wait for map to initialize

        map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        });
    });



    //render map in the app! :
    return (
        <div>
            <div className="sidebar">
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
            </div>
            <div ref={mapContainer} className="map-container" />
        </div>
    );  
}
