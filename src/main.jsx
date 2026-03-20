import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";

import './index.css'

import Delivery from './Pages/Delivery';
import Deliveries from './Pages/Deliveries';
import Order from './Pages/Order';
import AdmUser from './Pages/AdmUser';
import AdmVehicles from './Pages/AdmVehicles';
import NotFound from './Pages/NotFound';
import AdmClothes from './Pages/AdmClothes';
import SignIn from './Pages/SignIn';
import AdmOrder from './Pages/AdmOrder';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<SignIn />} /> 
      <Route path="/delivery" element={<Delivery />} /> 
      <Route path="/deliveries" element={<Deliveries />} /> 
      <Route path="/order/:id" element={<Order />} /> 
      <Route path="/adm/user" element={<AdmUser />} /> 
      <Route path="/adm/vehicle" element={<AdmVehicles />} /> 
      <Route path="/adm/clothes" element={<AdmClothes />} /> 
      <Route path="/adm/orders" element={<AdmOrder />} /> 
      <Route path="*" element={<NotFound />} />
    </Routes>
    </BrowserRouter>
  </StrictMode>
)