import { Link, Outlet } from 'react-router-dom'
import styles from './Layout.module.css'

// Shared shell rendered around every route via <Outlet />.
export function Layout() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <strong>stater</strong>
        <nav className={styles.nav}>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
