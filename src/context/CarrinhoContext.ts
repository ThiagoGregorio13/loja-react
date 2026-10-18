import type { Product } from "../types"
import { createContext, useContext } from "react"

type ContextCarrinho = {
  adicionarAoCarrinho: (produto: Product) => void
  removerDoCarrinho: (posicao: number) => void
  carrinho: Product[]
}

export const CarrinhoContext = createContext<ContextCarrinho | null>(null)

export function useCarrinho() {
  const context = useContext(CarrinhoContext)
  if (!context) {
    throw new Error("useCarrinho precisa estar dentro do CarrinhoProvider")
  }
  return context
}
