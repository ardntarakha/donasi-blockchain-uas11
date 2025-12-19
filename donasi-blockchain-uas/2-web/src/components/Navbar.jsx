import { NavLink } from "react-router-dom";

function LogoSVG() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2.5c3.6 0 6.7 2.4 7.7 5.9.2.6-.2 1.1-.8 1.1h-2.2c-.4 0-.7-.2-.8-.6-.7-2-2.6-3.4-4.9-3.4-3 0-5.4 2.4-5.4 5.4 0 3 2.4 5.4 5.4 5.4 2.3 0 4.2-1.4 4.9-3.4.1-.4.4-.6.8-.6h2.2c.6 0 1 .6.8 1.1-1 3.5-4.1 5.9-7.7 5.9-4.6 0-8.4-3.8-8.4-8.4S7.4 2.5 12 2.5Z"
        fill="white"
        opacity="0.95"
      />
      <path
        d="M13.2 7.4h2.1c.5 0 .9.4.9.9v7.4c0 .5-.4.9-.9.9h-2.1c-.5 0-.9-.4-.9-.9V8.3c0-.5.4-.9.9-.9Z"
        fill="white"
        opacity="0.9"
      />
    </svg>
  );
}

export default function Navbar() {
  return (
    <header className="nav">
      <div className="navContainer">
        <div className="navInner">
          <div className="navLeft">
            <div className="brandMark" title="Ruang Peduli">
              <LogoSVG />
            </div>
            <div className="titleWrap">
              <div className="titleMain">Ruang Peduli</div>
              <div className="titleSub">Donasi Digital Berbasis Blockchain</div>
            </div>
          </div>

          <nav className="navRight">
            <NavLink to="/" end className="navLink">
              Beranda
            </NavLink>
            <NavLink to="/about" className="navLink">
              Tentang
            </NavLink>
            <NavLink to="/admin" className={({ isActive }) => `navLink navAdmin ${isActive ? "active" : ""}`}>
              Admin
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}
