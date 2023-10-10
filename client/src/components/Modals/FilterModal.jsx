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

const MIN_PRICE = 10;
const MAX_PRICE = 150;


export default function FilterModal () {
  const { isFilterModalOpen, setIsFilterModalOpen } = useContext(ModalContext);
  const [places, setPlaces] = useState([1, 2, 3]);

  const [prices, setPrices] = useState([MIN_PRICE, MAX_PRICE]);
  const [bedrooms, setBedrooms] = useState(0);
  const [beds, setBeds] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);

  const [amenities, setAmenities] = useState([]);

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

  console.log(amenities);

  const bodyContent = (
    <div className="w-full px-12 md:px-6 m-auto h-[500px] overflow-y-scroll">
      {/* PRICE RANGE */}
      <div>
        <Heading
          title="Price range"
        />
        <div>
          <div className="my-6">
            <ReactSlider value={prices} min={MIN_PRICE} max={MAX_PRICE} onChange={setPrices} />
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