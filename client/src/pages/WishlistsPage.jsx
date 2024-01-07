import { useContext, useEffect, useState } from "react";
import Map from "../components/Map";
import { IntlContext } from "../contexts/intl.context";
import axios from "axios";
import PlaceCard from "../components/PlaceCard/PlaceCard";
import PlaceCardSkeleton from "../components/PlaceCard/PlaceCardSkeleton";

export default function WishlistsPage() {
  const [favoritePlaces, setFavorritePlaces] = useState([]);
  const { exchangeRate } = useContext(IntlContext);
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState();

  useEffect(() => {
    (async() => {
      try {
        setLoading(true);
        const res = await axios.get(`/users/wishlists`);

        const places = res.data.data.places.map(place => ({ 
          ...place, 
          price: exchangeRate(place.price), 
          price_discount: exchangeRate(place.price_discount),
          price_diff: exchangeRate(place.price - Math.trunc(place.price * place.price_discount))
        }))

        setFavorritePlaces(places);
        setSelectedPlace({
          address: places[0].location.address,
          price: places[0].price,
          id: places[0].id,
          image_cover: places[0].image_cover,
          coordinate: places[0].location.coordinates,
          name: places[0].name,
          rating: places[0].average_ratings,
        });

        setLoading(false);
  
      } catch (err) {
        console.error(err);
        setLoading(false);
      } 
    })();
  }, []);

  return (
    <div className="lg:mt-0 w-full">
      <div className="grid lg:grid-cols-5 md:grid-cols-2 h-full">
        <div className="lg:col-span-3 md:col-span-1 overflow-y-scroll py-6">
          <div className={`lg:px-10 md:px-10 grid place-items-center md:gap-1 2xl:grid-cols-3 md:grid-cols-1 lg:grid-cols-2`}>
            { favoritePlaces.length > 0 &&
              favoritePlaces.map((place) =>
                <div key={place.id}>
                  <PlaceCard hasShowOnMapIcon={true} showOnMap={setSelectedPlace} place={place} />
                </div> 
              ) 
            }
            
            { loading && <PlaceCardSkeleton cards={6} /> }
            { (!loading && !favoritePlaces.length) && <div className=" col-span-10 text-3xl opacity-70 font-bold text-center py-[250px]">No results</div> }
          </div>
        </div>
        <div className="lg:col-span-2 md:col-span-1">
          <div className="h-full border-l pl-1 border-l-primary">
            <Map 
              locations={favoritePlaces.length ? favoritePlaces?.map(fplace => ({
                address: fplace.location.address,
                price: fplace.price,
                id: fplace.id,
                image_cover: fplace.image_cover,
                coordinate: fplace.location.coordinates,
                name: fplace.name,
                rating: fplace.average_ratings,
              })) : undefined} 
              spotPlace={selectedPlace}
              className="h-full" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}