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
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/logout', { method: 'POST' });
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
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
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        background: 'white',
        borderRadius: '15px',
        padding: '20px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '30px',
          padding: '20px',
          background: '#f8f9fa',
          borderRadius: '10px'
        }}>
          <h1 style={{ margin: 0, color: '#333' }}>
            {userData ? `Welcome, ${userData.username}!` : 'Welcome to Your Dashboard'}
          </h1>
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
        
        {userData && (
          <div>
            <h2 style={{ color: '#555', marginBottom: '30px' }}>
              Hello, <span style={{ color: '#667eea' }}>{userData.username}</span>! 👋
            </h2>
            
            {/* User Information Card */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}>
              <div style={{ 
                padding: '25px', 
                background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)', 
                borderRadius: '10px', 
                minWidth: '250px',
                flex: 1,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <h3>📊 User Information</h3>
                <p><strong>Username:</strong> {userData.username}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>User ID:</strong> {userData.userId}</p>
                <p><strong>Mobile:</strong> {userData.mobile || 'Not provided'}</p>
                <p><strong>Joined:</strong> {new Date(userData.joinedDate).toLocaleDateString()}</p>
              </div>
              
              <div style={{ 
                padding: '25px', 
                background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)', 
                borderRadius: '10px', 
                minWidth: '250px',
                flex: 1,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <h3>🚀 Quick Stats</h3>
                <p><strong>Enrolled Courses:</strong> 5</p>
                <p><strong>Completed Lessons:</strong> 12</p>
                <p><strong>Current Streak:</strong> 7 days</p>
                <p><strong>Average Score:</strong> 85%</p>
              </div>
            </div>

            {/* Course Progress Section */}
            <div style={{ marginBottom: '30px' }}>
              <h3>🎯 Course Progress</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px' }}>
                  <h4>Network+</h4>
                  <p>Progress: 75%</p>
                  <div style={{ background: '#ddd', borderRadius: '4px', height: '10px' }}>
                    <div style={{ background: '#4CAF50', height: '100%', width: '75%', borderRadius: '4px' }}></div>
                  </div>
                  <button style={{ marginTop: '10px', padding: '8px 16px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '4px' }}>
                    Continue Learning
                  </button>
                </div>
                
                <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px' }}>
                  <h4>Cyber Security</h4>
                  <p>Progress: 40%</p>
                  <div style={{ background: '#ddd', borderRadius: '4px', height: '10px' }}>
                    <div style={{ background: '#FF9800', height: '100%', width: '40%', borderRadius: '4px' }}></div>
                  </div>
                  <button style={{ marginTop: '10px', padding: '8px 16px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '4px' }}>
                    Continue Learning
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3>⚡ Quick Actions</h3>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <button style={{ 
                  padding: '15px 20px', 
                  background: '#4caf50', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  flex: '1',
                  minWidth: '150px'
                }}>
                  📚 Browse Courses
                </button>
                <button style={{ 
                  padding: '15px 20px', 
                  background: '#2196f3', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  flex: '1',
                  minWidth: '150px'
                }}>
                  👤 Edit Profile
                </button>
                <button style={{ 
                  padding: '15px 20px', 
                  background: '#ff9800', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  flex: '1',
                  minWidth: '150px'
                }}>
                  📈 View Analytics
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;