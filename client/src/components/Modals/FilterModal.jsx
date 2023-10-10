import { useContext, useState } from "react";
import { ModalContext } from "../../contexts/modal.context";
import Modal from "./Modal";
import Heading from "../Heading/Heading";
import Input from "../Input/Input";
import { AiOutlineLine } from "react-icons/ai";
import ReactSlider from "react-slider";

const MIN_PRICE = 10;
const MAX_PRICE = 150;


export default function FilterModal () {
  const { isFilterModalOpen, setIsFilterModalOpen } = useContext(ModalContext);
  const [places, setPlaces] = useState([1, 2, 3]);

  const [prices, setPrices] = useState([MIN_PRICE, MAX_PRICE]);

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

  const bodyContent = (
    <div>
      <div>
        <Heading
          title="Price range"
        />
        
        <div>
          <div className="my-6">
            <ReactSlider value={prices} min={MIN_PRICE} max={MAX_PRICE} onChange={setPrices} />
          </div>
          <div className="flex justify-between items-center">
            <Input label="Minimum" value={prices[0]} beforeText="$" className="rounded-lg" onChange={handleChangeMinimumPrice} onBlur={handleBlurMinimumPrice} />
            <AiOutlineLine />
            <Input label="Maximum" value={prices[1]} beforeText="$" className="rounded-lg" onChange={handleChangeMaximumPrice} onBlur={handleBlurMaximumPrice} />
          </div>
        </div>

        <hr className="my-4" />
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