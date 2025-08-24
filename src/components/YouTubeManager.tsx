import React, { useState } from 'react';
import { useStudyData } from '../contexts/StudyDataContext';
import { Plus, Play, ExternalLink, Trash2, Edit3, Search } from 'lucide-react';

const YouTubeManager: React.FC = () => {
  const { youtubePlaylists, addYouTubePlaylist, updateYouTubePlaylist, deleteYouTubePlaylist } = useStudyData();
  const [showForm, setShowForm] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    category: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Extract playlist ID from YouTube URL
    const playlistId = extractPlaylistId(formData.url);
    if (!playlistId && !isYouTubeUrl(formData.url)) {
      alert('Please enter a valid YouTube playlist URL');
      return;
    }

    if (editingPlaylist) {
      updateYouTubePlaylist(editingPlaylist, formData);
    } else {
      addYouTubePlaylist(formData);
    }

    setFormData({ title: '', url: '', description: '', category: '' });
    setShowForm(false);
    setEditingPlaylist(null);
  };

  const handleEdit = (playlist: any) => {
    setFormData({
      title: playlist.title,
      url: playlist.url,
      description: playlist.description,
      category: playlist.category
    });
    setEditingPlaylist(playlist.id);
    setShowForm(true);
  };

  const extractPlaylistId = (url: string) => {
    const match = url.match(/[?&]list=([^#&?]*)/);
    return match ? match[1] : null;
  };

  const isYouTubeUrl = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const getEmbedUrl = (url: string) => {
    const playlistId = extractPlaylistId(url);
    if (playlistId) {
      return `https://www.youtube.com/embed/videoseries?list=${playlistId}&rel=0&modestbranding=1&iv_load_policy=3`;
    }
    return url;
  };

  const getFocusedUrl = (url: string) => {
    const playlistId = extractPlaylistId(url);
    if (playlistId) {
      // Create a focused URL that opens playlist in theater mode with minimal distractions
      return `https://www.youtube.com/playlist?list=${playlistId}&feature=share`;
    }
    return url;
  };

  const categories = Array.from(new Set(youtubePlaylists.map(p => p.category).filter(Boolean)));

  const filteredPlaylists = youtubePlaylists
    .filter(playlist => 
      playlist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      playlist.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(playlist => selectedCategory === 'all' || playlist.category === selectedCategory);

  const openFocusedPlaylist = (url: string) => {
    const focusedUrl = getFocusedUrl(url);
    window.open(focusedUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Play className="w-8 h-8 text-red-600" />
              YouTube Manager
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Organize study playlists and watch in distraction-free mode
            </p>
          </div>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingPlaylist(null);
              setFormData({ title: '', url: '', description: '', category: '' });
            }}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Playlist
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search playlists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md max-h-96 overflow-y-auto">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {editingPlaylist ? 'Edit Playlist' : 'Add New Playlist'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Math Fundamentals"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    YouTube URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.url}
                    onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://youtube.com/playlist?list=..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    placeholder="Brief description of the playlist content"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g. Mathematics, Science, Language"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    {editingPlaylist ? 'Update' : 'Add Playlist'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingPlaylist(null);
                    }}
                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Playlists Grid */}
        {filteredPlaylists.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
              No playlists found
            </h3>
            <p className="text-gray-400 dark:text-gray-500">
              {searchTerm ? 'Try adjusting your search' : 'Add your first study playlist to get started'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaylists.map(playlist => (
              <div
                key={playlist.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden"
              >
                {/* Playlist Preview */}
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 relative">
                  {extractPlaylistId(playlist.url) ? (
                    <iframe
                      src={getEmbedUrl(playlist.url)}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    ></iframe>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                    <button
                      onClick={() => openFocusedPlaylist(playlist.url)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open Focused
                    </button>
                  </div>
                </div>

                {/* Playlist Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                      {playlist.title}
                    </h3>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(playlist)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteYouTubePlaylist(playlist.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {playlist.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                      {playlist.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    {playlist.category && (
                      <span className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-xs rounded-full">
                        {playlist.category}
                      </span>
                    )}
                    <button
                      onClick={() => openFocusedPlaylist(playlist.url)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Watch
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Focus Mode Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
            🎯 Distraction-Free Viewing
          </h3>
          <p className="text-blue-700 dark:text-blue-300 text-sm">
            Playlists open in a focused mode with minimal YouTube distractions. For even better focus, 
            consider using browser extensions that block comments, recommendations, and other distracting elements.
          </p>
        </div>
      </div>
    </div>
  );
};

export default YouTubeManager;