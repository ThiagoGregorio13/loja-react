import { useEffect, useState } from "react";
import type { Product } from "../types";

export function useProduto(id: string | undefined) {
  const [produto, setProduto] = useState<Product | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let ignorar = false;

    async function carregarProduto() {
      setCarregando(true);
      setErro(null);

      try {
        const resposta = await fetch(`https://dummyjson.com/products/${id}`);
        if (!resposta.ok) {
          throw new Error(`Erro ${resposta.status} ao buscar o produto`);
        }
        const dados: Product = await resposta.json();
        if (!ignorar) setProduto(dados);
      } catch (e) {
        if (!ignorar) setErro(e instanceof Error ? e.message : "Erro desconhecido");
      } finally {
        if (!ignorar) setCarregando(false);
      }
    }

    carregarProduto();

    return () => {
      ignorar = true;
    };
  }, [id]);

  return { produto, carregando, erro };
}
