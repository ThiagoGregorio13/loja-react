import { Link } from "react-router";
import { useCarrinho } from "../context/CarrinhoContext";

export function Carrinho() {
  const { carrinho, removerDoCarrinho } = useCarrinho();
  const total = carrinho.reduce((acc, p) => acc + p.price, 0);

  return (
    <div className="carrinho">
      <Link to="/" className="voltar">
        ← Voltar para a loja
      </Link>

      <h2>Carrinho</h2>

      {carrinho.length === 0 ? (
        <p className="carrinho-vazio">Seu carrinho está vazio.</p>
      ) : (
        <ul className="carrinho-lista">
          {carrinho.map((p, i) => (
            <li key={i} className="carrinho-item">
              <img src={p.thumbnail} alt={p.title} />
              <span className="carrinho-item-nome">{p.title}</span>
              <span className="carrinho-item-preco">US$ {p.price}</span>
              <button className="botao-remover" onClick={() => removerDoCarrinho(i)}>
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
