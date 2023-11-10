import { useContext, useEffect, useState } from "react";
import { ModalContext } from "../../contexts/modal.context";
import Modal from "./Modal";
import capitalizeFirstLetter from "../../utils/capitalizeFirstLetter";
import Input from "../Input/Input";
import { FcCheckmark } from "react-icons/fc";
import axios from "axios";
import { UserContext } from "../../contexts/user.context";
import { ToastContext } from "../../contexts/toast.context";
import Toast from "../Toast/Toast";

const MAX_INTERESTS = 10;

export default function InterestSelectModal() {
  const { user, setUser } = useContext(UserContext);
  const { isInterestSelectModalOpen, setIsInterestSelectModalOpen } = useContext(ModalContext);
  const { openToast } = useContext(ToastContext);
  const [interests, setInterests] = useState([]);
  const [interestInput, setInterestInput] = useState('');
  const searchInterests = interests.length > 0 ? interests.filter(interest => interest.name.includes(interestInput)) : [];
  const [selectedInterests, setSelectedInterests] = useState(user?.interests || []);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const resInterests = await axios.get("/resources/interests");
        setInterests(resInterests.data.data.interests);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  async function handleSaveInterests() {
    try {
      setIsLoading(true);
      const res = await axios.patch(`/users/me`, { interests: selectedInterests.map(si => si._id) });
      openToast(<Toast title="Success" content="Update interests successfully" type="success" />);
      setUser(res.data.data.user);
      setIsInterestSelectModalOpen(false);
    } catch (err) {        
      openToast(<Toast title="Fail" content={err.response.data.message} type="error" />);
    } finally {
      setIsLoading(false);
    }
  }

  const bodyContent = (
    <div className="no-scrollbar overflow-y-auto text-left w-full h-[600px] px-4">
      <h3 className="text-2xl font-medium">What are you into?</h3>
      <p className="opacity-60 my-3">Pick up to {MAX_INTERESTS} interests or sports you enjoy that you want to show on your profile.</p>
      <Input
        label="Interest" 
        className="rounded-lg mb-4 mr-5"
        value={interestInput} 
        onChange={(ev => setInterestInput(ev.target.value))}  
      />
      <div className="flex flex-wrap gap-3 pr-5">
        { interests?.length > 0 && searchInterests.map(interest => (
            <div 
              key={interest.name} 
              className={`
                py-[6px] px-5 rounded-3xl flex gap-2 justify-start items-center border hover:border-gray-primary 
                cursor-pointer transition-all 
                ${selectedInterests.filter(si => si.name === interest.name).length > 0 
                  ? ' border-black border-[2px]' 
                  : (selectedInterests.length === MAX_INTERESTS 
                    ? 'opacity-40 cursor-not-allowed' 
                    : 'border-gray-300'
                    )
                }
              `}
              onClick={() => {
                setSelectedInterests(prev => 
                  prev.filter(i => i.name === interest.name).length > 0
                    ? prev.filter(i => i.name !== interest.name)
                    : (
                      selectedInterests.length === MAX_INTERESTS
                        ? prev
                        : [...prev, interest] 
                    )
                  )
              }}
            >
              <span><img src={`http://localhost:3000/images/interests/${interest.iconImage}`} className="w-5 h-5" /></span>
              <span className="text-[15px] font-light">{ capitalizeFirstLetter(interest.name) }</span>
            </div>
          ))
        }
      </div>
    </div>
  );  

  return (
    <Modal
      isOpen={isInterestSelectModalOpen} 
      onSubmit={async () => await handleSaveInterests()} 
      onClose={() => setIsInterestSelectModalOpen(false)} 
      actionLabel={"Save"} 
      title="Interests Selector"
      body={bodyContent}
      isLoading={isLoading}
      footer={
        <div className="text-right border-l-[1px] border-l-gray-400 pl-10">
          <p className="font-medium">{selectedInterests.length} / {MAX_INTERESTS} selected</p>
          <p className={`font-light ${selectedInterests.length !== MAX_INTERESTS ? 'opacity-70' : 'opacity-100'}  text-[13px]`}>
            {selectedInterests.length === MAX_INTERESTS 
              ? <span className="flex items-center gap-2 justify-end"><FcCheckmark size={20} /> You&lsquo;ve selected {MAX_INTERESTS} items.</span> 
              : 'Your selections will appear here'}
          </p>
        </div>
      }
      footerClassName="border-t border-t-gray-300 grid grid-cols-2 items-center"
    />
  );
}