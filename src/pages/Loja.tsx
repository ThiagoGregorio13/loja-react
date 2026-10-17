import { useState } from "react";
import { ProdutoCard } from "../ProdutoCard";
import { ResumoLoja } from "../Resumo";
import { Filtros } from "../Filtros";
import { useCategorias } from "../hooks/useCategorias";
import { useProdutos } from "../hooks/useProdutos";
import type { Product } from "../types";

type LojaProp = {
  aoAdicionar: (produto: Product) => void;
};

export function Loja({ aoAdicionar }: LojaProp) {
  const [digitado, setDigitado] = useState("");
  const [categoria, setCategoria] = useState("");
  const [bemAvaliado, setBemAvaliado] = useState(false);

  const { categorias } = useCategorias();
  const { produtos, carregando, erro } = useProdutos(categoria);

  const filtrados = produtos
    .filter((p) => p.title.toLowerCase().includes(digitado.toLowerCase()))
    .filter((p) => !bemAvaliado || p.rating >= 4.5);

  const visiveis = filtrados.slice(0, 20);
  const quantidade = filtrados.length;
  const precoMedio =
    quantidade === 0 ? 0 : filtrados.reduce((acc, p) => acc + p.price, 0) / quantidade;

  return (
    <div>
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

      {carregando && <p className="mensagem">Carregando...</p>}
      {erro && <p className="mensagem">Erro: {erro}</p>}

      {!carregando && !erro && (
        <ul className="grade-produtos">
          {visiveis.map((p) => (
            <ProdutoCard key={p.id} produto={p} aoAdicionar={aoAdicionar} />
          ))}
        </ul>
      )}
    </div>
  );
}
