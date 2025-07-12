import React, { useState, useEffect } from 'react';
import DynamicDropdown from './DynamicDropdown';

export default function EntryForm({ 
  subjects, 
  categories, 
  onAddSubject,
  onAddCategory,
  onSubmit,
  initialData 
}) {
  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    item: '',
    remark: '',
  });
  
  const [copyStatus, setCopyStatus] = useState(''); // State for copy feedback

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    if (!initialData) {
      setFormData({ subject: '', category: '', item: '', remark: '' });
    }
  };

  // Function to copy item text to clipboard
  const handleCopyItem = async () => {
    try {
      await navigator.clipboard.writeText(formData.item);
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus(''), 2000); // Clear status after 2 seconds
    } catch (err) {
      setCopyStatus('Copy failed!');
      console.error('Failed to copy:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <DynamicDropdown 
            options={subjects} 
            value={formData.subject}
            onChange={(value) => setFormData({ ...formData, subject: value })}
            onCreate={onAddSubject}
            placeholder="Select or type a subject"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <DynamicDropdown 
            options={categories} 
            value={formData.category}
            onChange={(value) => setFormData({ ...formData, category: value })}
            onCreate={onAddCategory}
            placeholder="Select or type a category"
          />
        </div>
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">Trick/Hack</label>
            {copyStatus && (
              <span className="text-xs text-green-600 transition-opacity duration-300">
                {copyStatus}
              </span>
            )}
          </div>
          <div className="relative">
            <textarea
              value={formData.item}
              onChange={(e) => setFormData({ ...formData, item: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pr-10"
              rows={3}
              placeholder="Describe your trick or hack..."
              required
            />
            <button
              type="button"
              onClick={handleCopyItem}
              disabled={!formData.item}
              className={`absolute right-2 bottom-2 p-1 rounded ${
                formData.item 
                  ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100' 
                  : 'text-gray-300 cursor-not-allowed'
              }`}
              aria-label="Copy to clipboard"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Remark <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            value={formData.remark}
            onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Additional notes or context"
          />
        </div>
      </div>
      <button
        type="submit"
        aria-label={initialData ? 'Update entry' : 'Add new entry'}
        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {initialData ? 'Update Entry' : 'Add Entry'}
      </button>
    </form>
  );
}