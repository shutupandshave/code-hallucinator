import React, { useState, useEffect } from 'react';

// A simple user profile component
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId);
  }, [userId]);

  async function fetchUser(id) {
    setLoading(true);
    const response = await fetch(`/api/users/${id}`);
    const data = await response.json();
    setUser(data);
    setLoading(false);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  if (loading) {
    return <div className='spinner'>Loading...</div>;
  }

  return (
    <div className='user-profile'>
      <img src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default UserProfile;
