import { useContext, useState } from "react";
import { ModalContext } from "../../contexts/modal.context";
import Modal from "./Modal";
import Heading from "../Heading/Heading";


export default function FilterModal () {
  const { isFilterModalOpen, setIsFilterModalOpen } = useContext(ModalContext);
  const [places, setPlaces] = useState([1, 2, 3]);


  function handleSubmit() { }

  function handleClearAll() {}

  const bodyContent = (
    <div>
      <Heading
        title="Type of place"
        subtitle="Search rooms, entire homes and more. Nightly prices don't include fees or taxes."
      />
    </div>
  );

  return (
    <Modal
      isOpen={isFilterModalOpen} 
      onClose={() => setIsFilterModalOpen(false)} 
      onSubmit={handleSubmit}
      title="Filters"
      actionLabel={`Show ${places.length} places`}
      secondaryActionLabel="Clear all"
      secondaryAction={handleClearAll}
      body={bodyContent}
    />
  );
}