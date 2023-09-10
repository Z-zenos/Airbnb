
import './App.css';
import {Route, Routes} from "react-router-dom";
import IndexPage from './pages/IndexPage';
import AuthPage from './pages/AuthPage';
import MainLayout from './layouts/MainLayout';

function App() {

  return (
    <Routes>
      <Route path='/' element={ <MainLayout /> } >
        <Route index element={<IndexPage />} />
        <Route path='/login' element={ <AuthPage /> } />
      </Route>
    </Routes>
  );
}

export default App
