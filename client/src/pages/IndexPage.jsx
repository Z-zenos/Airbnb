import axios from "axios";
import { useContext, useEffect, useState } from "react";
import capitalizeFirstLetter from "../utils/capitalizeFirstLetter";
import { CgFilters } from "react-icons/cg";

import {BsCaretLeft, BsCaretRight} from "react-icons/bs";
import useHorizontalScroll from "../hooks/useHorizontalScroll";
import PlaceCard from "../components/PlaceCard/PlaceCard";
import CreatePlaceModal from "../components/Modals/CreatePlaceModal";
import { ModalContext } from "../contexts/modal.context";
import FilterModal from "../components/Modals/FilterModal";
import { useNavigate, createSearchParams, useLocation } from "react-router-dom";

export default function IndexPage() {
  const { 
    setIsFilterModalOpen, 
    isCreatePlaceModalOpen,
    isFilterModalOpen, 
  } = useContext(ModalContext);
  const [propertyTypeList, setPropertyTypeList] = useState([]);
  const [propertyType, setPropertyType] = useState();
  const scrollRef = useHorizontalScroll();
  const [places, setPlaces] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [isHideScrollBtn, setIsHideScrollBtn] = useState(-1);

  console.log(places);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/places/property-types');

        setPropertyTypeList(() => res.data.data.propertyTypeList.map(pt => ({
          id: pt.id,
          name: capitalizeFirstLetter(pt.name),
          src: `http://localhost:3000/images/property_types/${pt.iconImage}` 
        })));

      } catch (err) {
        console.error(err);
      }
    })();
  }, []);
  
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`/places${location.search ? location.search : ''}`);
        setPlaces(res.data.data.places);

      } catch (err) {
        console.error(err);
      }
    })();
  }, [location]);

  function scrollHorizontal(scrollOffset) {
    scrollRef.current.scrollLeft += scrollOffset;
    handleScroll();
  }

  function handleScroll() {
    if(scrollRef.current.scrollLeft === 0) setIsHideScrollBtn(-1);
    else if(scrollRef.current.scrollLeft + scrollRef.current.offsetWidth === scrollRef.current.scrollWidth) setIsHideScrollBtn(1);
    else setIsHideScrollBtn(0);
  }

  function hanldleFilterPlaceByPropertyType(propertyTypeId) {
    setPropertyType(propertyTypeId);
    
    const params = {
      property_type: propertyTypeId
    };

    const options = {
      pathname: '/places',
      search: `?${createSearchParams(params)}`
    };

    navigate(options, { replace: true });
  }

  return (
    <div className="lg:px-20 md:px-10 mb-10">
      <div className="grid grid-cols-10 items-center gap-6">
        <div className="mt-4 grid grid-cols-12 items-center lg:col-span-9 md:col-span-8">
          { isHideScrollBtn !== -1 && 
            <BsCaretLeft 
              className="w-[40px] h-[40px] cursor-pointer border rounded-full p-2 opacity-60 border-gray-500 hover:scale-105 hover:shadow-md hover:shadow-gray-500 col-span-1 mx-auto xl:translate-x-[100%]" 
              onClick={() => scrollHorizontal(-400)} 
            />
          }

          <div className={`relative mx-4 ${isHideScrollBtn !== -1 ? 'before:absolute before:bottom-0 col-span-10 before:h-full before:left-[-10px] before:w-4 before:z-10 before:bg-gradient-to-b before:from-transparent before:to-[#fdfdfd]' : 'col-span-11'} ${isHideScrollBtn !== 1 ? 'after:absolute after:bottom-0 after:h-full after:w-4 after:z-10 after:right-[-10px] after:bg-gradient-to-b after:from-transparent after:to-[#fdfdfd]' : 'col-span-11'}`}>
            <div 
              className="flex justify-start gap-8 overflow-auto scroll-smooth" 
              ref={scrollRef}
              onWheel={handleScroll}
            >
              { propertyTypeList.length && propertyTypeList.map((pt, i) => (
                  <div 
                    className={`py-3 flex justify-center items-center flex-col ${pt.id === propertyType ? 'border-b-[2px] border-black' : 'opacity-60'} cursor-pointer`} key={pt.name + i}
                    onClick={() => hanldleFilterPlaceByPropertyType(pt.id)}
                  >
                    <img className="w-8" src={pt.src} />
                    <p className="mt-1 text-[12px] font-medium whitespace-nowrap">{pt.name}</p>
                  </div>
                )
              )}
            </div>
          </div>

          { isHideScrollBtn !== 1 && 
            <BsCaretRight 
              className="col-span-1 h-[40px] w-[40px] cursor-pointer border rounded-full p-2 opacity-60 border-gray-500 hover:scale-105 hover:shadow-md hover:shadow-gray-500 active:scale-100 active:shadow-none mx-auto  xl:translate-x-[-100%]" 
              onClick={() => scrollHorizontal(400)} 
              
            />
          }
        </div>

        <div 
          className="relative flex items-center mx-auto justify-center lg:col-span-1 md:col-span-2 border border-gray-300 rounded-md w-[120px] h-[60px] cursor-pointer translate-y-1 hover:border-gray-primary transition-all" 
          onClick={() => setIsFilterModalOpen(true)}
        >
          <CgFilters className=" w-6 h-6" />
          <p className=" ml-2">Filter</p>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-6 md:grid-cols-3 md:gap-5">
        { places.length > 0 
          ? places.map(place => <PlaceCard key={place.id} place={place} />) 
          : (
            <div className="flex items-center col-span-6 py-[200px] justify-center">
              <p className="font-medium opacity-60 text-3xl" >No Resutls</p>
            </div>
          )
        } 
      </div>

      { isCreatePlaceModalOpen && <CreatePlaceModal /> }
      { isFilterModalOpen && <FilterModal /> }
    </div>
  );
}