import { createContext, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

// Need a context so we can access anywhere in our app
export const ToastContext = createContext({});

export function ToastContextProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const openToast = (component, timeout = 5000) => {
    const id = Date.now();
    setToasts(toasts => [...toasts, {id, component}]);
    setTimeout(() => closeToast(id), timeout);
  };

  const closeToast = (id) => setToasts(toasts => toasts.filter(toast => toast.id !== id));

  return (
    <ToastContext.Provider value={{
      openToast
    }}>
      { children }
      <div className="space-y-2 fixed top-4 right-4 z-20">
        {toasts.map(({id, component}) => (
          <div key={id} className="relative">
            <button className="absolute top-2 right-2 p-1 rounded-lg bg-gray-200/20 text-gray-800/60" onClick={() => closeToast(id)}>
              <AiOutlineClose size={16} />
            </button>
            {component}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}