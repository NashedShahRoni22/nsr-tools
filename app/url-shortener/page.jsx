"use client";
import React, { useState, useEffect } from 'react';
import { Link2, Copy, Check, Trash2, ExternalLink, BarChart3, Calendar, Eye } from 'lucide-react';

export default function URLShortener() {
  const [urls, setUrls] = useState([]);
  const [longUrl, setLongUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const baseUrl = window.location.origin + '/';

  // Load URLs from localStorage on mount
  useEffect(() => {
    const savedUrls = localStorage.getItem('shortenedUrls');
    if (savedUrls) {
      setUrls(JSON.parse(savedUrls));
    }
  }, []);

  // Save URLs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('shortenedUrls', JSON.stringify(urls));
  }, [urls]);

  const generateShortCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const shortenUrl = () => {
    if (!longUrl.trim()) {
      alert('Please enter a URL');
      return;
    }

    if (!isValidUrl(longUrl)) {
      alert('Please enter a valid URL (including http:// or https://)');
      return;
    }

    let shortCode = customAlias.trim() || generateShortCode();
    
    // Check if alias already exists
    if (urls.some(url => url.shortCode === shortCode)) {
      alert('This custom alias is already taken. Please choose another one.');
      return;
    }

    const newUrl = {
      id: Date.now(),
      longUrl: longUrl,
      shortCode: shortCode,
      shortUrl: baseUrl + shortCode,
      clicks: 0,
      createdAt: new Date().toISOString(),
    };

    setUrls([newUrl, ...urls]);
    setLongUrl('');
    setCustomAlias('');
  };

  const deleteUrl = (id) => {
    setUrls(urls.filter(url => url.id !== id));
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const incrementClicks = (id) => {
    setUrls(urls.map(url =>
      url.id === id ? { ...url, clicks: url.clicks + 1 } : url
    ));
  };

  const filteredUrls = urls.filter(url =>
    url.longUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
    url.shortCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Link2 size={40} className="text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">URL Shortener</h1>
          </div>
          <p className="text-gray-600">Create short, memorable links in seconds</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="text-2xl font-bold text-blue-600">{urls.length}</div>
            <div className="text-sm text-gray-600">Short Links</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="text-2xl font-bold text-green-600">{totalClicks}</div>
            <div className="text-sm text-gray-600">Total Clicks</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center col-span-2 md:col-span-1">
            <div className="text-2xl font-bold text-purple-600">
              {urls.length > 0 ? Math.round(totalClicks / urls.length) : 0}
            </div>
            <div className="text-sm text-gray-600">Avg Clicks/Link</div>
          </div>
        </div>

        {/* URL Shortener Form */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Shorten a Long URL</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Long URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && shortenUrl()}
                placeholder="https://example.com/very/long/url/that/needs/shortening"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Custom Alias (Optional)
              </label>
              <div className="flex gap-2">
                <span className="flex items-center px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 font-mono text-sm">
                  {baseUrl}
                </span>
                <input
                  type="text"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                  placeholder="my-custom-link"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  maxLength={20}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Leave empty for auto-generated code. Only letters, numbers, hyphens, and underscores allowed.
              </p>
            </div>
            <button
              onClick={shortenUrl}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <Link2 size={20} />
              Shorten URL
            </button>
          </div>
        </div>

        {/* Search */}
        {urls.length > 0 && (
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your links..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {/* URLs List */}
        <div className="space-y-4">
          {filteredUrls.length === 0 ? (
            <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="text-6xl mb-4">🔗</div>
              <p className="text-gray-500 text-lg">
                {urls.length === 0 ? 'No shortened URLs yet' : 'No links found'}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {urls.length === 0
                  ? 'Create your first short link above'
                  : 'Try a different search term'}
              </p>
            </div>
          ) : (
            filteredUrls.map((url) => (
              <div
                key={url.id}
                className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Short URL */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <Link2 size={20} className="text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <a
                            href={url.longUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => incrementClicks(url.id)}
                            className="font-mono text-lg font-semibold text-blue-600 hover:text-blue-700 hover:underline break-all"
                          >
                            {url.shortUrl}
                          </a>
                          <button
                            onClick={() => copyToClipboard(url.shortUrl, url.id)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Copy to clipboard"
                          >
                            {copiedId === url.id ? (
                              <Check size={18} className="text-green-600" />
                            ) : (
                              <Copy size={18} className="text-gray-500" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Long URL */}
                    <div className="bg-gray-50 p-3 rounded-lg mb-3">
                      <div className="flex items-start gap-2">
                        <ExternalLink size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                        <a
                          href={url.longUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-600 hover:text-blue-600 break-all"
                        >
                          {url.longUrl}
                        </a>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye size={14} />
                        <span>{url.clicks} clicks</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>
                          Created {new Date(url.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex md:flex-col gap-2">
                    <button
                      onClick={() => deleteUrl(url.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Info Card */}
        {urls.length > 0 && (
          <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">💡 Pro Tips</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Click on the short link to test it (counts as a click)</li>
              <li>• Use custom aliases for branded, memorable links</li>
              <li>• All links are stored locally in your browser</li>
              <li>• Click the copy icon to quickly share your short links</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}