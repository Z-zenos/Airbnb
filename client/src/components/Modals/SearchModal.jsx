import Modal from "./Modal";
import { GrMapLocation } from "react-icons/gr" 
import { useContext, useState } from "react";
import { ModalContext } from "../../contexts/modal.context";
import Input from "../Input/Input";
import Heading from "../Heading/Heading";
import capitalizeFirstLetter from "../../utils/capitalizeFirstLetter";
import { Calendar } from "react-date-range";
import Counter from "../Input/Counter";
import { useNavigate, createSearchParams } from "react-router-dom";

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
  const [address, setAddress] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const navigate = useNavigate();

  function handleSearch() {
    const where = selectedRegion || address;

    const params = {
      where,
      checkin: checkin.getTime(),
      checkout: checkout.getTime(),
      adults,
      children,
      pets
    };

    if(!where) delete params.where;

    const options = {
      pathname: '/places',
      search: `?${createSearchParams(params)}`
    };

    navigate(options, { replace: true });
  }

  let searchContentOfCriteria = (
    <div className="mt-8">
      {
        !selectedRegion && (
          <div className="mb-8 flex items-center">
            <GrMapLocation className="mr-4 w-8 h-8" />
            <Input label="Enter favourite place. Ex: Hanoi, Vietnam" className="w-full border-t-0 border-x-0" value={address} onChange={ev => setAddress(ev.target.value)} />
          </div>
        )
      }
      {
        !address && (
          <>
          <Heading 
            title="Search by region" 
            subtitle="Clicking again for canceling region"  
          />
          <div className="cursor-pointer mt-8 grid grid-cols-3 place-items-center gap-4">
            { REGIONS.map(region => (
              <div 
                onClick={() => {
                  setSelectedRegion(region === selectedRegion ? "" : region);
                }} key={region}>
                <img src={`http://localhost:3000/images/regions/${region.replace(' ', '_').toLowerCase()}.jpg`} className={`w-[150px] h-[120px] border-gray-300 border rounded-md ${region === selectedRegion ? 'border-primary' : ''}`} />
                <p className={`${region === selectedRegion ? 'text-primary font-bold opacity-100' : 'opacity-70 font-medium'} mt-2  text-md`}>{region}</p>
              </div>
            )) }
          </div>
          </>
        )
      }
      
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

  if(currentSelectedSearch === 'who') {
    searchContentOfCriteria = (
      <div className="mt-10 px-4 flex flex-col gap-8">
        <Counter
          onChange={(value) => setAdults(value)}
          value={adults}
          title="Adults" 
          subtitle="Ages 13 or above"
          max={16}
          min={0}
        />
        <hr />
        <Counter 
          onChange={(value) => setChildren(value)}
          value={children}
          title="Children" 
          subtitle="Ages 2 - 12"
          max={16}
          min={0}
        />
        <hr />
        <Counter 
          onChange={(value) => setPets(value)}
          value={pets}
          title="Pets" 
          subtitle="Bringing a service animal?"
          max={5}
          min={0}
        />
      </div>
    );
  }

  const bodyContent = (
    <div className="w-full px-12 md:px-6 m-auto  overflow-y-scroll">
      <div 
        className='grid grid-cols-5 text-center items-center text-md border border-gray-300 rounded-full shadow-md shadow-gray-300 cursor-pointer'
      >
        { SEARCH_CRITERIA.map((sc, i) => (
          <div 
            className={`
              ${i === 0 || i === 3 ? 'self-stretch' : ''}
              ${i === 0 && 'col-span-2'}
            `} 
            key={sc}
          >
            <div 
              className={`
                py-4 px-4 transition-all font-light
                ${i !== 3 ? 'border-r border-r-gray-300' : ''}
                ${sc === currentSelectedSearch ? 'font-medium bg-primary text-white' : ''}
                ${i === 0 ? 'rounded-l-full flex h-full flex-col items-center justify-center' : ''}
                ${i === 3 ? 'rounded-r-full flex h-full flex-col items-center justify-center' : ''}
              `}
              onClick={() => setCurrentSelectedSearch(sc)}
            >
              {i !== 3 && capitalizeFirstLetter(sc)}
              {i === 3 && (adults + children + pets === 0) && capitalizeFirstLetter(sc)}
              <p className="text-sm font-medium">
                { (i === 0 && (selectedRegion || address)) && <span className=" inline-block whitespace-nowrap overflow-hidden text-ellipsis w-[150px]">{selectedRegion || address }</span> }
                { i === 1 && `${MONTHS[checkin.getMonth()].slice(0, 3)} ${checkin.getDate()}` }
                { i === 2 && `${MONTHS[checkout.getMonth()].slice(0, 3)} ${checkout.getDate()}` }
                { (i === 3 && (adults + children + pets !== 0)) && (
                  <span>{adults} adults, {children} children, {pets} pets</span>
                )}
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
      onSubmit={handleSearch}
      title="Search"
      actionLabel="Search"
      secondaryActionLabel="Clear all"
      body={bodyContent}
    />
  );
}