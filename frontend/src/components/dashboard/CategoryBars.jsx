import { formatInr } from '../../utils/currencyFormatter'

export default function CategoryBars({ breakdown }) {
  if (!breakdown?.length) return null

  const maxPct = Math.max(...breakdown.map((b) => b.percent_of_income), 1)

  return (
    <ul className="category-bars">
      {breakdown.map((item) => {
        const width = Math.max((item.percent_of_income / maxPct) * 100, 4)
        return (
          <li key={item.key} className="category-bar">
            <div className="category-bar__head">
              <span>{item.label}</span>
              <span>
                {item.percent_of_income}% · {formatInr(item.amount)}
              </span>
            </div>
            <div className="category-bar__track">
              <div className="category-bar__fill" style={{ width: `${width}%` }} />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
