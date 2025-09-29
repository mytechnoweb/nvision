import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);
	
  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/dashboard');
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else if (response.status === 401) {
        // If not authenticated, redirect to home
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Call the global logout function from index.html
    if (window.logout) {
      window.logout();
    } else {
      // Fallback
      fetch('/logout', { method: 'POST' }).then(() => {
        window.location.href = '/';
      });
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      minHeight: '80vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      marginTop: '20px'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        background: 'white',
        borderRadius: '15px',
        padding: '20px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        {/* Your existing dashboard content */}
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '30px',
          padding: '20px',
          background: '#f8f9fa',
          borderRadius: '10px'
        }}>
          <h1 style={{ margin: 0, color: '#333' }}>Welcome to Your Dashboard</h1>
          <button 
            onClick={handleLogout}
            style={{ 
              padding: '10px 20px', 
              background: '#dc3545', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Logout
          </button>
        </header>
        
        {/* Rest of your dashboard content */}
        {userData && (
          <div>
            <h2>Hello, {userData.username}!</h2>
			<div><iframe
        src="/welcome.html" // path to your HTML file
        title="Static Dashboard"
        style={{ width: '100%', height: '600px', border: 'none' }}
      /></div>
            {/* Your dashboard widgets */}
						
          </div>
		 		  
        )}
      </div>
    </div>
  );
};

export default Dashboard;

