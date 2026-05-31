const ICONS = ['💡', '📊', '✓', '⚠️']

export default function InsightCards({ suggestions }) {
  if (!suggestions?.length) return null

  return (
    <div className="insight-cards">
      {suggestions.map((text, index) => (
        <article key={text} className="insight-card">
          <span className="insight-card__icon" aria-hidden="true">
            {ICONS[index % ICONS.length]}
          </span>
          <p className="insight-card__text">{text}</p>
        </article>
      ))}
    </div>
  )
}
