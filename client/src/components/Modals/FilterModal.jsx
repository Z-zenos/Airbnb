import { useContext, useEffect, useState } from "react";
import { ModalContext } from "../../contexts/modal.context";
import Modal from "./Modal";
import Heading from "../Heading/Heading";
import Input from "../Input/Input";
import { AiOutlineLine } from "react-icons/ai";
import ReactSlider from "react-slider";
import QuantityChoice from "../Input/QuantityChoice";
import axios from "axios";
import Checkbox from "../Input/Checkbox";
import ToggleButton from "../Button/ToggleButton";
import { createSearchParams, useLocation, useNavigate, useSearchParams } from "react-router-dom";

const MIN_PRICE = 10;
const MAX_PRICE = 1000;

const BOOKING_OPTIONS = [
  {
    title: "Allow pets",
    description: "Bringing a service animal?",
    selected: false,
    param: 'pets_allowed',
  },
  {
    title: "Host Parties",
    description: "Now the party don't start til I walk in.",
    selected: false,
    param: 'events_allowed'
  },
  {
    title: "Commercial photography and filming",
    description: "Require additional insurance, film releases and a fee negotiated on the nature of the project",
    param: 'commercial_photography_and_filming_allowed',
    selected: false,
  },
];

export default function FilterModal ({ setFilterCriteriaNumber }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isFilterModalOpen, setIsFilterModalOpen } = useContext(ModalContext);
  const [filteredPlaces, setFilteredPlaces] = useState(0);
  const [prices, setPrices] = useState([+searchParams.get('price[gte]') ||  MIN_PRICE, +searchParams.get('price[lte]') || MAX_PRICE]);
  const [bedrooms, setBedrooms] = useState(+searchParams.get('bedrooms') || 0);
  const [beds, setBeds] = useState(+searchParams.get('beds') || 0);
  const [bathrooms, setBathrooms] = useState(+searchParams.get('bathrooms') || 0);
  const [amenities, setAmenities] = useState([]);
  const [placeType, setPlaceType] = useState(searchParams.get('place_type') || 'any type');
  const [bookingOptions, setBookingOptions] = useState(BOOKING_OPTIONS.map(
    bo => ({
      ...bo, 
      selected: searchParams.get(bo.param) || false
    })
  ));

  const [placeTypes, setPlaceTypes] = useState([]);
  const [query, setQuery] = useState("");

  const amenitiesTracker = JSON.stringify(amenities);
  const bookingOptionsTracker = JSON.stringify(bookingOptions);

  useEffect(() => {
    (async () => {
      const resp = await axios.get('/amenities');
      const selectedAmenities = searchParams.getAll(['amenities']);
      setAmenities(resp.data.data.amenitys.map(a => ({
        name: a.name,
        id: a.id,
        selected: selectedAmenities.includes(a.id)
      })));

      const respAvgPricesByPlaceType = await axios.get('places/average-price-by-place-type');
      setPlaceTypes(respAvgPricesByPlaceType.data.data.averages.filter(avg => avg.type !== 'shared room'));
    })();
  }, []);

  function handleClearAll() {}

  function handleChangeMinimumPrice(ev) {
    let price = +ev.target.value;
    setPrices([price ? price : '', prices[1]]);
  }

  function handleBlurMinimumPrice(ev) {
    let price = +ev.target.value;
    if(!price || price < MIN_PRICE) setPrices([MIN_PRICE, prices[1]]);
    if(price > MAX_PRICE) setPrices([prices[1], prices[1]]);
  }

  function handleChangeMaximumPrice(ev) {
    let price = +ev.target.value;
    setPrices([prices[0], price ? price : '']);
  }

  function handleBlurMaximumPrice(ev) {
    let price = +ev.target.value;
    if(!price || price > MAX_PRICE) setPrices([prices[0], MAX_PRICE]);
    if(price < prices[0]) setPrices([prices[0], prices[0]]);
  }

  function handleSelectAmenity(selected, i) {
    let tmp = amenities[i];
    tmp.selected = !selected;
    let amenitiesClone = [...amenities];
    amenitiesClone[i] = tmp;
    setAmenities([...amenitiesClone]);
  }

  function handleSelectPlaceType(type) {
    setPlaceType(type);
  }

  function handleToggleBookingOptions(bookingOption) {
    const bookingOptionIndex = bookingOptions.findIndex(bo => bo.title === bookingOption.title);

    const tmpBookingOptions = [...bookingOptions];

    tmpBookingOptions.splice(bookingOptionIndex, 1);

    if(!bookingOptionIndex) 
      tmpBookingOptions.unshift({
        ...bookingOption,
        selected: !bookingOption.selected
      });
    else tmpBookingOptions.splice(bookingOptionIndex, 0, {
      ...bookingOption,
      selected: !bookingOption.selected
    });

    setBookingOptions(() => tmpBookingOptions);
  }

  function removeDuplicateSearchParams(query) {
    let queryObj = {};
    Array.from(new URLSearchParams(query).entries()).forEach(([key, value]) => {
      if(!queryObj[key]) queryObj[key] = value;
      else {
        if(!Array.isArray(queryObj[key])) queryObj[key] = [queryObj[key], value];
        else queryObj[key] = [...queryObj[key], value];
      } 
    });

    queryObj = { ...Object.fromEntries([...searchParams]), ...queryObj };
    console.log(queryObj);
    return queryObj;
  }

  function handleUpdatePlacesIndexPage() {
    const options = {
      pathname: location.pathname !== '/' ? location.pathname : '/places',
      search: `?${createSearchParams(removeDuplicateSearchParams(query))}`
    };

    navigate(options, { replace: true });
    setFilterCriteriaNumber(query.split('&').length);
    setIsFilterModalOpen(false);
  }

  function handleFilters() {
    (async () => {
      try {
        const placeTypeQuery = placeType === 'any type' ? '' : `&place_type=${placeType}`;
        const bedroomsQuery = !bedrooms ? '' : `&bedrooms${bedrooms < 8 ? `=` : `[gte]=`}${bedrooms}`;
        const bedsQuery = !beds ? '' : `&beds${beds < 8 ? `=` : `[gte]=`}${beds}`;
        const bathroomsQuery = !bathrooms ? '' : `&bathrooms${bathrooms < 8 ? `=` : `[gte]=`}${bathrooms}`;
        const priceQuery = prices[0] === prices[1] ? `price=${prices[0]}` : `price[gte]=${prices[0]}&price[lte]=${prices[1]}`;
        const selectedAmenities = amenities.filter(a => a.selected === true);
        const amenitiesQuery = selectedAmenities.length ? `&${selectedAmenities.map(a => 'amenities=' + a.id).join('&')}` : '';
        const bookingOptionsQuery = bookingOptions.filter(bo => bo.selected).map(b => `&${b.param}=true`).join('');

        let queryStr = `${priceQuery}${bedroomsQuery}${bathroomsQuery}${bedsQuery}${amenitiesQuery}${placeTypeQuery}${bookingOptionsQuery}`;
        setQuery(queryStr);


        const res = await axios.get(`places/count-place?${createSearchParams(removeDuplicateSearchParams(queryStr))}`);
        setFilteredPlaces(res.data.count);
      } catch (err) {
        console.error(err);
      }
    })();
  }

  useEffect(handleFilters, [bedrooms, beds, amenitiesTracker, bathrooms, placeType, bookingOptionsTracker]);

  const bodyContent = (
    <div className="w-full px-12 md:px-6 m-auto h-[500px] overflow-y-scroll">
      {/* PLACE TYPE */}
      <div>
        <Heading
          title="Type of place"
          subtitle="Search rooms, entire homes and more. Nightly prices don't include fees or taxes."
        />
        <div className="grid grid-cols-3 px-8 py-5 text-center">
          { placeTypes.map((pt, i) => (
            <div 
              key={pt.type} 
              className={`
                border border-gray-300 cursor-pointer py-4 
                transition-all font-medium
                ${pt.type === 'room' ? 'rounded-tl-xl rounded-bl-xl' : ''}
                ${pt.type === 'any type' ? 'rounded-tr-xl rounded-br-xl': ''}
                ${i === 1 ? 'border-x-0' : ''}
                ${pt.type === placeType ? 'text-white shadow-[rgb(0,_0,_0)_0px_2px_8px_0px_inset] bg-[rgb(34,34,34)] bg-[linear-gradient(rgba(255,255,255,0.16),rgba(255,255,255,0))] border-[rgb(34,34,34)]' : ''}
              `} 
              onClick={() => handleSelectPlaceType(pt.type)}
            >
              <p className="text-md">{pt.type}</p>
              <p className="text-sm opacity-70">${pt.avg} avg</p>
            </div>
          )) }
        </div>

        <hr className="my-6" />
      </div>

      {/* PRICE RANGE */}
      <div>
        <Heading
          title="Price range"
        />
        <div>
          <div className="my-6">
            <ReactSlider value={prices} min={MIN_PRICE} max={MAX_PRICE} onChange={setPrices} onAfterChange={handleFilters} />
          </div>
          <div className="flex justify-between gap-3 items-center">
            <Input label="Minimum" value={prices[0]} beforeText="$" className="rounded-lg" onChange={handleChangeMinimumPrice} onBlur={handleBlurMinimumPrice} />
            <AiOutlineLine />
            <Input label="Maximum" value={prices[1]} beforeText="$" className="rounded-lg" onChange={handleChangeMaximumPrice} onBlur={handleBlurMaximumPrice} />
          </div>
        </div>

        <hr className="my-6" />
      </div>

      {/* ROOMS AND BEDS */}
      <div>
        <Heading
          title="Room and beds"
        />
        <div>
          <div className="my-4">
            <p className="font-light">Bedrooms</p>
            <QuantityChoice max={8} value={bedrooms} onClick={setBedrooms} />
          </div>
          <div className="my-4">
            <p className="font-light">Beds</p>
            <QuantityChoice max={8} value={beds} onClick={setBeds} />
          </div>
          <div className="my-4">
            <p className="font-light">Bathrooms</p>
            <QuantityChoice max={8} value={bathrooms} onClick={setBathrooms} />
          </div>
        </div>

        <hr className="my-6" />
      </div>

      {/* AMENITIES */}
      <div>
        <Heading
          title="Amenities"
        />
        <div className="grid grid-cols-2">
          { amenities.length > 0 && amenities.map(
            ({ name, id, selected }, i) => <Checkbox key={id} label={name} checked={selected} onChange={() => handleSelectAmenity(selected, i)} />
          )}
        </div>
        <hr className="my-6" />
      </div>

      {/* BOOKING OPTIONS */}
      <div>
        <Heading
          title="Booking options"
        />
        <div className="py-3">
          { bookingOptions.map(bo => (
            <div key={bo.title} className="grid gap-8 grid-cols-12 items-center my-4">
              <div className=" col-span-10">
                <p className="font-light">{bo.title}</p>
                <p className="font-medium text-sm opacity-50">{bo.description}</p>
              </div>

              <div className="col-span-1">
                <ToggleButton selected={bo.selected} onClick={() => handleToggleBookingOptions(bo)} />
              </div>
            </div>
          ))  }

        </div>
        <hr className="mt-6" />
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isFilterModalOpen} 
      onClose={() => setIsFilterModalOpen(false)} 
      onSubmit={handleUpdatePlacesIndexPage}
      title="Filters"
      actionLabel={`Show ${filteredPlaces} places`}
      secondaryActionLabel="Clear all"
      secondaryAction={handleClearAll}
      body={bodyContent}
    />
  );
}