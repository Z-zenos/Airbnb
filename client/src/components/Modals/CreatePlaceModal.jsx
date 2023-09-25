
import { useEffect, useMemo, useState } from "react";
import Modal from "./Modal";
import Heading from "../Heading/Heading";
import axios from "axios";
import capitalizeFirstLetter from "../../utils/capitalizeFirstLetter";

const STEPS = {
  CATEGORY: 0,
  LOCATION: 1,
  INFO: 2,
  IMAGES: 3,
  DESCRIPTION: 4,
  PRICE: 5
};


export default function CreatePlaceModal() {
  const [open, setOpen] = useState(true);
  const [step, setStep] = useState(STEPS['CATEGORY']);
  

  function onNext() {
    setStep(prevStep => prevStep + 1);
  }

  function onBack() {
    setStep(prevStep => prevStep - 1);
  }

  const actionLabel = useMemo(() => {
    if(step === STEPS['PRICE'])
      return 'Create';

    return 'Next';
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if(step === STEPS['CATEGORY'])
      return undefined;

    return 'Back';
  }, [step]);

  const [placeTypeList, setPlaceTypeList] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/places/place-types');


        setPlaceTypeList(() => res.data.data.placeTypeList.map(pt => ({
          id: pt.id,
          name: capitalizeFirstLetter(pt.name),
          src: `http://localhost:3000/images/place_types/${pt.iconImage}` 
        })));

      } catch (err) {
        console.error(err);
      }
    })();
  }, []); 

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Which of these best describes your place?"
        subtitle="Pick a category"
      />

      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto"
      >
        { placeTypeList.length && placeTypeList.map((pt, i) => (
          <div key={pt.name + i} className="col-span-1">
            {pt.name}
          </div>
        )) }
      </div>
    </div>
  );

  return (
    <Modal 
      isOpen={open} 
      onClose={() => setOpen(false)} 
      title="Airbnb your home!"
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS['CATEGORY'] ? undefined : onBack}
      body={bodyContent}
    />
  );
}