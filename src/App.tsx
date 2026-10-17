import { useState } from "react";
import { Routes, Route } from "react-router";
import { Loja } from "./pages/Loja";
import type { Product } from "./types";

export default function App() {
  const [carrinho, setCarrinho] = useState<Product[]>([]);



function adicionarAoCarrinho(produto: Product) {
    setCarrinho([...carrinho, produto]);
  }

  const quantidadeNoCarrinho = carrinho.length;
  const totalDoCarrinho = carrinho.reduce((acc, p) => acc + p.price, 0);

return (
    <div>
      <header>
        <h1>Loja</h1>
        <p>
          🛒 {quantidadeNoCarrinho} itens · US$ {totalDoCarrinho.toFixed(2)}
        </p>
      </header>

      <Routes>
        <Route path="/" element={<Loja aoAdicionar={adicionarAoCarrinho} />} />
      </Routes>
    </div>
  );
  
}