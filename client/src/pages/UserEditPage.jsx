import UserCard from "../components/UserCard/UserCard";
import { MdWorkOutline, MdOutlinePets } from "react-icons/md";
import { LiaLanguageSolid } from "react-icons/lia";
import { PiShootingStarBold } from "react-icons/pi";
import { LuSubtitles } from "react-icons/lu";
import { FaMagic } from "react-icons/fa";
import { GrMapLocation } from "react-icons/gr";
import { BsCheckLg, BsCaretLeft, BsCaretRight, BsFillCameraFill } from "react-icons/bs";
import { AiFillStar, AiOutlineHeart, AiOutlineRight, AiOutlineDown } from "react-icons/ai";
import { GiLoveSong, GiSandsOfTime } from "react-icons/gi";
import { BiTimeFive } from "react-icons/bi";
import { IoSchoolOutline } from "react-icons/io5";

import capitalizeFirstLetter from "../utils/capitalizeFirstLetter";
import Button from "../components/Button/Button";
import useHorizontalScroll from "../hooks/useHorizontalScroll";
import { useEffect, useState } from "react";
import axios from 'axios';
import { Link, useLocation } from "react-router-dom";
import Input from "../components/Input/Input";

const arrow = (on) => {
  const className = "arrow-right transition-all absolute right-5 top-1/2 -translate-y-1/2";

  return on 
    ? <AiOutlineDown className={className} size={20} />
    : <AiOutlineRight className={className} size={20} />
}

const Editor = ({ setEdits, editProperty, edits, label, content, title, description, icon  }) => {
  return (
    <div className="py-3 px-2 border-b-[1px] border-b-gray-300 cursor-pointer hover:bg-gray-100 hover:rounded-lg [&_.arrow-right]:hover:right-3">
      <div 
        className="flex items-center gap-3 relative "
        onClick={() => setEdits(prevEdits => ({ ...prevEdits, [`${editProperty}`]: !prevEdits[editProperty] }))}  
      >
        <span>{icon}</span>
        <div>
          <div className="font-medium">{label} </div>
          <div className="lg:max-w-[280px] md:max-w-[360px]">{content} </div>
        </div>
        {arrow(edits[editProperty])}
      </div>

      { edits[editProperty] && 
        <div className="px-3">
          <h3 className="text-xl mt-2 font-medium">{title}</h3>
          <p className="opacity-70 mt-2 mb-4">{description}</p>
          <Input label={label} value={content} className="rounded-md" />
        </div>
      }
    </div>
  );
}

export default function UserEditPage() {
  const scrollRef = useHorizontalScroll();
  const [user, setUser] = useState();
  const location = useLocation();
  const [places, setPlaces] = useState([]);
  const [edits, setEdits] = useState({
    work: false,
    fun_fact: false,
    useless_skill: false,
    biography_title: false,
    obsessed_with: false,
    favorite_song: false,
    time_consuming_activity: false,
    school: false,
    pets: false,

  });

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
    <div className="2xl:w-[70%] xl:w-[80%] lg:w-[80%] md:w-[100%] sm:block mx-auto md:px-10 mb-10 md:grid md:grid-cols-3 gap-[50px] p-10">
      <div className=" col-span-1 relative">
        <div className="w-[200px] h-[200px] rounded-full border-primary border-[2px] p-1 mx-auto mt-10 relative">
          <img src={user?.avatar} className=" rounded-full" />
          <Button 
            label="Edit" 
            className="bg-white shadow-[rgba(0,_0,_0,_0.12)_0px_6px_16px_0px]  absolute -bottom-4 left-1/2 -translate-x-1/2" 
            style={{ 
              padding: '4px 20px',
              color: 'black',
              borderColor: 'gray'
            }} >
              <BsFillCameraFill />
          </Button>
        </div>
      </div>

      <div className="col-span-2">
        <h3 className="font-bold text-4xl sm:mt-8">
          Your profile
        </h3>

        <p className="opacity-60 my-6">
          The information you share will be used across Airbnb to help other guests and Hosts get to know you.
        </p>

        <div className="pb-8">
          <div className="grid xl:grid-cols-2 md:grid-cols-1 gap-2 mt-8 font-light ">
            
            <Editor 
              setEdits={setEdits} 
              edits={edits}
              editProperty="work" 
              title="What do you do for work?" 
              description="Tell us what your profession is. If you don’t have a traditional job, tell us your life’s calling. Example: Nurse, parent to four kids, or retired surfer." 
              label="My work:"
              content={user?.work}
              icon={<MdWorkOutline className="w-6 h-6" />}
            />

            <p className="flex items-center gap-3 py-3 px-2 border-b-[1px] border-b-gray-300 relative cursor-pointer hover:bg-gray-100 hover:rounded-lg">
              <span><LiaLanguageSolid className="w-6 h-6" /></span>
              <span>Speaks {user?.languages?.join(', ').replace(/, ([^,]*)$/, ' and $1')}</span>
            </p>

            <Editor 
              setEdits={setEdits} 
              edits={edits}
              editProperty="fun_fact" 
              title="What’s a fun fact about you?" 
              description="Share something unique or unexpected about you. Example: I was in a music video or I’m a juggler." 
              label="My fun fact:"
              content={user?.fun_fact}
              icon={<PiShootingStarBold className="w-6 h-6" />}
            />

            <Editor 
              setEdits={setEdits} 
              edits={edits}
              editProperty="useless_skill" 
              title="What’s your most useless skill?" 
              description="Share a surprising but pointless talent you have. Example: Shuffling cards with one hand." 
              label="My most useless skill:"
              content={user?.useless_skill}
              icon={<FaMagic className="w-6 h-6" />}
            />

            <Editor 
              setEdits={setEdits} 
              edits={edits}
              editProperty="biography_title" 
              title="What would your biography title be?" 
              description="If someone wrote a book about your life, what would they call it? Example: Born to Roam or Chronicles of a Dog Mom." 
              label="My biography title would be:"
              content={user?.biography_title}
              icon={<LuSubtitles className="w-6 h-6" />}
            />

            <p className="flex items-center gap-3 py-3 px-2 border-b-[1px] border-b-gray-300 relative cursor-pointer hover:bg-gray-100 hover:rounded-lg">
              <span><GrMapLocation className="w-6 h-6" /></span>
              <span>Lives in {user?.address}</span>
            </p>

            <Editor 
              setEdits={setEdits} 
              edits={edits}
              editProperty="obsessed_with" 
              title="What are you obsessed with?" 
              description="Share whatever you can’t get enough of—in a good way. Example: Baking rosemary focaccia." 
              label="I'm obsessed with:"
              content={user?.obsessed_with}
              icon={<AiOutlineHeart className="w-6 h-6" />}
            />

            <Editor 
              setEdits={setEdits} 
              edits={edits}
              editProperty="favorite_song" 
              title="What was your favorite song in high school?" 
              description="However embarrassing, share the tune you listened to on repeat as a teenager." 
              label="My favorite in high school:"
              content={user?.favorite_song}
              icon={<GiLoveSong className="w-6 h-6" />}
            />

            <Editor 
              setEdits={setEdits} 
              edits={edits}
              editProperty="time_consuming_activity" 
              title="What do you spend too much time doing?" 
              description="Share an activity or hobby you spend lots of free time on. Example: Watching cat videos or playing chess." 
              label="I spend too much time:"
              content={user?.time_consuming_activity}
              icon={<BiTimeFive className="w-6 h-6" />}
            />

            <Editor 
              setEdits={setEdits} 
              edits={edits}
              editProperty="school" 
              title="Where did you go to school?" 
              description="Whether it’s home school, high school, or trade school, name the school that made you who you are." 
              label="Where I went to school:"
              content={user?.school}
              icon={<IoSchoolOutline className="w-6 h-6" />}
            />

            <p className="flex items-center gap-3 py-3 px-2 border-b-[1px] border-b-gray-300 relative cursor-pointer hover:bg-gray-100 hover:rounded-lg">
              <span><GiSandsOfTime className="w-6 h-6" /></span>
              <span>Born in the {user?.decade_born}s</span>
            </p>

            <Editor 
              setEdits={setEdits} 
              edits={edits}
              editProperty="pets" 
              title="Do you have any pets in your life?" 
              description="Share any pets you have and their names. Example: My calico cat Whiskers, or Leonardo my speedy turtle." 
              label="Pets:"
              content={user?.pets.join(', ').replace(/, ([^,]*)$/, ' and $1')}
              icon={<MdOutlinePets className="w-6 h-6" />}
            />
          </div>

          
        </div>

        <div className="">
          <h3 className="text-2xl font-medium">About you</h3>
          <p className="opacity-60 mt-2">Tell us a little bit about yourself, so your future hosts or guests can get to know you.</p>
          <p 
            className="text-[15px] font-light leading-[24px] mt-6 text-ellipsis whitespace-pre-wrap overflow-hidden"
            style={{
              'display': '-webkit-box',
              WebkitLineClamp: '5',
              MozBoxOrient: 'vertical'
            }}
          >
            {user?.description}
          </p>
        </div>
        

      </div>

    </div>
  );
}