import { Outlet } from 'react-router-dom'
export function Layout() {

  return (
    <div className="min-h-screen bg-dark-950">
      <header className={`border-b border-brand-600`}>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
