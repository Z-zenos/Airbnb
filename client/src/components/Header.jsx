import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useContext, useState } from 'react';
import { UserContext } from '../contexts/user.context';
import { ToastContext } from '../contexts/toast.context';
import { ModalContext } from '../contexts/modal.context';
import { MdManageAccounts } from "react-icons/md";
import { FcLike } from "react-icons/fc";
import { IoIosCreate } from "react-icons/io";
import { SlLogout } from "react-icons/sl";
import { CiLogin } from "react-icons/ci";
import Toast from "./Toast/Toast";
import axios from 'axios';

const MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const HIDE_SEARCH_URLS = ['users', 'account-settings', 'review-account', 'login'];
const HIDE_USER_MENU_URLS = ['review-account'];

export default function Header() {
  const { setIsCreatePlaceModalOpen, setIsIntlModalOpen } = useContext(ModalContext);
  const [userBox, setUserBox] = useState(false);
  const {user} = useContext(UserContext);
  const { setIsSearchModalOpen } = useContext(ModalContext);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { openToast } = useContext(ToastContext);

  const time = () => {
    const checkin = +searchParams.get('checkin');
    const checkout = +searchParams.get('checkout');

    if(checkin && checkout) {
      return `${MONTHS[new Date(checkin).getMonth()].slice(0, 3)}, ${new Date(checkin).getDate()} - ${MONTHS[new Date(checkout).getMonth()].slice(0, 3)}, ${new Date(checkout).getDate()}`;
    }
    else if(checkin) return `After ${MONTHS[new Date(checkin).getMonth()].slice(0, 3)}, ${new Date(checkin).getDate()}`;
    else if(checkout) return `Before ${MONTHS[new Date(checkout).getMonth()].slice(0, 3)} - ${new Date(checkout).getDate()}`;
    else return '';
  };

  const guests = () => {
    const adults = +searchParams.get('adults') || 0;
    const children = +searchParams.get('children') || 0;

    return adults + children ? adults + children + ' guest(s)' : 'Add guests';
  }

  async function logout() {
    try {
      /*
        If you are setting the cookie on a response in a login route/controller in express backend for JWT and are using 'httpOnly' option, you are unable to access the token from the client/react, even when using a third party library like 'universal-cookie' or 'document.cookie'.
        
        You will need to clear the cookie on the response from the backend e.g. when a user logs out in the logout controller as detailed below.
      */
      await axios.get('/auth/logout');
      window.location.reload();
    } catch (error) {
      openToast(<Toast title="Failure" content="Logout failed" type="error" />)
    }
  }

  return (
    <header className="h-[80px] px-20 py-4 flex justify-between items-center border-b-gray-200 border-b-[1px]  w-full bg-white">
      <Link to={'/'} className="ab__logo flex gap-1 items-center text-primary font-bold">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 -rotate-90">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>

        <span className='font-bold text-2xl'>airbnb</span>
      </Link>

      { !HIDE_SEARCH_URLS.some(hsu => location.pathname.startsWith(`/${hsu}`)) && 
        <div 
          className='ab__search-widget flex items-center gap-3 border border-gray-300 rounded-full pr-2 py-2 pl-6 shadow-md shadow-gray-300 text-sm cursor-pointer'
          onClick={() => setIsSearchModalOpen(true)}
        >
          <div>{ searchParams.get('region') || searchParams.get('address') || 'Anywhere'}</div>
          <div className='border-l bg-gray-700 h-5'></div>
          <div>{ time() || 'Any week'}</div>
          <div className='border-l bg-gray-700 h-5'></div>
          <div className='text-gray-800 font-thin'>{guests()}</div>
          <button className='bg-primary rounded-full p-2 text-white font-bold'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>
        </div>
      }

      <div className='flex items-center gap-2 relative'>
        <div 
          className='ab__lang-selection p-2 rounded-full hover:bg-gray-200 mr-1 cursor-pointer'
          onClick={() => setIsIntlModalOpen(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
          </svg>
        </div>

        <div className='ab__auth-widget border border-gray-300 rounded-full px-2 py-1 hover:shadow-md hover:shadow-gray-300 cursor-pointer'>
          { user?.email ? (
            !HIDE_USER_MENU_URLS.some(humu => location.pathname.startsWith(`/${humu}`)) &&
            <div className='flex items-center gap-2' onClick={() => setUserBox(!userBox)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
              </svg>

              <div className='border-[1px] border-primary rounded-full p-1'>
                { user?.avatar && <img className='rounded-full w-[30px] h-[30px]' src={`http://localhost:3000/images/users/avatars/${user?.avatar}`} /> }

              </div>

              {!!user && (
                <div>{user?.name}</div>
              )}

            </div>
          ) : (
            <Link to={'/login'} className='text-sm px-3'>Login / Register</Link>
          )}
        </div>

        { userBox && <div className='bg-white absolute right-0 top-[60px] shadow shadow-gray-400 rounded-xl py-4 w-[200px] text-sm z-[60]'>
          <ul>
            {user?.email ? (
              <>
                <Link to={'/account-settings'} className='px-4 flex items-center gap-3 py-2 hover:bg-gray-100 cursor-pointer w-full' onClick={() => setUserBox(false)}>
                  <MdManageAccounts className='w-5 h-5 inline' /> Account
                </Link>
                <Link to={'/wishlists'} className='px-4 flex items-center gap-3 py-2 hover:bg-gray-100 cursor-pointer w-full' onClick={() => setUserBox(false)}>
                  <FcLike className='w-5 h-5 inline' /> Wishlists
                </Link>
                <li 
                  className='px-4 flex items-center gap-3 py-2 hover:bg-gray-100 cursor-pointer' 
                  onClick={() => {
                    setIsCreatePlaceModalOpen(true)
                    setUserBox(false);
                  }}
                >
                  <IoIosCreate className='w-5 h-5 inline' /> Create your places
                </li>
                <li 
                  className='px-4 flex items-center gap-3 py-2 hover:bg-gray-100 cursor-pointer' 
                  onClick={logout}
                >
                  <SlLogout className='w-5 h-5 inline' /> Logout
                </li>
              </>
            ) : (
              <>
                <Link to={'/login'} className='px-4 py-2 hover:bg-gray-100 cursor-pointer w-full block'><CiLogin /> Login / Register</Link>
              </>
            )}
          </ul>
        </div>
        } 
      </div>      
    </header>
  );
}