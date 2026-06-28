"use client";

import { useState } from "react";

type Post = {
  id: string;
  content: string;
  createdAt: string;
  profile: { fullName: string | null; email: string };
};

export default function CommunityDetail({
  communityId,
  initialJoined,
  initialPosts,
  memberCount,
}: {
  communityId: string;
  initialJoined: boolean;
  initialPosts: Post[];
  memberCount: number;
}) {
  const [joined, setJoined] = useState(initialJoined);
  const [count, setCount] = useState(memberCount);
  const [posts, setPosts] = useState(initialPosts);
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  async function toggleJoin() {
    const method = joined ? "DELETE" : "POST";
    const res = await fetch(`/api/community/${communityId}/membership`, { method });
    if (res.ok) {
      setJoined(!joined);
      setCount((c) => (joined ? c - 1 : c + 1));
    }
  }

  async function submitPost(e: React.FormEvent) {
    e.preventDefault();
    const text = content.trim();
    if (!text) return;

    setPosting(true);
    setError("");

    const res = await fetch(`/api/community/${communityId}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text }),
    });
    const data = await res.json();
    setPosting(false);

    if (!res.ok) {
      setError(data.error ?? "Couldn't post. Please try again.");
      return;
    }

    setPosts((p) => [data.post, ...p]);
    setContent("");
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{count} members</p>
        <button
          onClick={toggleJoin}
          className={`text-sm font-semibold px-4 py-2 rounded-lg ${
            joined ? "border border-border-light text-teal" : "bg-teal text-cream"
          }`}
        >
          {joined ? "Joined ✓" : "Join community"}
        </button>
      </div>

      {joined ? (
        <form onSubmit={submitPost} className="flex gap-2 mt-6">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share something with the community..."
            className="flex-1 text-sm border border-border-light rounded-lg px-3 py-2 text-teal"
          />
          <button
            type="submit"
            disabled={posting}
            className="text-sm font-semibold bg-teal text-cream px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Post
          </button>
        </form>
      ) : (
        <p className="text-xs text-muted mt-6">Join this community to post and discuss.</p>
      )}
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}

      <div className="flex flex-col gap-3 mt-6">
        {posts.map((post) => (
          <div key={post.id} className="rounded-xl border border-border-light bg-white p-4">
            <p className="text-xs font-semibold text-teal">
              {post.profile.fullName ?? post.profile.email}
            </p>
            <p className="text-sm text-muted mt-1">{post.content}</p>
          </div>
        ))}
        {posts.length === 0 && (
          <p className="text-sm text-muted text-center py-12">
            No posts yet. Be the first to say something.
          </p>
        )}
      </div>
    </div>
  );
}
