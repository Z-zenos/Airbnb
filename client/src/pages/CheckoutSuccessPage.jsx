import { useNavigate } from "react-router-dom";
import Button from "../components/Button/Button";


export default function CheckoutSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="2xl:w-[60%] xl:w-[60%] lg:w-[60%] md:w-[100%] sm:block mx-auto md:px-10 mb-10 p-10">
      <div className="text-center flex justify-center items-center flex-col gap-4 h-full w-full pt-36">
        <img 
          src="https://cdn-icons-png.flaticon.com/128/9325/9325187.png"  
          alt="Payment success"
          className="w-24 h-24"
        />
        <h3 className=" text-green-400 font-bold text-3xl">Your Payment is Successfull !</h3>
        <p className="font-light">Thank you for your payment. An automated payment receipt will be sent to your registered email.</p>
        <Button
          onClick={() => navigate("/")}
          className="mt-8 hover:bg-white hover:text-primary"
        >
          Back to Home
        </Button>
      </div>
    </div>
  )
}