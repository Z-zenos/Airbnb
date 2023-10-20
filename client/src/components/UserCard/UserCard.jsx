
import { AiFillStar } from "react-icons/ai";

export default function UserCard() {

  return (
    <div className="rounded-2xl shadow-xl grid grid-cols-3">
      <div className="grid grid-cols-3">
        <div className="col-span-2">
          <img src="https://a0.muscache.com/im/pictures/user/3816a6ef-5cc9-40ed-ae47-406646daa103.jpg?im_w=240" className="w-[100px] h-[100px] rounded-full" />

          <p className="text-3xl font-bold">Golwen</p>
          <p className="text-md font-medium">Superhost</p>
        </div>

        <div className="col-span-1">
          <div className="mb-4">
            <p className="font-bold">43</p>
            <p className="my-3 font-light font-sm">Reviews</p>
            <hr />
          </div>

          <div className="mb-4">
            <p className="font-bold">4.95 <AiFillStar className="inline" /></p>
            <p className="my-3 font-light font-sm">Rating</p>
            <hr />
          </div>

          <div className="mb-4">
            <p className="font-bold">1</p>
            <p className="my-3 font-light font-sm">Year hosting</p>
          </div>
        </div>
      </div>
    </div>
  );
}