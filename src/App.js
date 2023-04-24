import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

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

    //initialise the map
    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/alidug/cldiebbv4003j01p60bnp4c40',
            center: [lng, lat],
            zoom: zoom
        });
    });
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
