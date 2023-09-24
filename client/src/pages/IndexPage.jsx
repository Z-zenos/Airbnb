import axios from "axios";
import { useEffect, useState } from "react";
import capitalizeFirstLetter from "../utils/capitalizeFirstLetter";

import {BsCaretLeft, BsCaretRight} from "react-icons/bs";
import useHorizontalScroll from "../hooks/useHorizontalScroll";
import PlaceCard from "../components/PlaceCard/PlaceCard";

export default function IndexPage() {
  const [placeTypeList, setPlaceTypeList] = useState([]);
  const [placeType, setPlaceType] = useState();
  const scrollRef = useHorizontalScroll();
  

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/places/place-types');

        setPlaceType(res.data.data.placeTypeList[0].id);

        setPlaceTypeList(() => res.data.data.placeTypeList.map(pt => ({
          id: pt.id,
          name: capitalizeFirstLetter(pt.name),
          src: `http://localhost:3000/images/place_types/${pt.iconImage}` 
        })));

      } catch (err) {
        console.error(err);
      }
    })();
  }, []);  

  function scrollHorizontal(scrollOffset) {
    scrollRef.current.scrollLeft += scrollOffset;
  }

  
  return (
    <div className="lg:px-20 md:px-10 mb-10">
      <div className="mt-4 flex justify-start items-center">
        <BsCaretLeft 
          className="h-full md:w-[120px] xl:w-[40px] cursor-pointer border rounded-full p-2 opacity-60 border-gray-500 hover:scale-105 hover:shadow-md hover:shadow-gray-500" 
          onClick={() => scrollHorizontal(-400)} 
        />
        

        <div className="relative mx-4 w-[90%] before:absolute before:bottom-0 before:h-full before:w-4 before:z-10 before:bg-gradient-to-b before:from-transparent before:to-[#fdfdfd] after:absolute after:bottom-0 after:h-full after:w-4 after:z-10 after:right-0 after:bg-gradient-to-b after:from-transparent after:to-[#fdfdfd]">
          <div 
            className="flex justify-start gap-8  overflow-auto scroll-smooth" 
            ref={scrollRef}
          >
            { placeTypeList.length && placeTypeList.map((pt, i) => (
                <div 
                  className={`py-3 flex justify-center items-center flex-col ${pt.id === placeType ? 'border-b-[2px] border-black' : 'opacity-60'} cursor-pointer`} key={pt.name + i}
                  onClick={() => setPlaceType(pt.id)}
                >
                  <img className="w-8" src={pt.src} />
                  <p className="mt-1 text-[12px] font-medium whitespace-nowrap">{pt.name}</p>
                </div>
              )
            )}
          </div>
        </div>


        <BsCaretRight 
          className="h-full md:w-[120px] xl:w-[40px] cursor-pointer border rounded-full p-2 opacity-60 border-gray-500 hover:scale-105 hover:shadow-md hover:shadow-gray-500 active:scale-100 active:shadow-none" 
          onClick={() => scrollHorizontal(400)}  
        />
      </div>
      
      <div className="flex flex-wrap items-center justify-between">
        <PlaceCard />
        <PlaceCard />
        <PlaceCard />
        <PlaceCard />
        <PlaceCard />
        <PlaceCard />
      </div>
    </div>
  );
}