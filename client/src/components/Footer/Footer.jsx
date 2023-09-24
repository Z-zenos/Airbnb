
import { BiWorld, BiDollar } from "react-icons/bi";
import { AiFillFacebook, AiOutlineTwitter, AiOutlineInstagram, AiOutlineCopyrightCircle } from "react-icons/ai";
import { BsDot } from "react-icons/bs";
import { useLocation } from "react-router-dom";

export default function Footer() {
  const location = useLocation();
  console.log(location);
  return (
    <footer className={`border border-t-1 border-gray-primary ${location.pathname === '/' ? 'fixed bottom-0 left-0 bg-white w-full flex justify-between items-center px-4 py-1' : 'flex flex-col items-center py-4'}`}>
      <div className="flex justify-center items-center">
        <span className="flex items-center">
          <BiWorld className="inline mr-1" />
          English (US)
        </span>

        <span className=" ml-8 mr-10 flex items-center">
          <BiDollar className="inline mr-1" />
          USD
        </span>

        <span className="flex gap-2 items-center text-xl">
          <AiFillFacebook />
          <AiOutlineTwitter />
          <AiOutlineInstagram />
        </span>
      </div>

      <div className="font-light text-sm flext items-center my-3">
        <AiOutlineCopyrightCircle className="inline mr-2" />
        2023 Airbnb, Inc.
      </div>

      <div className="font-light text-sm">
        <span className="hover:underline">Terms</span>
        <BsDot className="inline mx-2" />
        <span className="hover:underline">Sitemap</span>
        <BsDot className="inline mx-2" />
        <span className="hover:underline">Privacy</span>
        <BsDot className="inline mx-2" />
        <span className="underline">Your Privacy Choices</span>
      </div>
    </footer>
  );
}