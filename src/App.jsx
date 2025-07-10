import React from 'react';

function App() {
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
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span>Electron connection pending</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;