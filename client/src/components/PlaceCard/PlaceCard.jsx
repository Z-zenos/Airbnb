
import {AiFillStar} from "react-icons/ai";

export default function PlaceCard() {
  return (
    <div className="w-[270px] my-6 cursor-pointer">
      <div>
        <img className="rounded-lg w-[270px] h-[260px]" src="https://a0.muscache.com/im/pictures/miso/Hosting-721540609203378406/original/9dfaf7d6-40f2-4673-b468-7c5ab3147f86.jpeg?im_w=720" />
      </div>

      <div className="mt-3">
        <p className="flex justify-between items-center text-[17px] mb-1">
          <span className="font-medium">Dubai, UAE</span>
          <span className="font-light flex items-center">
            <AiFillStar className="inline mr-1" />
            5.0
          </span>
        </p>
        <p className="opacity-70 text-sm">Bowling alley</p>
        <p className="opacity-70 text-sm">Nov 12 - 17</p>
        <p className="text-md font-light mt-2"><span className="font-medium">$689</span> night</p>
      </div>
    </div>
  );
}