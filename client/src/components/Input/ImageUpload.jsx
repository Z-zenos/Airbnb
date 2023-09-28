import { useEffect, useRef, useState } from "react";
import { IoIosImages } from "react-icons/io";
import { BsTrash3 } from "react-icons/bs";
import { AiOutlineCloudUpload } from "react-icons/ai";
import axios from "axios";

export default function ImageUpload({
  value, onChange
}) {
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await axios.get('/images/65150230db6c8bcce87227ec');

      const { imageCover, images } = res.data.data;

      setPreviewUrls([imageCover, ...images]);
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
        if(!i) formData.append("imageCover", images[0]);
        else formData.append("images", image);
      });

      const res = await axios.patch(
        '/images/65150230db6c8bcce87227ec/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      const place = res.data.data.place;

      setPreviewUrls([...previewUrls, place.imageCover, ...place.images]);
    } catch (err) {
      console.error(err);
    }
  }

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

  async function handleRemoveImage (url) {
    
  }

  const preview = previewUrls.map((url, i) => (
    <div className={`relative rounded-lg border-dashed border-neutral-600 border-[1px] ${!i ? 'h-[40vh] w-full col-span-2' : 'h-[20vh] w-full'}`} key={url + i}>
      <img alt="not found" className="w-full h-full rounded-lg object-cover" src={`http://localhost:3000/images/places/${url}`} />

      <button onClick={() => handleRemoveImage(url)}>
        <BsTrash3 className="absolute right-4 top-4 p-2 bg-white shadow-sm rounded-full w-8 h-8" />
      </button>
    </div>
  ));

  return (
    <div className="mt-4 overflow-y-scroll max-h-[50vh]">
      <button className="px-4 py-2 cursor-pointer bg-[#1652f0] text-white rounded-md font-medium shadow-md shadow-gray-500 border-none active:shadow-none" hidden={!images.length} onClick={handleUploadImages}>
        Upload
        <AiOutlineCloudUpload className="inline w-6 h-6 ml-2" />  
      </button>
      <form 
        className=""
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        { previewUrls.length > 0 && <div className="grid grid-cols-2 gap-4">{preview}</div> }
        
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