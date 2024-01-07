
import { BiWorld } from "react-icons/bi";
import { AiFillFacebook, AiOutlineTwitter, AiOutlineInstagram, AiOutlineCopyrightCircle } from "react-icons/ai";
import { BsDot } from "react-icons/bs";
import { useContext } from "react";
import { IntlContext } from "../../contexts/intl.context";
import { Link } from "react-router-dom";

export default function Footer() {
  const { currency } = useContext(IntlContext);

  return (
    <footer className={`h-[60px] border border-t-1 border-gray-primary bottom-0 left-0 bg-white w-full flex justify-between items-center md:px-4 lg:px-[5%] py-1`}>
      <div className="flex justify-center items-center">
        <span className="flex items-center">
          <BiWorld className="inline mr-1" />
          English (US)
        </span>

        <span className=" ml-8 mr-10 flex items-center">
          { currency.symbol }
          { currency.code }
        </span>

        <span className="flex gap-2 items-center text-xl">
          <AiFillFacebook />
          <AiOutlineTwitter />
          <AiOutlineInstagram />
        </span>
      </div>

      <Link to={'/'} className=" text-sm flex items-center my-3 text-primary font-bold">
        <AiOutlineCopyrightCircle className="inline mr-2" />
        2023 Airbnb, Inc.
      </Link>

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