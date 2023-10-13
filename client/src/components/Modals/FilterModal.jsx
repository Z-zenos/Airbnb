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

const MIN_PRICE = 10;
const MAX_PRICE = 250;
const PLACE_TYPE = ['any type', 'room', 'entire home'];

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

export default function FilterModal () {
  const { isFilterModalOpen, setIsFilterModalOpen } = useContext(ModalContext);
  const [places, setPlaces] = useState([]);
  const [prices, setPrices] = useState([MIN_PRICE, MAX_PRICE]);
  const [bedrooms, setBedrooms] = useState(0);
  const [beds, setBeds] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [amenities, setAmenities] = useState([]);
  const [placeType, setPlaceType] = useState(PLACE_TYPE[0]);
  const [bookingOptions, setBookingOptions] = useState(BOOKING_OPTIONS);

  const amenitiesTracker = JSON.stringify(amenities);

  useEffect(() => {
    (async () => {
      const resp = await axios.get('/amenities');
      setAmenities(resp.data.data.amenitys.map(a => ({
        name: a.name,
        id: a.id,
        selected: false
      })));
    })();
  }, []);

  function handleSubmit() { }

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
    console.log(bookingOption);
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

  function handleFilters() {
    (async () => {
      try {

        const bedroomsQuery = !bedrooms ? '' : `&bedrooms${bedrooms < 8 ? `=` : `[gte]=`}${bedrooms}`;
        const bedsQuery = !beds ? '' : `&beds${beds < 8 ? `=` : `[gte]=`}${beds}`;
        const bathroomsQuery = !bathrooms ? '' : `&bathrooms${bathrooms < 8 ? `=` : `[gte]=`}${bathrooms}`;
        const priceQuery = prices[0] === prices[1] ? `price=${prices[0]}` : `price[gte]=${prices[0]}&price[lte]=${prices[1]}`;
        const selectedAmenities = amenities.filter(a => a.selected === true);
        const amenitiesQuery = selectedAmenities.length ? `&${selectedAmenities.map(a => 'amenities=' + a.id).join('&')}` : '';

        const queryStr = `${priceQuery}${bedroomsQuery}${bathroomsQuery}${bedsQuery}${amenitiesQuery}`;

        const res = await axios.get(`/places?${queryStr}`);
        setPlaces(res.data.data.places);
      } catch (err) {
        console.error(err);
      }
    })();
  }

  useEffect(handleFilters, [bedrooms, beds, amenitiesTracker, bathrooms]);

  const bodyContent = (
    <div className="w-full px-12 md:px-6 m-auto h-[500px] overflow-y-scroll">
      {/* PLACE TYPE */}
      <div>
        <Heading
          title="Type of place"
          subtitle="Search rooms, entire homes and more. Nightly prices don't include fees or taxes."
        />
        <div className="grid grid-cols-3 px-8 py-5 text-center">
          { PLACE_TYPE.map((pt, i) => (
            <div 
              key={pt} 
              className={`
                border border-gray-300 cursor-pointer py-4 
                transition-all font-medium
                ${pt === 'any type' ? 'rounded-tl-xl rounded-bl-xl' : ''}
                ${pt === 'entire home' ? 'rounded-tr-xl rounded-br-xl': ''}
                ${i === 1 ? 'border-x-0' : ''}
                ${pt === placeType ? 'text-white shadow-[rgb(0,_0,_0)_0px_2px_8px_0px_inset] bg-[rgb(34,34,34)] bg-[linear-gradient(rgba(255,255,255,0.16),rgba(255,255,255,0))] border-[rgb(34,34,34)]' : ''}
              `} 
              onClick={() => handleSelectPlaceType(pt)}
            >
              <p className="text-md">{pt}</p>
              <p className="text-sm opacity-70">$127 avg</p>
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
      onSubmit={handleSubmit}
      title="Filters"
      actionLabel={`Show ${places.length} places`}
      secondaryActionLabel="Clear all"
      secondaryAction={handleClearAll}
      body={bodyContent}
    />
  );
}