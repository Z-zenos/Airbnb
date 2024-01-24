
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
import Input from "../Input/Input";
import Spinner from "../Spinner/Spinner";

const STEPS = {
  PROPERTY_TYPES: 0,
  LOCATION: 1,
  INFO: 2,
  AMENITIES: 3,
  IMAGES: 4,
  DESCRIPTION: 5,
  PRICE: 6,
};

export default function CreatePlaceModal() {
  const { isCreatePlaceModalOpen, setIsCreatePlaceModalOpen } = useContext(ModalContext);
  const [step, setStep] = useState(STEPS['PROPERTY_TYPES']);
  const editorRef = useRef(null);
  const [propertyTypeList, setPropertyTypeList] = useState([]);
  const [amenityList, setAmenityList] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [placeId, setPlaceId] = useState("");

  let {
    setValue,
    watch,
    formState: {
      isDirty
    },
    getValues,
  } = useForm({
    mode: 'all',
    defaultValues: async () => {
      try {
        const res = await axios.get('/places/become-a-host');

        const placeList = res.data.data.places;
        const creatingPlaceList = placeList.filter(place => place.status === 'creating');

        if(!placeList.length || !creatingPlaceList.length) {
          const createResp = await axios.post('/places/become-a-host', {}, {
            headers: {
              "Content-Type": "application/json"
            },
          });
          setPlaceId(createResp.data.data.place._id);
          return createResp.data.data.place;
        }
        else {
          setPlaceId(creatingPlaceList[0]._id);
          return creatingPlaceList[0];
        }
      } catch(err) {
        console.error(err);
      }
    }
  });

  const property_type = watch('property_type');
  const location = watch('location');
  const guests = watch('guests');
  const bedrooms = watch('bedrooms');
  const beds = watch('beds');
  const bathrooms = watch('bathrooms');
  const amenities = watch('amenities');
  const price = watch('price');
  const name = watch('name');
  const description = watch('description');
  const images = watch('images');

  const setCustomValue = (id, value) => {
    (async () => {
      setValue(id, value, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true
      });
      if(id !== 'images') {
        await axios.patch(
          `/places/become-a-host/${placeId}`, 
          {
            [id]: value
          }, 
          {
            headers: {
              "Content-Type": "application/json"
            },
          }
        );
      }
  
      setErrors(isErrorsOfStep(step) ? [] : errors);
    })();
  }

  function isErrorsOfStep(step) {
    return !!errors.filter(e => e.step === step).length;
  }

  useEffect(() => {
    if(isErrorsOfStep(step)) return;

    if(step === STEPS['PROPERTY_TYPES'] && !property_type) {
      setErrors([...errors, {
        step: step,
        message: "Please choose one place type."
      }]);
    }
    else if(step === STEPS['LOCATION'] && !location?.country) {
      setErrors([...errors, {
        step: step,
        message: "Please choose location for your place."
      }]);
    }
    else if(step === STEPS['AMENITIES'] && !amenities.length) {
      setErrors([...errors, {
        step: step,
        message: "Please choose at least one amenity for your place."
      }]);
    }
    else if(step === STEPS['IMAGES'] && !images.length) {
      setErrors(() => [...errors, {
        step: step,
        message: "Please choose at least one image for your place."
      }]);
    }
    else if(step === STEPS['DESCRIPTION'] && !name) {
      setErrors([...errors, {
        step: step,
        message: "Please enter name and description for place."
      }]);
    }
    else if(step === STEPS['PRICE'] && !price) {
      setErrors([...errors, {
        step: step,
        message: "Please enter price for place."
      }]);
    }
  }, [step, name, location?.country, price]);

  function onNext() {
    if(!isErrorsOfStep(step))
      setStep(prevStep => prevStep + 1);
  }

  function onBack() {
    setStep(prevStep => prevStep - 1);
  }

  async function handleSubmit() {
    if(step !== STEPS['PRICE']) return;

    const placeData = { ...getValues() };
    delete placeData._id;
    delete placeData.host;

    try {
      await axios.patch(`/places/${getValues()._id}`, placeData, {
        headers: {
          "Content-Type": "application/json"
        },
      });
    } catch(err) {
      console.log(err);
    }
  }

  const actionLabel = useMemo(() => {
    if(step === STEPS['PRICE'])
      return 'Publish';

    return 'Next';
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if(step === STEPS['PROPERTY_TYPES'])
      return undefined;

    return 'Back';
  }, [step]);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const res = await axios.get('/places/property-types');

        setPropertyTypeList(() => res.data.data.propertyTypeList.map(pt => ({
          id: pt.id,
          name: capitalizeFirstLetter(pt.name),
          src: `http://localhost:3000/images/property_types/${pt.iconImage}` 
        })));

      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []); 

  useEffect(() => {
    if(step === STEPS['AMENITIES']) {
      (async () => {
        try {
          setIsLoading(true);
          const resp = await axios.get('/amenities');
          setAmenityList(resp.data.data.amenitys);
        } 
        catch (error) { /* empty */ }
        finally { 
          setIsLoading(false);
        }
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
        { (propertyTypeList.length > 0 && !isLoading)
          ? propertyTypeList.map(pt => (
              <div key={pt.id} className="col-span-1">
                <CategoryInput
                  onClick={property_typeId => setCustomValue('property_type', property_typeId)}
                  selected={property_type === pt.id}
                  id={pt.id}
                  label={pt.name}
                  iconSrc={pt.src}
                />
              </div>
            )) 
          : <Spinner />
        }
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

        <Map 
          locations={[{
            coordinate: location?.coordinates?.length ? location.coordinates : [0,0],
          }]} 
          className="h-[35vh] rounded-xl" 
          zoom={12}
          isDisplayExtraInfoPlace={false}
        />
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
        { isLoading 
        ? <Spinner /> 
        : <>
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
          </>
        }
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
          { amenityList?.length > 0 && amenityList
            ?.filter(a => a.iconImage && a.iconImage !== "essentials.png")
            ?.map(a => (
              <div key={a.id} className="col-span-1">
                <CategoryInput
                  onClick={(a) => setCustomValue(
                    'amenities', 
                    amenities.includes(a) 
                      ? amenities.filter(am => am !== a) 
                      : [...amenities ,a]
                    )
                  }
                  selected={amenities.includes(a.id)}
                  id={a.id}
                  label={capitalizeFirstLetter(a.name)}
                  iconSrc={`http://localhost:3000/images/amenities/${a.iconImage}`}
                />
              </div>
            )) 
          }
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

        <ImageUpload
          value={images}
          onChange={(images) => setCustomValue('images', images)}
          placeId={getValues()._id}
        />
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

        <Input label="Name" name="name" type="text" className="rounded-t-[8px]" value={name} onChange={(ev) => setCustomValue('name', ev.target.value)} />

        <hr />

        <Heading 
          title="Create your description"
          subtitle="Share what makes your place special."
        />

        <Editor
          onInit={(evt, editor) => editorRef.current = editor}
          initialValue={description}
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
          onChange={ev => setCustomValue('description', ev.target.getContent())}
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

        <Input label="Price ($)" name="price" type="number" className="rounded-t-[8px]" value={price} onChange={(ev) => setCustomValue('price', +ev.target.value)} />
      </div>
    );
  }

  const optionBtn = isDirty && (
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
      secondaryAction={step === STEPS['PROPERTY_TYPES'] ? undefined : onBack}
      body={bodyContent}
      optionBtn={optionBtn}
      // disabled={isErrorsOfStep(step)}
    />
  );
}