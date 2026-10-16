import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { BlogPost, PagedResponse } from '../types';
import { ArrowRight, Calendar, User, Loader2 } from 'lucide-react';

export const BlogPage: React.FC = () => {
  const [blogData, setBlogData] = useState<PagedResponse<BlogPost>>({
    content: [],
    page: 0,
    size: 6,
    totalElements: 0,
    totalPages: 0,
    last: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.public
      .getArticles()
      .then(setBlogData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-champagne-400 font-semibold block mb-2">
            The Elysian Journal
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium text-white">
            Market Intelligence & Architecture
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-xl font-light">
            Quarterly wealth intelligence, branded residence valuation forecasts, and architectural spotlights.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-champagne-400 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogData.content.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group glass-panel rounded-2xl overflow-hidden hover:border-champagne-400/40 transition flex flex-col shadow-luxury"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={post.featuredImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80'}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-champagne-400 font-semibold block mb-2">
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Editorial'}
                    </span>
                    <h3 className="font-serif text-lg font-medium text-white group-hover:text-champagne-300 transition line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-3 mt-2 leading-relaxed">
                      {post.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center space-x-1.5">
                      <User className="w-3.5 h-3.5 text-champagne-400" />
                      <span>{post.authorName || 'Editorial Team'}</span>
                    </span>
                    <span className="text-champagne-300 font-semibold flex items-center space-x-1">
                      <span>Read</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
