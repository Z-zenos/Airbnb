
import {Navigate, Route, Routes, useSearchParams} from "react-router-dom";
import IndexPage from './pages/IndexPage';
import AuthPage from './pages/AuthPage';
import MainLayout from './layouts/MainLayout';
import axios from 'axios';
import { UserContextProvider } from './contexts/user.context';
import PlacePage from './pages/PlacePage';
import { ModalContextProvider } from './contexts/modal.context';
import { ToastContextProvider } from './contexts/toast.context';
import UserPage from "./pages/UserPage";
import { IntlContextProvider } from "./contexts/intl.context";
import AccountSettingPage from "./pages/AccountSettingPage";
import UserEditPage from "./pages/UserEditPage";
import PersonalInfoPage from "./pages/PersonalInfoPage";
import WishlistsPage from "./pages/WishlistsPage";
import LoginSecurityPage from "./pages/LoginSecurityPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ReviewAccountPage from "./pages/ReviewAccountPage";
import BookingPage from "./pages/BookingPage";
import CheckoutSuccessPage from "./pages/CheckoutSuccessPage";


// Apply for all requests
axios.defaults.baseURL = "http://localhost:3000/api/v1";
/*
  The XMLHttpRequest.withCredentials property is a boolean value that indicates 
  whether or not cross-site Access-Control requests should be made using credentials 
  such as cookies, authorization headers or TLS client certificates. Setting 
  withCredentials has no effect on same-origin requests.

  In addition, this flag is also used to indicate when cookies are to be ignored in 
  the response. The default is false. XMLHttpRequest responses from a different 
  domain cannot set cookie values for their own domain unless withCredentials is set 
  to true before making the request. The third-party cookies obtained by setting 
  withCredentials to true will still honor same-origin policy and hence can not be 
  accessed by the requesting script through document.cookie or from response headers.
*/
axios.defaults.withCredentials = true; // every requests will be sent to server with cookie

function App() {
  const [searchParams] = useSearchParams();

  return (
    <IntlContextProvider>
      <ModalContextProvider>
        <ToastContextProvider>
          <UserContextProvider>
            <Routes>
              <Route path='/' element={ <MainLayout /> } >
                <Route index element={<IndexPage />} />
                <Route path="/places" element={<IndexPage />} />
                <Route path="/places/search" element={<IndexPage />} />
                <Route path="/wishlists" element={<WishlistsPage />} />
                <Route path="/account-settings" element={<AccountSettingPage />} />
                
                <Route path="/account-settings/personal-info" element={<PersonalInfoPage />} />
                <Route path="/account-settings/security" element={<LoginSecurityPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                <Route path="/review-account/:token" element={<ReviewAccountPage />} />
                <Route path="/users/profile/:id" element={searchParams.get('editMode') ? <UserEditPage /> : <UserPage />} />
                <Route path='/login' element={ <AuthPage /> } />
                <Route path='/places/:id' element={ <PlacePage /> } />
                
                <Route path='/booking/:place_id' element={ <BookingPage /> } />
                <Route path='/booking/result' element={ <CheckoutSuccessPage /> } />

                <Route path="*" element={<Navigate replace to="/" />}  />
              </Route>
            </Routes>
          </UserContextProvider>
        </ToastContextProvider>
      </ModalContextProvider>
    </IntlContextProvider>
  );
}

export default App
