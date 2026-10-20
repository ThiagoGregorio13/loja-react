import { formatPrice } from "../utils/format";

type SummaryProps = {
  showing: number;
  total: number;
  averagePrice: number;
};

export function StoreSummary({ showing, total, averagePrice }: SummaryProps) {
  return (
    <p className="summary">
      Showing {showing} of {total} products · average price {formatPrice(averagePrice)}
    </p>
  );
}
