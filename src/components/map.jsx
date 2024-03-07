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


const sceneMarkers = [  // géocode latitude + longitude 
  {
    geocode: [48.9098, 2.0917],  // geocode Scène 5 - Golf Saint germain -  Route de Poissy - 78100 Saint-Germain-en-Laye'
    id : 845, 
  },
  {
    geocode: [48.8989, 2.0936], // Scène 4 - 1 Pl. Charles de Gaulle, 78100 Saint-Germain-en-Laye
    id : 843, 
  },
  {
    geocode: [48.8768, 2.2577], // Scène 3 - Bois de Boulogne - 75016 Paris
    id: 838,
  },
  
  {
    geocode: [48.8458, 2.2233], // Scène 2 - Parc de Saint-Cloud - 92210 Saint-Cloud France
    id: 834,
  },
  {
    geocode: [48.8566, 2.3522], // Scène 1 (principal) - Hôtel de Ville 5 Rue de Lobau - 75004 Paris
    id:836, 
  },
];

const markershop= [ // géocode latitude + longitude 
  {
    geocode: [48.9098, 2.0917],// geocode Scène 5 - Golf Saint germain -  Route de Poissy - 78100 Saint-Germain-en-Laye'
    id: 855,

  },
  {
    geocode: [48.8989, 2.0936], // Scène 4 - 1 Pl. Charles de Gaulle, 78100 Saint-Germain-en-Laye
    id: 853,
  },
  {
    geocode: [48.8768, 2.2577], // Scène 3 - Bois de Boulogne - 75016 Paris
    id: 849,  },
  {
    geocode: [48.8458, 2.2233], // Scène 2 - Parc de Saint-Cloud - 92210 Saint-Cloud France
    id: 847,   },
  {
    geocode: [48.8566, 2.3522], // Scène 1 (principal) - Hôtel de Ville 5 Rue de Lobau - 75004 Paris
    id: 832,  }, // id hotel de ville 

];

const markerwc= [// géocode latitude + longitude 
  {
    geocode: [48.9098, 2.0917], // geocode Scène 5 - Golf Saint germain -  Route de Poissy - 78100 Saint-Germain-en-Laye'
    id: 865,
  },
  {
    geocode: [48.8989, 2.0936], // Scène 4 - 1 Pl. Charles de Gaulle, 78100 Saint-Germain-en-Laye
    id: 863,
  },
  {
    geocode: [48.8768, 2.2577], // Scène 3 - Bois de Boulogne - 75016 Paris
    id: 861,
  },
  {
    geocode: [48.8458, 2.2233],// Scène 2 - Parc de Saint-Cloud - 92210 Saint-Cloud France
    id: 859,
  },
  {
    geocode: [48.8566, 2.3522], // Scène 1 (principal) - Hôtel de Ville 5 Rue de Lobau - 75004 Paris
    id: 857, // id hotel de ville 
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

        const filteredWC = data.filter(article => [857, 859, 861, 863, 865].includes(article.id));
        const filteredBuvettes = data.filter(article => [832, 847, 849, 853, 855].includes(article.id));
        const filteredScenes = data.filter(article => [836, 834, 838, 843, 845].includes(article.id));

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
