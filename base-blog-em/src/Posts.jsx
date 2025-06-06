import { useState, useEffect } from 'react';
import { fetchPosts, deletePost, updatePost } from './api';
import { PostDetail } from './PostDetail';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const maxPostPage = 10;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (postId) => updatePost(postId),
  });
  const deleteMutation = useMutation({
    mutationFn: (postId) => deletePost(postId),
  });

  useEffect(() => {
    if (currentPage >= maxPostPage) return;

    const nextPage = currentPage + 1;
    queryClient.prefetchQuery({
      queryKey: ['posts', nextPage],
      queryFn: () => fetchPosts(nextPage),
    });
  }, [currentPage, queryClient]);

  const { data, error, isLoading, isFetching, isError } = useQuery({
    queryKey: ['posts', currentPage],
    queryFn: () => fetchPosts(currentPage),
    staleTime: 5000,
  });

  if (isLoading) return <h3>Loading...</h3>;
  if (isFetching) return <h3>Fetching...</h3>;
  if (isError)
    return (
      <h3>
        Oops, something went wrong <br />
        <p>{error.toString()}</p>
      </h3>
    );

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => {
              updateMutation.reset();
              deleteMutation.reset();
              setSelectedPost(post);
            }}
          >
            {post.title}
          </li>
        ))}
      </ul>

      <div className="pages">
        <button
          disabled={currentPage <= 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage >= maxPostPage}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next page
        </button>
      </div>
      <hr />

      {selectedPost && (
        <PostDetail
          post={selectedPost}
          updateMutation={updateMutation}
          deleteMutation={deleteMutation}
        />
      )}
    </>
  );
}
