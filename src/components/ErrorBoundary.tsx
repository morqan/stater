import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

// Rendered by React Router when a route (or its loader/action) throws.
export function ErrorBoundary() {
  const error = useRouteError()

  const title = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : 'Something went wrong'

  const detail = isRouteErrorResponse(error)
    ? error.data
    : error instanceof Error
      ? error.message
      : 'Unknown error'

  return (
    <section>
      <h1>{title}</h1>
      <p>{detail}</p>
    </section>
  )
}
