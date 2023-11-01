
import { useContext } from "react";
import Modal from "./Modal";
import { ModalContext } from "../../contexts/modal.context";

export default function ImageModal ({ images }) {
  const { isImageModalOpen, setIsImageModalOpen } = useContext(ModalContext);
  
  const bodyContent = (
    <div className="w-full px-12 md:px-6 m-auto h-[500px] grid grid-cols-2 gap-2 overflow-y-scroll">
      { images.length > 0 && images.map((image, i) => (
        <img className={`rounded-md w-[400px] h-[300px] ${i % 3 === 0 ? 'col-span-2 w-full' : ''}`} src={`http://localhost:3000/images/places/${image}`} key={i} />
      )) }
    </div>
  );

  return (
    <Modal
      isOpen={isImageModalOpen} 
      onClose={() => setIsImageModalOpen(false)} 
      onSubmit={() => setIsImageModalOpen(false)}
      title="Filters"
      actionLabel={`Close`}
      body={bodyContent}
    />
  );
}