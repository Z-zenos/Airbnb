
import { useContext, useEffect, useState } from "react";
import Modal from "./Modal";
import { ModalContext } from "../../contexts/modal.context";
import Input from "../Input/Input";
import axios from "axios";
import { UserContext } from "../../contexts/user.context";
import Checkbox from "../Input/Checkbox";
import { ToastContext } from "../../contexts/toast.context";
import Toast from "../Toast/Toast";

export default function LanguageSelectModal () {
  const { isLanguageSelectModalOpen, setIsLanguageSelectModalOpen } = useContext(ModalContext);
  const { user, setUser } = useContext(UserContext);

  const [languageInput, setLanguageInput] = useState('');
  const [languages, setLanguages] = useState([]);
  const searchLanguages = languages.length > 0 ? languages.filter(language => language.toLowerCase().startsWith(languageInput.toLowerCase())) : [];
  const [selectedLanguages, setSelectedLanguages] = useState(user?.languages || []);
  const { openToast } = useContext(ToastContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const resLanguages = await axios.get("/resources/languages");
        setLanguages(resLanguages.data.data.languages);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  async function handleUpdateLanguages() {
    try {
      setIsLoading(true);
      const res = await axios.patch(`/users/me`, { languages: selectedLanguages });
      openToast(<Toast title="Success" content="Update languages successfully" type="success" />);
      setIsLoading(false);
      setUser(res.data.data.user);
      setIsLanguageSelectModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  }

  const bodyContent = (
    <div className="no-scrollbar overflow-y-auto text-left w-full h-[600px] px-4">
      <h3 className="text-2xl font-medium">Languages you speak</h3>
      <Input 
        label="Search for a language" 
        className="rounded-lg mb-4 mr-5 mt-4"
        value={languageInput} 
        onChange={(ev => setLanguageInput(ev.target.value))}  
      />
      <div className="grid grid-cols-3">
        { languages.length > 0 && searchLanguages.map(language => (
            <div className="flex justify-between items-center" key={language}>
              <Checkbox
                key={language} 
                label={language} 
                checked={selectedLanguages.filter(l => l === language).length > 0} 
                onChange={() => setSelectedLanguages(prev => 
                  prev.filter(l => l === language).length > 0
                    ? prev.filter(l => l !== language)
                    : [...prev, language]
                )} 
              />
            </div>
          ))
        }
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isLanguageSelectModalOpen} 
      onClose={() => setIsLanguageSelectModalOpen(false)} 
      onSubmit={async () => await handleUpdateLanguages()}
      title="Language Selector"
      body={bodyContent}
      isLoading={isLoading}
      actionLabel="Save"
    />
  );
}