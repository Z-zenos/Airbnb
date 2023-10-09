import { IoIosCloseCircle, IoMdWarning } from "react-icons/io";
import { BsFillInfoCircleFill, BsRocketTakeoff } from "react-icons/bs";

const toastType = {
  error: {
    color: '#ff4141',
    icon: <IoIosCloseCircle size={32} />,
    background: '#fff6f6'
  },
  info: {
    color: '#3085e9',
    icon: <BsFillInfoCircleFill size={32} />,
    background: '#eff5fd'
  },
  warn: {
    color: '#f4b104',
    icon: <IoMdWarning size={32} />,
    background: '#fffbf2'
  },
  success: {
    color: '#01a08c',
    icon: <BsRocketTakeoff size={32} />,
    background: '#f0f9f8'
  },
};

export default function Toast({ title, content, type }) {
  const toast = toastType[type];
  return (
    <div className={`flex items-center gap-3 p-4 rounded-lg shadow-lg pr-10`} style={{ backgroundColor: toast.background, border: `1px solid ${toast.color}`  }}>

      <div style={{ color: toast.color }}>
        { toast.icon }
      </div>
      <div>
        <h3 className={`font-bold`} style={{ color: toast.color }}>{title}</h3>
        <p className="text-sm font-light">{content}</p>
      </div>
    </div>
  );
}