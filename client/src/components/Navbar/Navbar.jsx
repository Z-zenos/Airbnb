import {useState, useEffect} from 'react';

export default function Navbar({ children, className }) {
  const [visible, setVisible] = useState(false);

  const handleScroll = () => {
    const currentScrollPos = window.scrollY;
    setVisible(currentScrollPos > 600);
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  return (
    <div className={className + ` bg-white shadow-sm z-10 shadow-gray-300 h-20 flex items-center px-10 sticky ${visible ? 'top-0 visible' : 'hidden'} `}>
      {children}
    </div>
  );

}