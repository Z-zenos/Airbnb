
import { AiFillStar } from "react-icons/ai";

export default function UserCard() {

  return (
    <div className="rounded-2xl shadow-xl border border-gray-300">
      <div className="grid grid-cols-3 pt-8 pb-4 px-4">
        <div className="col-span-2 flex items-center justify-center flex-col">
          <img src="https://a0.muscache.com/im/pictures/user/3816a6ef-5cc9-40ed-ae47-406646daa103.jpg?im_w=240" className="w-[100px] h-[100px] rounded-full" />

          <p className="text-3xl mt-2 font-bold">Golwen</p>
          <p className="text-[14px] font-medium">Superhost</p>
        </div>

        <div className="col-span-1 flex flex-col">
          <div className="mb-4">
            <p className="font-bold text-[22px]">43</p>
            <p className="font-light text-[13px]">Reviews</p>
            <hr className="mt-3" />
          </div>

          <div className="mb-4">
            <p className="font-bold text-[22px]">4.95 <AiFillStar className="inline" /></p>
            <p className="font-light text-[13px]">Rating</p>
            <hr className="mt-3" />
          </div>

          <div className="mb-4">
            <p className="font-bold text-[22px]">1</p>
            <p className="font-light text-[13px]">Year hosting</p>
          </div>
        </div>
      </div>
    </div>
  );
}