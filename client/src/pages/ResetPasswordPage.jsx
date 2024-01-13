import { useContext, useState } from "react";
import Inputv2 from "../components/Input/Input.v2";
import { UserContext } from "../contexts/user.context";
import { ToastContext } from "../contexts/toast.context";
import axios from "axios";
import Toast from "../components/Toast/Toast";
import handleFormDataChange from "../utils/handleFormDateChange";
import { useForm } from "react-hook-form";
import Button from "../components/Button/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { TiTick } from "react-icons/ti";
import passwordChecker from "../utils/passwordChecker";

export default function ResetPasswordPage() {
  const { setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const { openToast } = useContext(ToastContext);
  const [resetPasswordFormData, setResetPasswordFormData] = useState({
    password: "",
    confirm_password: ""
  });

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

  const location = useLocation();
  const navigate = useNavigate();

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

        const res = await axios.patch(`/auth/resetPassword/${location.pathname.slice(location.pathname.lastIndexOf('/') + 1)}`, {
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

  return (
    <div className="2xl:w-[70%] xl:w-[80%] lg:w-[80%] md:w-[100%] sm:block mx-auto md:px-10 mb-10 ">
      <div className="flex justify-center items-center py-[110px]">
        <div className="border border-gray-300 rounded-lg p-8 w-[700px] h-[420px]">
          <h3 className="text-xl font-semibold mb-4">Reset password</h3>
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
        </div>
      </div>
    </div>
  );
}