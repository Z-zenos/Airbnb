
import { useContext, useEffect, useState } from "react";
import Modal from "./Modal";
import { ModalContext } from "../../contexts/modal.context";
import Input from "../Input/Input";
import axios from "axios";
import { FcCheckmark } from "react-icons/fc";
import { UserContext } from "../../contexts/user.context";
import { ToastContext } from "../../contexts/toast.context";
import Toast from "../Toast/Toast";

export default function SearchAddressModal () {
  const { isSearchAddressModalOpen, setIsSearchAddressModalOpen } = useContext(ModalContext);
  const { setUser } = useContext(UserContext);
  const [addressInput, setAddressInput] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [realSelectedAddress, setRealSelectedAddress] = useState('');
  const { openToast } = useContext(ToastContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        if(!addressInput) return;
        const res = await axios.get(`/resources/cities?keyword=${addressInput}`);
        setAddresses(res.data.data.cities);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [addressInput]);

  async function handleUpdateAddress() {
    try {
      setIsLoading(true);
      const res = await axios.patch(`/users/me`, { address: realSelectedAddress });
      openToast(<Toast title="Success" content="Update address successfully" type="success" />);
      setIsLoading(false);
      setUser(res.data.data.user);
      setIsSearchAddressModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  }

  const bodyContent = (
    <div className="no-scrollbar overflow-y-auto text-left w-full max-h-[400px] px-4 relative">
      <h3 className="text-2xl font-medium">Where you live</h3>
      <Input 
        label="Search for your city" 
        className="rounded-lg w-full mb-4 mr-5 mt-4 sticky bg-white top-1 shadow-[rgba(0,_0,_0,_0.35)_0px_5px_15px] z-10"
        value={addressInput} 
        onChange={(ev => setAddressInput(ev.target.value))}  
      />
      { addresses?.length > 0 && addresses.map((addr, i) => (
          <div 
            className={`py-3 border-b border-b-gray-300 px-3 rounded-md hover:bg-gray-100 cursor-pointer ${selectedAddress === addr.name && 'bg-gray-100 flex justify-between items-center'}`} onClick={() => {
              setSelectedAddress(addr.name);
              setRealSelectedAddress(`${addr.local_name}, ${addr.country}`);
            }} 
            key={addr.name + i}
          >
            <div>
              <span className="font-medium">{addr.name}, </span>
              <span className="opacity-70">{addr.local_name}, {addr.country}</span>
            </div>
            { selectedAddress === addr.name && <FcCheckmark />}
          </div>
        ))
      }
    </div>
  );

  return (
    <Modal
      isOpen={isSearchAddressModalOpen} 
      onClose={() => setIsSearchAddressModalOpen(false)} 
      onSubmit={async () => await handleUpdateAddress()}
      title="Address Selector"
      body={bodyContent}
      actionLabel="Save"
      isLoading={isLoading}
    />
  );
}