import React, { useState } from 'react';

const UserProfile = () => {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    purchases: ['Product A', 'Product B', 'Product C'],
    isBlocked: false,
  });

  const handleBlockUser = () => {
    setUser({ ...user, isBlocked: true });
  };

  const handleUnblockUser = () => {
    setUser({ ...user, isBlocked: false });
  };

  return (
    <div>
      <h2>User Profile</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <h3>Purchase History</h3>
      <ul>
        {user.purchases.map((purchase, index) => (
          <li key={index}>{purchase}</li>
        ))}
      </ul>
      <h3>User Status</h3>
      {user.isBlocked ? (
        <p>User is blocked</p>
      ) : (
        <p>User is active</p>
      )}
      <button onClick={handleBlockUser}>Block User</button>
      <button onClick={handleUnblockUser}>Unblock User</button>
    </div>
  );
};

export default UserProfile;