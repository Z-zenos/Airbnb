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
import { useNavigate, createSearchParams, useLocation, useSearchParams } from "react-router-dom";
import PlaceCardSkeleton from "../components/PlaceCard/PlaceCardSkeleton";
import Spinner from "../components/Spinner/Spinner";
import SearchModal from "../components/Modals/SearchModal";
import useIntersectionObserver from "../hooks/useIntersectionObserver";

export default function IndexPage() {
  const { 
    setIsFilterModalOpen, 
    isCreatePlaceModalOpen,
    isFilterModalOpen, 
    isSearchModalOpen,
  } = useContext(ModalContext);
  const [propertyTypeList, setPropertyTypeList] = useState([]);
  const [propertyType, setPropertyType] = useState(0);
  const scrollRef = useHorizontalScroll();
  const [places, setPlaces] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isHideScrollBtn, setIsHideScrollBtn] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [filterCriteriaNumber, setFilterCriteriaNumber] = useState(0);

  // Fetch property types
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/places/property-types');

        res.data.data.propertyTypeList.unshift({
          id: 0,
          name: 'all',
          iconImage: 'all.png'
        });

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
  
  // Fetch places
  console.log(places);
  const fetchPlaces = async (page = 0, limit = 12) => {
    try {
      setLoading(true);
      if(!location.search) setFilterCriteriaNumber(0);

      const res = await axios.get(`${location.pathname !== '/' ? location.pathname : 'places'}${location.search ? location.search : ''}`, {
        params: {
          page,
          limit
        }
      });

      if(res.data.total <= page + limit) setHasNextPage(false);
      setLoading(false);

      return res.data.data.places;

    } catch (err) {
      console.error(err);
      setLoading(false);
      return places;
    } 
  }

  /*
    Problem: Why use void in below function ?
      I'm using the useEffect hook, and in some cases I do not need to return anything. What is the best way to handle this situation?

      // fooRef is a reference to a textfield (belonging to the same component). Sometimes the fooRef is not there,because of redirections) that's why I need to check if it exists

        useEffect(() => fooRef.current && fooRef.current.focus()  , [fooRef])

      When using it like this, React complains with the following error message: An effect function must not return anything besides a function, which is used for clean-up. You returned null. If your effect does not require clean up, return undefined (or nothing).

    Solution:
      - Using void to make arrow functions return nothing
      - Sometimes you might want to call the promise, but you don't need to do anything with the response.
      - It's about "Avoid void". Void is an operator that evaluates the given expression and returns undefined. It's often used in minified / uglified code, because void 0 is shorter than undefined. And it is used as "pure" undefined. In clean code it can be confusing and it entices to disguise problems. There are many articles in the web. (just google it. "eslint no-void") The words here are limited. :D Finally it's up to you (the developer) how to write code and for what context. (professional clean code or amateur. The freedom in JavaScript is a blessing and a curse at the same time.) – 
        Domske                                                  <StackOverflow>
        Jan 28, 2020 at 14:36

    Ref:
      https://github.com/typescript-eslint/typescript-eslint/blob/HEAD/packages/eslint-plugin/docs/rules/no-floating-promises.md#ignorevoid
  */

  const lastPlaceRef = useIntersectionObserver(
    // callback
    () => {
      void fetchPlaces(places.length).then(newPlaces => setPlaces(places => [...places, ...newPlaces]))
    },
    
    // only fetch api when has next page and loading is false
    [hasNextPage, !loading]
  );

  
  useEffect(() => {
    void fetchPlaces().then(setPlaces);
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
      ...Object.fromEntries([...searchParams]),
      property_type: propertyTypeId,
    };

    if(!propertyTypeId) delete params.property_type;

    const options = {
      pathname: location.pathname === '/' ? 'places' : location.pathname,
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
              { propertyTypeList.length > 0 
                ? propertyTypeList.map((pt, i) => (
                    <div 
                      className={`py-3 flex justify-center items-center flex-col ${pt.id === propertyType ? 'border-b-[2px] border-black' : 'opacity-60'} cursor-pointer`} key={pt.name + i}
                      onClick={() => hanldleFilterPlaceByPropertyType(pt.id)}
                    >
                      <img className={`w-8 h-8 ${!i && ' max-w-none'}`} src={pt.src} />
                      <p className="mt-1 text-[12px] font-medium whitespace-nowrap">{pt.name}</p>
                    </div>
                  ))
                : <Spinner />
              }
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
          className={`relative flex items-center mx-auto justify-center lg:col-span-1 md:col-span-2 border border-gray-300 rounded-md w-[120px] h-[60px] cursor-pointer translate-y-1 hover:border-gray-primary hover:bg-gray-100 transition-all ${filterCriteriaNumber ? 'border-gray-primary' : ''}`}
          onClick={() => setIsFilterModalOpen(true)}
        >
          <CgFilters className=" w-6 h-6" />
          <p className=" ml-2">Filter</p>
          { filterCriteriaNumber > 0 &&  <span className="absolute -top-2 -right-2 bg-black text-sm py-1 px-2 text-white rounded-full">{filterCriteriaNumber}</span> }
        </div>
      </div>
      
      <div className="grid 2xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3 md:gap-5">
        { places.length > 0 && 
          places.map((place, i, places) =>
            <div ref={places.length - 1 === i ? lastPlaceRef : null} key={place.id}>
              <PlaceCard place={place} />
            </div> 
          ) 
        }
        
        { loading && <PlaceCardSkeleton cards={12} /> }
        { (!loading && !places.length) && <div className=" col-span-10 text-3xl opacity-70 font-bold text-center py-[250px]">No results</div> }
      </div>

      { isCreatePlaceModalOpen && <CreatePlaceModal /> }
      { isFilterModalOpen && <FilterModal setFilterCriteriaNumber={setFilterCriteriaNumber} /> }
      { isSearchModalOpen && <SearchModal /> }
    </div>
  );
}