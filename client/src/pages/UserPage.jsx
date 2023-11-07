import UserCard from "../components/UserCard/UserCard";
import { MdWorkOutline, MdOutlinePets } from "react-icons/md";
import { LiaLanguageSolid } from "react-icons/lia";
import { PiShootingStarBold } from "react-icons/pi";
import { LuSubtitles } from "react-icons/lu";
import { FaMagic } from "react-icons/fa";
import { GrMapLocation } from "react-icons/gr";
import { BsCheckLg, BsCaretLeft, BsCaretRight } from "react-icons/bs";
import { AiFillStar, AiOutlineHeart } from "react-icons/ai";
import { GiLoveSong, GiSandsOfTime } from "react-icons/gi";
import { BiTimeFive } from "react-icons/bi";
import { IoSchoolOutline } from "react-icons/io5";

import capitalizeFirstLetter from "../utils/capitalizeFirstLetter";
import Button from "../components/Button/Button";
import useHorizontalScroll from "../hooks/useHorizontalScroll";
import { useContext, useEffect, useState } from "react";
import axios from 'axios';
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../contexts/user.context";

export default function UserPage() {
  const scrollRef = useHorizontalScroll();
  const [user, setUser] = useState();
  const location = useLocation();
  const [places, setPlaces] = useState([]);
  const { user: loggedUser } = useContext(UserContext);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(location.pathname);
        setUser(res.data.data.user);

        const resPlaces = await axios.get(`/users/${res.data.data.user.id}/places`);
        setPlaces(resPlaces.data.data.places);
      } catch(err) {
        console.error(err);
      }
    })();
  }, []);

  function scrollHorizontal(scrollOffset) {
    scrollRef.current.scrollLeft += scrollOffset;
  }

  const shortReviewBox = (
    <div className="rounded-xl py-4 px-6 border-[1px] border-gray-300 ">
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

  const activity = user?.interests?.length > 0 && user?.interests.map(interest => (
    <div key={interest.name} className="py-2 px-5 rounded-3xl flex gap-2 justify-start items-center border border-gray-400">
      <span><img src={`http://localhost:3000/images/interests/${interest.iconImage}`} className="w-6 h-6" /></span>
      <span className="text-[15px]">{ capitalizeFirstLetter(interest.name) }</span>
    </div>
  ));

  const pastTrip = (
    <div className="bg-[#e0f7f7] py-3 pb-10 px-5 rounded-lg">
      <p className="text-[14px]">2021</p>
      <p className="text-md font-medium">
        Hanoi,<br /> Vietnam</p>
    </div>
  );

  const placeCardList = places.length > 0 && places.map(place => (
    <Link key={place.name} to={`/places/${place.id}`} className="cursor-pointer">
      <div >
        <img className="rounded-md w-full h-[220px]" src={`http://localhost:3000/images/places/${place.image_cover}`} />
        <div className="mt-3">
          <div className="w-full flex justify-between items-center">
            <span className="font-medium text-[15px]">{place.name}</span>
            <span className="flex items-center gap-1">{place.average_ratings} <AiFillStar className="inline " /></span>
          </div>
          <p className="opacity-70">{place.location.address}</p>
        </div>
      </div>
    </Link>
  ));

  return (
    <div className="2xl:w-[70%] xl:w-[80%] lg:w-[80%] md:w-[100%] sm:block mx-auto md:px-10 mb-10 md:grid md:grid-cols-3 gap-[200px] p-10">
      <div className=" col-span-1 relative">
        <div className=" fixed pt-8 sm:flex sm:justify-between sm:items-center sm:relative md:block">
          <UserCard user={user} />

          <div className="mt-10 border border-gray-300 py-6 px-8 rounded-3xl w-[350px] md:w-[300px] sm:w-[250px]">
            <p className="font-medium text-xl">{user?.name}&lsquo;s confirmed information</p>
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
        <h3 className="font-bold text-4xl sm:mt-8">About {user?.name}</h3>

        <Link to={'?editMode=true'}>
          { (loggedUser?._id === user?.id) && 
            <Button label="Edit profile" outline={true} className="mt-4 hover:bg-gray-100">
            </Button>
          }
        </Link>

        <div className="pb-8 border-b-[1px] border-gray-300">
          <div className="grid grid-cols-2 gap-4 mt-8 font-light ">
            <p className="flex items-center gap-3">
              <span><MdWorkOutline className="w-6 h-6" /></span>
              <span>My work: {user?.work}</span>
            </p>
            <p className="flex items-center gap-3">
              <span><LiaLanguageSolid className="w-6 h-6" /></span>
              <span>Speaks {user?.languages?.join(', ').replace(/, ([^,]*)$/, ' and $1')}</span>
            </p>
            <p className="flex items-center gap-3">
              <span><PiShootingStarBold className="w-6 h-6" /></span>
              <span>My fun fact: {user?.fun_fact}</span>
            </p>
            <p className="flex items-center gap-3">
              <span><FaMagic className="w-6 h-6" /></span>
              <span>Most useless skill: {user?.useless_skill}</span>
            </p>
            <p className="flex items-center gap-3">
              <span><LuSubtitles className="w-6 h-6" /></span>
              <span>My biography title: &ldquo;{user?.biography_title}&rdquo;</span>
            </p>
            <p className="flex items-center gap-3">
              <span><GrMapLocation className="w-6 h-6" /></span>
              <span>Lives in {user?.address}</span>
            </p>

            <p className="flex items-center gap-3">
              <span><AiOutlineHeart className="w-6 h-6" /></span>
              <span>I&lsquo;m obsessed with: {user?.obsessed_with}</span>
            </p>
            <p className="flex items-center gap-3">
              <span><GiLoveSong className="w-6 h-6" /></span>
              <span>Favorite song in high school: {user?.favorite_song}</span>
            </p>
            <p className="flex items-center gap-3">
              <span><BiTimeFive className="w-6 h-6" /></span>
              <span>I spend too much time: {user?.time_consuming_activity}</span>
            </p>
            <p className="flex items-center gap-3">
              <span><IoSchoolOutline className="w-6 h-6" /></span>
              <span>Where I went to school: {user?.school}</span>
            </p>
            <p className="flex items-center gap-3">
              <span><GiSandsOfTime className="w-6 h-6" /></span>
              <span>Born in the {user?.decade_born}s</span>
            </p>
            <p className="flex items-center gap-3">
              <span><MdOutlinePets className="w-6 h-6" /></span>
              <span>Pets: {user?.pets.join(', ').replace(/, ([^,]*)$/, ' and $1')}</span>
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
            {user?.description}
          </p>
        </div>

        <div className="py-8 border-b-[1px] border-gray-300">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-medium">What guests are saying about {user?.name}</h3>
            <div className="flex gap-2 items-center">
              <BsCaretLeft 
                className="w-[40px] h-[40px] cursor-pointer border rounded-full p-2 opacity-60 border-gray-500 hover:scale-105 hover:shadow-md hover:shadow-gray-500 col-span-1 mx-auto" 
                onClick={() => scrollHorizontal(-scrollRef.current.offsetWidth)} 
              />
              <BsCaretRight 
                className="col-span-1 h-[40px] w-[40px] cursor-pointer border rounded-full p-2 opacity-60 border-gray-500 hover:scale-55 hover:shadow-md hover:shadow-gray-500 active:scale-100 active:shadow-none mx-auto" 
                onClick={() => scrollHorizontal(scrollRef.current.offsetWidth)} 
              />
            </div>
          </div>

          <div 
            className="grid auto-cols-[calc(50%-8px)] grid-flow-col gap-3 overflow-x-scroll py-6  scroll-smooth" 
            ref={scrollRef}
          >
            { [...new Array(6).fill(0)].map((num, i) => <div key={num + i}>{shortReviewBox}</div>) }
          </div>
          <Button label="Show all 90 reviews" className=" mt-4 " outline={true} />
        </div>

        <div className="py-8 border-b-[1px] border-gray-300">
          <h3 className="text-2xl font-medium">Ask {user?.name} about</h3>

          <div className="py-6 flex justify-start flex-wrap items-center  gap-4">
            { activity }
          </div>
        </div>

        { user?.showPastTrips && (
          <div className="py-8 border-b-[1px] border-gray-300">
            <h3 className="text-2xl font-medium">{user?.name}’s past trips</h3>

            <div className="py-6 grid auto-cols-[calc(34%-8px)] grid-flow-col overflow-x-scroll  gap-4">
              { [...new Array(6).fill(0)].map((num, i) => <div key={'pt' + num + i}>{pastTrip}</div>) }
            </div>
          </div>
        ) }

        <div className="py-8">
          <h3 className="text-2xl font-medium">{user?.name}’s places</h3>

          <div className="py-6 grid grid-cols-3 md:grid-cols-2 gap-6">
            { placeCardList }
          </div>
        </div>

      </div>

    </div>
  );
}