import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import type { BlogPost } from '../types';
import { ArrowLeft, User, Eye, Loader2 } from 'lucide-react';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    api.public
      .getArticleBySlug(slug)
      .then(setPost)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center space-y-3 pt-24">
        <Loader2 className="w-8 h-8 text-[#997e55] animate-spin" />
        <p className="text-xs uppercase tracking-widest text-[#8c8675]">Loading Article...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center pt-24 px-4 text-center">
        <h2 className="font-serif text-2xl text-[#1c1b1a] mb-2">Article Not Found</h2>
        <Link to="/blog" className="px-6 py-2.5 bg-[#1c1b1a] text-white text-xs font-semibold uppercase">
          Back to Journal
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#1c1b1a] pt-28 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          to="/blog"
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-wider text-[#8c8675] hover:text-[#1c1b1a] transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Journal</span>
        </Link>

        {/* Article Header */}
        <div className="space-y-4 pb-6 border-b border-[#e7e4dc]">
          <span className="text-[11px] uppercase tracking-widest text-[#997e55] font-semibold block">
            {post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Market Report'}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1c1b1a] leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center space-x-4 pt-2 text-xs text-[#8c8675]">
            <span className="flex items-center space-x-2">
              {post.authorAvatar && (
                <img
                  src={post.authorAvatar}
                  alt={post.authorName}
                  className="w-6 h-6 rounded-full object-cover"
                />
              )}
              <span className="text-[#1c1b1a] font-medium">{post.authorName || 'Editorial Advisory'}</span>
            </span>
            {post.viewsCount && (
              <span className="flex items-center space-x-1">
                <Eye className="w-3.5 h-3.5 text-[#997e55]" />
                <span>{post.viewsCount} readers</span>
              </span>
            )}
          </div>
        </div>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="aspect-[16/9] overflow-hidden border border-[#e7e4dc] bg-[#f5f4f0]">
            <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Article Body */}
        <div
          className="prose max-w-none text-[#4a4742] text-sm sm:text-base leading-relaxed space-y-4 font-light"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </div>
  );
};
