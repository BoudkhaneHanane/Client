import Login from './components/login';
import ForgotPassword from './components/forgotPassword'; 
import SignRevendeur from './components/signRevendeur'; 
import Nav from './components/nav';
import Products from './components/products';
import FormulaireProduit from './components/formulaireproduit';
import AdminHome from './components/adminhome';
import SidBar from './components/sidbar';
import Account from './components/account';
import Users from './components/users';
import ProfilUser from './components/profiluser';
import Categorie from './components/categorie';
import SubCategorie from './components/subcategorie';
import SubSubCategorie from './components/subsubcategorie';
import CategorieFormu from './components/categorieformu';
import Promotions from './components/promotions';
import PromotionFormu  from './components/promotionformu';
import SubCategorieFormu from './components/subcategorieformu';
import SubSubCategorieFormu from './components/subsubcategorieformu';
import Revendeur from './components/revendeur';
import ListeBloque from './components/listebloque';
import Admin from './components/admin';
import Order from './components/order';
import DetailOrder from './components/detailorder';
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
    path: '/products/:id?/:name?',
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
    path: '/account/:id?',
    element: <div><Account/></div>
  },
  {
    path: '/users',
    element: <div><Users/></div>
  },
  {
    path: '/profiluser/:userId?', 
    element: <div><ProfilUser/></div>
  },
  {
    path: '/categorie',
    element: <div><Categorie/></div>
  },
  {
    path: '/subcategorie/:category?',
    element: <div><SubCategorie/></div>
  },
  {
    path: '/subsubcategorie/:name?',
    element: <div><SubSubCategorie/></div>
  },
  {
    path: '/categorieformu/:idCategorie?',
    element: <div><CategorieFormu/></div>
  },
  {
    path: '/promotions/:id?',
    element: <div><Promotions/></div>
  },
  {
    path: '/promotionformu/:productName?',
    element: <div><PromotionFormu/></div>
  },
  {
    path: '/subcategorieformu',
    element: <div><SubCategorieFormu/></div>
  },
  {
    path: '/subsubcategorieformu',
    element: <div><SubSubCategorieFormu/></div>
  },
  {
    path: '/revendeur/:idDemande',
    element: <div><Revendeur/></div>
  },
  {
    path: '/listebloque',
    element: <div><ListeBloque/></div>
  },
  {
    path: '/admin',
    element: <div><Admin/></div>
  },
  {
    path: '/nav',
    element: <div><Nav/></div>
  },
  {
    path: '/order',
    element: <div><Order/></div>
  },
  {
    path: '/detailorder/:orderId?',
    element: <div><DetailOrder/></div>
  },
 
 
])
function App() {
  return (
    <div>
      <RouterProvider router= {router}/>
    </div>
  );
}

export default App;
