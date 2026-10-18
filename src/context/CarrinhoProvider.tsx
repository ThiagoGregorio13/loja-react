import { useState } from "react"
import type { Product } from "../types"
import { CarrinhoContext } from "./CarrinhoContext"

export function CarrinhoProvider({ children }: { children: React.ReactNode }) {
  const [carrinho, setCarrinho] = useState<Product[]>([])

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
