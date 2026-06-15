import { useState } from 'react'
import styles from './Home.module.css'

export function Home() {
  const [count, setCount] = useState(0)

  return (
    <section>
      <h1 className={styles.title}>Vite + React + TypeScript</h1>
      <p>
        Edit files in <code>src/</code> and HMR updates the page instantly — no reload, no lost
        state.
      </p>
      <button type="button" className={styles.button} onClick={() => setCount((c) => c + 1)}>
        count is {count}
      </button>
    </section>
  )
}
