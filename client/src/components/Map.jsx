import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMap } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { Link } from 'react-router-dom';
import { AiFillStar } from 'react-icons/ai';

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

export default function Map({ 
  locations = [{
    address: '',
    price: 0,
    id: '',
    image_cover: '',
    coordinate: [0, 0],
    name: '',
    rating: 0,
  }], 
  className,
  spotPlace,
  zoom = 4,
  isDisplayExtraInfoPlace = true,
}) {
  const highlightPlace = spotPlace || locations[0];

  return (
    <MapContainer 
      center={ highlightPlace.coordinate || [51, -0.09]} 
      zoom={highlightPlace.coordinate ? 4 : 2} 
      className={className}
    >
      <ChangeView center={highlightPlace.coordinate} zoom={spotPlace ? 12 : zoom} />
      <TileLayer
        url={url}
        attribution={attribution}
      />
      {  locations.map((location, i) => (
        <Marker key={i} position={location?.coordinate} title={location?.address}  icon={customIcon} >
          { isDisplayExtraInfoPlace && 
            <Popup className=''>
              <Link 
                target="_blank" 
                to={`/places/${location?.id}`} 
                className=' cursor-pointer'
              >
                <img 
                  className='w-full h-[200px] max-h-[200px] rounded-tl-xl rounded-tr-xl ' 
                  src={`http://localhost:3000/images/places/${location?.image_cover}`} 
                />
                <div className='px-4 py-3'>
                  <p 
                    style={{ 
                      fontWeight: '600', 
                      fontSize: '18px', 
                      color: '#000', 
                      margin: '6px 0', 
                      display: 'flex', 
                      justifyContent: 'space-between' 
                    }}
                  >
                    {location?.name.replace(/(.{24})..+/, "$1…")} 
                    <span className='font-light flex items-center gap-1 '>
                      <AiFillStar className='text-yellow-500' /> 
                      {location?.rating}
                    </span>
                  </p>
                  <p 
                    style={{ 
                      margin: '4px 0', 
                      color: 'black', 
                      opacity: '70%' 
                    }}
                  >
                    {location?.address}
                  </p>
                </div>
              </Link>
            </Popup>
          }
          <Tooltip direction="bottom" offset={[0, 0]} opacity={1} permanent>
            <span style={{ fontWeight: '700' }}>$ {location?.price}</span>
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}