import { useState } from "react";
import { ProdutoCard } from "./ProdutoCard";
import { ResumoLoja } from "./Resumo";
import { Filtros } from "./Filtros";
import { useCategorias } from "./hooks/useCategorias";
import { useProdutos } from "./hooks/useProdutos";
import type { Product } from "./types";

export default function App() {
  const [digitado, setDigitado] = useState("");
  const [categoria, setCategoria] = useState("");
  const [bemAvaliado, setBemAvaliado] = useState(false);
  const [carrinho, setCarrinho] = useState<Product[]>([]);

  const { categorias } = useCategorias();
  const { produtos, carregando, erro } = useProdutos(categoria);

  const filtrados = produtos
    .filter((p) => p.title.toLowerCase().includes(digitado.toLowerCase()))
    .filter((p) => !bemAvaliado || p.rating >= 4.5);

  const visiveis = filtrados.slice(0, 20);
  const quantidade = filtrados.length;
  const precoMedio =
    quantidade === 0 ? 0 : filtrados.reduce((acc, p) => acc + p.price, 0) / quantidade;

  // carrinho
  const quantidadeNoCarrinho = carrinho.length;
  const totalDoCarrinho = carrinho.reduce((acc, p) => acc + p.price, 0);

  function adicionarAoCarrinho(produto: Product) {
    setCarrinho([...carrinho, produto]);
  }

  return (
    <div>
      <h1>Loja</h1>

      <p>
        🛒 {quantidadeNoCarrinho} itens · US$ {totalDoCarrinho.toFixed(2)}
      </p>

      <Filtros
        digitado={digitado}
        aoDigitar={setDigitado}
        categoria={categoria}
        aoMudarCategoria={setCategoria}
        categorias={categorias}
        bemAvaliado={bemAvaliado}
        aoMudarBemAvaliado={setBemAvaliado}
      />

      <ResumoLoja mostrando={visiveis.length} total={quantidade} precoMedio={precoMedio} />

      {carregando && <p>Carregando...</p>}
      {erro && <p>Erro: {erro}</p>}

      {!carregando && !erro && (
        <ul>
          {visiveis.map((p) => (
            <ProdutoCard key={p.id} produto={p} aoAdicionar={adicionarAoCarrinho} />
          ))}
        </ul>
      )}
    </div>
  );
}