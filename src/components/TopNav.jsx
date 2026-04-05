import { Link, NavLink } from 'react-router-dom'

function LinkItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-full px-4 py-2.5 text-sm font-semibold transition ${
          isActive ? 'bg-sky-200 text-slate-900' : 'text-cyan-800 hover:bg-sky-100'
        }`
      }
    >
      {children}
    </NavLink>
  )
}

export default function TopNav({ links = [], title = 'Health Hub', onLogout, showLogo = true }) {
  return (
    <header className="sticky top-0 z-20 border-b border-sky-200 bg-sky-50/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        {showLogo ? (
          <Link to="/" className="text-xl font-black tracking-tight text-slate-900">
            {title}
          </Link>
        ) : (
          <span className="text-xl font-black tracking-tight text-slate-900">{title}</span>
        )}

        <nav className="flex flex-wrap items-center gap-2">
          {links.map((link) => (
            <LinkItem key={link.to} to={link.to}>
              {link.label}
            </LinkItem>
          ))}
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="rounded-full bg-cyan-900 px-5 py-2.5 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-800"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}
