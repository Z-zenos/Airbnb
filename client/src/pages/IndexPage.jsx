import axios from "axios";
import { useContext, useEffect, useState } from "react";
import capitalizeFirstLetter from "../utils/capitalizeFirstLetter";
import { CgFilters } from "react-icons/cg";
import { SlMap } from "react-icons/sl";
import {BsCaretLeft, BsCaretRight} from "react-icons/bs";
import useHorizontalScroll from "../hooks/useHorizontalScroll";
import PlaceCard from "../components/PlaceCard/PlaceCard";
import { ModalContext } from "../contexts/modal.context";
import FilterModal from "../components/Modals/FilterModal";
import { useNavigate, createSearchParams, useLocation, useSearchParams } from "react-router-dom";
import PlaceCardSkeleton from "../components/PlaceCard/PlaceCardSkeleton";
import Spinner from "../components/Spinner/Spinner";
import useIntersectionObserver from "../hooks/useIntersectionObserver";
import Button from "../components/Button/Button";
import Map from "../components/Map";
import { IntlContext } from "../contexts/intl.context";

export default function IndexPage() {
  const { 
    setIsFilterModalOpen, 
    isFilterModalOpen,
  } = useContext(ModalContext);
  const scrollRef = useHorizontalScroll();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const [propertyTypeList, setPropertyTypeList] = useState([]);
  const [places, setPlaces] = useState([]);
  const [propertyType, setPropertyType] = useState(0);
  const [isHideScrollBtn, setIsHideScrollBtn] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [filterCriteriaNumber, setFilterCriteriaNumber] = useState(0);
  const [nextPage, setNextPage] = useState(1);
  const [isURLChanged, setIsURLChanged] = useState(true);
  const [isShowMap, setIsShowMap] = useState(false);
  const { exchangeRate } = useContext(IntlContext);

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
  const fetchPlaces = async (page = 1, limit = 12) => {
    try {
      setLoading(true);
      if(!location.search) setFilterCriteriaNumber(0);

      const res = await axios.get(`${location.pathname !== '/' ? location.pathname : 'places'}${location.search ? location.search : ''}${location.search ? '&' : '?'}page=${page}&limit=${limit}`);

      if(res.data.total <= limit * page) setHasNextPage(false);
      else setNextPage(page + 1);
      
      setLoading(false);
      setIsURLChanged(false);

      return res.data.data.places.map(place => ({ 
        ...place, 
        price: exchangeRate(place.price), 
        price_discount: exchangeRate(place.price_discount),
        price_diff: exchangeRate(place.price -  Math.trunc(place.price * place.price_discount))
      }));

    } catch (err) {
      console.error(err);
      setLoading(false);
      return [];
    } 
  }

  const lastPlaceRef = useIntersectionObserver(() => {
    void fetchPlaces(nextPage).then(newPlaces => setPlaces(places => [...places, ...newPlaces]));
  }, [hasNextPage, !loading]);

  useEffect(() => {
    setIsURLChanged(true);
    void fetchPlaces().then(setPlaces);
    setHasNextPage(true);
    setNextPage(1);

    if(!searchParams.get('property_type')) setPropertyType(0);

    setTimeout(() => {
      window.scrollTo({top: 0, behavior: 'smooth'});
    }, 500);
  }, [JSON.stringify(location)]);

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
    <div className="relative">
      <div className="lg:px-20 md:px-10 grid grid-cols-10 items-center gap-6 fixed top-17 bg-white shadow-md z-10">
        <div className="mt-4 grid grid-cols-12 items-center lg:col-span-9 md:col-span-8">
          { isHideScrollBtn !== -1 && 
            <BsCaretLeft 
              className="w-[40px] h-[40px] cursor-pointer border rounded-full p-2 opacity-60 border-gray-500 hover:scale-105 hover:shadow-md hover:shadow-gray-500 col-span-1 mx-auto xl:translate-x-[100%]" 
              onClick={() => scrollHorizontal(-400)} 
            />
          }

          <div 
            className={`
              relative mx-4 
              ${isHideScrollBtn !== -1 
                ? 'before:absolute before:bottom-0 col-span-10 before:h-full before:left-[-10px] before:w-4 before:z-10 before:bg-gradient-to-b before:from-transparent before:to-[#fdfdfd]' 
                : 'col-span-11'
              } 
              ${isHideScrollBtn !== 1 
                ? 'after:absolute after:bottom-0 after:h-full after:w-4 after:z-10 after:right-[-10px] after:bg-gradient-to-b after:from-transparent after:to-[#fdfdfd]' 
              : 'col-span-11'
              }
            `}
          >
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
      
      <div 
        className={`
          h-[85vh] pt-[12vh] lg:mt-0 
          ${isShowMap ? 'grid grid-cols-10 gap-4' : ''}
        `}
      >
        <div className={`lg:px-20 md:px-10 grid  md:gap-5 ${isShowMap ? 'col-span-6 2xl:grid-cols-3 overflow-y-scroll md:grid-cols-2' : '2xl:grid-cols-6 md:grid-cols-3 lg:grid-cols-4'}`}>
          { (places.length > 0 && !isURLChanged) &&
            places.map((place, i, places) =>
              <div ref={places.length - 1 === i ? lastPlaceRef : null} key={place.id}>
                <PlaceCard className={`${isShowMap ? '2xl:w-[320px] md:w-[240px]' : ''}`} place={place} />
              </div> 
            ) 
          }
          
          { loading && <PlaceCardSkeleton className={`${isShowMap ? '2xl:w-[320px] md:w-[240px]' : ''}`} cards={12} /> }
          { (!loading && !places.length) && <div className=" col-span-10 text-3xl opacity-70 font-bold text-center py-[250px]">No results</div> }
        </div>

        { isShowMap && (
          <div className="col-span-4 h-full border-l pl-1 border-l-primary">
            <Map 
              locations={places?.map(place => ({
                address: place.location.address,
                price: place.price,
                id: place.id,
                image_cover: place.images[0],
                coordinate: place.location.coordinates,
                name: place.name,
                rating: place.average_ratings,
              }))} 
              className="h-full" 
            />
          </div>
        )}
      </div>

      { isFilterModalOpen && <FilterModal setFilterCriteriaNumber={setFilterCriteriaNumber} /> }

      <Button outline={false} className="fixed top-[85%] z-40 left-1/2 -translate-x-1/2 hover:text-primary hover:bg-white shadow-[rgba(0,_0,_0,_0.19)_0px_10px_20px,_rgba(0,_0,_0,_0.23)_0px_6px_6px] hover:scale-105" label="Show map" onClick={() => setIsShowMap(!isShowMap)}>
        <SlMap className="mr-2" />
      </Button>
    </div>
  );
}