import { AiOutlineClose } from "react-icons/ai";

export default function Modal({ open, onClose, children, title }) {
  return (
    // backdrop
    <div
      onClick={onClose}
      className={`fixed inset-0 flex justify-center items-center transition-colors ${open ? 'visible bg-black/20' : 'invisible'}`}
    >
      {/* modal */}
      <div
        onClick={ev => ev.stopPropagation()}
        className={`relative bg-white rounded-xl shadow px-6 py-10 transition-all ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}`}
      >
        <p className="font-medium text-xl text-primary">{title}</p>

        <button 
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-lg text-gray-400 bg-white hover:bg-gray-50 hover:text-gray-600"
        >
          <AiOutlineClose className="text-xl" />
        </button>
        {children}
      </div>
    </div>
  );
}