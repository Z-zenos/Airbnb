
import {AiFillStar} from "react-icons/ai";
import Carousel from "../Carousel/Carousel";

export default function PlaceCard() {
  const slides = [
    'https://images.travelandleisureasia.com/wp-content/uploads/sites/2/2023/05/04232928/lake-como.jpg',
    'https://www.travelandleisure.com/thmb/rbPz5_6COrWFh94qFRHYLJrRM-g=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/iguazu-falls-argentina-brazil-MOSTBEAUTIFUL0921-e967cc4764ca4eb2b9941bd1b48d64b5.jpg',
    'https://media.cntravellerme.com/photos/647f5a66d49d9911e8a60ae4/master/pass/Plitvice-Lakes-Croatia-GettyImages-1080935866.jpg',
    'https://vnn-imgs-f.vgcloud.vn/2019/04/23/17/5-ha-long-bay.jpg',
    'https://cdn.wallpapersafari.com/14/51/BiX7S5.jpg'
  ];

  return (
    <div className="w-[270px] my-6 cursor-pointer">
      <div className="rounded-lg w-[270px] h-[260px]">
        <Carousel slides={slides} imageClassName="w-[270px] h-[260px] rounded-lg" />
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