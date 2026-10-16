import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import type { BlogPost } from '../types';
import { ArrowLeft, Calendar, User, Eye, Loader2 } from 'lucide-react';

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
      <div className="min-h-screen bg-obsidian-950 flex items-center justify-center pt-20">
        <Loader2 className="w-8 h-8 text-champagne-400 animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-obsidian-950 flex flex-col items-center justify-center pt-20 px-4 text-center">
        <h2 className="font-serif text-2xl text-white mb-2">Article Not Found</h2>
        <Link to="/blog" className="px-6 py-2.5 rounded-full bg-champagne-400 text-obsidian-900 text-xs font-semibold uppercase">
          Back to Journal
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          to="/blog"
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-wider text-champagne-300 hover:text-white transition font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Journal</span>
        </Link>

        {/* Article Header */}
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-widest text-champagne-400 font-semibold block">
            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Market Report'}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium text-white leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center space-x-4 pt-2 text-xs text-slate-400 border-t border-white/5">
            <span className="flex items-center space-x-2">
              {post.authorAvatar && (
                <img src={post.authorAvatar} alt={post.authorName} className="w-6 h-6 rounded-full object-cover" />
              )}
              <span className="text-slate-200 font-medium">{post.authorName}</span>
            </span>
            {post.viewsCount && (
              <span className="flex items-center space-x-1">
                <Eye className="w-3.5 h-3.5 text-champagne-400" />
                <span>{post.viewsCount} readers</span>
              </span>
            )}
          </div>
        </div>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 shadow-luxury">
            <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Article Body */}
        <div
          className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </div>
  );
};
