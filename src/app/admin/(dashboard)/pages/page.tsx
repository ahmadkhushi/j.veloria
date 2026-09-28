'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Plus, Trash2, ExternalLink } from 'lucide-react';

interface PageItem {
  id: number;
  title: string;
  slug: string;
  content: string;
  showInHeader: boolean;
  showInFooter: boolean;
  isPublished: boolean;
}

export default function AdminPagesPage() {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [showInHeader, setShowInHeader] = useState(true);
  const [showInFooter, setShowInFooter] = useState(true);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/pages');
      const data = await res.json();
      if (data.pages) {
        setPages(data.pages);
      }
    } catch (err) {
      console.error('Error fetching dynamic pages:', err);
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
        }),
      });

      if (res.ok) {
        setShowModal(false);
        setTitle('');
        setSlug('');
        setContent('');
        setMetaTitle('');
        setMetaDescription('');
        fetchPages();
      } else {
        alert('Failed to create page.');
      }
    } catch (err) {
      console.error('Error creating page:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePage = async (id: number) => {
    if (!confirm('Are you sure you want to delete this page?')) return;
    try {
      const res = await fetch(`/api/admin/pages?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPages((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error('Error deleting page:', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-7 h-7 text-pink-400" />
            <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-wide uppercase text-white">
              Dynamic CMS Pages Manager
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Create custom subpages and policy guides dynamically linked to storefront navigation.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-white text-[#0A192F] font-bold text-xs uppercase tracking-wider hover:bg-amber-300 transition-colors shadow-lg"
        >
          <Plus className="w-4 h-4" /> Add Dynamic Page
        </button>
      </div>

      {/* Pages Table */}
      <div className="bg-[#0A192F] border border-white/10 rounded-lg overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading pages...</div>
        ) : pages.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No dynamic pages created yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#020C1B] text-slate-400 font-semibold uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Slug / URL</th>
                  <th className="py-3 px-4">Display Locations</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {pages.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white font-serif">{p.title}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">/pages/{p.slug}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex gap-2">
                        {p.showInHeader && (
                          <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px] font-bold uppercase rounded">
                            Header Nav
                          </span>
                        )}
                        {p.showInFooter && (
                          <span className="px-2 py-0.5 bg-slate-500/10 text-slate-300 border border-slate-500/30 text-[10px] font-bold uppercase rounded">
                            Footer Nav
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase rounded">
                        Published
                      </span>
                    </td>
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <Link
                        href={`/pages/${p.slug}`}
                        target="_blank"
                        className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] uppercase font-semibold"
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0A192F] border border-white/20 p-6 md:p-8 max-w-2xl w-full text-white space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h3 className="font-serif text-lg font-bold uppercase tracking-wider">
                Add New Dynamic Custom Page
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white uppercase text-xs"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreatePage} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                  Page Title (Required)
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!slug) {
                      setSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/(^-|-$)+/g, '')
                      );
                    }
                  }}
                  placeholder="e.g., Bespoke Tailoring Guide, Atelier History, Shipping FAQ"
                  className="w-full bg-[#020C1B] border border-white/20 p-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g., bespoke-guide"
                  className="w-full bg-[#020C1B] border border-white/20 p-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                  Page Content (HTML / Text Supported)
                </label>
                <textarea
                  rows={8}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="<h2>Guide Overview</h2><p>Describe your custom page details here...</p>"
                  className="w-full bg-[#020C1B] border border-white/20 p-3 text-xs text-white font-mono focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-6 text-xs pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showInHeader}
                    onChange={(e) => setShowInHeader(e.target.checked)}
                    className="accent-white"
                  />
                  <span>Show Link in Navigation Header</span>
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
                className="w-full py-3 bg-white text-[#0A192F] font-bold text-xs uppercase tracking-wider hover:bg-amber-300 transition-colors"
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
