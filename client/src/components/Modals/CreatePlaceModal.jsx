
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import{useForm} from "react-hook-form";
import Modal from "./Modal";
import Heading from "../Heading/Heading";
import axios from "axios";
import capitalizeFirstLetter from "../../utils/capitalizeFirstLetter";
import CategoryInput from "../Input/CategoryInput";
import LocationInput from "../Input/LocationInput";
import Map from "../Map";
import Counter from "../Input/Counter";
import ImageUpload from "../Input/ImageUpload";
import { Editor } from "@tinymce/tinymce-react";
import { ModalContext } from "../../contexts/modal.context";
import Input2 from "../Input/Input2";

const STEPS = {
  PLACE_TYPES: 0,
  LOCATION: 1,
  INFO: 2,
  AMENITIES: 3,
  IMAGES: 4,
  DESCRIPTION: 5,
  PRICE: 6,
};

export default function CreatePlaceModal() {
  const { isCreatePlaceModalOpen, setIsCreatePlaceModalOpen } = useContext(ModalContext);
  const [step, setStep] = useState(STEPS['PLACE_TYPES']);
  const editorRef = useRef(null);
  const [placeTypeList, setPlaceTypeList] = useState([]);
  const [amenityList, setAmenityList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors,
      isDirty
    },
    reset,
  } = useForm({
    defaultValues: {
      placeType: '',
      location: null, // obj
      guests: 1,
      bedrooms:1,
      bathrooms: 1,
      beds: 1,
      photos: [],
      amenities: [],
      description: '',
      name: '',
      price: 1,
      discount: 10
    },
    mode: 'all'
  });

  const placeType = watch('placeType');
  const location = watch('location');
  const guests = watch('guests');
  const bedrooms = watch('bedrooms');
  const beds = watch('beds');
  const bathrooms = watch('bathrooms');
  const amenities = watch('amenities');
  
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

  useEffect(() => {
    if(step === STEPS['AMENITIES']) {
      (async () => {
        const resp = await axios.get('/amenities');
        setAmenityList(resp.data.data.amenity);
      })();
    }
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Which of these best describes your place?"
        subtitle="Pick a category"
      />

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[40vh] px-4 overflow-y-auto"
      >
        { placeTypeList.length && placeTypeList.map(pt => (
          <div key={pt.id} className="col-span-1">
            <CategoryInput
              onClick={placeTypeId => setCustomValue('placeType', placeTypeId)}
              selected={placeType === pt.id}
              id={pt.id}
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
      <div className="flex flex-col gap-4">
        <Heading 
          title="Where is your place located?"
          subtitle="Help guests find you!"
        />

        <LocationInput 
          value={location}
          onChange={value => setCustomValue('location', value)}
        />

        <Map country={location?.label} center={location?.latlng} />
      </div>
    );
  }

  if(step === STEPS['INFO']) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Share some basics about your place"
          subtitle="You'll add more details later, like bed types."
        />
        <Counter
          onChange={(value) => setCustomValue('guests', value)}
          value={guests}
          title="Guests" 
          subtitle="How many guests do you allow?"
          max={16}
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
          onChange={(value) => setCustomValue('beds', value)}
          value={beds}
          title="Beds" 
          subtitle="How many beds do you have?"
        />
        <hr />
        <Counter 
          onChange={(value) => setCustomValue('bathrooms', value)}
          value={bathrooms}
          title="Bathrooms" 
          subtitle="How many bathrooms do you have?"
          plussedNumber={0.5}
          min={0.5}
        />
      </div>
    );
  }

  if(step === STEPS['AMENITIES']) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Tell guests what your place has to offer"
          subtitle="You can add more amenities after you publish your listing."
        />

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[40vh] px-4 overflow-y-auto"
        >
          { amenityList.length && amenityList.map(a => (
            <div key={a.id} className="col-span-1">
              <CategoryInput
                onClick={(a) => setCustomValue('amenities', amenities.includes(a) ? amenities.filter(am => am !== a) : [...amenities ,a])}
                selected={amenities.includes(a.id)}
                id={a.id}
                label={capitalizeFirstLetter(a.name)}
                iconSrc={`http://localhost:3000/images/amenities/${a.iconImage}`}
              />
            </div>
          )) }
        </div>
      </div>
    ) 
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

        <Input2 label="Name" className="rounded-[8px]" errors={errors} register={register} id="name" disabled={isLoading} required={true} />

        <hr />

        <Heading 
          title="Create your description"
          subtitle="Share what makes your place special."
        />

        {/* <Editor
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
          
        /> */}
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

        <Input2
          id="price"
          label="Price ($)"
          type="number"
          errors={errors}
          register={register}
          validate={{ required: 'ngu', max: {value:3, message: 'ngu'} }}
          disabled={isLoading}
        />
      </div>
    );
  }

  console.log(errors);

  const optionBtn = !errors.length && isDirty && (
    <div>
      <button className="border px-4 py-1 border-gray-primary hover:bg-red-500 hover:border-red-500 hover:text-white font-medium mr-3">
        Discard
      </button>
      <button className="border px-4 py-1 border-gray-primary hover:bg-blue-500 hover:border-blue-500 hover:text-white font-medium">
        Save
      </button>
    </div>
  )

  return (
    <Modal 
      isOpen={isCreatePlaceModalOpen} 
      onClose={() => setIsCreatePlaceModalOpen(false)} 
      onSubmit={step === STEPS['PRICE'] ? handleSubmit : onNext}
      title="Airbnb your home!"
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS['PLACE_TYPES'] ? undefined : onBack}
      body={bodyContent}
      optionBtn={optionBtn}
      disabled={isLoading}
    />
  );
}