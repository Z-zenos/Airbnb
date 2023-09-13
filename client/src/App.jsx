
import './App.css';
import {Route, Routes} from "react-router-dom";
import IndexPage from './pages/IndexPage';
import AuthPage from './pages/AuthPage';
import MainLayout from './layouts/MainLayout';
import axios from 'axios';
import { UserContextProvider } from './contexts/user.context';

axios.defaults.baseURL = "http://127.0.0.1:3000/api/v1";
axios.defaults.withCredentials = true;

function App() {

  return (

    <UserContextProvider>
      <Routes>
        <Route path='/' element={ <MainLayout /> } >
          <Route index element={<IndexPage />} />
          <Route path='/login' element={ <AuthPage /> } />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App
