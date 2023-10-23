import UserCard from "../components/UserCard/UserCard";
import { MdWorkOutline } from "react-icons/md";
import { LiaLanguageSolid } from "react-icons/lia";
import { PiShootingStarBold } from "react-icons/pi";
import { LuSubtitles } from "react-icons/lu";
import { FaMagic } from "react-icons/fa";
import { GrMapLocation } from "react-icons/gr";
import { BsBicycle, BsCheckLg } from "react-icons/bs";
import { AiFillStar } from "react-icons/ai";

import Button from "../components/Button/Button";

export default function UserPage() {

  const shortReviewBox = (
    <div className="w-[315px] rounded-xl py-4 px-6 border-[1px] border-gray-300 ">
      <p 
        className=" text-[15px] font-light leading-[24px] mb-8 text-ellipsis whitespace-pre-wrap overflow-hidden" 
        style={{
          'display': '-webkit-box',
          WebkitLineClamp: '4',
          MozBoxOrient: 'vertical'
        }}
      >
      &quot;…A great host and a great guy! Friendly and inviting. Helped with recommandations of things to see and where to have good restaurant experiences
      A great host and a great guy! Friendly and inviting. Helped with recommandations of things to see and where to have good restaurant experiences
      </p>
      <div className="flex items-center justify-start gap-4">
        <div className="rounded-full border-[1px] border-primary p-[2px]">
          <img src="https://a0.muscache.com/im/pictures/user/511e7e29-7a53-4d33-b817-8d9c4351c264.jpg?im_w=240" className="rounded-full w-[40px] h-[40px]" alt="review user" />
        </div>
        <div>
          <p className="font-medium">Josef</p>
          <p className="opacity-60 text-[15px]">May 2023</p>
        </div>
      </div>
    </div>
  );

  const activity = (
    <div className="py-2 px-5 rounded-3xl flex gap-2 justify-start items-center border border-gray-400">
      <span><BsBicycle className="w-6 h-6" /></span>
      <span className="font-light text-[15px]">Cycling</span>
    </div>
  );

  const pastTrip = (
    <div className="bg-[#e0f7f7] py-3 pb-10 px-5">
      <p className="text-[14px]">2021</p>
      <p className="text-md font-medium">
        Hanoi,<br /> Vietnam</p>
    </div>
  );

  const place = (
    <div className="">
      <img className="rounded-md w-full h-[220px]" src="https://a0.muscache.com/im/pictures/miso/Hosting-13903824/original/82d996fb-d7c4-46a8-a713-febd281cd69f.jpeg?im_w=720" />
      <div className="mt-3">
        <div className="w-full flex justify-between items-center">
          <span className="font-medium text-[15px]">Condo</span>
          <span className="flex items-center gap-1">4.65 <AiFillStar className="inline " /></span>
        </div>
        <p className="opacity-70">Hasfyasi, Aasdas</p>
      </div>
    </div>
  );

  return (
    <div className="lg:w-[70%] mx-auto md:px-10 mb-10 grid grid-cols-3 gap-[200px] p-10">
      <div className=" col-span-1 relative">
        <div className=" fixed">
          <UserCard />

          <div className="mt-10 border border-gray-300 py-6 px-8 rounded-3xl w-[350px]">
            <p className="font-medium text-xl">Gandolfo Gabriele&lsquo;s confirmed information</p>
            <div className="text-lg mt-3">
              <p className="flex my-1 items-center gap-4">
                <BsCheckLg />
                <span className="font-light">Identity</span>
              </p>
              <p className="flex my-1 items-center gap-4">
                <BsCheckLg />
                <span className="font-light">Email address</span>
              </p>
              <p className="flex my-1 items-center gap-4">
                <BsCheckLg />
                <span className="font-light">Phone Number</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className=" col-span-2 ">
        <h3 className="font-bold text-4xl">About Golwen</h3>

        <div className="py-8 border-b-[1px] border-gray-300">
          <div className="grid grid-cols-2 gap-4 mt-8 font-light ">
            <p className="flex items-center gap-3">
              <span><MdWorkOutline className="w-6 h-6" /></span>
              <span>My work: visual artist</span>
            </p>
            <p className="flex items-center gap-3">
              <span><LiaLanguageSolid className="w-6 h-6" /></span>
              <span>Speaks English, French, Italian, and Spanish</span>
            </p>
            <p className="flex items-center gap-3">
              <span><PiShootingStarBold className="w-6 h-6" /></span>
              <span>What makes my home unique: panoramic views and silence</span>
            </p>
            <p className="flex items-center gap-3">
              <span><FaMagic className="w-6 h-6" /></span>
              <span>Most useless skill: guessing the music on the radio</span>
            </p>
            <p className="flex items-center gap-3">
              <span><LuSubtitles className="w-6 h-6" /></span>
              <span>My biography title: leone leone leone</span>
            </p>
            <p className="flex items-center gap-3">
              <span><GrMapLocation className="w-6 h-6" /></span>
              <span>Lives in Palermo, Italy</span>
            </p>
          </div>

          <p 
            className="text-[15px] font-light leading-[24px] mt-8 text-ellipsis whitespace-pre-wrap overflow-hidden"
            style={{
              'display': '-webkit-box',
              WebkitLineClamp: '5',
              MozBoxOrient: 'vertical'
            }}
          >
            Here I am on this adventure! I&lsquo;ve always loved sharing my spaces with friends or family, so I said why not make it a business ? I am originally from a small town near Reggio Calabria but  Turin has become my city for 30 years and I am really excited about it. I live with my son  Emanuele and my super cat Whisky. I enjoy cooking and experimenting with new dishes every time, and it looks like my guests really appreciate it. When I can afford to travel, I love to travel, but I don&lsquo;t miss a good book or a show, and Turin really offers a lot. From the Jazz festival to classical music to the festival for the very young. So I think I can meet the needs of my guests by offering them friendliness and comfort .
          </p>
        </div>

        <div className="py-8 border-b-[1px] border-gray-300">
          <h3 className="text-2xl font-medium">What guests are saying about Gandolfo Gabriele</h3>

          <div className="grid grid-flow-col gap-3 overflow-x-scroll py-6">
            { [...new Array(6).fill(0)].map((num, i) => <div key={num + i}>{shortReviewBox}</div>) }
          </div>
          <Button label="Show all 90 reviews" className=" mt-4 " outline={true} />
        </div>

        <div className="py-8 border-b-[1px] border-gray-300">
          <h3 className="text-2xl font-medium">Ask Gandolfo Gabriele about</h3>

          <div className="py-6 flex justify-start flex-wrap items-center  gap-4">
          { [...new Array(6).fill(0)].map((num, i) => <div key={'a' + num + i}>{activity}</div>) }
          </div>
        </div>

        <div className="py-8 border-b-[1px] border-gray-300">
          <h3 className="text-2xl font-medium">Gandolfo Gabriele’s past trips</h3>

          <div className="py-6 grid grid-cols-3 gap-4">
          { [...new Array(6).fill(0)].map((num, i) => <div key={'pt' + num + i}>{pastTrip}</div>) }
          </div>
        </div>

        <div className="py-8">
          <h3 className="text-2xl font-medium">Gandolfo Gabriele’s places</h3>

          <div className="py-6 grid grid-cols-3 gap-6">
          { [...new Array(4).fill(0)].map((num, i) => <div key={'pl' + num + i}>{place}</div>) }
          </div>
        </div>

      </div>

    </div>
  );
}