import { useCallback, useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import Button from "../Button/Button";

export default function Modal({ 
  isOpen, onClose, children, title, body,
  secondaryAction, secondaryActionLabel, disabled,
  actionLabel, onSubmit, footer, className,
  optionBtn, footerClassName, isLoading
}) {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (disabled) {
      return;
    }
  
    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300)
  }, [onClose, disabled]);

  const handleSubmit = useCallback(() => {
    if (disabled) {
      return;
    }

    onSubmit();
  }, [onSubmit, disabled]);

  const handleSecondaryAction = useCallback(() => {
    secondaryAction();
  }, [secondaryAction]);
  
  if(!isOpen) return null;

  return (
    // backdrop
    <div
      onClick={onClose}
      className={`z-50 fixed inset-0 flex justify-center items-center transition-colors ${isOpen ? 'visible bg-black/40' : 'invisible'}`}
    >
      {/* modal */}
      <div
        onClick={ev => ev.stopPropagation()}
        className={`
          w-full md:w-4/6 lg:w-3/6 xl:w-1/2 2xl:w-2/5 my-6 mx-auto h-full 
          lg:h-auto md:h-auto relative bg-white rounded-xl shadow transition-all 
          ${showModal ? "scale-100 opacity-100" : "scale-125 opacity-0"}
          ${className}
        `}
      >

        <div className="translate h-full lg:h-auto md:h-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
          {/* HEADER */}
          <div className="flex items-center p-6 justify-center rounded-t relative border-b-[1px]">
            <button 
              onClick={handleClose}
              className="p-1 border-0 hover:opacity-70 hover:bg-gray-300 transition absolute left-9"
            >
              <IoMdClose size={18}/>
            </button>

            <p className="text-lg font-semibold text-primary">{title}</p>
            
            <span className="absolute right-8">{optionBtn}</span>
          </div>

          {/* BODY */}
          <div className="relative p-6 flex-auto">
            {body}
            {children}
          </div>

          {/* FOOTER */}
          { (actionLabel || secondaryAction) && (
            <div className={`flex flex-col gap-2 p-6 ${footerClassName}`}>
              <div className="flex flex-row items-center gap-4 w-full">
                {secondaryActionLabel && (
                  <Button 
                    label={secondaryActionLabel}
                    onClick={handleSecondaryAction}
                    outline
                  />
                )}
                
                <Button
                  isLoading={isLoading}
                  disabled={disabled}
                  label={actionLabel}
                  onClick={handleSubmit}
                  type="submit"
                />
              </div>

              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}