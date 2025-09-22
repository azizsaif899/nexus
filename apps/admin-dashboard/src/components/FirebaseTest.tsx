import React, { useState } from 'react';
import { signInWithGoogle, logout } from '@azizsys/core/auth';
import { createDocument, getDocuments } from '@azizsys/core/database';

export const FirebaseTest: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);

  const handleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      setUser(result.user);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  const addData = async () => {
    try {
      await createDocument('test', {
        name: 'Test User',
        timestamp: new Date(),
        userId: user?.uid
      });
      loadData();
    } catch (error) {
      console.error('Add data failed:', error);
    }
  };

  const loadData = async () => {
    try {
      const docs = await getDocuments('test');
      setData(docs);
    } catch (error) {
      console.error('Load data failed:', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Firebase Test</h2>
      
      {!user ? (
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Login with Google
        </button>
      ) : (
        <div>
          <p className="mb-4">Welcome, {user.displayName}!</p>
          <div className="space-x-2 mb-4">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
            <button
              onClick={addData}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add Test Data
            </button>
            <button
              onClick={loadData}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Load Data
            </button>
          </div>
          
          {data.length > 0 && (
            <div>
              <h3 className="font-bold mb-2">Firestore Data:</h3>
              <pre className="bg-gray-100 p-2 rounded text-sm">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};