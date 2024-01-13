import { useContext, useEffect, useMemo, useState } from "react";
import Inputv2 from "../components/Input/Input.v2";
import { UserContext } from "../contexts/user.context";
import { ToastContext } from "../contexts/toast.context";
import axios from "axios";
import Toast from "../components/Toast/Toast";
import handleFormDataChange from "../utils/handleFormDateChange";
import { useForm } from "react-hook-form";
import Button from "../components/Button/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { IoMdArrowBack, IoMdCloseCircleOutline } from "react-icons/io";
import { TiTick } from "react-icons/ti";
import { FaCheck } from "react-icons/fa";
import { RiProhibitedLine } from "react-icons/ri";
import passwordChecker from "../utils/passwordChecker";
import Spinner from "../components/Spinner/Spinner";

export default function ReviewAccountPage() {

  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const { openToast } = useContext(ToastContext);
  const [resetPasswordFormData, setResetPasswordFormData] = useState({
    password: "",
    confirm_password: ""
  });

  const reviewAccountToken = location.pathname.slice(location.pathname.lastIndexOf('/') + 1);
  const [isReviewAccountTokenValid, setIsReviewAccountTokenValid] = useState(true);

  const [rules, setRules] = useState({
    password_strength: {
      valid: false,
      description: `Password strength: `,
      strength: 'weak'
    },
    containsUpperAndLower: {
      valid: false,
      description: "At least 1 upper and 1 lower"
    },
    minLength: {
      valid: false,
      description: "At least 4 characters",
      min: 4
    },
    containsANumberOrSymbol: {
      valid: false,
      description: "Contains a number or symbol"
    }
  });

  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors }
  } = useForm({ 
    mode: "all", 
    defaultValues: {
      password: "",
      confirm_password: "",
    }
  });

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`auth/reviewAccount/${reviewAccountToken}}`);
        setIsReviewAccountTokenValid(res.data.valid);
      } catch (error) {
        setIsReviewAccountTokenValid(false);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  function handleRules(ev) {
    let password = ev.target.value || '';

    if(!password) {
      setRules(prev => {
        Object.keys(rules).forEach(rule => prev[rule].valid = false);
        prev['password_strength'].strength = "weak";
        return prev;
      });
      return;
    }

    setRules(prev => {
      prev.minLength.valid = password.length >= rules['minLength'].min;
      prev.containsUpperAndLower.valid = /(?=.*[a-z])(?=.*[A-Z])/.test(password);
      prev.containsANumberOrSymbol.valid = (/[!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?]+/.test(password) || /[0-9]/.test(password));
      let strength = passwordChecker(password);
      if(strength !== 'weak') {
        prev.password_strength.valid = strength !== 'weak';
        prev.password_strength.strength = strength;
      }

      return prev;
    });
  }

  async function handleSubmitForm(ev) {
    ev.preventDefault();
    if (Object.keys(rules).filter(rule => rules[rule].valid).length === 4) {
      try {
        setIsLoading(true);

        const config = {
          headers: {
            "Content-Type": "application/json"
          },
        };

        const res = await axios.patch(`/auth/review-account/${reviewAccountToken}}`, {
          password: resetPasswordFormData.password,
          passwordConfirm: resetPasswordFormData.confirm_password
        }, config);

        setUser(res.data.data.user);
        openToast(<Toast title="Success" content={`Reset password successfully`} type="success" />);

        navigate('/');

      } catch (err) {
        openToast(<Toast title="Fail" content={err.response?.data?.message} type="error" />);
      } finally {
        setIsLoading(false);
      }
    }
  }

  const Notice_Step = (
    <>
      <p className="font-light">
        If we notice (or you let us know about) activity on your account that looks like it might not have come from you, we’ll ask you to complete an account review.
      </p>
      <p className="my-3"></p>
      <p className="font-light mb-4">
        You’ll start by creating a new, unique password, then we’ll walk you through a few steps to review and undo any changes that were made without your permission.
      </p>
    </>
  );

  const Update_password_Step = (
    <>
      <p className="font-light mb-8">A new password will help make sure you, and only you, have access to your account. Your password must be at least 8 characters long.</p>
      <form className="grid grid-cols-5 gap-6" onSubmit={handleSubmit(handleSubmitForm)}>
        <div className=" col-span-3">
          <p className="font-light mb-8">Must include at least one symbol or number and have at least 8 characters.</p>

          <Inputv2
            type="password" 
            name="password"
            label="Password" 
            register={register}
            errors={errors}
            value={resetPasswordFormData.password}
            validationSchema={{
              required: "Password is required.",
              minLength: {
                value: 4,
                message: "Please enter a minimum of 4 characters"
              },
              maxLength: {
                value: 100,
                message: "Password must be less than 100 characters."
              },
              validate: (password) => {
                if (watch('confirm_password') !== password) {
                  return "Your passwords do no match";
                }
                else return true;
              }
            }} 
            onChange={ev => {
              handleFormDataChange(ev, setResetPasswordFormData)
              handleRules(ev);
            }}
            className="my-3 rounded-md" 
          />

          <Inputv2
            type="password" 
            name="confirm_password"
            label="Re-enter the new password." 
            register={register}
            errors={errors}
            value={resetPasswordFormData.confirm_password}
            validationSchema={{
              required: "Please re-enter password to confirm.",
              minLength: {
                value: 4,
                message: "Please enter a minimum of 4 characters"
              },
              maxLength: {
                value: 100,
                message: "Password must be less than 100 characters."
              },
              validate: (confirm_password) => {
                if (watch('password') !== confirm_password) {
                  return "Your passwords do no match";
                }
              }
            }} 
            onChange={ev => {
              handleFormDataChange(ev, setResetPasswordFormData)
              handleRules(ev);
            }}
            className="my-3 rounded-md" 
          />

        <Button 
          isLoading={isLoading} 
          label="Reset password" 
          disabled={
            Object.keys(errors).length > 0 || 
            Object.keys(rules).filter(rule => !rules[rule].valid).length > 0}
          className="w-full mt-8 bg-secondary border-secondary hover:bg-white hover:text-secondary px-6" 
          onClick={async (ev) => await handleSubmitForm(ev)} 
        />
        </div>

        <div className="col-span-2">
          <p className="font-semibold text-lg text-primary">Rules</p>
          <ul className="text-sm font-light flex flex-col gap-1">
            { Object.keys(rules).map(rule => (
              <p key={rule} className={`${rules[rule].valid ? 'text-green-500' : 'text-primary'} flex items-center justify-start gap-2`}>
                { rules[rule].valid 
                  ? <TiTick className="flex-shrink-0 w-3 h-3 inline"/> 
                  : <IoMdCloseCircleOutline className=" flex-shrink-0 w-3 h-3 inline" />
                }
                { rules[rule].description + (rule === 'password_strength' ? rules[rule].strength : '')}
              </p>
            )) }
            
          </ul>
        </div>
      </form>
    </>
  );

  const Check_device_Step = (
    <>
      <p className="font-light mb-8">If you don’t recognize a device or location, click <span className="font-semibold">Remove</span> next to it—this will reverse any changes made by that device.</p>

      <div className="flex flex-col gap-3 ">
        <div className="flex gap-8 items-center pl-10 py-8 border-b border-b-gray-300">
          <img src="https://cdn-icons-png.flaticon.com/128/2248/2248656.png" title="computer image" className="w-[100px] h-[100px]" />
          <div>
            <p className="mb-3">Linux (Ubuntu)</p>
            <p className="font-semibold text-sm">HN, Vietnam</p>
            <p className="font-semibold text-sm text-green-600">Now - Current Device</p>
          </div>
        </div>

        <div className="flex gap-8 items-center pl-10  py-8 border-b border-b-gray-300">
          <img src="https://cdn-icons-png.flaticon.com/128/2482/2482945.png" title="phone image" className="w-[100px] h-[100px]" />
          <div>
            <p className="mb-3">Android Phone</p>
            <p className="font-semibold text-sm">HN, Vietnam</p>
            <p className=" font-light text-sm">9 days ago</p>
          </div>
        </div>
      </div>
    </>
  );

  const Review_account_info_Step = (
    <>
      <p className="font-light mb-8">Update your info or click <span className="font-semibold">Remove</span> or <span className="font-semibold">Change</span> next to anything you don’t recognize. You can always make more changes from your account settings later.</p>

      <div>
        <h3 className="font-semibold">First & last name</h3>
        <input className="p-3 focus:outline-none  w-full border border-gray-300 focus:border-secondary rounded my-2" />
        <input className="p-3 focus:outline-none  w-full border border-gray-300 focus:border-secondary rounded my-2" />
      </div>
      <div className="mt-4">
        <h3 className="font-semibold">Email Address</h3>
        <input className="p-3 focus:outline-none  w-full border border-gray-300 focus:border-secondary rounded my-2" />
      </div>
    </>
  );

  const Check_profile_photo_Step = (
    <>
      <p className="font-light mb-8">If you don’t recognize one of these photos, click the trash icon to remove it from your profile.</p>

      <div className="mt-10">
        <img src="https://a0.muscache.com/im/pictures/user/14e684fa-919f-4077-b692-1aaea77be871.jpg?aki_policy=profile_large" className="w-full rounded" />
      </div>
    </>
  );

  const Final_Step = (
    <>
      <p className="font-light mb-8">Taking time to review your account helps keep Airbnb secure for you and the rest of our community.</p>

      <div className="mt-10">
        <h3 className="font-semibold">Here&lsquo;s what you did:</h3>
        <div className="my-3 flex justify-between items-center">
          <p className="font-light">Reviewed recent logins</p>
          <FaCheck className=" text-green-400" />
        </div>
        <div className="my-3 flex justify-between items-center">
          <p className="font-light">Updated your account details</p>
          <FaCheck className=" text-green-400" />
        </div>
      </div>
    </>
  )

  const steps = useMemo(() => [
    { 
      title: "Let's review your account", 
      step: Notice_Step, 
      right_button: 'Start',
    },
    { 
      title: "Start by updating your password", 
      step: Update_password_Step, 
      right_button: 'Skip'  
    },
    { 
      title: "Do you recognize these recent logins?", 
      step: Check_device_Step, 
      right_button: 'Next'  
    },
    { 
      title: "Now, let’s review your account info", 
      step: Review_account_info_Step, 
      right_button: 'Next'  
    },
    {
      title: "Are these your profile photos?",
      step: Check_profile_photo_Step,
      right_button: 'Next'
    },
    {
      title: "You're all set!",
      step: Final_Step,
      right_button: 'Return to Airbnb'
    },
  ], []);

  const [step, setStep] = useState(0);

  return (
    <div className="2xl:w-[70%] xl:w-[80%] lg:w-[80%] md:w-[100%] sm:block mx-auto md:px-10 mb-10 relative">
      { isLoading 
        ? <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"><Spinner className="mx-auto" /></div> 
        : <>
          { isReviewAccountTokenValid ? (
          <div className="flex justify-center items-center flex-col py-[110px]">
            <div className="px-[20%]">
              <h3 className="font-medium text-3xl mb-4">{steps[step].title}</h3>

              {steps[step].step}
            </div>

            <div className="flex gap-3 justify-start items-center">
              { (step > 0 && step < steps.length - 1) && <Button 
                  isLoading={isLoading} 
                  label="Back" 
                  outline={true}
                  className="w-full mt-8 text-secondary border-none hover:underline px-6" 
                  onClick={() => setStep(prev => prev - 1)} 
                >
                  <IoMdArrowBack />
                </Button>
              }

              <Button 
                isLoading={isLoading} 
                label={steps[step].right_button}
                className="w-full mt-8 bg-secondary border-secondary hover:bg-white hover:text-secondary px-6" 
                onClick={() => {
                  if(step === steps.length - 1) {
                    navigate('/');
                  }
                  else setStep(prev => prev + 1)
                }} 
              />
            </div>
          </div>
          ) : (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <RiProhibitedLine className="text-primary mx-auto w-[100px] h-[100px] mt-10" />
            <p className="text-primary font-semibold flex justify-center items-center flex-col py-10">You do not have permission to access this resource.</p>
          </div>
          )}
        </>
      }
    </div>
  );
}