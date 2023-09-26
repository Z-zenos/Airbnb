
import { useEffect, useMemo, useState } from "react";
import{useForm} from "react-hook-form";
import Modal from "./Modal";
import Heading from "../Heading/Heading";
import axios from "axios";
import capitalizeFirstLetter from "../../utils/capitalizeFirstLetter";
import PlaceTypeInput from "../Input/PlaceTypeInput";
import LocationInput from "../Input/LocationInput";
import Map from "../Map";

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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors
    },
    reset
  } = useForm({
    defaultValues: {
      placeType: '',
      location: null, // obj
      guests: 1,
      bedrooms:1,
      bathrooms: 1,
      beds: 1,
      description: '',
      name: '',
      photos: [],
      price: 1,
    }
  });

  const placeType = watch('placeType');
  const location = watch('location');
  
  const setCustomValue = (id, value) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
  }
  

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
        className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[40vh] px-4 overflow-y-auto"
      >
        { placeTypeList.length && placeTypeList.map((pt, i) => (
          <div key={pt.name + i} className="col-span-1">
            <PlaceTypeInput
              onClick={(placeType) => setCustomValue('placeType', placeType)}
              selected={placeType === pt.name}
              label={pt.name}
              iconSrc={pt.src}
            />
          </div>
        )) }
      </div>
    </div>
  );

  if(step === STEPS['LOCATION']) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading 
          title="Where is your place located?"
          subtitle="Help guests find you!"
        />

        <LocationInput 
          value={location}
          onChange={value => setCustomValue('location', value)}
        />

        <Map center={location?.latlng} />
      </div>
    );
  }

  return (
    <Modal 
      isOpen={open} 
      onClose={() => setOpen(false)} 
      onSubmit={step === STEPS['PRICE'] ? handleSubmit : onNext}
      title="Airbnb your home!"
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS['CATEGORY'] ? undefined : onBack}
      body={bodyContent}
    />
  );
}