import {useState, useEffect} from 'react';

export default function Navbar({ children, className }) {
  const [visible, setVisible] = useState(false);

  const handleScroll = () => {
    const currentScrollPos = document.querySelector('.main').scrollTop;
    setVisible(currentScrollPos > 600);
  }

  useEffect(() => {
    const main = document.querySelector('.main');
    main.addEventListener('scroll', handleScroll);
    return () => main.removeEventListener('scroll', handleScroll);
  });

  return (
    <div className={className + ` bg-white shadow-sm z-10 shadow-gray-300 h-20 flex items-center px-10 fixed w-full ${visible ? 'top-0 visible' : 'hidden'} `}>
      {children}
    </div>
  );

}