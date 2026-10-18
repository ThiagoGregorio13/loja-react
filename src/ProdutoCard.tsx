import type { Product } from "./types";
import { Link } from "react-router";
import { useCarrinho } from "./context/CarrinhoContext";

type ProdutoCardProps = {
  produto: Product;
};

export function ProdutoCard({ produto }: ProdutoCardProps) {
  const { adicionarAoCarrinho } = useCarrinho();

  return (
    <li className="card">
      <Link to={`/produto/${produto.id}`} className="card-imagem">
        <img src={produto.thumbnail} alt={produto.title} />
      </Link>

      <div className="card-corpo">
        <span className="categoria">{produto.category}</span>
        <Link to={`/produto/${produto.id}`}>
          <h3 className="card-titulo">{produto.title}</h3>
        </Link>

        <div className="card-info">
          <span>Nota {produto.rating}</span>
          {produto.stock === 0 ? (
            <span className="esgotado">Esgotado</span>
          ) : (
            <span>{produto.stock} em estoque</span>
          )}
        </div>

        <div className="card-rodape">
          <p className="preco">US$ {produto.price}</p>
          <button className="botao" onClick={() => adicionarAoCarrinho(produto)}>
            Adicionar
          </button>
        </div>
      </div>
    </li>
  );
}
