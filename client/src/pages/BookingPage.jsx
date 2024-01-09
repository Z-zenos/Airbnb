import { FaAngleLeft, FaStar } from "react-icons/fa6";
import Button from "../components/Button/Button";
import { LiaBusinessTimeSolid } from "react-icons/lia";
import { useNavigate } from "react-router-dom";

export default function BookingPage() {
  const navigate = useNavigate();

  return (
    <div className="2xl:w-[60%] xl:w-[60%] lg:w-[60%] md:w-[100%] sm:block mx-auto md:px-10 mb-10 md:grid sm:grid-cols-4 lg:grid-cols-5 md:gap-10 lg:gap-20 p-10">
      <div className="lg:col-span-3 sm:col-span-2">
        <p 
          className="text-2xl flex items-center "
          onClick={() => navigate('')}
        >
          <FaAngleLeft className="inline cursor-pointer" />
          Request to Book
        </p>
        <div className="text-[15px] py-6 border-b border-b-gray-300">
          <p className="font-medium text-xl mb-4">
            Your trip
          </p>
          <div className="flex justify-between mb-4">
            <div>
              <p className="text-[18px] mb-1">Dates</p>
              <p className="font-light">Jan 10 - 15</p>
            </div>
            <p 
              onClick={() => {}} 
              className="underline cursor-pointer text-[15px]"
            >
              Edit
            </p>
          </div>

          <div className="flex justify-between">
            <div>
              <p className="text-[18px] mb-1">Guests</p>
              <p className="font-light">1 guests</p>
            </div>
            <p 
              onClick={() => {}} 
              className="underline cursor-pointer text-[15px]"
            >
              Edit
            </p>
          </div>
        </div>

        <div className="text-[15px] py-6 border-b border-b-gray-300">
          <p className="font-medium text-xl mb-4">Pay with</p>
          <div>
          </div>
        </div>

        <div className="text-[15px] py-6 border-b border-b-gray-300">
          <p className="font-medium text-xl mb-4">Required for your trip</p>
          <div className="flex justify-between text-[16px] gap-6">
            <div>
              <p className="text-[18px] mb-1">Message the Host</p>
              <p className="font-light">Share why you&lsquo;re traveling, who&lsquo; coming with you, and what you love about the space.</p>
            </div>
            <Button
              onClick={() => {}}
              className="bg-white !text-black !border-black h-10 hover:bg-gray-200 transition-all"
            >
              Add
            </Button>
          </div>

          <div className="flex justify-between mt-5 text-[16px] gap-6">
            <div>
              <p className="text-[18px] mb-1">Phone number</p>
              <p className="font-light">Add and confirm your phone number to get trip updates.</p>
            </div>
            <Button
              onClick={() => {}}
              className="bg-white !text-black !border-black h-10 hover:bg-gray-200 transition-all"
            >
              Add
            </Button>
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
          onClick={() => {}}
          className="mt-8"
        >
          Request to book
        </Button>
      </div>
      <div className="lg:col-span-2 sm:col-span-2">
        <div className="fixed mt-20 p-8 sm:flex sm:justify-between sm:items-center sm:relative md:block border border-gray-300 rounded-xl">
          <div className="flex gap-4 pb-5 border-b border-b-gray-300">
            <img src="https://a0.muscache.com/im/pictures/miso/Hosting-13903824/original/82d996fb-d7c4-46a8-a713-febd281cd69f.jpeg?aki_policy=large" className="w-[150px] h-[120px] rounded-xl" />
            <div className="flex flex-col justify-between">
              <div>
                <p className="font-light mb-1 opacity-70 text-[13px]">Room in condo</p>
                <p className="font-light text-sm">Noble rooom into the historical Torino</p>
              </div>
              <p className="text-sm">
                <span className="font-semibold flex-inline mr-1 items-center">
                  <FaStar className="inline" />
                  <span>4,99</span>
                </span>
                <span className="font-light opacity-70">(170)</span>
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
                  $46.42 x 5 nights
                </span>
                <span>$232.09</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="underline">
                  Cleaning fee
                </span>
                <span>$21.90</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="underline">
                  Airbnb service fee
                </span>
                <span>$35.86</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="underline">
                  Taxes
                </span>
                <span>$12.59</span>
              </li>
            </ul>
          </div>
          <div className="pt-6">
            <p className="flex justify-between items-center text-lg font-medium">
              <span>Total <span>(USD)</span></span>
              <span>$302.44</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}