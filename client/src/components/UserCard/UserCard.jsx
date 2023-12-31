
import { AiFillStar } from "react-icons/ai";
import { BiSolidMedal } from "react-icons/bi";

export default function UserCard({ user }) {
  return (
    <div className="rounded-2xl md:w-[300px] w-[350px] shadow-[rgba(0,_0,_0,_0.2)_0px_6px_20px_0px] border">
      <div className="grid grid-cols-3 py-4 px-6 md:px-3">
        <div className="col-span-2 flex items-center justify-center flex-col">
          <img 
            src={(user?.avatar && user?.avatar?.match(/github|cloudflare/)?.length > 0) 
              ? user?.avatar 
              : (user?.avatar && `http://localhost:3000/images/users/avatars/${user?.avatar}`)
            } 
            className="w-[100px] h-[100px] rounded-full" 
          />

          <p className="text-3xl mt-4 font-bold text-primary">{user?.name.split(' ')[0]}</p>
          <p className="text-[14px] font-medium mt-1 flex items-center gap-1 "><BiSolidMedal className="inline w-5 h-5" /> Superhost</p>
        </div>

        <div className="col-span-1 flex flex-col">
          <div className="mb-4 border-b-[1px] pb-3 border-b-gray-300">
            <p className="font-bold text-[22px]">43</p>
            <p className="text-[13px]">Reviews</p>
          </div>

          <div className="mb-4 border-b-[1px] pb-3 border-b-gray-300">
            <p className="font-bold text-[22px]">4.95 <AiFillStar className="inline" /></p>
            <p className="text-[13px]">Rating</p>
          </div>

          <div className="pb-3">
            <p className="font-bold text-[22px]">{user?.year_hosting}</p>
            <p className="text-[13px]">Year hosting</p>
          </div>
        </div>
      </div>
    </div>
  );
}