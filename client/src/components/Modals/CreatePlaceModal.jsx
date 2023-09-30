
import { useEffect, useMemo, useRef, useState } from "react";
import{useForm} from "react-hook-form";
import Modal from "./Modal";
import Heading from "../Heading/Heading";
import axios from "axios";
import capitalizeFirstLetter from "../../utils/capitalizeFirstLetter";
import PlaceTypeInput from "../Input/PlaceTypeInput";
import LocationInput from "../Input/LocationInput";
import Map from "../Map";
import Counter from "../Input/Counter";
import ImageUpload from "../Input/ImageUpload";
import Input from "../Input/Input";
import { Editor } from "@tinymce/tinymce-react";

const STEPS = {
  PLACE_TYPES: 0,
  LOCATION: 1,
  INFO: 2,
  IMAGES: 3,
  DESCRIPTION: 4,
  PRICE: 5
};


export default function CreatePlaceModal() {
  const [open, setOpen] = useState(true);
  const [step, setStep] = useState(STEPS['PLACE_TYPES']);
  const editorRef = useRef(null);

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
  const guests = watch('guests');
  const bedrooms = watch('bedrooms');
  const bathrooms = watch('bathrooms');
  
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
      return 'Publish';

    return 'Next';
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if(step === STEPS['PLACE_TYPES'])
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

  if(step === STEPS['INFO']) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Share some basics about your place"
          subtitle="What amenitis do you have?"
        />
        <Counter
          onChange={(value) => setCustomValue('guests', value)}
          value={guests}
          title="Guests" 
          subtitle="How many guests do you allow?"
        />
        <hr />
        <Counter 
          onChange={(value) => setCustomValue('bedrooms', value)}
          value={bedrooms}
          title="Bedrooms" 
          subtitle="How many bedrooms do you have?"
        />
        <hr />
        <Counter 
          onChange={(value) => setCustomValue('bathrooms', value)}
          value={bathrooms}
          title="Bathrooms" 
          subtitle="How many bathrooms do you have?"
        />
      </div>
    );
  }

  if(step === STEPS['IMAGES']) {
    bodyContent = (
      <div>
        <Heading
          title="Add some photos for your place"
          subtitle="You'll need 5 photos to get started. You can add more or make changes later."
        />

        <ImageUpload />
      </div>
    );
  }

  if(step === STEPS['DESCRIPTION']) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading 
          title="How would you describe your place?"
          subtitle="Short and sweet works best!"
        />

        <Input label="Title" name="title" type="text" className="rounded-[8px]"  errors={errors} required />

        <hr />

        <Heading 
          title="Create your description"
          subtitle="Share what makes your place special."
        />

        <Editor
          onInit={(evt, editor) => editorRef.current = editor}
          initialValue="<p>Feel refreshed when you stay in this rustic gem.</p>"
          init={{
            height: 300,
            menubar: false,
            plugins: [
              'advlist autolink lists link image charmap print preview anchor',
              'searchreplace visualblocks code fullscreen',
              'insertdatetime media table paste code help wordcount'
            ],
            toolbar: 'undo redo | formatselect | ' +
            'bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
          }}
          
        />
      </div>
    );
  }

  if(step === STEPS['PRICE']) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading 
          title="Now, set your price"
          subtitle="How much do you charge per night?"
        />

        <Input 
          label="Price"
          type="number"
          errors={errors}
          required
        />
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
      secondaryAction={step === STEPS['PLACE_TYPES'] ? undefined : onBack}
      body={bodyContent}
    />
  );
}