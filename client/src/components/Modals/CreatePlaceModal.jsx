
import { useContext, useMemo, useRef, useState } from "react";
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
import { ToastContext } from "../../contexts/toast.context";
import Toast from "../Toast/Toast";
import { useNavigate } from "react-router-dom";

const STEPS = [
  {
    id: 0,
    name: 'property_type',
    fields: ['property_type']
  },
  {
    id: 1,
    name: 'location',
    fields: ['location']
  },
  {
    id: 2,
    name: 'info',
    fields: ['guests', 'beds', 'bathrooms', 'bedrooms']
  },
  {
    id: 3,
    name: 'amenities',
    fields: ['amenities']
  },
  {
    id: 4,
    name: 'images',
    fields: []
  },
  {
    id: 5,
    name: 'description',
    fields: ['name', 'description'],
  },
  {
    id: 6,
    name: 'price',
    fields: ['price']
  },
];

export default function CreatePlaceModal() {
  const { isCreatePlaceModalOpen, setIsCreatePlaceModalOpen } = useContext(ModalContext);
  const [step, setStep] = useState(0);
  const editorRef = useRef(null);
  const navigate = useNavigate();
  const [propertyTypeList, setPropertyTypeList] = useState([]);
  const [amenityList, setAmenityList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { openToast } = useContext(ToastContext);

  let {
    setValue,
    watch,
    formState: {
      isDirty,
    },
    getValues,
  } = useForm({
    mode: 'all',
    defaultValues: async () => {
      try {
        setIsLoading(true);

        const property_typeResp = await axios.get('/places/property-types');

        setPropertyTypeList(() => property_typeResp.data.data.propertyTypeList.map(pt => ({
          id: pt.id,
          name: capitalizeFirstLetter(pt.name),
          src: `http://localhost:3000/images/property_types/${pt.iconImage}` 
        })));

        const amenityResp = await axios.get('/amenities');
        setAmenityList(amenityResp.data.data.amenitys);

        const placesRes = await axios.get('/places/become-a-host');

        const placeList = placesRes.data.data.places;
        const creatingPlaceList = placeList.filter(place => place.status === 'creating');

        let newPlace;

        if(!placeList.length || !creatingPlaceList.length) {
          const createResp = await axios.post('/places/become-a-host', {}, {
            headers: {
              "Content-Type": "application/json"
            },
          });
          newPlace = createResp.data.data.place;
        }
        else {
          newPlace =  creatingPlaceList[0];
        }

        newPlace.amenities = newPlace.amenities.map(am => am._id);
        newPlace.property_type = newPlace.property_type.id;
        return newPlace;
      } catch(error) {
        console.error(error);
      }
      finally {
        setIsLoading(false);
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
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
  }

  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);

  function onNext() {
    (async () => {
      try {
        setIsLoadingUpdate(true);
        if(STEPS[step].name !== 'images') {
          let body = {};
          STEPS[step].fields.forEach(field => {
            body[field] = getValues(field);
          });
          
          await axios.patch(`/places/become-a-host/${getValues("_id")}`, body, {
              headers: {
                "Content-Type": "application/json"
              },
            }
          );
        }
        setStep(prevStep => prevStep + 1);
      } catch (error) {
        openToast(<Toast title="Failure" content={error?.message || "Something went wrong!"} type="error" />)
      } finally {
        setIsLoadingUpdate(false);
      }
    })();
  }

  function onBack() {
    setStep(prevStep => prevStep - 1);
  }

  async function handleSubmit() {
    if(STEPS[step].name !== 'price') return;

    const placeData = { ...getValues(), status: 'published' };
    delete placeData._id;
    delete placeData.host;

    try {
      setIsLoadingUpdate(true);
      await axios.patch(`/places/${getValues('_id')}`, placeData, {
        headers: {
          "Content-Type": "application/json"
        },
      });
      openToast(<Toast title="Success" type="success" content="Create new place successfully" />);
    } catch(err) {
      openToast(<Toast title="Failure" type="error" content="May be missed some needed information for your place" />);
    } finally {
      setIsLoadingUpdate(false);
      setIsCreatePlaceModalOpen(false);
      navigate(0);
    }
  }

  const actionLabel = useMemo(() => {
    if(STEPS[step].name === 'price')
      return 'Publish';

    return 'Next';
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if(STEPS[step].name === 'property_type')
      return undefined;

    return 'Back';
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Which of these best describes your place?"
        subtitle="Pick a category"
      />

      <div
        className={`
          grid grid-cols-1 gap-3 
          max-h-[40vh] px-4 overflow-y-auto 
          ${isLoading ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'}
        `}
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

  if(STEPS[step].name === 'location') {
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

  if(STEPS[step].name === 'info') {
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

  if(STEPS[step].name === 'amenities') {
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

  if(STEPS[step].name === 'images') {
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

  if(STEPS[step].name === 'description') {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading 
          title="How would you describe your place?"
          subtitle="Short and sweet works best!"
        />

        <Input 
          label="Name" 
          name="name" 
          type="text" 
          className="rounded-t-[8px]" 
          value={name} 
          onChange={(ev) => setCustomValue('name', ev.target.value)} 
        />

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

  if(STEPS[step].name === 'price') {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading 
          title="Now, set your price"
          subtitle="How much do you charge per night?"
        />

        <Input label="Price ($)" name="price" type="number" className="rounded-t-[8px]" value={price || ""} onChange={(ev) => setCustomValue('price', +ev.target.value)} />
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
      onSubmit={STEPS[step].name === 'price' ? handleSubmit : onNext}
      title="Airbnb your home!"
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={STEPS[step].name === 'property_type' ? undefined : onBack}
      body={bodyContent}
      optionBtn={optionBtn}
      isLoading={isLoadingUpdate}
      // disabled={isErrorsOfStep(step)}
    />
  );
}