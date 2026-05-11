import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav style={{ 
            padding: '16px 30px', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex', 
            gap: '25px',
            alignItems: 'center',
            borderBottom: '3px solid rgba(255,255,255,0.1)',
            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            {/* Site Branding */}
            <Link to="/search" style={{ textDecoration: 'none', marginRight: '15px' }}>
                <span style={{
                    fontSize: '26px',
                    fontWeight: 'bold',
                    color: 'white',
                    letterSpacing: '-0.5px',
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
                .nav-link:hover {
                    background-color: rgba(255, 255, 255, 0.2) !important;
                    transform: translateY(-2px) !important;
                }
            `}</style>
            <button 
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
};

export default Navbar;