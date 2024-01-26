import { FaAngleLeft, FaStar } from "react-icons/fa6";
import Button from "../components/Button/Button";
import { LiaBusinessTimeSolid } from "react-icons/lia";
import { useNavigate, useSearchParams } from "react-router-dom";
import Checkout from "../components/Checkout/Checkout";
import axios from "axios";
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner/Spinner";
import GuestInput from "../components/Input/GuestInput";
import ToggleButton from "../components/Button/ToggleButton";
import DateRange from "../components/DateRange/DateRange";
import useDateRange from "../hooks/useDateRange";
import Modal from "../components/Modals/Modal";

export default function BookingPage() {
  const navigate = useNavigate();
  const placeId = location.pathname.slice(location.pathname.lastIndexOf('/') + 1);
  const [place, setPlace] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [guests, setGuests] = useState({
    adults: +searchParams.get("adults") || 1,
    children: +searchParams.get("children") || 0,
    pets: +searchParams.get("pets") || 0,
    total: +searchParams.get("adults") + (+searchParams.get("children")),
  });

  const [isOpenPaymentModal, setIsOpenPaymentModal] = useState(false);
  const [addMessage, setAddMessage] = useState(false);
  const [addPhone, setAddPhone] = useState(false);

  const {
    checkInDate, checkOutDate,
    handleSelectDateRange,
    selectionRange
  } = useDateRange(
    +searchParams.get('checkInDate'), 
    +searchParams.get('checkOutDate')
  );

  const datediff = (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24) + 1;

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`places/${placeId}`);
        setPlace(res.data.data.place);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  function calculateFees(airbnbServiceFee = 1) {
    const total = place?.price * datediff;
    return airbnbServiceFee + (datediff 
      ? Math.trunc(total - total * place?.price_discount)
      : Math.trunc(place?.price - place?.price * place?.price_discount)); 
  }

  return (
    <div className="2xl:w-[60%] xl:w-[60%] lg:w-[60%] md:w-[100%] sm:block mx-auto md:px-10 mb-10 md:grid sm:grid-cols-4 lg:grid-cols-5 md:gap-10 lg:gap-20 p-10">
      { isLoading ? <Spinner className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" /> : (
        <>
          <div className="lg:col-span-3 sm:col-span-2">
            <p 
              className="text-2xl flex items-center "
              onClick={() => navigate(`/places/${place?.id}`)}
            >
              <FaAngleLeft className="inline cursor-pointer" />
              Request to Book
            </p>
            <div className="text-[15px] py-6 border-b border-b-gray-300">
              <p className="font-medium text-xl mb-4">
                Your trip
              </p>
              <div className="">
                <DateRange 
                  className="rounded-tl-md rounded-tr-md border-b-0"
                  checkin={checkInDate}
                  checkout={checkOutDate}
                  onDateRangeChange={handleSelectDateRange}
                  selectionRange={selectionRange}
                  calendarClassName="left-0"
                />
                <GuestInput 
                  className="rounded-bl-md rounded-br-md h-16" 
                  guests={guests}
                  setGuests={setGuests}
                  max_guests={place?.guests}
                  max_children={place?.rules?.children}
                  pets_allowed={place?.rules?.pets_allowed}
                  max_pets={place?.rules?.pets}
                  menuClassName="left-0 top-14"
                />
              </div>
            </div>

            { isOpenPaymentModal && (
              <Modal
                isOpen={isOpenPaymentModal} 
                onClose={() => setIsOpenPaymentModal(false)} 
                title="Pay with"
                body={
                  <Checkout 
                    placeId={placeId} 
                    guests={guests}
                    checkin={checkInDate}
                    checkout={checkOutDate} 
                    hasMessage={addMessage}
                    hasPhone={addPhone} 
                  />
                }
                className="max-h-[800px] overflow-y-scroll"
              />
            ) }

            <div className="text-[15px] py-6 border-b border-b-gray-300">
              <p className="font-medium text-xl mb-4">Required for your trip</p>
              <div className="flex justify-between text-[16px] gap-6">
                <div className="flex-1">
                  <p className="text-[18px] mb-1">Message the Host</p>
                  <p className="font-light">Share why you&lsquo;re traveling, who&lsquo; coming with you, and what you love about the space.</p>
                </div>
                <ToggleButton 
                  selected={addMessage} 
                  onClick={() => setAddMessage(!addMessage)}
                  className="w-18"
                />

              </div>

              <div className="flex justify-between mt-5 text-[16px] gap-6">
                <div className="flex-1">
                  <p className="text-[18px] mb-1">Phone number</p>
                  <p className="font-light">Add and confirm your phone number to get trip updates.</p>
                </div>
                <ToggleButton 
                  selected={addPhone} 
                  onClick={() => setAddPhone(!addPhone)}
                  className="w-18"
                />
              </div>
              
            </div>

            <div className="text-[15px] py-6 border-b border-b-gray-300">
              <p className="font-medium text-xl mb-4">Cancellation policy</p>
              <p className="font-light text-[16px]">Cancel before 12:00 PM on Jan 10 for a partial refund. After that, your refund depends on when you cancel. Learn more</p>
            </div>

            <div className="text-[15px] py-6 border-b border-b-gray-300">
              <p className="font-medium text-xl mb-4">Ground rules</p>
              <div className="font-light text-[16px]">
                <p className="mb-3">We ask every guest to remember a few simple things about what makes a great guest.</p>
                <ul className="list-disc pl-4">
                  <li>Follow the house rules</li>
                  <li>Treat your Host’s home like your own</li>
                </ul>
              </div>
            </div>

            <div className="text-[15px] py-6 border-b border-b-gray-300 flex gap-4">
              <LiaBusinessTimeSolid className="text-primary w-[100px] h-10"/>
              <p className="text-[16px]">
                <span className="font-semibold mr-1">Your reservation won’t be confirmed until the Host accepts your request (within 24 hours).</span>
                <span>You won’t be charged until then.</span>
              </p>
            </div>

            <p className="text-sm my-4">
              By selecting the button below, I agree to the Host&lsquo;s House Rules, Ground rules for guests, Airbnb&lsquo;s Rebooking and Refund Policy, and that Airbnb can charge my payment method if I’m responsible for damage. I agree to pay the total amount shown if the Host accepts my booking request.
            </p>
            <Button
              type="submit"
              onClick={() => setIsOpenPaymentModal(true)}
              className="mt-8 hover:bg-white hover:text-primary"
            >
              Request to book
            </Button>
          </div>
          <div className="lg:col-span-2 sm:col-span-2 relative">
            <div className="sticky mt-20 p-8 sm:flex sm:justify-between sm:items-center sm:relative md:block border border-gray-300 rounded-xl">
              <div className="flex gap-4 pb-5 border-b border-b-gray-300">
                <img src={`http://localhost:3000/images/places/${place?.images[0]}`} className="w-[150px] h-[120px] rounded-xl" />
                <div className="flex flex-col justify-between">
                  <div>
                    <p className="font-light mb-1 opacity-70 text-[13px]">Room in {place?.location?.address}</p>
                    <p className="font-light text-sm">{place?.name}</p>
                  </div>
                  <p className="text-sm">
                    <span className="font-semibold flex-inline mr-1 items-center">
                      <FaStar className="inline" />
                      <span>{place?.average_ratings}</span>
                    </span>
                    <span className="font-light opacity-70">({place?.quantity_ratings})</span>
                  </p>
                </div>
              </div>
              <div className="py-6 border-b border-b-gray-300">
                <p className="font-medium text-xl mb-4">
                  Price details
                </p>
                <ul className="flex flex-col gap-4 font-light">
                  <li className="flex justify-between items-center">
                    <span className="underline">
                      ${place?.price} x {datediff} nights
                    </span>
                    <span>${place?.price * datediff}</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="underline">
                      Discounts
                    </span>
                    <span className=" text-green-600">-{place?.price_discount * 100}%</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="underline">
                      Airbnb service fee
                    </span>
                    <span>$1</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6">
                <p className="flex justify-between items-center text-lg font-medium">
                  <span>Total <span>(USD)</span></span>
                  <span>${calculateFees()}</span>
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}