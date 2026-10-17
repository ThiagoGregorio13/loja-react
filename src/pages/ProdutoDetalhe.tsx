import { Link, useParams } from "react-router";
import { useProduto } from "../hooks/useProduto";
import type { Product } from "../types";

type ProdutoDetalheProp = {
  aoAdicionar: (produto: Product) => void;
};

export function ProdutoDetalhe({ aoAdicionar }: ProdutoDetalheProp) {
  const { id } = useParams();
  const { produto, carregando, erro } = useProduto(id);

  if (carregando) return <p className="mensagem">Carregando...</p>;
  if (erro) return <p className="mensagem">Erro: {erro}</p>;
  if (!produto) return <p className="mensagem">Produto não encontrado</p>;

  return (
    <div>
      <Link to="/" className="voltar">
        ← Voltar para a loja
      </Link>

      <div className="detalhe-grade">
        <div className="detalhe-imagem">
          <img src={produto.thumbnail} alt={produto.title} />
        </div>

        <div className="detalhe-info">
          <span className="categoria">{produto.category}</span>
          <h2>{produto.title}</h2>
          <p className="nota">★ {produto.rating}</p>
          <p className="descricao">{produto.description}</p>
          <p className="preco">US$ {produto.price}</p>

          <button className="botao" onClick={() => aoAdicionar(produto)}>
            Adicionar ao carrinho
          </button>
        </div>
      </div>
    </div>
  );
}
