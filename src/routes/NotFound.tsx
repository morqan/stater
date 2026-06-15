import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <section>
      <h1>404 — Page not found</h1>
      <p>
        The page you're looking for doesn't exist. <Link to="/">Go home</Link>.
      </p>
    </section>
  )
}
