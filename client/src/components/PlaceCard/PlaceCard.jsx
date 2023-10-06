
import {AiFillStar} from "react-icons/ai";
import Carousel from "../Carousel/Carousel";

export default function PlaceCard({place}) {

  if(!place.name) return;

  return (

    <div className="w-[270px] my-6 cursor-pointer">
      <div className="rounded-lg w-[270px] h-[260px]">
        <Carousel slides={[place.imageCover, ...place.images.slice(0, 4)]} imageClassName="h-[260px] object-cover rounded-lg" />
      </div>

      <div className="mt-3">
        <p className="flex justify-between items-center text-[17px] mb-1">
          <span className="font-medium">{place.location.address}</span>
          <span className="font-light flex items-center">
            <AiFillStar className="inline mr-1" />
            {place.averageRatings}
          </span>
        </p>
        <p className="opacity-70 text-sm">Bowling alley</p>
        <p className="opacity-70 text-sm">Nov 12 - 17</p>
        <p className="text-md font-light mt-2"><span className="font-medium">${place.price}</span> night</p>
      </div>
    </div>
  );
}