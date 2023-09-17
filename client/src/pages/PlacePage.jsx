import Button from "../components/Button/Button";
import { AiFillStar } from "react-icons/ai";
import { BiSolidAward } from "react-icons/bi";
import { AiOutlineHeart } from "react-icons/ai";
import { CiShare1 } from "react-icons/ci";
import { CgMenuGridO } from "react-icons/cg";
import { GiDesk } from "react-icons/gi";



export default function PlacePage() {
  return (
    <div className=" lg:w-3/5 mx-auto">
      <h2 className="font-bold text-2xl mb-1">Whispering Pines Cottages| Cabin | Tandi</h2>
      <div className="flex justify-between items-center">
        <div className="text-sm">
          <span className="font-medium"><AiFillStar className="inline" /> 4.88</span>
          <span className="mx-2 font-medium">·</span>
          <span className="underline font-medium">205 reviews</span>
          <span className="mx-2 font-medium">·</span>
          <span><BiSolidAward className="inline" /> Superhost</span>
          <span className="mx-2 font-medium">·</span>
          <span className="underline font-medium">Hibhi, Himachai Pradesh, India</span>
        </div>
        <div className="gap-1 flex">
          <Button icon="share" title="Share" className="flex items-center border-none py-1 px-2 gap-2 hover:bg-gray-100 transition-all rounded-md underline font-medium text-sm" iconClassName="translate-y-[2px]">
            <CiShare1 />
          </Button>

          <Button icon="heart" title="Heart" className="flex items-center border-none py-1 px-2 gap-2 hover:bg-gray-100 transition-all rounded-md underline font-medium text-sm" iconClassName="translate-y-[2px]" >
            <AiOutlineHeart />
          </Button>
        </div>
      </div>

      <div className="image-container w-full mt-6 py-2 h-[480px] relative">
        <div className="-m-1 h-full flex md:-m-2">
          <div className="flex h-full w-1/2 flex-wrap">
            <div className="w-1/2 p-1 md:p-2">
              <img
                alt="gallery"
                className="block h-full w-full rounded-lg object-cover object-center"
                src="https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(70).webp" />
            </div>
            <div className="w-1/2 p-1 md:p-2">
              <img
                alt="gallery"
                className="block h-full w-full rounded-lg object-cover object-center"
                src="https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(72).webp" />
            </div>
            <div className="w-full h-3/5 p-1 md:p-2">
              <img
                alt="gallery"
                className="block w-full h-full rounded-lg object-cover object-center"
                src="https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(73).webp" />
            </div>
          </div>
          <div className="flex w-3/5 h-full flex-wrap ">
            <div className="w-full h-full p-1 md:p-2">
              <img
                alt="gallery"
                className="block h-full w-full rounded-lg object-cover object-center"
                src="https://tecdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(74).webp" />
            </div>
          </div>
        </div>

        <Button className="absolute flex items-center border border-gray-700 py-1 px-2 gap-2 hover:bg-gray-100 transition-all rounded-md font-light text-sm bottom-6 right-8 md:bottom-12 md:right-6 bg-white" title="Show all photos" >
          <CgMenuGridO />
        </Button>

      </div>

      <div className="h-[1px] bg-gray-300 mt-1"></div>

      <div className="w-3/5 mt-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <span>4 guests</span>
            <span className="mx-2 font-medium">·</span>
            <span>2 bedrooms</span>
            <span className="mx-2 font-medium">·</span>
            <span>3 beds</span>
            <span className="mx-2 font-medium">·</span>
            <span>1 bath</span>
          </div>

          <div className="rounded w-14 h-14">
            <img src="https://a0.muscache.com/im/pictures/user/d87628a6-3c1a-4e2e-a4ae-7743ab5f6ece.jpg?im_w=240" className="rounded-full w-full h-full" />
          </div>
        </div>
        <div className="h-[1px] bg-gray-300 mt-1"></div>

        <div className="gap-2 py-8">
          <div className="flex justify-start gap-10 px-3">
            <span><GiDesk className="text-3xl" /></span>
            <div>
              <p className="font-medium">Dedicated workspace</p>
              <p className=" text-gray-600 text-sm font-light">
                A common area with wifi that’s well-suited for working.
              </p>
            </div>
          
          </div>
        </div>

        <div className="h-[1px] bg-gray-300 mt-1"></div>

      </div>
    </div>
  );
}