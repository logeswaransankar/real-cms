import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { BlogPost, PagedResponse } from '../types';
import { ArrowRight, User, Loader2 } from 'lucide-react';

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
    <div className="min-h-screen bg-[#faf9f6] text-[#1c1b1a] pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 pb-4 border-b border-[#e7e4dc]">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#997e55] font-semibold block mb-1">
            Market Intelligence
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#1c1b1a]">
            The Elysian Journal
          </h1>
          <p className="text-xs sm:text-sm text-[#6e6962] mt-2 max-w-xl font-light">
            Quarterly wealth intelligence, branded residence valuation forecasts, and architectural spotlights.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <Loader2 className="w-8 h-8 text-[#997e55] animate-spin" />
            <p className="text-xs uppercase tracking-widest text-[#8c8675]">Loading Journal...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogData.content.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="editorial-card group overflow-hidden border border-[#e7e4dc] bg-white flex flex-col"
              >
                <div className="aspect-[16/10] overflow-hidden bg-[#f5f4f0]">
                  <img
                    src={
                      post.featuredImage ||
                      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80'
                    }
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#997e55] font-semibold block mb-2">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'Editorial'}
                    </span>
                    <h3 className="font-serif text-lg font-medium text-[#1c1b1a] group-hover:text-[#997e55] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-[#6e6962] line-clamp-3 mt-2 leading-relaxed">
                      {post.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#f0ede6] flex items-center justify-between text-xs text-[#8c8675]">
                    <span className="flex items-center space-x-1.5">
                      <User className="w-3.5 h-3.5 text-[#997e55]" />
                      <span>{post.authorName || 'Editorial Advisory'}</span>
                    </span>
                    <span className="text-[#1c1b1a] font-semibold flex items-center space-x-1 group-hover:text-[#997e55]">
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
