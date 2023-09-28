import { useEffect, useRef, useState } from "react";
import { IoIosImages } from "react-icons/io";
import { BsTrash3 } from "react-icons/bs";
import axios from "axios";

export default function ImageUpload({
  value, onChange
}) {
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  function handleImages(files) {
    setImages([...images, ...files]);
  }

  useEffect(() => {
    (async () => {
      try {
        if(!images.length) return;

        // send the file and description to the server
        const formData = new FormData();
        images.forEach((image, i) => {
          if(!i) formData.append("imageCover", images[0]);
          else formData.append("images", image);
        });

        console.log(images[0]);

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
        const urls = [place.imageCover, ...place.images];

        setPreviewUrls(urls.map(u => `http://localhost:3000/images/places/${u}`));
      } catch (err) {
        console.error(err);
      }
    })();
  }, [images]);

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

  const preview = images.map((image, i) => (
    <div className="relative w-40 h-40" key={image.name + i}>
      <img alt="not found" className="w-full h-full rounded-lg object-cover" src={previewUrls[i]} />

      <button>
        <BsTrash3 className="absolute right-4 top-4 p-2 bg-white shadow-sm rounded-full w-8 h-8" />
      </button>
    </div>
  ));

  return (
    <div className="mt-8">
      <form 
        className="h-[40vh] rounded-lg border-dashed border-neutral-600 border-[1px] flex flex-col items-center justify-center"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        { images.length 
          ? preview
          : (
              <>
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
              </>
            )
          }
      </form>
    </div>
  );
}