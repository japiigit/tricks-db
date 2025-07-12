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
          await window.electronAPI.updateEntry(editingEntry.id, entryData); // Fixed typo and added semicolon
          setEditingEntry(null);
        } else {
          await window.electronAPI.addEntry(entryData); // Added semicolon
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
                  <td className="p-2">{trick.item}</td>
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