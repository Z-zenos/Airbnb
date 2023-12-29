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

export default function ResetPasswordPage() {
  const { setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const { openToast } = useContext(ToastContext);
  const [resetPasswordFormData, setResetPasswordFormData] = useState({});

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

  async function handleSubmitForm(ev) {
    ev.preventDefault();
    if (Object.keys(errors).length === 0 && errors.constructor === Object) {
      try {
        setIsLoading(true);

        console.log(resetPasswordFormData);

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
        <div className="border border-gray-300 rounded-lg p-4 w-[600px] h-[420px]">
          <h3 className="text-xl font-semibold mb-4">Reset password</h3>
          <form className="grid grid-cols-5 gap-4" onSubmit={handleSubmit(handleSubmitForm)}>
            <div className=" col-span-3">
              <p className="font-light mb-8">Must include at least one symbol or number and have at least 8 characters.</p>

              <Inputv2
                type="password" 
                name="password"
                label="Password" 
                errors={errors} 
                register={register}
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
                  }
                }} 
                onChange={ev => handleFormDataChange(ev, setResetPasswordFormData)}
                className="my-3 rounded-md" 
              />

              <Inputv2
                type="password" 
                name="confirm_password"
                label="Re-enter the new password." 
                errors={errors} 
                register={register}
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
                onChange={ev => handleFormDataChange(ev, setResetPasswordFormData)}
                className="my-3 rounded-md" 
              />

            <Button 
              isLoading={isLoading} 
              disabled={Object.keys(errors).length} 
              label="Reset password" 
              className="w-full mt-8 bg-secondary border-secondary hover:bg-white hover:text-secondary px-6" 
              onClick={async (ev) => await handleSubmitForm(ev)} 
            />
            </div>
            <div className="col-span-2">
              <p className="font-semibold text-lg text-primary">Rules</p>
              <ul className="text-sm font-light flex flex-col gap-1">
                <p>&#x2022; Password strength: weak</p>
                <p>&#x2022; Can&apos;t contain your name or email address</p>
                <p>&#x2022; At least 8 characters</p>
                <p>&#x2022; Contains a number or symbol</p>
              </ul>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}