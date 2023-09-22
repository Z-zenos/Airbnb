import Button from "../components/Button/Button";
import { AiFillStar, AiOutlineRight } from "react-icons/ai";
import { BiSolidAward } from "react-icons/bi";
import { AiOutlineHeart } from "react-icons/ai";
import { CiShare1 } from "react-icons/ci";
import { CgMenuGridO } from "react-icons/cg";
import { GiDesk } from "react-icons/gi";
import { BsCurrencyDollar } from "react-icons/bs";

import Input from "../components/Input/Input";
import DateRange from "../components/DateRange/DateRange";
import { DateRange as SimpleDateRange } from 'react-date-range';
import { useRef, useContext, useEffect, useState } from "react";
import useWindowDimensions from "../hooks/useWindowDementions";
import Navbar from "../components/Navbar/Navbar";
import useOnScreen from "../hooks/useOnScreen";
import { PlaceContext } from "../contexts/place.context";

import axios from "axios";

export default function PlacePage() {
  const { width } = useWindowDimensions();

  const purchaseCardRef = useRef(null);
  const isPurchaseCardVisible = useOnScreen(purchaseCardRef);

  const photosRef = useRef(null);
  const amenitiesRef = useRef(null);
  const reviewsRef = useRef(null);
  const locationRef = useRef(null);

  const {
    selectionRange, handleSelectDateRange
  } = useContext(PlaceContext);

  const [place, setPlace] = useState({});
  const [amenities, setAmenities] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/places/65058538d31130157a5a2a2a');
        setPlace(() => res.data.data.place);

        const amenityList = res.data.data.place.amenities;

        amenityList.forEach(async (amenity) => {
          const resIcon = await axios.get(`/amenities/${amenity.id}`, { responseType: 'arraybuffer' });
          const base64 = btoa(new Uint8Array(resIcon.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            '',
          ));

          setAmenities(prevAmenities => [ ...prevAmenities, {
            name: amenity.name,
            shortDesc: amenity.shortDesc,
            src: `data:;base64,${base64}`
          } ]);
        });

      } catch(err) {
        console.error(err);
      }
    })();
  }, []);

  const scrollToSection = ref => ref.current.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  });
  
  function handleScrollTo(ev) {
    scrollToSection({
      Photos: photosRef,
      Amenities: amenitiesRef,
      Reviews: reviewsRef,
      Location: locationRef
    }[ev.target.textContent]);
  }

  function capitalizeFirstLowercaseRest(str) {
    return (
      str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
    );
  }

  return (
    <div className=" lg:w-3/5 mx-auto">
      <Navbar className="flex justify-between items-center w-full">
        <div className="flex gap-10 text-sm font-medium cursor-pointer h-full" onClick={handleScrollTo}>
          <span className="flex h-full items-center border-b-white border-b-2 hover:border-b-primary">Photos</span>
          <span className="flex h-full items-center border-b-white border-b-2 hover:border-b-primary">Amenities</span>
          <span className="flex h-full items-center border-b-white border-b-2 hover:border-b-primary">Reviews</span>
          <span className="flex h-full items-center border-b-white border-b-2 hover:border-b-primary">Location</span>
        </div>

        {!isPurchaseCardVisible && (
          <div className="flex justify-start items-center">
          <div className="w-[140px]">
          <span className="-translate-y-1 font-light text-sm line-through text-gray-400"><span className="font-medium text-lg"><BsCurrencyDollar className="inline -translate-y-[2px]" />{place.price}</span></span>
            <span className="-translate-y-1 font-light text-sm"><span className="font-medium text-lg"><BsCurrencyDollar className="inline -translate-y-[2px]" />{place.price}</span> night</span>
            <div className="text-[12px]">
              <span className=""><AiFillStar className="inline font-medium text-yellow-400" /> 4.88</span>
              <span className="mx-1 font-medium">·</span>
              <span className="text-gray-500">205 reviews</span>
            </div>
          </div>

          <button 
            className="rounded-md text-center p-2 cursor-pointer bg-primary border border-primary text-white font-bold hover:bg-white hover:text-primary "
            type="submit"
          >
            Reverse
          </button>
          </div>
        )}
      </Navbar>

      <div className="p-6">

        <h2 className="font-bold text-2xl mb-1">{place.name}</h2>
        <div className="flex justify-between items-center">
          <div className="text-sm">
            <span className="font-medium"><AiFillStar className="inline" /> 4.88</span>
            <span className="mx-2 font-medium">·</span>
            <span className="underline font-medium">205 reviews</span>
            <span className="mx-2 font-medium">·</span>
            <span><BiSolidAward className="inline" /> Superhost</span>
            <span className="mx-2 font-medium">·</span>
            <span className="underline font-medium">Hibhi, Himachai Pradesh, India</span>
          </div>
          <div className="gap-1 flex">
            <Button icon="share" title="Share" className="flex items-center border-none py-1 px-2 gap-2 hover:bg-gray-100 transition-all rounded-md underline font-medium text-sm" iconClassName="translate-y-[2px]">
              <CiShare1 />
            </Button>

            <Button icon="heart" title="Heart" className="flex items-center border-none py-1 px-2 gap-2 hover:bg-gray-100 transition-all rounded-md underline font-medium text-sm" iconClassName="translate-y-[2px]" >
              <AiOutlineHeart />
            </Button>
          </div>
        </div>

        <div className="image-container w-full mt-6 py-2 h-[480px] relative" ref={photosRef}>
          <div className="-m-1 h-full flex md:-m-2">
            <div className="flex h-full w-1/2 flex-wrap">
              <div className="w-1/2 p-1 md:p-2">
                <img
                  alt="gallery"
                  className="block h-full w-full rounded-lg object-cover object-center"
                  src="https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(70).webp" />
              </div>
              <div className="w-1/2 p-1 md:p-2">
                <img
                  alt="gallery"
                  className="block h-full w-full rounded-lg object-cover object-center"
                  src="https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(72).webp" />
              </div>
              <div className="w-full h-3/5 p-1 md:p-2">
                <img
                  alt="gallery"
                  className="block w-full h-full rounded-lg object-cover object-center"
                  src="https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(73).webp" />
              </div>
            </div>
            <div className="flex w-3/5 h-full flex-wrap ">
              <div className="w-full h-full p-1 md:p-2">
                <img
                  alt="gallery"
                  className="block h-full w-full rounded-lg object-cover object-center"
                  src="https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(74).webp" />
              </div>
            </div>
          </div>

          <Button className="absolute flex items-center border border-gray-700 py-1 px-2 gap-2 hover:bg-gray-100 transition-all rounded-md font-light text-sm bottom-6 right-8 md:bottom-12 md:right-6 bg-white" title="Show all photos" >
            <CgMenuGridO />
          </Button>

        </div>

        <div className="h-[1px] bg-gray-300 mt-1"></div>

        <div className="relative flex justify-between items-start gap-10">
          <div className="w-3/5 mt-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <span>{place.guests} guests</span>
                <span className="mx-2 font-medium">·</span>
                <span>{place.bedrooms} bedrooms</span>
                <span className="mx-2 font-medium">·</span>
                <span>{place.beds} beds</span>
                <span className="mx-2 font-medium">·</span>
                <span>{place.bathrooms} bath</span>
              </div>

              <div className="rounded w-14 h-14">
                <img src="https://a0.muscache.com/im/pictures/user/d87628a6-3c1a-4e2e-a4ae-7743ab5f6ece.jpg?im_w=240" className="rounded-full w-full h-full" />
              </div>
            </div>
            <div className="h-[1px] bg-gray-300 mt-1"></div>

            <div className="gap-2 pt-8">
              <div className="flex justify-start gap-8 px-6 mb-8">
                <span><GiDesk className="text-3xl" /></span>
                <div>
                  <p className="font-medium">Dedicated workspace</p>
                  <p className=" text-gray-600 text-sm font-light">
                    A common area with wifi that’s well-suited for working.
                  </p>
                </div>
              
              </div>

              <div className="flex justify-start gap-8 px-6 mb-8">
                <span><GiDesk className="text-3xl" /></span>
                <div>
                  <p className="font-medium">Daleep is a Superhost</p>
                  <p className=" text-gray-600 text-sm font-light">
                    Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.
                  </p>
                </div>
              
              </div>

              <div className="flex justify-start gap-8 px-6 mb-8">
                <span><GiDesk className="text-3xl" /></span>
                <div>
                  <p className="font-medium">Dedicated workspace</p>
                </div>
              
              </div>
            </div>

            <div className="h-[1px] bg-gray-300"></div>

            <div className="py-8 px-2">
              <div className="font-light leading-[24px] text-ellipsis whitespace-pre-wrap overflow-hidden" style={{
                'display': '-webkit-box',
                '-webkit-line-clamp': '6',
                '-moz-box-orient': 'vertical'
              }}>
                <p>
                  { place.description }
                </p>
              </div>

              <div className="mt-4 cursor-pointer">
                <span className="font-medium underline">Show more </span>
                <AiOutlineRight className="inline" />
              </div>
            </div>

            <div className="h-[1px] bg-gray-300"></div>

            <div className="py-8 px-2" ref={amenitiesRef}>
              <h3 className="font-medium text-2xl">What this place offers</h3>
              <div className="mt-4">
                { amenities.length && amenities.slice(0, 6).map(amenity => (
                  <div className="flex gap-4 items-center mb-4" key={amenity.id}>
                    <span>
                      <img className="inline text-[24px] font-light w-[25px] h-[25px]" src={amenity.src} />
                    </span>
                    <span className="">{capitalizeFirstLowercaseRest(amenity.name)}</span>
                  </div>
                ))}
                

                {/* <div className="flex gap-4 items-center">
                  <span className="relative before:absolute before:w-[2px] before:h-[140%] before:bg-black before:block before:-rotate-45 before:left-1/2 before:-top-1">
                    <BsMicrosoftTeams className="inline text-[24px] font-light" />
                  </span>
                  <span className="font-light line-through">Ms.Team</span>
                </div> */}
              </div>

              <Button className="border border-black py-[10px] px-6 rounded-lg mt-8 hover:bg-gray-100" title="Show all 10 amenities" />
            </div>

            <div className="h-[1px] bg-gray-300"></div>

            <div className="py-8 px-2">
              <h3 className="text-2xl mb-2">7 nights in Graeter London</h3>
              <p className="font-light text-sm text-gray-600">Oct, 9 2023 - Oct 16, 2023</p>
              <div>
              <SimpleDateRange
                onChange={handleSelectDateRange}
                months={width < 1000 ? 1 : 2}
                minDate={new Date()}
                ranges={[selectionRange]}
                direction="horizontal"
                rangeColors={["#ff385c"]}
                className={"my-8 text-black " + (width < 1000 ? 'w-full text-[16px] [&_.rdrMonth]:w-full' : '')}
              />
              </div>
            </div>

          </div>

          <div ref={purchaseCardRef} className="rounded-md shadow-sm shadow-gray-400 py-7 px-5 w-[35%] ml-10 my-10 border border-gray-30 sticky right-2 top-32">
            <div className="flex justify-between items-center">
              <p className="-translate-y-1"><span className="font-medium text-2xl"><BsCurrencyDollar className="inline -translate-y-[2px]" />{place.price}</span> night</p>
              <div>
                <span className="font-medium"><AiFillStar className="inline text-yellow-400" /> 4.88</span>
                <span className="mx-2 font-medium">·</span>
                <span className="underline font-light text-sm">205 reviews</span>
              </div>
            </div>

            <div className="mt-4">
              
              <DateRange />
              <Input label="GUESTS" type="number" className="border-t-0 rounded-bl-xl rounded-br-xl" />

            </div>
            
            <button 
              className=" w-full bottom-[2px] rounded-md text-center p-2 cursor-pointer bg-primary border border-primary text-white font-bold hover:bg-white hover:text-primary my-4 mb-8"
              type="submit"
            >
              Reverse
            </button>

            <div className=" font-light">
              <div className="flex justify-between items-center mb-4">
                <span className="underline">
                  <BsCurrencyDollar className="inline -translate-y-[2px]" />
                  {place.price} x <span>2 nights</span>
                </span>
                <span><BsCurrencyDollar className="inline text-gray-700 -translate-y-[2px]" />144</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="underline">
                  Airbnb service fee
                </span>
                <span><BsCurrencyDollar className="inline text-gray-700 -translate-y-[2px]" />144</span>
              </div>
            </div>

            <div className="h-[1px] bg-gray-300"></div>

            <div className="flex justify-between items-center mt-4 font-medium">
              <p>Total before taxes</p>
              <p><BsCurrencyDollar className="inline -translate-y-[2px]" />164</p>
            </div>
          </div>
        </div>

        <div className="h-[1px] bg-gray-300 mt-1"></div>

        <div className="py-8 px-2 text-xl">
          <div className="font-medium">
            <span className=""><AiFillStar className="inline text-yellow-400" /> 4.88</span>
            <span className="mx-2 font-medium">·</span>
            <span className="underline">205 reviews</span>
          </div>

          <div className="mt-8" ref={reviewsRef}>
            <div className="my-2">
              <div className="flex gap-3 items-center justify-start mb-3">
                <img src="https://a0.muscache.com/im/users/7179431/profile_pic/1372514494/original.jpg?im_w=240" className="rounded-full w-10 h-10" />

                <div>
                  <p className="text-sm font-medium">Meg</p>
                  <p className="text-gray-500 font-light text-sm">September 2023</p>
                </div>
              </div>
              <p className="text-[16px] font-light">
                Both Amelia and her lovely home are warm and welcoming, and the bed was super comfy. Thank you so much x.
              </p>
            </div>
          </div>
          
          <Button className="border border-black py-[10px] px-6 rounded-lg mt-8 hover:bg-gray-100 text-[16px]" title="Show all 90 reviews" />
          
        </div>

        <div className="h-[1px] bg-gray-300 mt-1"></div>
      
        <div className="py-8 px-2" ref={locationRef}>
          <h3 className="text-2xl font-medium">Where you{"'"}be</h3>

          {/* 
            Two options for q=
            + q=lat,long -> q=25.30{place.price}008,51.4803216
            + q=name_address -> q=morklake or q=Google, 8th Avenue, New York, NY, USA
          */}
          { place.location && <iframe className="mt-6 mx-auto" width="800" height="500" id="gmap_canvas" src={`https://maps.google.com/maps?q=${place.location.coordinates[1]},${place.location.coordinates[0]}&t=&z=13&ie=UTF8&iwloc=&output=embed&hl=en`} >
          </iframe>}
        </div>
      </div>
    </div>
  );
}