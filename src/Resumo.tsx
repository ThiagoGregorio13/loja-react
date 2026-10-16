
type  Resumo = {
mostrando:number;
total:number;
precoMedio:number;
}

export function ResumoLoja({mostrando,total,precoMedio}: Resumo){
    return (
        <p>
        Mostrando {mostrando} de {total} produtos · preço médio US${" "}
        {precoMedio.toFixed(2)}
      </p>
    )
}