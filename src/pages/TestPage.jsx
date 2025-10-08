import React from 'react';

export default function TestPage() {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#1e293b', 
      color: 'white', 
      minHeight: '100vh',
      textAlign: 'center',
      paddingTop: '100px'
    }}>
      <h1>🎉 System Test Page</h1>
      <p>If you can see this, your React app is working!</p>
      <div style={{ marginTop: '20px' }}>
        <a href="/" style={{ color: '#38bdf8', textDecoration: 'underline' }}>
          ← Back to Homepage
        </a>
      </div>
    </div>
  );
}