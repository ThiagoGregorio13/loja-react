type FiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  categories: string[];
  topRated: boolean;
  onTopRatedChange: (value: boolean) => void;
};

export function Filters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
  topRated,
  onTopRatedChange,
}: FiltersProps) {
  return (
    <div className="filters">
      <input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search products..."
      />

      <select value={category} onChange={(e) => onCategoryChange(e.target.value)}>
        <option value="">All</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <label>
        <input
          type="checkbox"
          checked={topRated}
          onChange={(e) => onTopRatedChange(e.target.checked)}
        />
        Top rated only
      </label>
    </div>
  );
}
