import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="app-navbar" style={{ 
            padding: '16px clamp(14px, 3vw, 30px)', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex', 
            gap: 'clamp(8px, 1.8vw, 25px)',
            alignItems: 'center',
            flexWrap: 'wrap',
            borderBottom: '3px solid rgba(255,255,255,0.1)',
            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            {/* Site Branding */}
            <Link className="navbar-brand" to="/search" style={{ textDecoration: 'none', marginRight: '15px' }}>
                <span style={{
                    fontSize: 'clamp(20px, 2.2vw, 26px)',
                    fontWeight: 'bold',
                    color: 'white',
                    letterSpacing: 0,
                    textShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    💎 MergeMarket
                </span>
            </Link>

            {/* Navigation Links */}
            <Link to="/search" style={navLinkStyle} className="nav-link">🔍 Search</Link>
            <Link to="/sell" style={navLinkStyle} className="nav-link">📤 Sell</Link> 
            <Link to="/cart" style={navLinkStyle} className="nav-link">🛒 Cart</Link>
            <Link to="/history" style={navLinkStyle} className="nav-link">📋 Orders</Link>
            <Link to="/deliver" style={navLinkStyle} className="nav-link">🚚 Deliver</Link>
            <Link to="/profile" style={navLinkStyle} className="nav-link">👤 Profile</Link>
            <Link to="/support" style={navLinkStyle} className="nav-link">💬 Support</Link>
            
            <style>{`
                .app-navbar {
                    width: 100%;
                }

                .nav-link:hover {
                    background-color: rgba(255, 255, 255, 0.2) !important;
                    transform: translateY(-2px) !important;
                }

                @media (max-width: 900px) {
                    .app-navbar {
                        justify-content: center;
                    }

                    .navbar-brand {
                        flex: 1 0 100%;
                        display: flex;
                        justify-content: center;
                        margin-right: 0 !important;
                    }

                    .nav-link {
                        font-size: 13px !important;
                        padding: 7px 9px !important;
                    }

                    .logout-button {
                        margin-left: 0 !important;
                    }
                }

                @media (max-width: 520px) {
                    .app-navbar {
                        gap: 6px !important;
                        padding: 12px 10px !important;
                    }

                    .nav-link {
                        flex: 1 1 calc(33.333% - 8px);
                        text-align: center;
                    }

                    .logout-button {
                        flex: 1 1 100%;
                    }
                }
            `}</style>
            <button 
                className="logout-button"
                onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
                style={{ 
                    marginLeft: 'auto', 
                    background: 'rgba(255, 77, 77, 0.9)',
                    color: 'white', 
                    border: '2px solid white',
                    cursor: 'pointer', 
                    borderRadius: '8px', 
                    padding: '10px 20px',
                    fontWeight: '600',
                    fontSize: '14px',
                    transition: 'all 0.3s',
                    boxShadow: '0 4px 12px rgba(220, 53, 69, 0.3)'
                }}
                onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(220, 53, 69, 1)';
                    e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 77, 77, 0.9)';
                    e.target.style.transform = 'scale(1)';
                }}
            >
                🚪 Logout
            </button>
        </nav>
    );
};

const navLinkStyle = {
    color: 'white',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600',
    padding: '8px 12px',
    borderRadius: '6px',
    transition: 'all 0.3s',
    whiteSpace: 'nowrap',
    minWidth: 0,
};

export default Navbar;
