/** Shown when the BFF returned partial data because one downstream service failed. */
export function Warnings({ warnings }: { warnings: string[] }) {
  if (warnings.length === 0) return null;
  return (
    <div className="warning">
      {warnings.map((w) => (
        <p key={w}>⚠ {w}</p>
      ))}
    </div>
  );
}
