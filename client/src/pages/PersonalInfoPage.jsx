import { AiOutlineFileProtect } from "react-icons/ai";
import { FaLock } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import axios from "axios";
import SelectInput from "../components/Input/SelectInput";
import { ToastContext } from "../contexts/toast.context";
import Toast from "../components/Toast/Toast";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import useYupValidationResolver from "../hooks/useYupValidationResolver";
import { UserContext } from "../contexts/user.context";

const phoneRegex = /^[\\+]?[(]?[0-9]{3}[)]?[-\s\\.]?[0-9]{3}[-\s\\.]?[0-9]{4,6}$/im;

const basicPersonalInfoSchema = {
  name: yup
  .string().trim()
  .max(255, "Name must be less than 255 characters.")
  .min(4, "Name must be greater than 3 characters.")
  .required("Please tell us your name."),

  email: yup
    .string()
    .email("Please enter correct email.")
    .required("Please enter email."),

  phone: yup
    .string()
    .matches(phoneRegex, "Phone invalid.")
    .required("Please enter your phone."),
}

const personalInfoFormSchema = yup.object({
  ...basicPersonalInfoSchema,

  emergency_contact: yup
    .object({
      ...basicPersonalInfoSchema,
      relation_ship: yup
        .string().trim()
        .max(255, "Name must be less than 255 characters.")
        .min(4, "Name must be greater than 3 characters.")
        .required("Please tell us your name."),
    })
});

export default function PersonalInfoPage() {
  const {user, setUser} = useContext(UserContext);

  const resolver = useYupValidationResolver(personalInfoFormSchema);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setFormData({
      email: user?.email,
      name: user?.name,
      phone: user?.phone,
      emergency_contact: user?.emergency_contact
    });
  }, [JSON.stringify(user)]);

  const { register, trigger, handleSubmit, formState: {errors} } = useForm({ mode: "all", resolver });

  const [infoInputOpen, setInfoInputOpen] = useState({
    name: false,
    email: false,
    phone: false,
    emergency_contact: false 
  });

  const [countries, setCountries] = useState([]);

  const { openToast } = useContext(ToastContext);
  const [isLoading, setIsLoading] = useState(false);

  function handleFormDataChange(ev) {
    const { name, value } = ev.target;
    setFormData(prevFromData => ({ ...prevFromData, [name]: value }));
  }

  async function handleSubmitForm(ev) {
    trigger();
    ev.preventDefault();
    if(Object.keys(errors).length === 0 && errors.constructor === Object) {
      try {
        setIsLoading(true);
        console.log(formData);
        // const config = {
        //   headers: {
        //     "Content-Type": "application/json"
        //   },
        // };
        
        // const res = await axios.patch(`/users/me`, formData, config);

        // openToast(<Toast title="Success" content="Update personal info successfully" type="success" />)

        // const loggedUser = res.data.data.user;
        // setUser(loggedUser);
        
      } catch (err) {
        openToast(<Toast title="Fail" content={err.response.data.message} type="error" />);
      } finally {
        setIsLoading(false);
      }
    }
  }

  function handleEditInfo(prop) {
    setInfoInputOpen(prev => {
      const newInfo = { ...prev };
      newInfo[prop] = !newInfo[prop];

      return newInfo;
    });
  }

  function getCountriesData () {
    (async () => {
      try {
        const res = await axios.get('/resources/countries');
        const countries = res.data.data.countries;
  
        setCountries(countries);
      } catch (err) {
        console.error(err);
      }
    })();
  }

  useEffect(getCountriesData, []);

  return (
    <div className="2xl:w-[70%] xl:w-[80%] lg:w-[80%] md:w-[100%] sm:block mx-auto md:px-10 mb-10 ">
      <h2 className="font-medium text-3xl my-10">Personal Info</h2>
      <div className="md:grid md:grid-cols-5 gap-20 py-10">

        <form className="col-span-3" onSubmit={handleSubmit(handleSubmitForm)}>
          
          {/* LEGAL NAME */}
          <div className="grid grid-cols-11 gap-2 border-b border-b-gray-300 py-6">
            <div className=" col-span-10">
              <p className="text-[17px]">Legal name</p>
              { infoInputOpen['name'] 
                ? (
                  <div>
                    <p className="my-3 text-[14px] font-light opacity-60">
                      This is the name on your travel document, which could be a license or a passport.
                    </p>
                    <Input label="Legal name" className="my-3 rounded-lg" value={formData?.name} {...register("name", { required: true, onChange: handleFormDataChange })} errors={errors} />
                    
                  </div>
                )
                : <p className="font-light opacity-60 text-[14px]">Tuấn Hoàng Anh</p>
              }
            </div>
            <p onClick={() => handleEditInfo('name')} className="underline cursor-pointer text-[15px]">{ infoInputOpen['name'] ? 'Cancel' : 'Edit' }</p>
          </div>

          {/* EMAIL ADDRESS */}
          <div className="grid grid-cols-11 gap-2 border-b border-b-gray-300 py-6">
            <div className=" col-span-10">
              <p className="text-[17px]">Email address</p>
              { infoInputOpen['email'] 
                ? (
                  <div>
                    <p className="my-3 text-[14px] font-light opacity-60">
                      Use an address you’ll always have access to.
                    </p>
                    <Input label="Email address" className="my-3 rounded-lg" value={formData?.email} {...register("email", { required: true, onChange: handleFormDataChange })} errors={errors} />
                    
                  </div>
                )
                : <p className="font-light opacity-60 text-[14px]">h**1@gmail.com</p>
              }
              
            </div>
            <p onClick={() => handleEditInfo('email')} className="underline cursor-pointer text-[15px]">{ infoInputOpen['email'] ? 'Cancel' : 'Edit' }</p>
          </div>
          
          {/* PHONE NUMBER */}
          <div className="grid grid-cols-11 gap-2 border-b border-b-gray-300 py-6">
            <div className=" col-span-10">
              <p className="text-[17px]">Phone numbers</p>
              <p className="font-light opacity-60 text-[14px]">Add a number so confirmed guests and Airbnb can get in touch. You can add other numbers and choose how they’re used.</p>
              { infoInputOpen['phone'] && (
                  <div>
                    <p className="my-3 text-[14px] font-light opacity-90">
                      Enter an new phone number
                    </p>
                    
                    <SelectInput 
                      label="Country/region" 
                      data={countries} 
                      optionValueTitle="name" 
                      className=" border-b-transparent rounded-tl-lg rounded-tr-lg" 
                      optionDisplayFormat="name (dialling_code)" 
                    />

                    <Input label="Phone number" className="mb-3 rounded-br-lg rounded-bl-lg" value={formData?.phone} {...register("phone", { required: true, onChange: handleFormDataChange })} errors={errors} />

                    <p className="text-[14px] font-light opacity-60 mb-3">We’ll send you a code to verify your number. Standard message and data rates apply.</p>
                    
                  </div>
              )}
            </div>
            <p onClick={() => handleEditInfo('phone')} className="underline cursor-pointer text-[15px]">{ infoInputOpen['phone'] ? 'Cancel' : 'Edit' }</p>
          </div>

          {/* EMERGENCY CONTACT */}
          <div className="grid grid-cols-11 gap-2 border-b border-b-gray-300 py-6">
            <div className=" col-span-10">
              <p className="text-[17px]">Emergency contact</p>
              { infoInputOpen['emergency_contact'] 
                ? (
                  <div>
                    <p className="my-3 text-[14px] font-light opacity-60">
                    A trusted contact we can alert in an urgent situation.
                    </p>
                    <div className="grid grid-cols-1 mb-6">
                      <Input label="Name" className="rounded-tl-lg rounded-tr-lg border-b-0" value={formData?.emergency_contact.name} {...register("emergency_contact.name", { required: true, onChange: handleFormDataChange })} errors={errors} />

                      <Input label="Relationship" className="border-b-0" value={formData?.emergency_contact.relation_ship} {...register("emergency_contact.relation_ship", { required: true, onChange: handleFormDataChange })} errors={errors} />

                      <Input label="Email" value={formData?.emergency_contact.email} {...register("emergency_contact.email", { required: true, onChange: handleFormDataChange })} errors={errors} />

                      <div className="flex justify-between items-center">
                        <SelectInput 
                          label="Country/region" 
                          data={countries} 
                          optionValueTitle="name" 
                          className=" border-t-transparent border-r-transparent rounded-bl-lg" 
                          optionDisplayFormat="name (dialling_code)" 
                        />
                        <Input label="Phone number" className="border-t-0 rounded-br-lg" value={formData?.emergency_contact.phone} {...register("emergency_contact.phone", { required: true, onChange: handleFormDataChange })} errors={errors} />
                      </div>
                    </div>
                  </div>
                )
                : <p className="font-light opacity-60 text-[14px]">Not provided</p>
              }
            </div>
            <p onClick={() => handleEditInfo('emergency_contact')} className="underline cursor-pointer text-[15px]">{ infoInputOpen['emergency_contact'] ? 'Cancel' : 'Edit' }</p>
          </div>

          <Button isLoading={isLoading} label="Save" className="mt-8 hover:bg-white hover:text-primary px-6" onClick={async (ev) => await handleSubmitForm(ev)} />
        </form>

        <div className="col-span-2">
          <div className="border border-gary-300 rounded-xl p-6">
            <div className="border-b border-b-gray-300 py-6">
              <div className="flex items-center justify-between gap-4 mb-2">
                <AiOutlineFileProtect className="w-[40px] h-[40px] text-primary" />  
                <p className="font-medium text-md">Why isn’t my info shown here?</p>
              </div>
              <p className="opacity-60 font-light">We’re hiding some account details to protect your identity.</p>
            </div>
            <div className="border-b border-b-gray-300 py-6">
              <div className="flex items-center justify-between gap-4 mb-2">
                <FaLock className="w-[40px] h-[40px] text-primary" />  
                <p className="font-medium text-md">Which details can be edited?</p>
              </div>
              <p className="opacity-60 font-light">Contact info and personal details can be edited. If this info was used to verify your identity, you’ll need to get verified again the next time you book—or to continue hosting.</p>
            </div>
            <div className="border-b border-b-gray-300 py-6">
              <div className="flex items-center justify-between gap-4 mb-2">
                <FaEye className="w-[40px] h-[40px] text-primary" />  
                <p className="font-medium text-md">What info is shared with others?</p>
              </div>
              <p className="opacity-60 font-light">Airbnb only releases contact information for Hosts and guests after a reservation is confirmed.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}