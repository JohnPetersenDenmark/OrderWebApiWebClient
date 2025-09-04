import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Layout from './components/Layout';
import PaymentSuccess from "./components/PaymentSuccess";
import PaymentCancel from "./components/PaymentCancel";
import TermsOfSale from './components/TermsOfSale';
import { CurrentUser } from "./components/CurrentUser";
import CreateOrder from "./components/CreateOrder";
import { DashboardProvider } from "./components/admin/DashboardContext";
import AdminDashboard from "./components/admin/AdminDashBoard";
import { CartProvider } from "./components/CartContext";
import Cart from "./components/Cart";

/* function Layout() {
  return (
    <div>
      <h1>My Layout</h1>
      <Outlet />
    </div>
  );
} */



export default function App() {
  return (

<BrowserRouter>
  <CurrentUser>
    <DashboardProvider>
      <CartProvider>
        <div className="flex gap-6">
          {/* Main content takes most space */}
          <div className="flex-1">
            <Routes>
              {/* Routes wrapped in Layout */}
              <Route element={<Layout />}>
                <Route index element={<></>} /> {/* Homepage */}
                <Route path="payment-success" element={<PaymentSuccess />} />
                <Route path="payment-cancel" element={<PaymentCancel />} />
                <Route path="*" element={<div>404 Not Found</div>} />
              </Route>

              {/* Standalones */}
              <Route path="/home" element={<Layout />} />
              <Route path="/admin" element={<AdminDashboard />} />

              {/* Create order route */}
              <Route path="/createOrder" element={<CreateOrder />} />
            </Routes>
          </div>

        </div>
      </CartProvider>
    </DashboardProvider>
  </CurrentUser>
</BrowserRouter>

  );
}
