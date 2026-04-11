import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";

// function Home() {
//   return (
//     <div className="max-w-6xl mx-auto px-4 py-12">
//       <h1 className="text-white text-3xl font-bold">Home Hola</h1>
//     </div>
//   );
// }

// function Cart() {
//   return (
//     <div className="max-w-6xl mx-auto px-4 py-12">
//       <h1 className="text-white text-3xl font-bold">Carrito</h1>
//     </div>
//   );
// }

// function Orders() {
//   return (
//     <div className="max-w-6xl mx-auto px-4 py-12">
//       <h1 className="text-white text-3xl font-bold">Pedidos</h1>
//     </div>
//   );
// }

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
    </Routes>
  );
}

export default App;