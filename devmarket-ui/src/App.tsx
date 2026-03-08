import { Routes, Route } from "react-router-dom";

function Home() {
  return <h1 className="text-white text-3xl">Home</h1>;
}

function Products() {
  return <h1 className="text-white text-3xl">Productos</h1>;
}

function Cart() {
  return <h1 className="text-white text-3xl">Carrito</h1>;
}

function Orders() {
  return <h1 className="text-white text-3xl">Pedidos</h1>;
}

function App() {
  return (
    <div className="min-h-screen bg-slate-900 p-10">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </div>
  );
}

export default App;