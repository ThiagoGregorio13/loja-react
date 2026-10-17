import { Link } from "react-router";
import type { Product } from "../types";

type CarrinhoProps = {
  itens: Product[];
  aoRemover: (posicao:number) => void
};

export function Carrinho({itens , aoRemover}: CarrinhoProps){
    const total = itens.reduce((acc,p) => acc + p.price, 0);

return (
    <div>
        <h2>Carrinho</h2>
        {itens.length === 0 ? (
<p>seu carrinho esta vazio</p>
        ): (
            <ul>
                {itens.map((p,i) =>  (
                    <li key={i}>
                        {p.title} . US$ {p.price}
                        <button onClick={() => aoRemover(i)}>Remover</button>
                    </li>
                ))}
            </ul>
        )}
<p>Total: US$ {total.toFixed(2)} </p>

        <Link to={"/"}>Voltar para Loja</Link>
    </div>
)
}