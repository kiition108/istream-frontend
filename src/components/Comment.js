'use client';

import { useEffect, useState } from 'react';
import { videoService } from '@/api';
import { toast } from 'react-toastify';
import { ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import Image from 'next/image';

export default function VideoComment({ videoId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const fetchComments = async () => {
    if (!videoId) return;
    try {
      setLoading(true);
      const data = await videoService.getComments(videoId);
      setComments(data.data || []);
    } catch (error) {
      // Silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  const handleSubmit = async () => {
    if (!text.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    try {
      const data = await videoService.addComment(videoId, text);
      setComments((prev) => [data.data, ...prev]);
      setText('');
      toast.success(data.message || "Comment posted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post comment");
    }
  };

  const formatTimeAgo = (date) => {
    if (!date) return '';
    const now = new Date();
    const commentDate = new Date(date);
    const diffTime = Math.abs(now - commentDate);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffMinutes < 1) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
    if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
    return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="mt-6">
      {/* Comments Header - Collapsible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full mb-4 group"
      >
        <div className="flex items-center gap-3">
          <MessageSquare size={24} className="text-gray-400" />
          <h3 className="text-xl font-bold">
            {comments?.length || 0} {comments?.length === 1 ? 'Comment' : 'Comments'}
          </h3>
        </div>
        <div className="text-gray-400 group-hover:text-white transition-colors">
          {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </div>
      </button>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="space-y-6">
          {/* Add Comment Form */}
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-600 flex-shrink-0 flex items-center justify-center text-white font-semibold">
              U
            </div>
            <div className="flex-1">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Add a comment..."
                className="w-full border-b bg-transparent border-gray-600 focus:border-blue-500 outline-none transition-colors resize-none py-2 px-1 text-white placeholder-gray-500"
                rows={1}
                onFocus={(e) => e.target.rows = 3}
                onBlur={(e) => !text && (e.target.rows = 1)}
              />
              {text && (
                <div className="flex justify-end gap-2 mt-3">
                  <button
                    onClick={() => setText('')}
                    className="px-4 py-2 rounded-full text-sm font-medium hover:bg-secondary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                  >
                    Comment
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Comments List */}
          {loading && comments.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {comments && comments.length > 0 ? (
                comments.map((comment, idx) => (
                  <div key={comment._id || idx} className="flex gap-3 group">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-700">
                      {comment?.user?.avatar ? (
                        <Image
                          src={comment.user.avatar}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                          alt={comment?.user?.username || 'User'}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-semibold">
                          {comment?.user?.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>

                    {/* Comment Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-semibold text-sm text-white">
                          {comment?.user?.username || 'Unknown User'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(comment?.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 break-words whitespace-pre-wrap">
                        {comment?.text}
                      </p>

                      {/* Comment Actions */}
                      <div className="flex items-center gap-4 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-xs text-gray-400 hover:text-white transition-colors">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare size={48} className="mx-auto mb-3 opacity-50" />
                  <p>No comments yet. Be the first to comment!</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
