import {Route, Routes } from 'react-router-dom'
import SignIn from './signIn_Up/SignIn';
import Signup from './signIn_Up/Signup';
import Cprofile from './customer/Cprofile';
import Cproduct from './customer/Cproduct';
import Crecorder from './customer/Crecorder';
import CbakeryShow from './customer/CbakeryShow'
import Cordhistory from './customer/Cordhistory'
import Bprofile from './baker/Bprofile'
import Product from './baker/ProductCategory';
import ReceOrder from './baker/ReceOrder.js'
import OrderHis from './baker/OrderHis.js';
import ProductItem from './baker/ProductItem.js';
import ErrorPage from './ErrorPage.js';

function App() {
  return (
    <Routes>
      <Route excat path="/baker/profile" element={<Bprofile/>}></Route>
      <Route excat path="/baker/product" element={<Product/>}></Route>
      <Route excat path="/baker/recentorder" element={<ReceOrder/>}></Route>
      <Route excat path="/baker/orderhistory" element={<OrderHis/>}></Route>
      <Route excat path="/baker/category/:catname" element={<ProductItem/>}></Route>
      <Route excat path="/customer/profile" element={<Cprofile/>}></Route>
      <Route excat path="/customer/product" element={<Cproduct/>}></Route>
      <Route excat path="/cusotmer/product/:bakeryname/:whatdousell" element={<CbakeryShow/>}></Route>
      <Route excat path="/customer/recentorder" element={<Crecorder/>}></Route> 
      <Route excat path="/customer/orderhistory" element={<Cordhistory/>}></Route> 
      <Route excat path='/signin' element={<SignIn/>}></Route>
      <Route excat path='/signup' element={<Signup/>}></Route>
      <Route excat path='/' element={<SignIn/>}></Route>    
      <Route path="*" element={<ErrorPage/>}></Route>  
    </Routes>
  );
}

export default App;
