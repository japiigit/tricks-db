import React, { useState, useEffect } from 'react';

function App() {
  const [electronStatus, setElectronStatus] = useState('pending');
  const [subjects, setSubjects] = useState([]);

  // Check Electron connection
  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.getSubjects()
        .then(data => {
          setSubjects(data);
          setElectronStatus('active');
        })
        .catch(error => {
          console.error('Electron connection failed:', error);
          setElectronStatus('failed');
        });
    } else {
      setElectronStatus('unavailable');
    }
  }, []);

  // Get status color and text
  const getStatusInfo = () => {
    switch(electronStatus) {
      case 'active': 
        return { color: 'bg-green-500', text: 'active' };
      case 'failed': 
        return { color: 'bg-red-500', text: 'failed' };
      case 'unavailable': 
        return { color: 'bg-gray-500', text: 'unavailable' };
      default: 
        return { color: 'bg-yellow-500', text: 'pending' };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-blue-600">
          Tricks & Hacks Database
        </h1>
        <p className="text-gray-600 mt-2">
          Your personal knowledge repository
        </p>
      </header>
      
      <main>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Setup Status</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>React application mounted</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>Tailwind CSS integrated</span>
            </div>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${statusInfo.color}`}></div>
              <span>Electron connection {statusInfo.text}</span>
            </div>
          </div>
          
          {/* Database Test Section */}
          {subjects.length > 0 && (
            <div className="mt-6 border-t pt-4">
              <h3 className="font-medium text-gray-700 mb-2">Database Connection Verified</h3>
              <div className="bg-blue-50 rounded-lg p-3">
                <h4 className="font-medium text-blue-700 mb-1">Subjects in Database:</h4>
                <ul className="grid grid-cols-2 gap-2">
                  {subjects.map(subject => (
                    <li 
                      key={subject.id} 
                      className="bg-white py-1 px-2 rounded text-sm shadow-sm"
                    >
                      {subject.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {electronStatus === 'active' && subjects.length === 0 && (
            <div className="mt-6 border-t pt-4">
              <div className="bg-yellow-50 rounded-lg p-3">
                <h4 className="font-medium text-yellow-700">Database is Empty</h4>
                <p className="text-sm text-yellow-600 mt-1">
                  No subjects found. Add some using the SQLite CLI:
                </p>
                <code className="block bg-gray-800 text-gray-100 p-2 rounded mt-2 text-xs">
                  sqlite3 tricks.db "INSERT INTO subjects (name) VALUES ('JavaScript');"
                </code>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;