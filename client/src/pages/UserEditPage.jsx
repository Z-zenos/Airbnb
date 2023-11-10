import { MdWorkOutline, MdOutlinePets } from "react-icons/md";
import { LiaLanguageSolid } from "react-icons/lia";
import { PiShootingStarBold } from "react-icons/pi";
import { LuSubtitles } from "react-icons/lu";
import { FaMagic } from "react-icons/fa";
import { GrMapLocation } from "react-icons/gr";
import { BsFillCameraFill } from "react-icons/bs";
import { AiOutlineHeart, AiOutlineRight, AiOutlineDown } from "react-icons/ai";
import { GiLoveSong, GiSandsOfTime } from "react-icons/gi";
import { BiTimeFive } from "react-icons/bi";
import { IoSchoolOutline } from "react-icons/io5";

import Button from "../components/Button/Button";
import { useContext, useRef, useState } from "react";
import axios from 'axios';
import Input from "../components/Input/Input";
import ToggleButton from "../components/Button/ToggleButton";
import { UserContext } from "../contexts/user.context";
import { ModalContext } from "../contexts/modal.context";
import InterestSelectModal from "../components/Modals/InterestSelectModal";
import SearchAddressModal from "../components/Modals/SearchAddressModal";
import LanguageSelectModal from "../components/Modals/LanguageSelectModal";
import { ToastContext } from "../contexts/toast.context";
import Toast from "../components/Toast/Toast";

const arrow = (on) => {
  const className = "arrow-right transition-all absolute right-5 top-1/2 -translate-y-1/2";

  return on 
    ? <AiOutlineDown className={className} size={20} />
    : <AiOutlineRight className={className} size={20} />
};

const Editor = ({ 
  setEdits, editProperty, edits, label, content, title, description, icon  
}) => {
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
};



export default function UserEditPage() {
  const {user, setUser} = useContext(UserContext);
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
  const inputFileRef = useRef(null); 
  const wrapperAvatarRef = useRef(null);

  const {
    isInterestSelectModalOpen, setIsInterestSelectModalOpen,
    isSearchAddressModalOpen, setIsSearchAddressModalOpen,
    isLanguageSelectModalOpen, setIsLanguageSelectModalOpen,
  } = useContext(ModalContext);

  const { openToast } = useContext(ToastContext);
  const [showDecadeBorn, setShowDecadeBorn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // const pastTrip = (
  //   <div className="bg-[#e0f7f7] py-3 pb-10 px-5 rounded-lg">
  //     <p className="text-[14px]">2021</p>
  //     <p className="text-md font-medium">
  //       Hanoi,<br /> Vietnam</p>
  //   </div>
  // );

  async function handleChangeAvatar(ev) {
    try {
      setIsLoading(true);
      const avatar = ev.target.files[0];
      if(Object.keys(avatar).length === 0 && avatar.constructor === Object) return;
      const formData = new FormData();
      formData.append("avatar", avatar);

      const res = await axios.patch(
        `/images/user/${user?.id}/avatar`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      openToast(<Toast title="Success" content="Update avatar successfully" type="success" />);

      const updatedUser = res.data.data.user;
      setUser(updatedUser);
    } catch (err) {
      console.error(err);
      openToast(<Toast title="Fail" content={err.message} type="error" />);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="2xl:w-[70%] xl:w-[80%] lg:w-[80%] md:w-[100%] sm:block mx-auto md:px-10 mb-10 md:grid md:grid-cols-3 gap-[50px] p-10">
      <div className=" col-span-1 relative">
        <div ref={wrapperAvatarRef} className="w-[200px] h-[200px] rounded-full border-primary border-[2px] p-1 mx-auto mt-10 sticky top-[100px]">
          <img src={`http://localhost:3000/images/users/avatars/${user?.avatar}`} className="w-full h-full rounded-full" />
          { isLoading && 
            <div className="absolute w-full h-full bg-transperent border-4 animate-spin border-gray-200 top-0 left-0 rounded-[50%] border-l-primary"></div> 
          }
          <Button 
            label="Edit" 
            className="bg-white shadow-[rgba(0,_0,_0,_0.12)_0px_6px_16px_0px]  absolute -bottom-4 left-1/2 -translate-x-1/2 active:scale-95" 
            style={{ 
              padding: '4px 20px',
              color: 'black',
              borderColor: 'gray'
            }}
            onClick={() => inputFileRef.current.click()}
          >
            <input 
              type='file' 
              id='file' 
              ref={inputFileRef} 
              accept="image/*" 
              hidden 
              multiple={true}
              onChange={async (ev) => await handleChangeAvatar(ev)}  
            />
            <BsFillCameraFill />
          </Button>
        </div>
      </div>

      <div className="col-span-2 relative">
        <div className="flex justify-between items-center sticky top-[80px] bg-white z-10 py-4">
          <h3 className="font-bold text-4xl  ">
            Your profile
          </h3>
          <Button label="Save"></Button>
          
        </div>

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

            <div>
              <div 
                className="flex items-center gap-3 py-3 px-2 border-b-[1px] border-b-gray-300 relative cursor-pointer hover:bg-gray-100 hover:rounded-lg"
                onClick={() => setIsLanguageSelectModalOpen(true)}
              >
                <span><LiaLanguageSolid className="w-6 h-6" /></span>
                <span>Speaks {user?.languages?.join(', ').replace(/, ([^,]*)$/, ' and $1')}</span>
              </div>

              { isLanguageSelectModalOpen && <LanguageSelectModal /> }
            </div>

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

            <div className="" onClick={() => setIsSearchAddressModalOpen(true)}>
              <div className="flex items-center gap-3 py-3 px-2 border-b-[1px] border-b-gray-300 relative cursor-pointer hover:bg-gray-100 hover:rounded-lg">
                <span><GrMapLocation className="w-6 h-6" /></span>
                <span>Lives in {user?.address}</span>
              </div>

              { isSearchAddressModalOpen && <SearchAddressModal /> }
            </div>

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

            <div className="flex justify-between items-center border-b-[1px] border-b-gray-300 relative hover:bg-gray-100 hover:rounded-lg pr-6">
              <p className="flex basis-60 items-center gap-3 py-3 px-2 ">
                <span><GiSandsOfTime className="w-6 h-6" /></span>
                <span>Born in the {user?.decade_born}s. Show the decade I was born?</span>
              </p>
              <ToggleButton selected={showDecadeBorn} onClick={() => setShowDecadeBorn(!showDecadeBorn)} />
            </div>

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

        <div className="border-b-[1px] border-b-gray-300 pb-8">
          <h3 className="text-2xl font-medium">About you</h3>
          <p className="opacity-60 my-2">Tell us a little bit about yourself, so your future hosts or guests can get to know you.</p>
          <textarea 
            className="w-full border-gray-primary border h-[160px] py-3 px-5 rounded-md outline-none" 
            value={user?.description}
            spellCheck={false} 
          />
          
        </div>

        <div className="border-b-[1px] border-b-gray-300 py-8">
          <h3 className="text-2xl font-medium">What you’re into</h3>
          <p className="opacity-60 my-3">Find common ground with other guests and Hosts by adding interests to your profile.</p>
          
          <div className=" flex justify-start items-center gap-2 flex-wrap">
            { user?.interests.length > 0 && user?.interests.map(interest => 
              <div key={interest.id}
                className="border-[1px] border-gray-primary text-3xl h-[40px] text-center py-1 px-3 flex items-center gap-1 hover:border-gray-700 rounded-3xl"
              >
                <img src={`http://localhost:3000/images/interests/${interest.iconImage}`} className="w-[24px] h-[24px]" alt={interest.name} />
                <span className="text-sm">{interest.name}</span>
              </div>
            )}

            <div 
              className="border-[1px] border-dashed border-gray-primary w-[100px] h-[40px] text-3xl text-center py-1 px-8 opacity-60 hover:opacity-100 hover:border-gray-700 flex items-center justify-center cursor-pointer transition-all rounded-3xl"
              onClick={() => setIsInterestSelectModalOpen(true)}
            >
              { user?.interests.length === 10 ? '-' : '+' }
            </div>
          </div>

          {isInterestSelectModalOpen && <InterestSelectModal />  }

        </div>
      </div>

    </div>
  );
}