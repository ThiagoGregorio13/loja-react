 import { useEffect, useState } from "react";
 

export function useCategorias() {
     const [categorias, setCategorias] = useState<string[]>([]);
  const [erro, setErro] = useState<string | null>(null);


 useEffect(() => {
    async function carregarCategorias() {
      try {
        const resposta = await fetch("https://dummyjson.com/products/category-list");
        if (!resposta.ok) {
          throw new Error(`Erro ${resposta.status} ao buscar categorias`);
        }
        const dados: string[] = await resposta.json();
        setCategorias(dados);
      } catch (erro) {
        setErro(erro instanceof Error ? erro.message : "Erro desconhecido");
      }
    }
    carregarCategorias();
  }, []);

return { categorias, erro}

}