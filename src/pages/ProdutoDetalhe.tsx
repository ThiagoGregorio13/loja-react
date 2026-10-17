import { Link, useParams } from "react-router";
import { useProduto } from "../hooks/useProduto";
import type { Product } from "../types";

type ProdutoDetalheProp = {
  aoAdicionar: (produto: Product) => void;
};

export function ProdutoDetalhe({ aoAdicionar }: ProdutoDetalheProp) {
  const { id } = useParams();
  const { produto, carregando, erro } = useProduto(id);

  if (carregando) return <p>Carregando...</p>;
  if (erro) return <p>Erro: {erro}</p>;
  if (!produto) return <p>Produto não encontrado</p>;

  return (
    <div>
      <Link to="/">Voltar para a loja</Link>

      <img src={produto.thumbnail} alt={produto.title} />

      <h2>{produto.title}</h2>
      <p>{produto.description}</p>

      <p>US$ {produto.price}</p>
      <p>Nota: {produto.rating}</p>

      <button onClick={() => aoAdicionar(produto)}>Adicionar ao carrinho</button>
    </div>
  );
}
