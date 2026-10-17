import type { Product } from "./types";
import { Link } from "react-router";

type ProdutoCardProps = {
  produto: Product;
  aoAdicionar: (produto: Product) => void;
};

export function ProdutoCard({ produto, aoAdicionar }: ProdutoCardProps) {
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
          <span className="nota">★ {produto.rating}</span>
          {produto.stock === 0 ? (
            <span className="esgotado">Esgotado</span>
          ) : (
            <span className="estoque">Estoque: {produto.stock}</span>
          )}
        </div>

        <div className="card-rodape">
          <p className="preco">US$ {produto.price}</p>
          <button className="botao" onClick={() => aoAdicionar(produto)}>
            Adicionar
          </button>
        </div>
      </div>
    </li>
  );
}
