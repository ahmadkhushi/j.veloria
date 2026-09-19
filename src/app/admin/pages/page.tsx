'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Plus, Trash2, Eye, CheckCircle2, Globe, ExternalLink } from 'lucide-react';

interface CustomPageItem {
  id: number;
  title: string;
  slug: string;
  content: string;
  metaTitle: string | null;
  metaDescription: string | null;
  isPublished: boolean;
  showInHeader: boolean;
  showInFooter: boolean;
  sortOrder: number;
  createdAt: string;
}

export default function AdminPagesManager() {
  const [pages, setPages] = useState<CustomPageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Page Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [showInHeader, setShowInHeader] = useState(true);
  const [showInFooter, setShowInFooter] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchPages = async () => {
    try {
      const res = await fetch('/api/admin/pages');
      const data = await res.json();
      if (data.success) {
        setPages(data.pages);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg('');

    try {
      const res = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          content,
          metaTitle,
          metaDescription,
          showInHeader,
          showInFooter,
          isPublished: true,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMsg('Dynamic custom page created and published successfully!');
        setShowCreateModal(false);
        setTitle('');
        setSlug('');
        setContent('');
        setMetaTitle('');
        setMetaDescription('');
        fetchPages();
      } else {
        setMsg(data.error || 'Failed to create dynamic page.');
      }
    } catch (err) {
      setMsg('Error creating page.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePage = async (id: number) => {
    if (!confirm('Are you sure you want to delete this custom page?')) return;
    try {
      const res = await fetch(`/api/admin/pages?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchPages();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-slate-400 font-light">CMS & Navigation</span>
          <h1 className="text-3xl font-serif text-white uppercase tracking-wider flex items-center gap-3">
            <FileText className="w-7 h-7 text-white" /> Dynamic Page Manager
          </h1>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-white text-[#0A192F] font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-200 transition-colors w-fit"
        >
          <Plus className="w-4 h-4" /> Add Dynamic Page / Subpage
        </button>
      </div>

      {msg && (
        <div className="p-4 bg-white/10 border border-white/20 text-xs text-white flex items-center justify-between">
          <span>{msg}</span>
          <button onClick={() => setMsg('')} className="text-slate-400 hover:text-white uppercase">Dismiss</button>
        </div>
      )}

      {/* Pages List Table */}
      <div className="bg-[#0A192F] border border-white/10 p-6 space-y-4">
        <h2 className="font-serif text-base uppercase tracking-wider text-white font-bold border-b border-white/10 pb-3">
          Published Dynamic Custom Pages ({pages.length})
        </h2>

        {loading ? (
          <p className="text-xs text-slate-400">Loading dynamic pages...</p>
        ) : pages.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs space-y-2">
            <p>No custom dynamic pages created yet.</p>
            <p>Click "Add Dynamic Page" above to publish custom subpages or guides.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#020C1B] text-white uppercase tracking-wider font-serif">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Slug / URL</th>
                  <th className="p-3">Display Location</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {pages.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5">
                    <td className="p-3 font-semibold text-white font-serif">{p.title}</td>
                    <td className="p-3 font-mono text-slate-400">/pages/{p.slug}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        {p.showInHeader && (
                          <span className="px-2 py-0.5 bg-blue-950/60 text-blue-300 border border-blue-500/30 text-[10px] uppercase font-bold">
                            Header Nav
                          </span>
                        )}
                        {p.showInFooter && (
                          <span className="px-2 py-0.5 bg-slate-800 text-slate-300 border border-white/10 text-[10px] uppercase font-bold">
                            Footer Nav
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 text-[10px] uppercase font-bold">
                        Published
                      </span>
                    </td>
                    <td className="p-3 flex items-center gap-3">
                      <Link
                        href={`/pages/${p.slug}`}
                        target="_blank"
                        className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] uppercase"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> View Live
                      </Link>
                      <button
                        onClick={() => handleDeletePage(p.id)}
                        className="text-slate-400 hover:text-red-400 transition-colors"
                        title="Delete Page"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Dynamic Page Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0A192F] border border-white/20 p-6 md:p-8 max-w-2xl w-full text-white space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h3 className="font-serif text-lg font-bold uppercase tracking-wider">Add New Dynamic Custom Page</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white uppercase text-xs">
                Close
              </button>
            </div>

            <form onSubmit={handleCreatePage} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">Page Title (Required)</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!slug) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                    }
                  }}
                  placeholder="e.g., Atelier Heritage, Care & Maintenance Guide, VIP Fitting"
                  className="w-full bg-[#020C1B] border border-white/20 p-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">URL Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g., care-guide"
                  className="w-full bg-[#020C1B] border border-white/20 p-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                  HTML / Text Content (Supports HTML headers, paragraphs & tables)
                </label>
                <textarea
                  rows={8}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="<h2>Section Title</h2><p>Your custom luxury page content here...</p>"
                  className="w-full bg-[#020C1B] border border-white/20 p-3 text-xs text-white font-mono focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">SEO Title (Optional)</label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="w-full bg-[#020C1B] border border-white/20 p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">SEO Meta Description</label>
                  <input
                    type="text"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className="w-full bg-[#020C1B] border border-white/20 p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showInHeader}
                    onChange={(e) => setShowInHeader(e.target.checked)}
                    className="accent-white"
                  />
                  <span>Show Link in Top Navigation Header</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showInFooter}
                    onChange={(e) => setShowInFooter(e.target.checked)}
                    className="accent-white"
                  />
                  <span>Show Link in Footer</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-white text-[#0A192F] font-bold text-xs uppercase tracking-wider hover:bg-slate-200 transition-colors"
              >
                {submitting ? 'Creating Page...' : 'Publish Dynamic Page'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
