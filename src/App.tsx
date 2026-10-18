import { Loja } from "./pages/Loja";
import { Routes, Route, Link } from "react-router";
import { Carrinho } from "./pages/Carrinho";
import { ProdutoDetalhe } from "./pages/ProdutoDetalhe";
import { useCarrinho } from "./context/CarrinhoContext";

export default function App() {
  const { carrinho } = useCarrinho();
  const quantidadeNoCarrinho = carrinho.length;
  const totalDoCarrinho = carrinho.reduce((acc, p) => acc + p.price, 0);

return (
    <div>
      <header className="cabecalho">
        <div className="cabecalho-conteudo">
          <Link to="/" className="logo">
            AXON
          </Link>
          <Link to="/carrinho" className="carrinho-link">
            Carrinho · US$ {totalDoCarrinho.toFixed(2)}
            <span className={quantidadeNoCarrinho > 0 ? "contador ativo" : "contador"}>
              {quantidadeNoCarrinho}
            </span>
          </Link>
        </div>
      </header>

      <main className="conteudo">
      <Routes>
        <Route path="/" element={<Loja />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/produto/:id" element={<ProdutoDetalhe />} />
      </Routes>
      </main>
    </div>
  )
  
}