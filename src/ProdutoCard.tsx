import type {Product} from "./types"

type ProdutoCardProps = {
    produto:Product;
      aoAdicionar: (produto: Product) => void;
    
};

export function ProdutoCard({produto, aoAdicionar}: ProdutoCardProps){
return (
    <li>
          <h3>{produto.title}</h3>
              <p>US$ {produto.price}</p>
              <p>{produto.category}</p>
              <p>Nota: {produto.rating}</p>
              <p>{produto.stock === 0 ? "Esgotado" : `Estoque: ${produto.stock}`}</p>
              <button onClick={() => aoAdicionar(produto)}>Adicionar</button>
    </li>
)
}