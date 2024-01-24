import { useContext, useEffect, useRef, useState } from "react";
import { IoIosImages } from "react-icons/io";
import { BsTrash3 } from "react-icons/bs";
import axios from "axios";
import {ToastContext} from "../../contexts/toast.context";
import Toast from "../Toast/Toast";
import Spinner from "../Spinner/Spinner";

export default function ImageUpload({
  value, onChange, placeId
}) {
  const [images, setImages] = useState([]);
  const { openToast } = useContext(ToastContext);

  useEffect(() => {
    (async () => {
      const res = await axios.get(`/images/${placeId}`);

      const { image_cover, images } = res.data.data;

      const urls = [image_cover, ...images].filter(Boolean);

      if(urls.length) onChange(urls);
    })();
  }, []);

  function handleImages(files) {
    setImages([...images, ...files]);
  }

  async function handleUploadImages() {
    try {
      if(!images.length) return;

      // send the file and description to the server
      const formData = new FormData();
      images.forEach((image, i) => {
        if(!i) formData.append("image_cover", image);
        else formData.append("images", image);
      });

      const res = await axios.patch(
        `/images/${placeId}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      const place = res.data.data.place;

      onChange([...value, place.image_cover, ...place.images]);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    try {
      handleUploadImages();
      openToast(
        <Toast title="Success" content="Upload images successfully!" type="success" />
      );
    } catch (error) {
      openToast(
        <Toast title="Failure" content={error?.message} type="error" />
      );
    }
  }, [images.length]);

  function handleDrop (ev) {
    // prevent the browser from opening the image
    ev.preventDefault();
    ev.stopPropagation();

    // Info about all images that dragged
    const { files } = ev.dataTransfer;

    if(files.length > 0) {
      handleImages(files);
    }
  }

  function handleDragOver (ev) {
    ev.preventDefault();
  }

  const fileInputRef = useRef(null);

  async function handleRemoveImage (ev, url) {
    ev.preventDefault();
    if(!value.length) return;

    const res = await axios.delete(`/images/${placeId}/${url}`);
    const place = res.data.data.place;
    onChange([place.image_cover, ...place.images]);
  }

  const preview = value.length > 0 
    ? value.map((url, i) => (
      <div 
        className={`
          relative rounded-lg border-dashed border-neutral-600 border-[1px] 
          ${!i 
            ? 'h-[40vh] w-full col-span-2' 
            : 'h-[20vh] w-full'
          }
        `} 
        key={url + i}
      >
        <img 
          alt="not found" 
          className="w-full h-full rounded-lg object-cover" 
          src={`http://localhost:3000/images/places/${url}`} 
        />

        <button onClick={async (ev) => await handleRemoveImage(ev, url)}>
          <BsTrash3 className="absolute right-4 top-4 p-2 bg-white shadow-sm rounded-full w-8 h-8" />
        </button>
      </div>
    ))
    : <Spinner />

  return (
    <div className="mt-4 overflow-y-scroll max-h-[50vh]">
      <form 
        className=""
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        { value.length > 0 && <div className="grid grid-cols-2 gap-4">{preview}</div> }
        
        <div className="h-[40vh] mt-4 rounded-lg border-dashed border-neutral-600 border-[1px] flex flex-col items-center justify-center">
          <div className="text-center">
            <IoIosImages className="mx-auto w-20 h-20 text-primary" />

            <p className="text-2xl font-medium my-3">Drag and drop your photos here</p>
            <p className="font-light">Choose at least 5 photos</p>
          </div>

          <p 
            className="underline font-medium text-sm mt-10 cursor-pointer"
            onClick={() => fileInputRef.current.click()}
          >
            Upload from your device
            <input 
              ref={fileInputRef} 
              type="file" 
              accept="image/*" 
              hidden 
              multiple={true}
              onChange={ev => handleImages(ev.target.files)}
            />
          </p>
        </div>
      </form>
    </div>
  );
}