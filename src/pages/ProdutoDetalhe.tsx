import { Link, useParams } from "react-router";
import { useProduto } from "../hooks/useProduto";
import {useCarrinho} from "../context/CarrinhoContext"


export function ProdutoDetalhe() {
  const { id } = useParams();
  const { produto, carregando, erro } = useProduto(id);
const {adicionarAoCarrinho} = useCarrinho()


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
          <p className="preco">US$ {produto.price}</p>
          <p className="descricao">{produto.description}</p>

          <ul className="especificacoes">
            <li>
              <span>Avaliação</span>
              <span>{produto.rating} / 5</span>
            </li>
            <li>
              <span>Disponibilidade</span>
              <span>{produto.stock === 0 ? "Esgotado" : `${produto.stock} em estoque`}</span>
            </li>
          </ul>

          <button className="botao" onClick={() => adicionarAoCarrinho(produto)}>
            Adicionar ao carrinho
          </button>
        </div>
      </div>
    </div>
  );
}
