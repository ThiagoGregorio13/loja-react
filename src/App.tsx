import { useState } from "react";
import { Loja } from "./pages/Loja";
import type { Product } from "./types";
import { Routes, Route, Link } from "react-router";
import { Carrinho } from "./pages/Carrinho";
import { ProdutoDetalhe } from "./pages/ProdutoDetalhe";

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
<Link to="/carrinho">
  🛒 {quantidadeNoCarrinho} itens · US$ {totalDoCarrinho.toFixed(2)}
</Link>        </p>
      </header>

      <Routes>
        <Route path="/" element={<Loja aoAdicionar={adicionarAoCarrinho} />} />
        <Route path="/carrinho" element={<Carrinho itens={carrinho} />} />
        <Route path="/produto/:id" element={<ProdutoDetalhe aoAdicionar={adicionarAoCarrinho} />} />
      </Routes>
    </div>
  );
  
}