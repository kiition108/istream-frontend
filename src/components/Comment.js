import { useEffect, useState } from 'react';
import { videoService } from '@/api';
import { toast } from 'react-toastify';

export default function VideoComment({ videoId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');

  const fetchComments = async () => {
    if (!videoId) return;
    try {
      const data = await videoService.getComments(videoId);
      setComments(data.data || []);
    } catch (error) {
      console.error("Failed to fetch comments", error);
      // toast.error("Failed to load comments"); // Optional, might be annoying on load
    }
  };

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    try {
      const data = await videoService.addComment(videoId, text);
      // Add new comment to list
      setComments((prev) => [data.data, ...prev]);
      setText('');
      toast.success(data.message || "Comment posted successfully");
    } catch (error) {
      console.error("Failed to post comment", error);
      toast.error(error.response?.data?.message || "Failed to post comment");
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-4">{comments?.length || 0} Comments</h3>

      <div className="mb-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
          className="w-full border rounded p-2 bg-transparent border-gray-600 focus:border-blue-500 outline-none transition-colors"
          rows={3}
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Comment
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {comments && comments.map((comment, idx) => (
          <div key={comment._id || idx} className="flex gap-4">
            {/* Safe check for user avatar */}
            <img
              src={comment?.user?.avatar || '/default-avatar.png'}
              className="w-10 h-10 rounded-full object-cover"
              alt="User pointer"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{comment?.user?.username || 'Unknown User'}</span>
                <span className="text-xs text-gray-500">
                  {/* Date formatting could go here */}
                </span>
              </div>
              <p className="text-sm mt-1">{comment?.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
