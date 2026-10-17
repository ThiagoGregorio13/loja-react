import { Link } from "react-router";
import type { Product } from "../types";

type CarrinhoProps = {
  itens: Product[];
  aoRemover: (posicao: number) => void;
};

export function Carrinho({ itens, aoRemover }: CarrinhoProps) {
  const total = itens.reduce((acc, p) => acc + p.price, 0);

  return (
    <div className="carrinho">
      <Link to="/" className="voltar">
        ← Voltar para a loja
      </Link>

      <h2>Carrinho</h2>

      {itens.length === 0 ? (
        <p className="carrinho-vazio">Seu carrinho está vazio 🛒</p>
      ) : (
        <ul className="carrinho-lista">
          {itens.map((p, i) => (
            <li key={i} className="carrinho-item">
              <img src={p.thumbnail} alt={p.title} />
              <span className="carrinho-item-nome">{p.title}</span>
              <span className="carrinho-item-preco">US$ {p.price}</span>
              <button className="botao-remover" onClick={() => aoRemover(i)}>
                Remover
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="carrinho-total">
        <span>Total</span>
        <strong>US$ {total.toFixed(2)}</strong>
      </div>
    </div>
  );
}
