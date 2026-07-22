/** Star rating out of 5. Filled stars use gold; empties use the line colour. */
export function Stars({
  rating,
  className = "",
}: {
  rating: number;
  className?: string;
}) {
  const full = Math.round(rating);
  return (
    <span className={`text-gold ${className}`} aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < full ? "" : "text-line"}>
          ★
        </span>
      ))}
    </span>
  );
}
