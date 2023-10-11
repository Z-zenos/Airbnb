
import {AiFillStar} from "react-icons/ai";
import {FaLocationDot } from "react-icons/fa6";
import {BsCalendarHeart} from "react-icons/bs";
import Carousel from "../Carousel/Carousel";
import { Link } from "react-router-dom";

export default function PlaceCard({place}) {
  if(!place.name) return;

  return (
    <Link to={`/places/${place.id}`} className="w-[270px] my-6 cursor-pointer">
      <div className="rounded-lg w-[270px] h-[260px]">
        <Carousel slides={[place.image_cover, ...place.images.slice(0, 4)]} imageClassName="h-[260px] object-cover aspect-video rounded-lg" />
      </div>

      <div className="mt-3">
        <p className="text-[17px] mb-1">
          <span className="font-medium "><FaLocationDot className="inline text-primary mr-1" size={18} />{place.location.address}</span>
        </p>
        <p className="opacity-90 text-[16px]">{place.name}</p>
        <p className="text-sm flex items-center">
          <span><BsCalendarHeart className="text-green-500 mr-2" /></span>
          <span className="opacity-50 ">Nov 12 - 17</span>
        </p>
        <p className="text-sm font-light mt-2 flex justify-between items-center">
          <span className="flex items-center">
            <span className="line-through">${place.price}</span> 
            <span className="font-bold mx-2 text-xl text-primary">
              {place.price -  Math.trunc(place.price * place.price_discount / 100)}
            </span> 
            / night
          </span> 
          <span className="font-light flex text-lg items-center">
            <AiFillStar className="inline mr-1 text-yellow-300" />
            {place.average_ratings}
          </span>  
        </p>
      </div>
    </Link>
  );
}