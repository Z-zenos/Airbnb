import { useEffect, useState, useContext } from "react";

import axios from "axios";
import { useForm } from "react-hook-form";
import * as yup from "yup";


import Input from "../components/Input/Input";
import { AiFillFacebook } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { Navigate } from "react-router-dom";
import { UserContext } from "../contexts/user.context";
import useYupValidationResolver from "../hooks/useYupValidationResolver";

const phoneRegex = /^[\\+]?[(]?[0-9]{3}[)]?[-\s\\.]?[0-9]{3}[-\s\\.]?[0-9]{4,6}$/im;

const authFormSchema = yup.object({
  email: yup
    .string()
    .email("Please enter correct email.")
    .required("Please enter email."),
  
  name: yup
    .string()
    .max(50, "Name must be less than 50 characters.")
    .min(4, "Name must be greater than 4 characters")
    .required("Please enter name."),

  phone: yup
    .string()
    .matches(phoneRegex, "Phone invalid.")
    .required("Please enter your phone."),

  password: yup
    .string()
    .max(255, "Password must be less than 50 characters.")
    .min(4, "Password must be greater than 4 characters")
    .required("Please enter password."),
    
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref('password'), null], "Passwords must match.")
    .required("Please re-enter password to confirm.")
  
});

export default function AuthPage() {
  const resolver = useYupValidationResolver(authFormSchema);
  
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    passwordConfirm: "",
    phone: "",
    country: ""
  });

  const [redirect, setRedirect] = useState(false);

  const {setUser} = useContext(UserContext);

  const { register, trigger, handleSubmit, formState: {errors, isDirty} } = useForm({ mode: "all", resolver });

  const [countries, setCountries] = useState([]);
  const { email, name, password, passwordConfirm, phone, country } = formData;

  async function getCountriesData () {
    try {
      const res = await axios.get('/resources/countries');
      const countries = res.data.data.countries;

      setCountries(countries);
      setFormData(prevFromData => ({ 
        ...prevFromData, 
        country: countries[0].name
      }));
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getCountriesData();
  }, []);

  function handleFormDataChange(ev) {
    const { name, value } = ev.target;
    setFormData(prevFromData => ({ ...prevFromData, [name]: value }));
  }

  async function handleSubmitForm(ev) {
    trigger();
    ev.preventDefault();
    
    if(Object.keys(errors).length === 0 && errors.constructor === Object) {
      const typeSubmit = ev.target.textContent; // login / register
      const newUser = typeSubmit === 'Login' 
        ? { email: formData.email, password: formData.password } 
        : { ...formData };

      try {
        const config = {
          headers: {
            "Content-Type": "application/json"
          },
        };

        const body = JSON.stringify(newUser);
        const entry = typeSubmit === 'Login' ? 'login' : 'signup';
        
        const res = await axios.post(`/auth/${entry}`, body, config);
        const loggedUser = res.data.data.user;
        setUser(loggedUser);
        setRedirect(true);
      } catch (err) {
        console.error(err);
      }
    }
  }

  if(redirect) return <Navigate to='/' />

  return (
    <div className="bg-[url('src/assets/images/background-1.webp')] grow flex items-center justify-around">
      
      <div className="auth-box bg-white w-[600px] rounded-md py-2 shadow-[0_0_0_1000px_rgba(0,0,0,0.5)] -mt-16">
        <div className="px-6 pb-4 pt-2 text-center border-b-[1px] border-gray-300">
          <h3 className="font-bold text-md">Login or signup</h3>
        </div>
        <div className="p-6 relative h-[520px]  overflow-y-scroll">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Welcome to Airbnb</h2>
            <div className="flex gap-3">
              <AiFillFacebook className="text-[#1773ea] text-3xl cursor-pointer" />
              <FcGoogle className="text-3xl cursor-pointer" />
            </div>
          </div>

          <form className="w-2/3" onSubmit={handleSubmit(handleSubmitForm)}>
            <div className="relative">
              {/* FOR LOGIN */}
              <Input label="Email" name="email" type="email" className="rounded-t-[8px]" value={email} {...register("email", { required: true, onChange: handleFormDataChange })} errors={errors} />

              <Input label="Password" name="password" type="password" className="border-t-transparent" value={password} {...register("password", { required: true, onChange: handleFormDataChange })} errors={errors}  />

              {/* FOR REGISTER */}
              <Input label="Confirm password" name="passwordConfirm" type="password" className="border-t-transparent" value={passwordConfirm} {...register("passwordConfirm", { required: true, onChange: handleFormDataChange })} errors={errors}  />
              <Input label="Name" type="text" name="name" className="border-t-transparent" value={name} {...register("name", { required: true, onChange: handleFormDataChange })} errors={errors}  />

              <div className="relative border border-gray-400 border-t-transparent pt-6 pb-2 focus-within:rounded-md focus-within:outline focus-within:outline-black focus-within:outline-2 focus-within:outline-offset-1 focus-within:border-y-gray-400">
                <select 
                  className="relative w-full h-full focus:border-none focus:outline-none bg-transparent text-[16px] px-[18px] cursor-pointer appearance-none "
                  name="country" value={country.name} onChange={handleFormDataChange}
                >
                  { countries && countries.length && countries.map((country, i) => <option key={country.name + i} value={country.name} data-phonecode={country.phoneCode}>{country.name + ` (${country.dialling_code})`}</option>) }
                </select>
                <label className="absolute pointer-events-none scale-90 left-[12px] text-gray-500 top-[6px] text-[14px]" htmlFor="country">Country/Region</label>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="absolute top-1/2 right-4 -translate-y-1/2 w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>

              </div>

              <Input label="Phone number" beforeText={countries.length && countries?.find(c => c.name === country).dialling_code} name="phone" type="tel" className="rounded-b-[8px] border-t-transparent" value={phone} {...register("phone", { required: true, onChange: handleFormDataChange })} errors={errors}  />
              
              <button 
                className="absolute top-[96px] -right-44 w-1/3 rounded-md text-center p-2 cursor-pointer bg-primary text-white font-bold border border-primary after:w-[40px] after:h-1 after:bg-primary after:top-1/2 after:absolute after:block after:-left-[30px] after:-translate-y-1/2 after:rounded-full hover:bg-white hover:text-primary"
                onClick={handleSubmitForm}
                type="submit"
                disabled={!isDirty}
              >
                Login
              </button>

              <button 
                className="absolute bottom-[2px] -right-44 w-1/3 rounded-md text-center p-2 cursor-pointer bg-primary border border-primary text-white font-bold translate-y-[16px] after:w-[40px] after:h-1 after:bg-primary after:top-1/2 after:absolute after:block after:-left-[30px] after:-translate-y-1/2 after:rounded-full hover:bg-white hover:text-primary"
                onClick={handleSubmitForm}
                type="submit"
                disabled={!isDirty}
              >
                Register
              </button>
              
              <div className="absolute w-[1px] h-full bg-gray-primary top-0 -right-5 rounded-full before:w-3 before:h-3 before:bg-primary before:top-0 before:absolute before:block before:-left-[6px] before:rounded-full
              after:w-3 after:h-3 after:bg-primary after:bottom-0 after:absolute after:block after:-left-[6px] after:rounded-full
              ">
                <div className="absolute w-3 h-3 bg-primary top-[110px] block -left-[6px] rounded-full"></div>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2 mb-5">We’ll call or text you to confirm your number. Standard message and data rates apply. <a className="underline font-bold">Privacy Policy</a></p>
            
          </form>
        </div>
      
      </div>

    </div>
  );
}