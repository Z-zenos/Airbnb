import Button from "../components/Button/Button";
import { AiFillStar, AiOutlineRight } from "react-icons/ai";
import { BiSolidAward, BiShieldQuarter } from "react-icons/bi";
import { CiShare1 } from "react-icons/ci";
import { CgMenuGridO } from "react-icons/cg";
import { GiDesk, GiBlackBook } from "react-icons/gi";
import { BsCurrencyDollar, BsCalendarWeek, BsHouses } from "react-icons/bs";
import { MdVerifiedUser } from "react-icons/md";
import { FaRegHeart, FaHeart } from "react-icons/fa6";

import Input from "../components/Input/Input";
import DateRange from "../components/DateRange/DateRange";
import { DateRange as SimpleDateRange } from 'react-date-range';
import { useRef, useContext, useEffect, useState } from "react";
import useWindowDimensions from "../hooks/useWindowDementions";
import Navbar from "../components/Navbar/Navbar";
import useOnScreen from "../hooks/useOnScreen";
import { PlaceContext } from "../contexts/place.context";

import axios from "axios";
import Modal from "../components/Modals/Modal";
import capitalizeFirstLetter from "../utils/capitalizeFirstLetter";
import { Link, useLocation } from "react-router-dom";
import { ModalContext } from "../contexts/modal.context";
import ImageModal from "../components/Modals/ImageModal";
import { UserContext } from "../contexts/user.context";

export default function PlacePage() {
  const { width } = useWindowDimensions();
  const { user, setUser } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const { isImageModalOpen, setIsImageModalOpen } = useContext(ModalContext);

  const purchaseCardRef = useRef(null);
  const isPurchaseCardVisible = useOnScreen(purchaseCardRef);

  const photosRef = useRef(null);
  const amenitiesRef = useRef(null);
  const reviewsRef = useRef(null);
  const locationRef = useRef(null);
  const location = useLocation();

  const {
    checkInDate, checkOutDate,
    selectionRange, handleSelectDateRange
  } = useContext(PlaceContext);

  const datediff = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);

  const [place, setPlace] = useState({});
  const [amenities, setAmenities] = useState([]);
  const priceAfterDiscount = place.price -  Math.trunc(place.price * place.price_discount / 100);
  const [heart, setHeart] = useState();

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(location.pathname);
        setPlace(() => res.data.data.place);
        setHeart(user?.wishlists?.includes(res.data.data.place?._id));
        setAmenities(() => res.data.data.place.amenities.map(a => ({
          name: capitalizeFirstLetter(a.name),
          src: a.iconImage,
          shortenDesc: a.shortenDesc
        })));

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

  async function handleUpdateWishlists() {
    try {
      setHeart(!heart);
      const res = await axios.patch(`/users/wishlists`, {
        place_id: place?._id,
        state: heart ? 'unheart' : 'heart',
      });

      setUser(res.data.data.user);
    } catch (err) {
      setHeart(user?.wishlists?.includes(place?._id));
    }
  }

  return (
    <>
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
              <span className="-translate-y-1 font-light text-sm line-through text-gray-400">
                <span className="font-medium text-lg">
                  <BsCurrencyDollar className="inline -translate-y-[2px]" />{place.price}
                </span>
              </span>
              <span className="-translate-y-1 font-light text-sm">
                <span className="font-medium text-lg mr-1">
                  <BsCurrencyDollar className="inline -translate-y-[2px]" />
                  {priceAfterDiscount}
                </span> 
                night
              </span>
              <div className="text-[12px]">
                <span className="">
                  <AiFillStar className="inline font-medium text-yellow-400" /> {place.average_ratings}
                </span>
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
      <div className="md:mt-[4vh] lg:mt-0 lg:w-3/5 mx-auto">

        <div className="p-6">

          <h2 className="font-bold text-2xl mb-1">{place?.name}</h2>
          <div className="flex justify-between items-center">
            <div className="text-[15px]">
              <span className="font-light"><AiFillStar className="inline" /> {place.average_ratings}</span>
              <span className="mx-2 font-light">·</span>
              <span className="underline font-light">205 reviews</span>
              <span className="mx-2 font-light">·</span>
              <span><BiSolidAward className="inline" /> Superhost</span>
              <span className="mx-2 font-light">·</span>
              <span className="underline font-light">{place.location?.address}</span>
            </div>
            <div className="gap-1 flex">
              <Button 
                label="Share" 
                className="flex items-center border-none py-1 px-2 gap-2 hover:bg-gray-200 transition-all rounded-md underline font-light text-sm" 
                iconClassName="translate-y-[2px]"
                outline={true}
                small={true}
              >
                <CiShare1 />
              </Button>

              <Button 
                label={heart ? 'Saved' : 'Save'} 
                className="flex items-center border-none py-1 px-2 gap-2 hover:bg-gray-200 transition-all rounded-md underline font-light text-sm" 
                iconClassName="translate-y-[2px]" 
                outline={true}
                small={true}
                onClick={async () => await handleUpdateWishlists()}
              >
                {heart ? (
                  <FaHeart
                    className={`w-5 h-5 text-primary transition-all active:scale-100`}
                  />
                ) : (
                  <FaRegHeart
                    className={`w-5 h-5 hover:scale-110 transition-all active:scale-80`}
                  />
                )}
              </Button>
            </div>
          </div>

          <div className="image-container w-full mt-6 py-2 relative" ref={photosRef}>
            { place.images && (
              <div className="-m-1 h-full flex md:-m-2">
                <div className="grid gap-[10px] grid-cols-4 w-full h-full">
                  <img
                    style={{ gridColumn: '1' }}
                    alt="gallery"
                    className="block w-full h-[230px] rounded-lg object-cover object-center"
                    src={`http://localhost:3000/images/places/${place?.images[0]}`} 
                  />
                  <img
                    style={{ gridColumn: '2' }}
                    alt="gallery"
                    className="block w-full h-[230px] rounded-lg object-cover object-center"
                    src={`http://localhost:3000/images/places/${place?.images[3]}`} 
                  />
                  <img
                    style={{ gridColumn: '1', gridRow: '2' }}
                    alt="gallery"
                    className="block w-full h-[230px] rounded-lg object-cover object-center"
                    src={`http://localhost:3000/images/places/${place?.images[1]}`} 
                  />
                  <img
                    style={{ gridColumn: '2' , gridRow: '2' }}
                    alt="gallery"
                    className="block w-full h-[230px] rounded-lg object-cover object-center"
                    src={`http://localhost:3000/images/places/${place?.images[2]}`} 
                  />
                  <img
                    style={{ gridColumn: '3 / span 2' , gridRow: '1 / span 2' }}
                    alt="gallery"
                    className="block w-full h-full max-h-[470px] rounded-lg object-cover object-center"
                    src={`http://localhost:3000/images/places/${place?.image_cover}`} 
                  />
                  
                </div>
              </div>
            )}

            <Button 
              className="absolute flex items-center border border-gray-700 py-1 px-2 gap-2 hover:bg-white hover:text-primary transition-all rounded-md font-light text-sm bottom-6 right-8 md:bottom-12 md:right-6 " label="Show all photos" 
              onClick={() => setIsImageModalOpen(true)}
            >
              <CgMenuGridO />
            </Button>
            { (isImageModalOpen && place.images) && <ImageModal images={place.images ? [place.image_cover, ...place.images] : []} /> }

          </div>

          <div className="h-[1px] bg-gray-300 mt-[60px]"></div>

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
                  <span>{place.bathrooms} bathrooms</span>
                </div>

                <Link to={`/users/profile/${place?.host?.id}`} className="w-12 h-12  border-primary rounded-full border-[1px] p-[2px]">
                  <img src={place.host?.avatar} className="rounded-full w-full h-full" />
                </Link>
              </div>
              <div className="h-[1px] bg-gray-300 mt-1"></div>

              <div className="gap-2 pt-8">
                <div className="flex justify-start items-center gap-8 px-6 mb-6">
                  <span><GiDesk className="text-3xl" /></span>
                  <div>
                    <p className="font-medium">Dedicated workspace</p>
                    <p className=" text-gray-600 text-sm font-light">
                      A common area with wifi that’s well-suited for working.
                    </p>
                  </div>
                
                </div>

                <div className="flex justify-start items-center gap-8 px-6 mb-6">
                  <span><BiSolidAward className="text-3xl" /></span>
                  <div>
                    <p className="font-medium">{place?.host?.name} is a Superhost</p>
                    <p className=" text-gray-600 text-sm font-light">
                      Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.
                    </p>
                  </div>
                
                </div>

                <div className="flex justify-start items-center gap-8 px-6 mb-6">
                  <span><BsCalendarWeek className="text-2xl" /></span>
                  <div>
                    <p className="font-medium">{place.rules?.cancellation_policy?.description}</p>
                  </div>
                
                </div>
              </div>

              <div className="h-[1px] bg-gray-300"></div>

              <div className="py-8 px-2">
                <div className="font-light leading-[24px] text-ellipsis whitespace-pre-wrap overflow-hidden" style={{
                  'display': '-webkit-box',
                  WebkitLineClamp: '6',
                  MozBoxOrient: 'vertical'
                }}>
                  <p>
                    { `${place.description} ${place.description} ${place.description} ${place.description}` }
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
                <div className="mt-4 xl:grid xl:grid-cols-2">
                  { amenities.length && amenities.slice(0, width > 1000 ? 12 : 6).map(amenity => amenity.src && (
                    <div className="flex gap-4 items-center mb-4" key={amenity.name}>
                      <span>
                        <img 
                          className="inline text-[24px] font-light w-[25px] h-[25px]" 
                          src={`http://localhost:3000/images/amenities/${amenity.src}`} 
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.style.display = 'none';
                          }} 
                        />
                      </span>
                      <span className="">{amenity.name}</span>
                    </div>
                  ))}
                  

                  {/* <div className="flex gap-4 items-center">
                    <span className="relative before:absolute before:w-[2px] before:h-[140%] before:bg-black before:block before:-rotate-45 before:left-1/2 before:-top-1">
                      <BsMicrosoftTeams className="inline text-[24px] font-light" />
                    </span>
                    <span className="font-light line-through">Ms.Team</span>
                  </div> */}
                </div>

                <Button className="border border-black py-[10px] px-6 rounded-lg mt-8 hover:bg-gray-100 hover:text-primary " label={`Show all ${place?.amenities?.length} amenities`} onClick={() => setOpen(true)} />
              </div>

              <div className="h-[1px] bg-gray-300"></div>

              <div className="py-8 px-2">
                <h3 className="text-2xl mb-2">7 nights in {place.location?.country}</h3>
                <p className="font-light text-sm text-gray-600">Oct, 9 2023 - Oct 16, 2023</p>
                <div>
                <SimpleDateRange
                  onChange={handleSelectDateRange}
                  months={width < 1000 ? 1 : 2}
                  minDate={new Date()}
                  ranges={[selectionRange]}
                  direction="horizontal"
                  rangeColors={["#ff385c"]}
                  className={"my-8 text-black " + (width < 1000 ? 'w-full text-[16px] [&_.rdrMonth]:w-full ' : '')}
                />
                </div>
              </div>

            </div>

            <div ref={purchaseCardRef} className="rounded-xl shadow-[rgba(0,_0,_0,_0.12)_0px_6px_16px] py-7 px-5 w-[35%] ml-10 my-10 border border-gray-30 sticky right-2 top-32">
              <div className="flex justify-between items-center">
                <p className="-translate-y-1"><span className="font-medium text-2xl"><BsCurrencyDollar className="inline -translate-y-[2px]" />{priceAfterDiscount}</span> night</p>
                <div>
                  <span className="font-medium"><AiFillStar className="inline text-yellow-400" /> {place.average_ratings}</span>
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
                    {priceAfterDiscount} x <span>{datediff} nights</span>
                  </span>
                  <span><BsCurrencyDollar className="inline text-gray-700 -translate-y-[2px]" />{priceAfterDiscount * datediff}</span>
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
                <p><BsCurrencyDollar className="inline -translate-y-[2px]" />{priceAfterDiscount * datediff + 144}</p>
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-gray-300 mt-1"></div>

          <div className="py-8 px-2 text-xl">
            <div className="font-medium">
              <span className=""><AiFillStar className="inline text-yellow-400" /> {place.average_ratings}</span>
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
            
            <Button className="border border-black py-[10px] px-6 rounded-lg mt-8 hover:bg-gray-100 text-[16px] hover:text-primary " label="Show all 90 reviews" />
            
          </div>

          <div className="h-[1px] bg-gray-300 mt-1"></div>
        
          <div className="py-8 px-2" ref={locationRef}>
            <h3 className="text-2xl font-medium">Where you{"'"}be</h3>

            {/* 
              Two options for q=
              + q=lat,long -> q=25.30{priceAfterDiscount}008,51.4803216
              + q=name_address -> q=morklake or q=Google, 8th Avenue, New York, NY, USA
            */}
            { place.location && <iframe className="mt-6 mx-auto" width="800" height="500" id="gmap_canvas" src={`https://maps.google.com/maps?q=${place.location.coordinates[1]},${place.location.coordinates[0]}&t=&z=13&ie=UTF8&iwloc=&output=embed&hl=en`} >
            </iframe>}
          </div>
        </div>

        {/* HOST */}
        <div className="h-[1px] bg-gray-300 mt-1"></div>
        <div className="py-8 px-8">
          <div className="grid grid-cols-2 gap-10">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-start gap-4">
                <Link to={`/users/profile/${place?.host?.id}`} className="rounded w-14 h-14">
                  <img src={place?.host?.avatar} className="rounded-full w-full h-full" />
                </Link>

                <div>
                  <p className="text-2xl font-medium">Hosted by {place?.host?.name}</p>
                  <p className="font-light opacity-60">Joined in July, 2018</p>
                </div>
              </div>

              <div className="flex justify-between items-center font-light mt-4">
                <p className="flex items-center justify-center gap-2">
                  <AiFillStar className="w-5 h-5" /> 33 Reviews
                </p>
                <p className="flex items-center justify-center gap-2">
                  <MdVerifiedUser className="w-5 h-5" /> Identity verified
                </p>
                <p className="flex items-center justify-center gap-2">
                  <BiSolidAward className="w-5 h-5" /> Superhost
                </p>
              </div>

              <div className="font-light my-4">
                { place?.host?.description }
              </div>

              <div>
                <p className="font-medium">{place?.host?.name} is a <span className="underline">Superhost</span></p>
                <p className="font-light">Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.</p>
              </div>
            </div>
            <div className="py-8">
              <Button label="Contact Host" outline={true} className="ml-8 hover:bg-gray-100" />
              <div className="flex justify-start items-center gap-2 mt-6">
                <span><BiShieldQuarter className="w-8 h-8 text-primary" /></span>
                <p className="font-light text-[14px]">To protect your payment, never transfer money or communicate outside of the Airbnb website or app.</p>
              </div>
            </div>
          </div>
        </div>

        {/* THINKS TO KNOW */}
        <div className="h-[1px] bg-gray-300 mt-1"></div>
        <div className="py-8 px-8">
          <h3 className="text-2xl font-medium">Things to know</h3>
          <div className="grid grid-cols-3">
            <div className="my-2">
              <p className="text-lg flex items-center gap-2"><BsHouses /> House rules</p>
              <div className="font-light text-[15px]">
                <p>Check-in after {new Date(place?.checkinout?.checkin_date).toLocaleDateString('en-US')}</p>
                <p>Checkout before {new Date(place?.checkinout?.checkout_date).toLocaleDateString('en-US')}</p>
                <p>{place.guests} guests max</p>
                {place.rules && Object.keys(place?.rules).map(rule => (
                  <p className={`${rule === '_id' || rule === 'cancellation_policy' || rule === 'additional_rules' ? 'hidden' : ''} font-light ${place.safety[rule] ? '' : 'line-through'}`} key={rule}>{capitalizeFirstLetter(rule.replace(/_/g, ' '))}</p>
                ))}
              </div>
            </div>
            <div className="my-2">
              <p className="text-lg flex items-center gap-2"><GiBlackBook /> Safety & property</p>
              <div className=" text-[15px]">
                {place.safety && Object.keys(place?.safety).map(sp =>  (
                  <p className={`${sp === '_id' ? 'hidden' : ''} font-light ${place.safety[sp] ? '' : 'line-through'}`} key={sp}>{capitalizeFirstLetter(sp.replace(/_/g, ' '))}</p>
                ))}
              </div>
            </div>
            <div className="my-2">
              <p className="text-lg flex items-center gap-2"><BsCalendarWeek /> Cancellation policy</p>
              <p className="font-light text-[15px]">{place.rules?.cancellation_policy?.description}</p>
            </div>
          </div>
        </div>

        <Modal isOpen={open} onSubmit={() => setOpen(false)} onClose={() => setOpen(false)} actionLabel={"Close"} >
          <div className="no-scrollbar overflow-y-auto text-left w-[600px] h-[600px] px-4">
            <h3 className="font-medium text-2xl my-8">What this place offers?</h3>
            { amenities.length && amenities.map((amenity, i) => (
              <div key={amenity.name + i} className="py-5 border-b-[1px] border-gray-200">
                <div className="font-light flex gap-5 items-center">
                  <img 
                    src={`http://localhost:3000/images/amenities/${amenity.src}`}  
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.style.display = 'none';
                      const aTitle = currentTarget.nextElementSibling.querySelector('.a-title');
                      aTitle.style.fontWeight = '500';
                      aTitle.style.fontSize = '20px';
                    }} 
                  />
                  <div>
                    <p className="a-title font-normal">{amenity.name}</p>
                    <p className="a-shortenDesc text-light text-sm text-gray-500">{amenity.shortenDesc}</p>
                  </div>
                </div>
              </div>
            ))
            }
          </div>
        </Modal>
      </div>
    </>
  );
}