import Modal from "./Modal";
import { GrMapLocation } from "react-icons/gr" 
import { useContext, useState } from "react";
import { ModalContext } from "../../contexts/modal.context";
import Input from "../Input/Input";
import Heading from "../Heading/Heading";
import capitalizeFirstLetter from "../../utils/capitalizeFirstLetter";
import { Calendar } from "react-date-range";
import Counter from "../Input/Counter";
import { useNavigate, createSearchParams, useSearchParams } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";

const SEARCH_CRITERIA = ['where', 'who', 'check in', 'check out'];
const REGIONS = ['Any', 'Europe', 'Australia', 'North America', 'South America', 'Asia'];
const MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function SearchModal () {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentSelectedSearch, setCurrentSelectedSearch] = useState(searchParams.get('region') || SEARCH_CRITERIA[0]);
  const { isSearchModalOpen, setIsSearchModalOpen } = useContext(ModalContext);

  const [adults, setAdults] = useState(+searchParams.get('adults') || 0);
  const [children, setChildren] = useState(+searchParams.get('children') || 0);
  const [pets, setPets] = useState(+searchParams.get('pets') || 0);
  const [checkin, setCheckin] = useState(searchParams.get('checkin') ? new Date(+searchParams.get('checkin')) : null);
  const [checkout, setCheckout] = useState(searchParams.get('checkout') ? new Date(+searchParams.get('checkout')) : null);
  const [address, setAddress] = useState(searchParams.get('address') || "");
  const [selectedRegion, setSelectedRegion] = useState(searchParams.get('region') || "");

  function handleSearch() {
    let params = {};

    if(address) params.address = address;
    else if(selectedRegion) params.region = selectedRegion;

    if(checkin) params.checkin = checkin.getTime();
    if(checkout) params.checkout = checkout.getTime();
    if(adults) params.adults = adults;
    if(children) params.children = children;
    if(pets) params.pets = pets;

    params = { ...Object.fromEntries([...searchParams]), ...params };
    

    const options = {
      pathname: '/places/search',
      search: `?${createSearchParams(params)}`
    };

    navigate(options, { replace: true });
    setIsSearchModalOpen(false);
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
        date={checkin ? checkin : new Date()} 
        onChange={date => setCheckin(date)} 
        className={"my-8 text-black text-lg border border-gray-300 rounded-xl flex items-center"}  
        color="#ff385c"
        maxDate={checkout && new Date()}
      />
    );
  }

  if(currentSelectedSearch === 'check out') {
    searchContentOfCriteria = (
      <Calendar 
        date={checkout ? checkout : new Date()} 
        onChange={date => setCheckout(date)} 
        className={"my-8 text-black text-lg border border-gray-300 rounded-xl flex items-center"}  
        color="#ff385c"
        minDate={checkin && new Date()}
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
          max={10}
          min={0}
        />
        <hr />
        <Counter 
          onChange={(value) => setPets(value)}
          value={pets}
          title="Pets" 
          subtitle="Bringing a service animal?"
          max={3}
          min={0}
        />
      </div>
    );
  }

  const bodyContent = (
    <div className="w-full px-12 md:px-6 m-auto max-h-[600px] overflow-y-scroll">
      <div 
        className='grid grid-cols-4 text-center  overflow-hidden items-center text-md border border-gray-300 rounded-full shadow-md shadow-gray-300 cursor-pointer'
      >
        { SEARCH_CRITERIA.map((sc, i) => (
          <div 
            className="self-stretch col-span-2" 
            key={sc}
          >
            <div 
              className={`
                py-2 px-4 transition-all font-light border-r-gray-300
                ${i === 0 ? 'border-r border-b ' : ''}
                ${i === 1 ? 'border-b' : ''}
                ${i === 2 ? 'border-r' : ''}
                ${sc === currentSelectedSearch ? 'font-medium bg-primary text-white' : ''}
                flex h-full items-center justify-center relative
              `}
              onClick={() => setCurrentSelectedSearch(sc)}
            >
              { (i === 0 && (!selectedRegion && !address)) && 'Where'}
              { (i !== 0 && i !== 1) && capitalizeFirstLetter(sc)}
              { (i === 1 && (adults + children + pets === 0) && 'Who') }
              <p className="text-sm flex items-center justify-center font-medium">
                {/* WHERE */}
                { (i === 0 && (selectedRegion || address)) && (
                  <>
                    <span className=" inline-block whitespace-nowrap overflow-hidden text-ellipsis w-[150px]"> 
                      {selectedRegion || address }
                    </span>
                    <AiOutlineClose 
                      className="absolute right-5" 
                      onClick={() => {
                        if(address) setAddress('');
                        if(selectedRegion) setSelectedRegion('');
                      }} 
                    />
                  </>
                ) }

                {/* WHO */}
                { (i === 1 && (adults + children + pets !== 0)) && (
                  <>
                    <span>{adults} adults, {children} childs, {pets} pets</span>
                    <AiOutlineClose 
                      className="absolute right-5" 
                      onClick={() => {
                        setAdults(0);
                        setChildren(0);
                        setPets(0);
                        searchParams.delete('adults');
                        searchParams.delete('children');
                        searchParams.delete('pets');
                      }} />
                  </>
                )}

                {/* CHECK IN */}
                { (i === 2 && checkin) 
                  ? (
                      <>
                        <span>
                          {` : ${MONTHS[checkin.getMonth()].slice(0, 3)} ${checkin.getDate()}`}
                        </span>
                        <AiOutlineClose className="absolute right-5" onClick={() => setCheckin(null)} />
                      </>
                    ) 
                  : '' 
                }

                {/* CHECK OUT */}
                { (i === 3 && checkout) 
                  ? (
                      <>
                        <span>
                          {` : ${MONTHS[checkout.getMonth()].slice(0, 3)} ${checkout.getDate()}`}
                        </span>
                        <AiOutlineClose className="absolute right-5" onClick={() => setCheckout(null)} />
                      </>
                    ) 
                  : '' 
                }
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