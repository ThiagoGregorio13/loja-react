type FiltrosProps = {
  digitado: string;
  aoDigitar: (valor: string) => void;
  categoria: string;
  aoMudarCategoria: (valor: string) => void;
  categorias: string[];
  bemAvaliado: boolean;
  aoMudarBemAvaliado: (valor: boolean) => void;
};

export function Filtros({
  digitado,
  aoDigitar,
  categoria,
  aoMudarCategoria,
  categorias,
  bemAvaliado,
  aoMudarBemAvaliado,
}: FiltrosProps) {
  return (
    <div>
      <input
        value={digitado}
        onChange={(e) => aoDigitar(e.target.value)}
        placeholder="Buscar produto..."
      />

      <select value={categoria} onChange={(e) => aoMudarCategoria(e.target.value)}>
        <option value="">Todas</option>
        {categorias.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <label>
        <input
          type="checkbox"
          checked={bemAvaliado}
          onChange={(e) => aoMudarBemAvaliado(e.target.checked)}
        />
        Só bem avaliados
      </label>
    </div>
  );
}