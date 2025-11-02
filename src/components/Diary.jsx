import { useState, useEffect } from 'react';
import { BookOpen, Trash2, Edit, Save, X } from 'lucide-react';
import { saveDiaryEntry, getDiaryEntries, updateDiaryEntry, deleteDiaryEntry } from '../utils/storage';
import { format } from 'date-fns';

const Diary = () => {
  const [entries, setEntries] = useState([]);
  const [isWriting, setIsWriting] = useState(false);
  const [currentEntry, setCurrentEntry] = useState({ title: '', content: '', date: format(new Date(), 'yyyy-MM-dd'), tags: '' });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () => {
    const allEntries = getDiaryEntries();
    setEntries(allEntries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
  };

  const handleSave = () => {
    if (!currentEntry.content.trim()) {
      alert('Please write something before saving');
      return;
    }

    if (editingId) {
      updateDiaryEntry(editingId, currentEntry);
    } else {
      saveDiaryEntry(currentEntry);
    }

    setCurrentEntry({ title: '', content: '', date: format(new Date(), 'yyyy-MM-dd'), tags: '' });
    setIsWriting(false);
    setEditingId(null);
    loadEntries();
  };

  const handleEdit = (entry) => {
    setCurrentEntry({
      title: entry.title,
      content: entry.content,
      date: entry.date,
      tags: entry.tags || '',
    });
    setEditingId(entry.id);
    setIsWriting(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      deleteDiaryEntry(id);
      loadEntries();
    }
  };

  const handleCancel = () => {
    setCurrentEntry({ title: '', content: '', date: format(new Date(), 'yyyy-MM-dd'), tags: '' });
    setIsWriting(false);
    setEditingId(null);
  };

  const filteredEntries = entries.filter(entry => {
    const searchLower = searchTerm.toLowerCase();
    return (
      entry.title.toLowerCase().includes(searchLower) ||
      entry.content.toLowerCase().includes(searchLower) ||
      (entry.tags && entry.tags.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Learning Diary
          </h1>
          <p className="text-gray-600 font-medium">Document your journey and insights</p>
        </div>
        {!isWriting && (
          <button
            onClick={() => setIsWriting(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2 font-bold shadow-lg"
          >
            <BookOpen className="w-5 h-5" />
            New Entry
          </button>
        )}
      </div>

      {/* Writing Area */}
      {isWriting && (
        <div className="backdrop-blur-sm bg-white/80 p-6 rounded-2xl shadow-xl border border-white/20">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {editingId ? 'Edit Entry' : 'New Diary Entry'}
          </h2>

          {/* Date */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-3">Date</label>
            <input
              type="date"
              value={currentEntry.date}
              onChange={(e) => setCurrentEntry({ ...currentEntry, date: e.target.value })}
              className="w-full md:w-auto px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 font-medium"
            />
          </div>

          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-3">Title (Optional)</label>
            <input
              type="text"
              value={currentEntry.title}
              onChange={(e) => setCurrentEntry({ ...currentEntry, title: e.target.value })}
              placeholder="Give your entry a title..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 font-medium"
            />
          </div>

          {/* Content */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-3">Content</label>
            <textarea
              value={currentEntry.content}
              onChange={(e) => setCurrentEntry({ ...currentEntry, content: e.target.value })}
              placeholder="What did you learn today? What challenges did you face? What insights did you gain?"
              rows="10"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 font-medium resize-none"
            />
          </div>

          {/* Tags */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-3">Tags (Optional)</label>
            <input
              type="text"
              value={currentEntry.tags}
              onChange={(e) => setCurrentEntry({ ...currentEntry, tags: e.target.value })}
              placeholder="e.g., breakthrough, struggled, idea (comma-separated)"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 font-medium"
            />
            <p className="text-xs text-gray-500 mt-2 font-medium">Separate tags with commas</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2 font-bold shadow-lg"
            >
              <Save className="w-5 h-5" />
              Save Entry
            </button>
            <button
              onClick={handleCancel}
              className="px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2 font-bold shadow-lg"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      {!isWriting && entries.length > 0 && (
        <div className="backdrop-blur-sm bg-white/80 p-4 rounded-2xl shadow-xl border border-white/20">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Search entries by title, content, or tags..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 font-medium"
          />
        </div>
      )}

      {/* Entries List */}
      <div className="space-y-4">
        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="group backdrop-blur-sm bg-white/80 p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {entry.title || 'Untitled Entry'}
                    </h3>
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-bold rounded-full">
                      {format(new Date(entry.date), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  {entry.tags && (
                    <div className="flex gap-2 mb-3 flex-wrap">
                      {entry.tags.split(',').map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs font-bold rounded-full border border-blue-200"
                        >
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(entry)}
                    className="text-blue-500 hover:text-white hover:bg-blue-500 p-2 rounded-lg transition-all duration-300 transform hover:scale-110"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-red-500 hover:text-white hover:bg-red-500 p-2 rounded-lg transition-all duration-300 transform hover:scale-110"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed font-medium">{entry.content}</p>
              </div>

              <div className="mt-4 pt-3 border-t-2 border-gray-200 text-xs text-gray-500 font-medium">
                📅 {format(new Date(entry.timestamp), 'EEEE, MMMM dd, yyyy • h:mm a')}
              </div>
            </div>
          ))
        ) : (
          <div className="backdrop-blur-sm bg-white/80 p-12 rounded-2xl shadow-xl border border-white/20 text-center">
            <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400 text-xl font-bold mb-2">
              {searchTerm ? 'No entries found matching your search' : 'No diary entries yet'}
            </p>
            <p className="text-gray-400 text-sm">
              {searchTerm ? 'Try a different search term' : 'Click "New Entry" to start writing!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Diary;
