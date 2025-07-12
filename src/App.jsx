import React, { useState, useEffect } from 'react';
import EntryForm from './components/EntryForm';
import './styles/tailwind.css';

function App() {
  const [tricks, setTricks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [editingEntry, setEditingEntry] = useState(null);

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.getTricks().then(setTricks);
      window.electronAPI.getSubjects().then(setSubjects);
      window.electronAPI.getCategories().then(setCategories);
    }
  }, []);

  const handleAddSubject = (subjectName) => {
    setSubjects([...subjects, { id: Date.now(), name: subjectName }]);
    return subjectName;
  };

  const handleAddCategory = (categoryName) => {
    setCategories([...categories, { id: Date.now(), name: categoryName }]);
    return categoryName;
  };

  const handleSubmitEntry = async (entryData) => {
    if (window.electronAPI) {
      try {
        if (editingEntry) {
          await window.electronAPI.updateEntry(editingEntry.id, entryData);
          setEditingEntry(null);
        } else {
          await window.electronAPI.addEntry(entryData);
        }
        window.electronAPI.getTricks().then(setTricks);
        window.electronAPI.getSubjects().then(setSubjects);
        window.electronAPI.getCategories().then(setCategories);
        alert(editingEntry ? 'Entry updated successfully!' : 'Entry saved successfully!');
      } catch (error) {
        console.error('Failed to save entry:', error);
        alert(`Save failed: ${error.message}`);
      }
    } else {
      console.log('Not running in Electron - entry would be:', entryData);
      alert('In Electron, this would save to your database!');
    }
  };

  const handleEdit = (trick) => {
    setEditingEntry(trick);
  };

  const handleDelete = async (id) => {
    if (window.electronAPI) {
      try {
        await window.electronAPI.deleteEntry(id);
        window.electronAPI.getTricks().then(setTricks);
        alert('Entry deleted successfully!');
      } catch (error) {
        console.error('Failed to delete entry:', error);
        alert(`Delete failed: ${error.message}`);
      }
    }
  };

  // Function to copy item text to clipboard
  const handleCopyItem = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        alert('Copy failed');
      });
  };

  const filteredTricks = tricks.filter(
    (trick) =>
      trick.subject.toLowerCase().includes(search.toLowerCase()) ||
      trick.category.toLowerCase().includes(search.toLowerCase()) ||
      trick.item.toLowerCase().includes(search.toLowerCase()) ||
      (trick.remark && trick.remark.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">TricksVault</h1>
      </header>
      <main>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{editingEntry ? 'Edit Entry' : 'Add New Entry'}</h2>
          <EntryForm
            subjects={subjects}
            categories={categories}
            onAddSubject={handleAddSubject}
            onAddCategory={handleAddCategory}
            onSubmit={handleSubmitEntry}
            initialData={editingEntry}
          />
        </div>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tricks..."
            className="border p-2 w-full mb-4 rounded"
          />
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Subject</th>
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-left">Item</th>
                <th className="p-2 text-left">Remark</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTricks.map((trick) => (
                <tr key={trick.id} className="border-t">
                  <td className="p-2">{trick.subject}</td>
                  <td className="p-2">{trick.category}</td>
                  <td className="p-2">
                    <div className="flex items-center">
                      <span className="mr-2">{trick.item}</span>
                      <button
                        onClick={() => handleCopyItem(trick.item)}
                        className="text-blue-500 hover:text-blue-700"
                        title="Copy to clipboard"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" 
                             className="h-5 w-5" 
                             viewBox="0 0 20 20" 
                             fill="currentColor">
                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td className="p-2">{trick.remark}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleEdit(trick)}
                      className="text-blue-500 mr-2 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(trick.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default App;