import { useEffect, useState } from "react"
import type { Product } from "../types"
import { CarrinhoContext } from "./CarrinhoContext"

export function CarrinhoProvider({ children }: { children: React.ReactNode }) {
  const [carrinho, setCarrinho] = useState<Product[]>(() => {
    const save = localStorage.getItem("carrinho")
    return save ? JSON.parse(save) : [];
  })

  useEffect(() => {
    localStorage.setItem("carrinho", JSON.stringify(carrinho))
  }, [carrinho])

  function adicionarAoCarrinho(produto: Product) {
    setCarrinho([...carrinho, produto])
  }

  function removerDoCarrinho(posicao: number) {
    setCarrinho(carrinho.filter((_, i) => i !== posicao))
  }

  return (
    <CarrinhoContext value={{ adicionarAoCarrinho, removerDoCarrinho, carrinho }}>
      {children}
    </CarrinhoContext>
  )
}
