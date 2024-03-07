import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Popup, Marker } from 'react-leaflet';
import { divIcon, point, Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FullscreenControl } from 'react-leaflet-fullscreen';
import MarkerClusterGroup from 'react-leaflet-cluster';
import axios from 'axios';
import WCIcon from "../assets/wc.png";
import BuvetteIcon from "../assets/bar.png"; // import de l'icône pour les buvettes
import SceneIcon from "../assets/scene.png"; // import de l'icône pour les scènes
import "../../src/css/map.css"; // * importation du fichier css concerts, style

const WCMarkerIcon = new Icon({
  iconUrl: WCIcon,
  iconSize: [38, 38],//  l'icône pour les wc
});

const BuvetteMarkerIcon = new Icon({ //  l'icône pour les buvettes
  iconUrl: BuvetteIcon,
  iconSize: [38, 38],
});

const SceneMarkerIcon = new Icon({ //  l'icône pour les scènes
  iconUrl: SceneIcon,
  iconSize: [38, 38],
});


const sceneMarkers = [ // tableau markers
  {
    geocode: [48.9000, 2.1000], // géocode latitude + longitude 
    id : 794,
  },
  {
    geocode: [48.9113, 2.0869],
    id : 796,
  },
  {
    geocode: [48.8606, 2.2353],
    id: 792,
  },
  
  {
    geocode: [48.8465, 2.2204],
    id: 790,
  },
  {
    geocode: [48.8566, 2.3522],
    id:788,
  },

];

const markershop= [
  {
    geocode: [48.9000, 2.1000],
    id: 804,
  },
  {
    geocode: [48.9113, 2.0869],
    id: 806,
  },
  {
    geocode: [48.8606, 2.2353],
    id: 802,  },
  {
    geocode: [48.8465, 2.2204],
    id: 800,   },
  {
    geocode: [48.8566, 2.3522],
    id: 798,  },

];

const markerwc= [
  {
    geocode: [48.9000, 2.1000],
    id: 814,
  },
  {
    geocode: [48.9113, 2.0869],
    id: 796,
  },
  {
    geocode: [48.8606, 2.2353],
    id: 812,
  },
  {
    geocode: [48.8465, 2.2204],
    id: 810,
  },
  {
    geocode: [48.8566, 2.3522],
    id: 808,
  },

];

const CustomMap = () => {
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef(null);
  const [markerWC, setMarkerWC] = useState([]);
  const [markerBuvettes, setMarkerBuvettes] = useState([]);
  const [markerScenes, setMarkerScenes] = useState([]);

  const username = 'tom';
  const password = 'Petitcalvejunior2025!!$$';
  const apiUrl = 'https://sonosound.online/wp-json/wp/v2/posts?per_page=100';
  const proxyUrl = '/proxy?url=';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const basicAuth = btoa(`${username}:${password}`);
        const response = await axios.get(`${proxyUrl}${encodeURIComponent(apiUrl)}`, {
          headers: {
            Authorization: `Basic ${basicAuth}`
          }
        });
        const data = response.data;

        const filteredWC = data.filter(article => [814, 796, 812, 810, 808].includes(article.id));
        const filteredBuvettes = data.filter(article => [804, 806, 802, 800, 798].includes(article.id));
        const filteredScenes = data.filter(article => [796, 794, 792, 790, 788].includes(article.id));

        const wcMarkers = filteredWC.map(wc => ({
          geocode: [wc.latitude, wc.longitude],
          popUp: wc.nom,
        }));

        const buvetteMarkers = filteredBuvettes.map(buvette => ({
          geocode: [buvette.latitude, buvette.longitude],
          popUp: buvette.nom,
        }));

        const sceneMarkers = filteredScenes.map(scene => ({
          geocode: [scene.latitude, scene.longitude],
          popUp: scene.nom,
        }));

        setMarkerWC(wcMarkers);
        setMarkerBuvettes(buvetteMarkers);
        setMarkerScenes(sceneMarkers);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    fetchData();
  }, []);

  const handleLocationFound = (e) => {
    setUserLocation(e.latlng);
  };

  const locateUser = () => {
    mapRef.current.locate({setView: true});
  };

  const createClusterCustomIcon = function (cluster) {
    return new divIcon({
      html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
      className: 'custom-marker-cluster',
      iconSize: point(33, 33, true),
    });
  };

  return (
    <div className="map-container">
      <h1 className="titlemap">CARTE DU FESTIVAL</h1>
      <MapContainer
        center={[48.9000, 2.1000]}
        zoom={7}
        style={{ height: '500px' }}
        ref={mapRef}
        onLocationfound={handleLocationFound}
      >
        <TileLayer
          attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.mapbox.com">MapBox</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {userLocation && <Marker position={userLocation}><Popup>Votre position actuelle</Popup></Marker>}
        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterCustomIcon}
        >
          {markerWC.map((marker, index) => (
            <Marker key={index} position={marker.geocode} icon={WCMarkerIcon}>
              <Popup>{marker.popUp}</Popup>
            </Marker>
          ))}

          {markerBuvettes.map((marker, index) => (
            <Marker key={index} position={marker.geocode} icon={BuvetteMarkerIcon}>
              <Popup>{marker.popUp}</Popup>
            </Marker>
          ))}

          {markerScenes.map((marker, index) => (
            <Marker key={index} position={marker.geocode} icon={SceneMarkerIcon}>
              <Popup>{marker.popUp}</Popup>
            </Marker>
          ))}

        </MarkerClusterGroup>
        <FullscreenControl position="topright" aria-hidden="true">  </FullscreenControl>
        <button className="locationbuttonMap" onClick={locateUser}>
          Se géolocaliser
        </button>
      </MapContainer>
    </div>
  );
};

export default CustomMap;
