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
          <label className="block text-sm font-medium text-gray-700 mb-1">Trick/Hack</label>
          <textarea
            value={formData.item}
            onChange={(e) => setFormData({ ...formData, item: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            rows={3}
            placeholder="Describe your trick or hack..."
            required
          />
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