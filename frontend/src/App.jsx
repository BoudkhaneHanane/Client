import Login from './components/login';
import ForgotPassword from './components/forgotPassword'; 
import SignRevendeur from './components/signRevendeur'; 
import Products from './components/products';
import FormulaireProduit from './components/formulaireproduit';
import AdminHome from './components/adminhome';
import SidBar from './components/sidbar';
import NavAdmin from './components/navadmin';
import Account from './components/account';
import Users from './components/users';
import ProfilUser from './components/profileuser';
import Categorie from './components/categorie';
import SubCategorie from './components/subcategorie';
import './App.css';

import {createBrowserRouter, RouterProvider} from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <div><Login /></div>
  },
  {
    path: '/forgotPassword',
    element: <div><ForgotPassword /></div>
  },
  {
    path: '/signRevendeur',
    element: <div><SignRevendeur /></div>
  },
  {
    path: '/products',
    element: <div><Products /></div>
  },
  {
    path: '/formulaireproduit/:id?',
    element: <div><FormulaireProduit/></div>
  },
  {
    path: '/adminhome',
    element: <div><AdminHome/></div>
  },
  {
    path: '/sidbar',
    element: <div><SidBar/></div>
  },
  {
    path: '/navadmin',
    element: <div><NavAdmin/></div>
  },
  {
    path: '/account',
    element: <div><Account/></div>
  },
  {
    path: '/users',
    element: <div><Users/></div>
  },
  {
    path: '/profiluser',
    element: <div><ProfilUser/></div>
  },
  {
    path: '/categorie',
    element: <div><Categorie/></div>
  },
  {
    path: '/subcategorie/:name?',
    element: <div><SubCategorie/></div>
  }
  
])
function App() {
  return (
    <div>
      <RouterProvider router= {router}/>
    </div>
  );
}

export default App;
