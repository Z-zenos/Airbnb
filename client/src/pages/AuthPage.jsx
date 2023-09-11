import { useEffect, useState, useCallback } from "react";

import axios from "axios";
import { useForm } from "react-hook-form";
import * as yup from "yup";


import Input from "../components/Input/Input";
import { AiFillFacebook } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";

const useYupValidationResolver = validationSchema =>
  useCallback(
    async data => {
      try {
        const values = await validationSchema.validate(data, {
          abortEarly: false
        });

        return {
          values,
          errors: {}
        };
      } catch (errors) {
        return {
          values: {},
          errors: errors.inner.reduce(
            (allErrors, currentError) => ({
              ...allErrors,
              [currentError.path]: {
                type: currentError.type ?? "validation",
                message: currentError.message
              }
            }),
            {}
          )
        };
      }
    },
    [validationSchema]
  );

const phoneRegex = /^[\\+]?[(]?[0-9]{3}[)]?[-\s\\.]?[0-9]{3}[-\s\\.]?[0-9]{4,6}$/im;

const authFormSchema = yup.object({
  email: yup
    .string()
    .email("Please enter correct email.")
    .required("Please enter email."),
  
  name: yup
    .string()
    .required("Please enter name.")
    .max(50, "Name must be less than 50 characters.")
    .min(4, "Name must be greater than 4 characters"),

  phone: yup
    .string()
    .required("Please enter your phone.")
    .matches(phoneRegex, "Phone invalid."),

  password: yup
    .string()
    .required("Please enter password.")
    .max(255, "Password must be less than 50 characters.")
    .min(4, "Password must be greater than 4 characters"),
    
  passwordConfirm: yup
    .string()
    .required("Please re-enter password to confirm.")
    .oneOf([yup.ref('password'), null], "Passwords must match.")
  
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

  const { register, handleSubmit, formState: {errors} } = useForm({ mode: 'onChange', resolver });

  const [countries, setCountries] = useState([]);
  const { email, name, password, passwordConfirm, phone, country } = formData;

  async function getCountriesData () {
    try {
      const res = await axios.get('http://localhost:3000/api/v1/resources/countries');
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
    console.log(errors);
    ev.preventDefault();

    // const typeSubmit = ev.target.textContent; // login / register

    if(formData.password !== formData.passwordConfirm) {
      console.error("Password does not match !");
    }
    else {
      const newUser = {
        ...formData
      };

      try {
        const config = {
          headers: {
            "Content-Type": "application/json"
          },
        };

        const body = JSON.stringify(newUser);
        await axios.post('http://localhost:3000/api/v1/auth/signup', body, config);
      } catch (err) {
        console.error(err.response.data);
      }
    }
  }

  return (
    <div className="bg-[url('src/assets/images/background-1.webp')] grow flex items-center justify-around h-[85vh]">
      
      <div className="auth-box bg-white w-[600px] rounded-md py-2 shadow-[0_0_0_1000px_rgba(0,0,0,0.5)] -mt-16">
        <div className="px-6 pb-4 pt-2 text-center border-b-[1px] border-gray-300">
          <h3 className="font-bold text-md">Login or signup</h3>
        </div>
        <div className="p-6 relative">
          <h2 className="text-xl font-bold mb-4">Welcome to Airbnb</h2>

          <form className="w-2/3" onSubmit={handleSubmit(handleSubmitForm)}>
            <div className="relative">
              {/* FOR LOGIN */}
              <Input label="Email" name="email" type="email" className="rounded-t-[8px]" value={email} onChange={handleFormDataChange} register={register} />

              {errors.email && (
                <p>{errors.email.message}</p>
              )}
              <Input label="Password" name="password" type="password" className="border-t-transparent" value={password} onChange={handleFormDataChange} register={register} />

              {/* FOR REGISTER */}
              <Input label="Confirm password" name="passwordConfirm" type="password" className="border-t-transparent" value={passwordConfirm} onChange={handleFormDataChange} register={register} />
              <Input label="Name" type="text" name="name" className="border-t-transparent" value={name} onChange={handleFormDataChange} register={register} />

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

              <Input label="Phone number" beforeText={countries.length && countries?.find(c => c.name === country).dialling_code} name="phone" type="tel" className="rounded-b-[8px] border-t-transparent" value={phone} onChange={handleFormDataChange} register={register} />
              
              <button 
                className="absolute top-[96px] -right-44 w-1/3 rounded-md text-center p-2 cursor-pointer bg-primary text-white font-bold border border-primary after:w-[40px] after:h-1 after:bg-primary after:top-1/2 after:absolute after:block after:-left-[30px] after:-translate-y-1/2 after:rounded-full hover:bg-white hover:text-primary"
                onClick={handleSubmitForm}
                type="submit"
              >
                Login
              </button>

              <button 
                className="absolute bottom-[2px] -right-44 w-1/3 rounded-md text-center p-2 cursor-pointer bg-primary border border-primary text-white font-bold translate-y-[16px] after:w-[40px] after:h-1 after:bg-primary after:top-1/2 after:absolute after:block after:-left-[30px] after:-translate-y-1/2 after:rounded-full hover:bg-white hover:text-primary"
                onClick={handleSubmitForm}
                type="submit"
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

          <div className="other">
            <div className="h-[1px] relative bg-gray-300 mt-10">
              <div className="absolute w-10 h-10 text-gray-700 text-sm bg-white flex items-center justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">or</div>
            </div>

            <button className="relative text-[15px] flex justify-center items-center w-3/4 mx-auto rounded-md text-center p-2 cursor-pointer bg-white border border-gray-500 shadow-sm shadow-gray-300 hover:bg-gray-100 mt-7 mb-4">
              <AiFillFacebook className="absolute top-1/2 left-[32px] -translate-x-1/2 -translate-y-1/2 text-[#1773ea] text-[24px] " />
              Continue with Facebook
            </button>

            <button className="relative text-[15px] flex justify-center items-center w-3/4 mx-auto  rounded-md text-center p-2 cursor-pointer bg-white border border-gray-500 shadow-sm shadow-gray-300 hover:bg-gray-100">
              <FcGoogle className="absolute top-1/2 left-[32px] -translate-x-1/2 -translate-y-1/2 text-[24px] " />
              Continue with Google
            </button>
          </div>
        </div>
      
      </div>

    </div>
  );
}