<<<<<<< HEAD
<<<<<<< HEAD
function Header({ onPageChange, onArchiveClick, currentUser, onLogout }) {
=======
function Header({ onPageChange, onArchiveClick, isLoggedIn }) {
>>>>>>> 31f0dbb (Signup/Login button disappear after login)
=======
function Header({ onPageChange, onArchiveClick, isLoggedIn, onLogout }) {
>>>>>>> bf6054d (Add logout function)
  return (
    <header className="site-header">
      <button
        className="brand"
        type="button"
        onClick={() => onPageChange("dashboard")}
      >
        Dream Evidence Locker
      </button>

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
        <button type="button" onClick={() => onPageChange("links")}>
          Links
        </button>
<<<<<<< HEAD
        <button type="button" onClick={onArchiveClick}>
          Archive
        </button>
        {currentUser ? (
          <>
            <span className="nav-user">Signed in: {currentUser.username}</span>
            <button type="button" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={() => onPageChange("login")}>
              Login
            </button>
            <button type="button" onClick={() => onPageChange("signup")}>
              Sign Up
            </button>
          </>
        )}
=======
        {isLoggedIn && <button type="button" onClick={onArchiveClick}>
            Archive
          </button>
        }

        {!isLoggedIn ? (
          <>
            <button type="button" onClick={() => onPageChange("signup")}>
              Sign Up
            </button>
            <button type="button" onClick={() => onPageChange("login")}>
              Login
            </button>
          </>
        ) : (
          <button onClick={onLogout} className="btn-logout">
            Logout
          </button>
        )
      }
       
>>>>>>> 31f0dbb (Signup/Login button disappear after login)
      </nav>
    </header>
  );
}

export default Header;
