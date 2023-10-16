import Modal from "./Modal";
import { GrMapLocation } from "react-icons/gr" 
import { useContext, useState } from "react";
import { ModalContext } from "../../contexts/modal.context";
import Input from "../Input/Input";
import Heading from "../Heading/Heading";
import capitalizeFirstLetter from "../../utils/capitalizeFirstLetter";
import { Calendar } from "react-date-range";
import Counter from "../Input/Counter";

const SEARCH_CRITERIA = ['where', 'check in', 'check out', 'who'];
const REGIONS = ['Any', 'Europe', 'Australia', 'North America', 'South America', 'Asia'];
const MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function SearchModal () {
  const { isSearchModalOpen, setIsSearchModalOpen } = useContext(ModalContext);
  const [currentSelectedSearch, setCurrentSelectedSearch] = useState(SEARCH_CRITERIA[0]);

  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [pets, setPets] = useState(0);
  const [checkin, setCheckin] = useState(new Date());
  const [checkout, setCheckout] = useState(new Date());

  let searchContentOfCriteria = (
    <div className="mt-8">
      <div className="mb-8 flex items-center">
        <GrMapLocation className="mr-4 w-8 h-8" />
        <Input label="Enter favourite place. Ex: Hanoi, Vietnam" className="w-full border-t-0 border-x-0"  />
      </div>
      <Heading title="Search by region" />
      <div className="cursor-pointer mt-8 grid grid-cols-3 place-items-center gap-4">
        { REGIONS.map(region => (
          <div key={region}>
            <img src={`http://localhost:3000/images/regions/${region.replace(' ', '_').toLowerCase()}.jpg`} className="w-[150px] h-[120px] border-gray-300 border rounded-md" />
            <p className="mt-2 opacity-70 font-medium text-md">{region}</p>
          </div>
        )) }
      </div>
    </div>
  );

  if(currentSelectedSearch === 'check in') {
    searchContentOfCriteria = (
      <Calendar 
        date={checkin} 
        onChange={date => setCheckin(date)} 
        className={"my-8 text-black text-lg border border-gray-300 rounded-xl flex items-center"}  
        color="#ff385c"
        maxDate={checkout}
      />
    );
  }

  if(currentSelectedSearch === 'check out') {
    searchContentOfCriteria = (
      <Calendar 
        date={checkout} 
        onChange={date => setCheckout(date)} 
        className={"my-8 text-black text-lg border border-gray-300 rounded-xl flex items-center"}  
        color="#ff385c"
        minDate={checkin}
      />
    );
  }

  console.log(checkin, checkout);

  if(currentSelectedSearch === 'who') {
    searchContentOfCriteria = (
      <div className="mt-10 px-4 flex flex-col gap-8">
        <Counter
          onChange={(value) => setAdults(value)}
          value={adults}
          title="Adults" 
          subtitle="Ages 13 or above"
          max={16}
        />
        <hr />
        <Counter 
          onChange={(value) => setChildren(value)}
          value={children}
          title="Children" 
          subtitle="Ages 2 - 12"
          max={16}
        />
        <hr />
        <Counter 
          onChange={(value) => setPets(value)}
          value={pets}
          title="Pets" 
          subtitle="Bringing a service animal?"
          max={5}
        />
      </div>
    );
  }


  const bodyContent = (
    <div className="w-full px-12 md:px-6 m-auto  overflow-y-scroll">
      <div 
        className='grid grid-cols-4 text-center items-center text-md border border-gray-300 rounded-full shadow-md shadow-gray-300 cursor-pointer'
      >
        { SEARCH_CRITERIA.map((sc, i) => (
          <div key={sc}>
            <div 
              className={`
                py-4 px-4 transition-all font-light
                ${i !== 3 ? 'border-r border-r-gray-300' : ''}
                ${sc === currentSelectedSearch ? 'font-medium bg-primary text-white' : ''}
                ${i === 0 ? 'rounded-l-full' : ''}
                ${i === 3 ? 'rounded-r-full' : ''}
              `}
              onClick={() => setCurrentSelectedSearch(sc)}
            >
              {capitalizeFirstLetter(sc)}
              <p className="text-sm font-medium">
                { i === 2 && `${MONTHS[checkout.getMonth()].slice(0, 3)} ${checkout.getDate()}` }
                { i === 1 && `${MONTHS[checkin.getMonth()].slice(0, 3)} ${checkin.getDate()}` }
              </p>
            </div>
          </div>
        )) }
      </div>

      {searchContentOfCriteria}
    </div>
  );

  return (
    <Modal
      isOpen={isSearchModalOpen} 
      onClose={() => setIsSearchModalOpen(false)} 
      onSubmit={() => {}}
      title="Search"
      actionLabel="Search"
      secondaryActionLabel="Clear all"
      body={bodyContent}
    />
  );
}