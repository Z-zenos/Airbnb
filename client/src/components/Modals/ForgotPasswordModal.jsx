import { useContext, useState } from "react";
import { ModalContext } from "../../contexts/modal.context";
import Modal from "./Modal";
import axios from "axios";
import Inputv2 from "../Input/Input.v2";
import { useForm } from "react-hook-form";
import { ToastContext } from "../../contexts/toast.context";
import Toast from "../Toast/Toast";

export default function ForgotPasswordModal() {
  const { isForgotPasswordModalOpen, setIsForgotPasswordModalOpen } = useContext(ModalContext);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordFormData, setForgotPasswordFormData] = useState({});
  const { openToast } = useContext(ToastContext);

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({ 
    mode: "all", 
    defaultValues: {
      email: ""
    }
  });

  function handleFormDataChange(ev) {
    const { name, value } = ev.target;
    setForgotPasswordFormData(prevFromData => ({ ...prevFromData, [name]: value }));
  }

  async function handleSendResetLink() {
    if (Object.keys(errors).length === 0 && errors.constructor === Object) {
      try {
        setIsLoading(true);

        const res = await axios.post('/auth/forgotPassword', forgotPasswordFormData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        openToast(<Toast type="success" title="Successfully" content={res.data.message} />);
        console.log(forgotPasswordFormData);

      } catch (error) {
        openToast(<Toast type="error" title="Failure" content={error.response.data.message} />);
      } finally {
        setIsLoading(false);
      }
    }
    else {
      openToast(<Toast type="error" title="Failure" content={errors?.email?.message} />);
    }
  }

  const bodyContent = (
    <form 
      className="text-left w-full h-[160px]"
      onSubmit={handleSubmit(handleSendResetLink)}  
    >
      <p className="opacity-60 my-3">Enter the email address associated with your account, and we’ll email you a link to reset your password.</p>
      <Inputv2
        label="Email" 
        className="rounded-lg mb-4 mr-5"
        name="email"
        errors={errors} 
        value={forgotPasswordFormData.email}
        register={register}
        validationSchema={{
          required: "Email is required.",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address"
          }
        }} 
        onChange={handleFormDataChange}
      />
    </form>
  );  

  return (
    <Modal
      isOpen={isForgotPasswordModalOpen} 
      onSubmit={async () => await handleSendResetLink()} 
      onClose={() => setIsForgotPasswordModalOpen(false)} 
      actionLabel={"Send reset link"} 
      title="Forgot Password?"
      body={bodyContent}
      isLoading={isLoading}
    />
  );
}