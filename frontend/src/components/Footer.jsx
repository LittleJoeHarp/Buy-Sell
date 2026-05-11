const Footer = () => {
    return (
        <footer style={{
            backgroundColor: 'linear-gradient(135deg, #667eea, #764ba2)',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textAlign: 'center',
            padding: '30px 20px',
            borderTop: '3px solid rgba(255,255,255,0.1)',
            marginTop: '60px',
            fontSize: '14px',
            boxShadow: '0 -4px 20px rgba(102, 126, 234, 0.2)'
        }}>
            <p style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 15px 0' }}>
                💎 <strong>MergeMarket</strong>
            </p>
            <p style={{ margin: '0 0 5px 0', opacity: 0.9 }}>
                IIIT Hyderabad Peer-to-Peer Marketplace
            </p>
            <p style={{ margin: '0 0 20px 0', opacity: 0.9 }}>
                Created with ❤️ by <strong>Ritama Sanyal</strong>
            </p>
            <div style={{ 
                borderTop: '1px solid rgba(255,255,255,0.3)',
                paddingTop: '20px',
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
                flexWrap: 'wrap'
            }}>
                <span style={{ fontSize: '12px', opacity: 0.8 }}>© 2026 MergeMarket</span>
                <span style={{ fontSize: '12px', opacity: 0.8 }}>•</span>
                <span style={{ fontSize: '12px', opacity: 0.8 }}>All rights reserved</span>
            </div>
        </footer>
    );
};

export default Footer;
