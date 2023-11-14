import { AiOutlineFileProtect } from "react-icons/ai";
import { FaLock } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { useState } from "react";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";

export default function PersonalInfoPage() {
  const [info, setInfo] = useState({
    legalName: false,
    email: false,
    phone: false,
    emergencyContact: false 
  });

  function handleEditInfo(prop) {
    setInfo(prev => {
      const newInfo = { ...prev };
      newInfo[prop] = !newInfo[prop];
      Object.keys(newInfo).forEach(key => {
        if(key !== prop) newInfo[key] = false;
      });

      return newInfo;
    });
  }

  return (
    <div className="2xl:w-[70%] xl:w-[80%] lg:w-[80%] md:w-[100%] sm:block mx-auto md:px-10 mb-10 ">
      <h2 className="font-medium text-3xl my-10">Personal Info</h2>
      <div className="md:grid md:grid-cols-5 gap-20 py-10">
        <div className="col-span-3">
          <div className="grid grid-cols-11 gap-2 border-b border-b-gray-300 py-6">
            <div className=" col-span-10">
              <p className="text-[17px]">Legal name</p>
              { info['legalName'] 
                ? (
                  <div>
                    <p className="my-3 text-[14px] font-light opacity-60">
                      This is the name on your travel document, which could be a license or a passport.
                    </p>
                    <Input label="Legal name" className="my-3 rounded-lg" />
                    <Button label="Save" className=" hover:bg-white hover:text-primary px-6" />
                  </div>
                )
                : <p className="font-light opacity-60 text-[14px]">Tuấn Hoàng Anh</p>
              }
            </div>
            <p onClick={() => handleEditInfo('legalName')} className="underline cursor-pointer text-[15px]">{ info['legalName'] ? 'Cancel' : 'Edit' }</p>
          </div>

          <div className="grid grid-cols-11 gap-2 border-b border-b-gray-300 py-6">
            <div className=" col-span-10">
              <p className="text-[17px]">Email address</p>
              { info['email'] 
                ? (
                  <div>
                    <p className="my-3 text-[14px] font-light opacity-60">
                      Use an address you’ll always have access to.
                    </p>
                    <Input label="Email address" className="my-3 rounded-lg" />
                    <Button label="Save" className=" hover:bg-white hover:text-primary px-6" />
                  </div>
                )
                : <p className="font-light opacity-60 text-[14px]">h**1@gmail.com</p>
              }
              
            </div>
            <p onClick={() => handleEditInfo('email')} className="underline cursor-pointer text-[15px]">{ info['email'] ? 'Cancel' : 'Edit' }</p>
          </div>

          <div className="grid grid-cols-11 gap-2 border-b border-b-gray-300 py-6">
            <div className=" col-span-10">
              <p className="text-[17px]">Phone numbers</p>
              <p className="font-light opacity-60 text-[14px]">Add a number so confirmed guests and Airbnb can get in touch. You can add other numbers and choose how they’re used.</p>
            </div>
            <p onClick={() => {}} className="underline cursor-pointer text-[15px]">Edit</p>
          </div>

          <div className="grid grid-cols-11 gap-2 border-b border-b-gray-300 py-6">
            <div className=" col-span-10">
              <p className="text-[17px]">Emergency contact</p>
              <p className="font-light opacity-60 text-[14px]">Not provided</p>
            </div>
            <p onClick={() => {}} className="underline cursor-pointer text-[15px]">Edit</p>
          </div>
        </div>

        <div className="col-span-2">
          <div className="border border-gary-300 rounded-xl p-6">
            <div className="border-b border-b-gray-300 py-6">
              <div className="flex items-center justify-between gap-4 mb-2">
                <AiOutlineFileProtect className="w-[40px] h-[40px] text-primary" />  
                <p className="font-medium text-md">Why isn’t my info shown here?</p>
              </div>
              <p className="opacity-60 font-light">We’re hiding some account details to protect your identity.</p>
            </div>
            <div className="border-b border-b-gray-300 py-6">
              <div className="flex items-center justify-between gap-4 mb-2">
                <FaLock className="w-[40px] h-[40px] text-primary" />  
                <p className="font-medium text-md">Which details can be edited?</p>
              </div>
              <p className="opacity-60 font-light">Contact info and personal details can be edited. If this info was used to verify your identity, you’ll need to get verified again the next time you book—or to continue hosting.</p>
            </div>
            <div className="border-b border-b-gray-300 py-6">
              <div className="flex items-center justify-between gap-4 mb-2">
                <FaEye className="w-[40px] h-[40px] text-primary" />  
                <p className="font-medium text-md">What info is shared with others?</p>
              </div>
              <p className="opacity-60 font-light">Airbnb only releases contact information for Hosts and guests after a reservation is confirmed.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}