import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/Landing";
import AddProduct from "./pages/admin/AddProduct";
import ProductLists from "./pages/Products";
import AdminList from "./pages/admin/ProductsLists";
import Order from "./pages/admin/orders";
import AdminLayout from "./layout/adminLayout";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import { Toaster } from "sonner";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <CartProvider>
      <Toaster richColors theme="dark" position="top-right" />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/landing" />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/products" element={<ProductLists />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminList />} />
            <Route path="products" element={<AdminList />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="orders" element={<Order />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
