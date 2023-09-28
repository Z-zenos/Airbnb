import { useEffect, useRef, useState } from "react";
import { IoIosImages } from "react-icons/io";
import { BsTrash3 } from "react-icons/bs";
import axios from "axios";

export default function ImageUpload({
  value, onChange
}) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [description, setDescription] = useState("");
  const [isCover, setIsCover] = useState(false);

  async function handleSubmit(ev) {
    ev.preventDefault();

    // send the file and description to the server
    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("description", description);

    const res = await axios.post(
      '/images/65150230db6c8bcce87227ec/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    console.log(res.data);
  }

  const fileInputRef = useRef(null);

  function handleSelectImage() {
    fileInputRef.current.click();
  }

  return (
    <div className="mt-8">
      <form 
        className="h-[40vh] rounded-lg border-dashed border-neutral-600 border-[1px] flex flex-col items-center justify-center"
        onSubmit={handleSubmit}  
      >
        { selectedImage 
          ? (
              <div className="relative w-full h-full">
                <img alt="not found" className="w-full h-full rounded-lg object-cover" src={URL.createObjectURL(selectedImage)} />

                <button onClick={() => setSelectedImage(null)}>
                  <BsTrash3 className="absolute right-4 top-4 p-2 bg-white shadow-sm rounded-full w-8 h-8" />
                </button>
              </div>
            ) 
          : (
              <>
                <div className="text-center">
                  <IoIosImages className="mx-auto w-20 h-20 text-primary" />

                  <p className="text-2xl font-medium my-3">Drag and drop your photos here</p>
                  <p className="font-light">Choose at least 5 photos</p>
                </div>

                <p 
                  className="underline font-medium text-sm mt-10 cursor-pointer"
                  onClick={handleSelectImage}
                >
                  Upload from your device
                  <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={ev => {
                    setSelectedImage(ev.target.files[0])
                    handleSubmit(ev);
                  }} />
                </p>
              </>
            )
          }
      </form>
    </div>
  );
}