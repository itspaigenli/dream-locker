function Header({
  onPageChange,
  onArchiveClick,
  onLinksClick,
  isLoggedIn,
  currentUser,
  onLogout,
}) {
  return (
    <header className="site-header">
      <div className="brand-area">
        <button
          className="brand"
          type="button"
          onClick={() => onPageChange("dashboard")}
        >
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 36 36" role="img">
              <path
                className="brand-mark-fill"
                d="M8 6h10c7 0 12 5 12 12s-5 12-12 12H8V6Z"
              />
              <path
                className="brand-mark-line"
                d="M14 11h4c4.3 0 7 2.8 7 7s-2.7 7-7 7h-4V11Z"
              />
              <path
                className="brand-mark-line"
                d="M14 11 25 18 14 25M18 11 14 18l4 7M14 18h11"
              />
              <path className="brand-mark-line" d="M18 25v5M22 23v4" />
              <circle className="brand-mark-dot" cx="18" cy="31" r="1.1" />
              <circle className="brand-mark-dot" cx="22" cy="28" r="1" />
            </svg>
          </span>
          DreamLocker
        </button>
      </div>

      <nav className="nav">
        <button type="button" onClick={() => onPageChange("dashboard")}>
          Dashboard
        </button>
        <button type="button" onClick={() => onPageChange("reports")}>
          Reports
        </button>
        <button type="button" onClick={() => onPageChange("new")}>
          New Report
        </button>
        <button type="button" onClick={onLinksClick}>
          Links
        </button>
        {isLoggedIn && (
          <button type="button" onClick={onArchiveClick}>
            Archive
          </button>
        )}
      </nav>

      <div className="nav-actions">
        {isLoggedIn ? (
          <>
            <span className="nav-user">Signed in: {currentUser.username}</span>
            <button className="nav-cta" type="button" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={() => onPageChange("login")}>
              Login
            </button>
            <button
              className="nav-cta"
              type="button"
              onClick={() => onPageChange("signup")}
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
