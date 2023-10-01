import { MapContainer, Marker, TileLayer } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const customIcon = new Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/128/9384/9384815.png',
  iconSize: [38, 38]
})


export default function Map({ center }) {

  return (
    <MapContainer 
      center={ center || [51, -0.09]} 
      zoom={center ? 4 : 2} 
      // scrollWheelZoom={false} 
      className="h-[35vh] rounded-lg"
    >
      <TileLayer
        url={url}
        attribution={attribution}
      />
      {center && (
        <Marker position={center} icon={customIcon} />
      )}
    </MapContainer>
  );
}