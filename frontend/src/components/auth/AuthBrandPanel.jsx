export default function AuthBrandPanel({ features }) {
  return (
    <aside className="auth-layout__brand">
      <p className="auth-layout__tag">Personal finance</p>
      <h1>Smart Finance Dashboard</h1>
      <p>{features.tagline}</p>
      <ul className="auth-layout__features">
        {features.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </aside>
  )
}
