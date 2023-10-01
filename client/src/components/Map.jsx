import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const customIcon = new Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/128/9384/9384815.png',
  iconSize: [38, 38]
});


function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default function Map({ country, center = [0,0] }) {

  return (
    <MapContainer 
      center={ center || [51, -0.09]} 
      zoom={center ? 4 : 2} 
      // scrollWheelZoom={false} 
      className="h-[35vh] rounded-lg"
    >
      <ChangeView center={center} zoom={4} />
      <TileLayer
        url={url}
        attribution={attribution}
      />
      {center && (
        <Marker position={center} icon={customIcon} >
          <Popup>{country}</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}