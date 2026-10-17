import { Link } from "react-router";
import type { Product } from "../types";

type CarrinhoProps = {
  itens: Product[];
};

export function Carrinho({itens}: CarrinhoProps){
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
                    </li>
                ))}
            </ul>
        )}
<p>Total: US$ {total.toFixed(2)} </p>

        <Link to={"/"}>Voltar para Loja</Link>
    </div>
)
}