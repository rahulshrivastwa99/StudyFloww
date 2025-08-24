import React, { useState, useRef, useEffect } from 'react';
import { useStudyData } from '../contexts/StudyDataContext';
import { Plus, Search, FileText, Edit3, Trash2, Save, X, Folder } from 'lucide-react';

const NotesPanel: React.FC = () => {
  const { notes, addNote, updateNote, deleteNote } = useStudyData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showEditor, setShowEditor] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editorData, setEditorData] = useState({
    title: '',
    content: '',
    category: ''
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const categories = Array.from(new Set(notes.map(note => note.category).filter(Boolean)));

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [editorData.content]);

  const handleSaveNote = () => {
    if (!editorData.title.trim()) return;

    if (editingNote) {
      updateNote(editingNote, editorData);
    } else {
      addNote(editorData);
    }

    setEditorData({ title: '', content: '', category: '' });
    setShowEditor(false);
    setEditingNote(null);
  };

  const handleEditNote = (note: any) => {
    setEditorData({
      title: note.title,
      content: note.content,
      category: note.category
    });
    setEditingNote(note.id);
    setShowEditor(true);
  };

  const handleNewNote = () => {
    setEditorData({ title: '', content: '', category: '' });
    setEditingNote(null);
    setShowEditor(true);
  };

  const filteredNotes = notes
    .filter(note => 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(note => selectedCategory === 'all' || note.category === selectedCategory)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Notes List */}
          <div className={`${showEditor ? 'lg:w-1/2' : 'w-full'} space-y-6`}>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <FileText className="w-8 h-8 text-blue-600" />
                  Study Notes
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Organize and manage your study notes
                </p>
              </div>
              <button
                onClick={handleNewNote}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                New Note
              </button>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notes Grid */}
            {filteredNotes.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  No notes found
                </h3>
                <p className="text-gray-400 dark:text-gray-500">
                  {searchTerm ? 'Try adjusting your search' : 'Create your first note to get started'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredNotes.map(note => (
                  <div
                    key={note.id}
                    className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-200 card-hover"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                        {note.title}
                      </h3>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleEditNote(note)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                      {note.content || 'No content'}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        {note.category && (
                          <>
                            <Folder className="w-3 h-3" />
                            <span>{note.category}</span>
                          </>
                        )}
                      </div>
                      <span>
                        Updated {new Date(note.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Editor */}
          {showEditor && (
            <div className="lg:w-1/2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg h-full min-h-96">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {editingNote ? 'Edit Note' : 'New Note'}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveNote}
                      disabled={!editorData.title.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setShowEditor(false);
                        setEditingNote(null);
                        setEditorData({ title: '', content: '', category: '' });
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Note title..."
                      value={editorData.title}
                      onChange={(e) => setEditorData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full text-xl font-semibold bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Category (optional)"
                      value={editorData.category}
                      onChange={(e) => setEditorData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="flex-1">
                    <textarea
                      ref={textareaRef}
                      placeholder="Start writing your notes..."
                      value={editorData.content}
                      onChange={(e) => setEditorData(prev => ({ ...prev, content: e.target.value }))}
                      className="w-full min-h-96 bg-transparent border-none outline-none resize-none text-gray-700 dark:text-gray-300 placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesPanel;