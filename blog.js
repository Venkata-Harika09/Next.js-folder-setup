import React, { useState, useRef, useCallback } from 'react';
import { 
  Bold, Italic, Underline, Strikethrough, 
  Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Code2, Image, Link2,
  AlignLeft, AlignCenter, AlignRight,
  Eye, Save, Send, Type, Tag, Palette
} from 'lucide-react';

const WYSIWYGBlogEditor = () => {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [savedPosts, setSavedPosts] = useState([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const editorRef = useRef(null);

  const executeCommand = useCallback((command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }, []);

  const handleFormat = useCallback((command, value = null) => {
    executeCommand(command, value);
  }, [executeCommand]);

  const handleImageInsert = useCallback(() => {
    const url = prompt('Enter image URL:');
    if (url) {
      executeCommand('insertImage', url);
    }
  }, [executeCommand]);

  const handleLinkInsert = useCallback(() => {
    const url = prompt('Enter URL:');
    if (url) {
      const text = window.getSelection().toString() || url;
      executeCommand('createLink', url);
    }
  }, [executeCommand]);

  const handleTextColor = useCallback((color) => {
    executeCommand('foreColor', color);
    setShowColorPicker(false);
  }, [executeCommand]);

  const handleContentChange = useCallback(() => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  }, []);

  const handleSave = useCallback(() => {
    const post = {
      id: Date.now(),
      title,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      content,
      createdAt: new Date().toISOString(),
      status: 'saved'
    };
    setSavedPosts(prev => [post, ...prev]);
    alert('Post saved successfully!');
  }, [title, tags, content]);

  const handlePublish = useCallback(() => {
    const post = {
      id: Date.now(),
      title,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      content,
      createdAt: new Date().toISOString(),
      status: 'published'
    };
    setSavedPosts(prev => [post, ...prev]);
    alert('Post published successfully!');
  }, [title, tags, content]);

  const ToolbarButton = ({ onClick, children, title, className = "" }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded hover:bg-gray-200 transition-colors duration-200 border border-gray-300 bg-white min-w-8 h-8 flex items-center justify-center ${className}`}
    >
      {children}
    </button>
  );

  const ColorPicker = () => {
    const colors = [
      '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
      '#800000', '#008000', '#000080', '#808000', '#800080', '#008080', '#808080',
      '#FF8000', '#8000FF', '#FF0080', '#80FF00', '#0080FF', '#FF8080', '#80FF80',
      '#8080FF', '#FFFF80', '#FF80FF', '#80FFFF', '#FFB366', '#B366FF', '#66FFB3'
    ];

    if (!showColorPicker) return null;

    return (
      <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-50">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => handleTextColor(color)}
              className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
        <button
          onClick={() => setShowColorPicker(false)}
          className="w-full text-xs text-gray-500 hover:text-gray-700 py-1"
        >
          Close
        </button>
      </div>
    );
  };

  const formatButtons = [
    { command: 'bold', icon: <Bold size={16} />, title: 'Bold' },
    { command: 'italic', icon: <Italic size={16} />, title: 'Italic' },
    { command: 'underline', icon: <Underline size={16} />, title: 'Underline' },
    { command: 'strikeThrough', icon: <Strikethrough size={16} />, title: 'Strikethrough' },
  ];

  const headingButtons = [
    { command: 'formatBlock', value: 'h1', icon: <Heading1 size={16} />, title: 'Heading 1' },
    { command: 'formatBlock', value: 'h2', icon: <Heading2 size={16} />, title: 'Heading 2' },
    { command: 'formatBlock', value: 'h3', icon: <Heading3 size={16} />, title: 'Heading 3' },
  ];

  const listButtons = [
    { command: 'insertUnorderedList', icon: <List size={16} />, title: 'Bullet List' },
    { command: 'insertOrderedList', icon: <ListOrdered size={16} />, title: 'Numbered List' },
  ];

  const alignButtons = [
    { command: 'justifyLeft', icon: <AlignLeft size={16} />, title: 'Align Left' },
    { command: 'justifyCenter', icon: <AlignCenter size={16} />, title: 'Align Center' },
    { command: 'justifyRight', icon: <AlignRight size={16} />, title: 'Align Right' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Type size={32} />
          WYSIWYG Blog Editor
        </h1>
        <p className="text-gray-600">Create and publish your blog posts with rich formatting</p>
      </div>

      {/* Title Input */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Blog Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your blog title..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-medium"
        />
      </div>

      {/* Tags Input */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <Tag size={16} />
          Tags (comma-separated)
        </label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g. technology, programming, web development"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Editor Toolbar */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <div className="bg-gray-50 p-3 border-b border-gray-300">
          <div className="flex items-center gap-1 overflow-x-auto">
            {/* Text Formatting */}
            {formatButtons.map(({ command, icon, title }) => (
              <ToolbarButton
                key={command}
                onClick={() => handleFormat(command)}
                title={title}
              >
                {icon}
              </ToolbarButton>
            ))}

            <div className="w-px h-6 bg-gray-300 mx-1" />

            {/* Headings */}
            {headingButtons.map(({ command, value, icon, title }) => (
              <ToolbarButton
                key={value}
                onClick={() => handleFormat(command, value)}
                title={title}
              >
                {icon}
              </ToolbarButton>
            ))}

            <div className="w-px h-6 bg-gray-300 mx-1" />

            {/* Lists */}
            {listButtons.map(({ command, icon, title }) => (
              <ToolbarButton
                key={command}
                onClick={() => handleFormat(command)}
                title={title}
              >
                {icon}
              </ToolbarButton>
            ))}

            <div className="w-px h-6 bg-gray-300 mx-1" />

            {/* Text Color */}
            <div className="relative">
              <ToolbarButton
                onClick={() => setShowColorPicker(!showColorPicker)}
                title="Text Color"
              >
                <Palette size={16} />
              </ToolbarButton>
              <ColorPicker />
            </div>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            {/* Special Formatting */}
            <ToolbarButton
              onClick={() => handleFormat('formatBlock', 'blockquote')}
              title="Blockquote"
            >
              <Quote size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => handleFormat('formatBlock', 'pre')}
              title="Code Block"
            >
              <Code2 size={16} />
            </ToolbarButton>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            {/* Media & Links */}
            <ToolbarButton
              onClick={handleImageInsert}
              title="Insert Image"
            >
              <Image size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={handleLinkInsert}
              title="Insert Link"
            >
              <Link2 size={16} />
            </ToolbarButton>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            {/* Alignment */}
            {alignButtons.map(({ command, icon, title }) => (
              <ToolbarButton
                key={command}
                onClick={() => handleFormat(command)}
                title={title}
              >
                {icon}
              </ToolbarButton>
            ))}

            <div className="w-px h-6 bg-gray-300 mx-1" />

            {/* Preview Toggle */}
            <ToolbarButton
              onClick={() => setIsPreview(!isPreview)}
              title={isPreview ? "Edit Mode" : "Preview Mode"}
            >
              <Eye size={16} />
            </ToolbarButton>
          </div>
        </div>

        {/* Editor Content */}
        <div className="bg-white">
          {!isPreview ? (
            <div
              ref={editorRef}
              contentEditable
              onInput={handleContentChange}
              className="min-h-96 p-6 focus:outline-none"
              style={{
                lineHeight: '1.6',
                fontSize: '16px',
              }}
              suppressContentEditableWarning={true}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <div className="min-h-96 p-6 prose max-w-none">
              <h1 className="text-2xl font-bold mb-4">{title || 'Untitled Post'}</h1>
              {tags && (
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {tags.split(',').map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: content || '<p>Start writing your content...</p>' }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-4 justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2 font-medium"
        >
          <Save size={20} />
          Save Draft
        </button>
        <button
          onClick={handlePublish}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 font-medium"
        >
          <Send size={20} />
          Publish Post
        </button>
      </div>

      {/* Saved Posts */}
      {savedPosts.length > 0 && (
        <div className="mt-12 border-t pt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Posts</h2>
          <div className="grid gap-4">
            {savedPosts.slice(0, 3).map((post) => (
              <div key={post.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{post.title || 'Untitled'}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    post.status === 'published' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {post.status}
                  </span>
                </div>
                {post.tags.length > 0 && (
                  <div className="flex gap-1 mb-2">
                    {post.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WYSIWYGBlogEditor;