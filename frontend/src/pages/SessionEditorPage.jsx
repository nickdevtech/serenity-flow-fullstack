import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Save, 
  Send, 
  ArrowLeft, 
  Plus, 
  X,
  Clock,
  Image as ImageIcon,
  FileJson,
  Check
} from 'lucide-react';

const SessionEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [session, setSession] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [],
    json_file_url: '',
    duration: '',
    difficulty: 'beginner',
    category: '',
    image_url: '',
    status: 'draft'
  });
  
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const autoSaveTimeoutRef = useRef(null);

  const categories = [
    { value: 'yoga', label: 'Yoga' },
    { value: 'meditation', label: 'Meditation' },
    { value: 'breathwork', label: 'Breathwork' },
    { value: 'mindfulness', label: 'Mindfulness' },
    { value: 'movement', label: 'Movement' },
    { value: 'relaxation', label: 'Relaxation' }
  ];

  const difficulties = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  useEffect(() => {
    if (id) {
      loadSession();
    }
  }, [id]);

  useEffect(() => {
    if (hasUnsavedChanges && formData.title.trim()) {
      clearTimeout(autoSaveTimeoutRef.current);
      autoSaveTimeoutRef.current = setTimeout(handleAutoSave, 5000);
    }
    return () => clearTimeout(autoSaveTimeoutRef.current);
  }, [formData, hasUnsavedChanges]);

  const loadSession = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/sessions/my-sessions/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSession(data);
        setFormData(data);
      } else {
        alert("Session not found or you don't have permission to edit it.");
        navigate('/my-studio');
      }
    } catch (error) {
      console.error('Error loading session:', error);
      navigate('/my-studio');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      handleInputChange('tags', [...formData.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = async (status) => {
    if (!formData.title.trim()) {
      alert('Please enter a session title');
      return false;
    }
    if (status === 'published' && !formData.category) {
      alert('Please select a category to publish.');
      return false;
    }

    setIsLoading(true);
    const payload = { ...formData, status };
    
    try {
      const token = localStorage.getItem('token');
      const endpoint = status === 'draft' ? 'save-draft' : 'publish';
      const response = await fetch(`/api/sessions/my-sessions/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        setSession(result);
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
        setIsLoading(false);
        return true;
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      alert(`Failed to ${status === 'draft' ? 'save' : 'publish'}.`);
      console.error(`Error during save/publish:`, error);
      setIsLoading(false);
      return false;
    }
  };

  const handleAutoSave = async () => {
    await handleSave('draft');
  };

  const handleSaveDraft = async () => {
    const success = await handleSave('draft');
    if (success) {
      navigate('/my-studio');
    }
  };

  const handlePublish = async () => {
    const success = await handleSave('published');
    if (success) {
      navigate('/my-studio');
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/my-studio">
              <button className="w-10 h-10 rounded-xl border border-sage-200 hover:bg-sage-50 flex items-center justify-center transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-sage-900">{session ? 'Edit Session' : 'Create Session'}</h1>
              <p className="text-sage-600">Design a transformative wellness experience</p>
            </div>
          </div>
          
          {lastSaved && (
            <div className="flex items-center gap-2 text-sm text-sage-600">
              <Check className="w-4 h-4" />
              <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-sage-200">
          <div className="p-8 space-y-8">
            {/* Title and Duration */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sage-800 font-medium">
                  Session Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Morning Sun Salutation"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 border border-sage-200 focus:border-sage-400 rounded-xl outline-none"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sage-800 font-medium">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  placeholder="30"
                  value={formData.duration || ''}
                  onChange={(e) => handleInputChange('duration', e.target.value ? parseInt(e.target.value) : '')}
                  className="w-full px-4 py-3 border border-sage-200 focus:border-sage-400 rounded-xl outline-none"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sage-800 font-medium">
                Description
              </label>
              <textarea
                placeholder="Describe your session, its benefits, and what participants can expect..."
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-4 py-3 border border-sage-200 focus:border-sage-400 rounded-xl outline-none resize-none h-32"
              />
            </div>

            {/* Category and Difficulty */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sage-800 font-medium">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-3 border border-sage-200 focus:border-sage-400 rounded-xl outline-none"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sage-800 font-medium">Difficulty Level</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => handleInputChange('difficulty', e.target.value)}
                  className="w-full px-4 py-3 border border-sage-200 focus:border-sage-400 rounded-xl outline-none"
                >
                  {difficulties.map((difficulty) => (
                    <option key={difficulty.value} value={difficulty.value}>
                      {difficulty.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-4">
              <label className="block text-sage-800 font-medium">Tags</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a tag and press Enter"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 px-4 py-2 border border-sage-200 focus:border-sage-400 rounded-xl outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-sage-100 hover:bg-sage-200 text-sage-800 rounded-xl transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      onClick={() => handleRemoveTag(tag)}
                      className="bg-sage-100 text-sage-800 px-3 py-1 rounded-lg text-sm cursor-pointer hover:bg-sage-200 transition-colors flex items-center gap-1"
                    >
                      {tag}
                      <X className="w-3 h-3" />
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* URLs */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className=" text-sage-800 font-medium flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Cover Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image_url || ''}
                  onChange={(e) => handleInputChange('image_url', e.target.value)}
                  className="w-full px-4 py-3 border border-sage-200 focus:border-sage-400 rounded-xl outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className=" text-sage-800 font-medium flex items-center gap-2">
                  <FileJson className="w-4 h-4" />
                  JSON Configuration URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/session-config.json"
                  value={formData.json_file_url || ''}
                  onChange={(e) => handleInputChange('json_file_url', e.target.value)}
                  className="w-full px-4 py-3 border border-sage-200 focus:border-sage-400 rounded-xl outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={handleSaveDraft}
            disabled={isLoading}
            className="px-6 py-3 bg-gray-200 border border-sage-300 text-sage-700 hover:bg-sage-50 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </button>
          <button
            onClick={handlePublish}
            disabled={isLoading}
            className="px-6 py-3 bg-green-700 hover:text-red-500 bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 text-white rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4 " />
            Publish Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionEditorPage;
