import { IoIosImages } from "react-icons/io";

export default function ImageUpload() {
  return (
    <div className="mt-8">
      <div className="h-[40vh] rounded-lg border-dashed border-neutral-600 border-[1px] flex flex-col items-center justify-center">
        <div className="text-center">
          <IoIosImages className="mx-auto w-20 h-20 text-primary" />

          <p className="text-2xl font-medium my-3">Drag and drop your photos here</p>
          <p className="font-light">Choose at least 5 photos</p>
        </div>

        <p className="underline font-medium text-sm mt-10 cursor-pointer">
          Upload from your device
          <input type="file" hidden />
        </p>
      </div>
    </div>
  );
}