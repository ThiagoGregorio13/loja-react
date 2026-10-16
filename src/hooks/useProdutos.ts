import { useEffect, useState } from "react";
import type { Product, ApiResponse } from "../types";

export function useProdutos(categoria: string) {
    const [produtos, setProdutos] = useState<Product[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

 useEffect(() => {
    let ignorar = false; // NOVO: explicado abaixo

    async function carregarProdutos() {
      setCarregando(true); // NOVO: liga o "carregando" a cada busca
      setErro(null);       // NOVO: limpa o erro anterior

      // NOVO: a URL depende da categoria escolhida
      const url =
        categoria === ""
          ? "https://dummyjson.com/products?limit=0"
          : `https://dummyjson.com/products/category/${categoria}`;

      try {
        const resposta = await fetch(url);
        if (!resposta.ok) {
          throw new Error(`Erro ${resposta.status} ao buscar produtos`);
        }
        const dados: ApiResponse = await resposta.json();
        if (!ignorar) setProdutos(dados.products);
      } catch (e) {
        if (!ignorar) setErro(e instanceof Error ? e.message : "Erro desconhecido");
      } finally {
        if (!ignorar) setCarregando(false);
      }
    }

    carregarProdutos();

    return () => {
      ignorar = true;
    };
  }, [categoria])

  return { produtos, carregando, erro };
}