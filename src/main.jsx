import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";

import './index.css'

import Home from './Pages/Home';
import Deliveries from './Pages/Deliveries';
import Order from './Pages/Order';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Home />} /> 
      <Route path="/deliveries" element={<Deliveries />} /> 
      <Route path="/order/:id" element={<Order />} /> 
    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
