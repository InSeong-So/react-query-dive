import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { PostDetail } from './PostDetail';

const maxPostPage = 10;

async function fetchPosts(pageNum: number) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}`);
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState<{ id: string; title: string; body: string }>();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (currentPage >= maxPostPage) return;
    const nextPage = currentPage + 1;
    queryClient.prefetchQuery(['posts', nextPage], () => fetchPosts(nextPage));
  }, [currentPage, queryClient]);

  // replace with useQuery
  const { data, isError, isFetching } = useQuery<
    { userId: string; id: string; title: string; name: string; body: string }[]
  >(['posts', currentPage], () => fetchPosts(currentPage), { staleTime: 2000, keepPreviousData: true });

  if (isFetching) return <h3>Fetching in Progress...</h3>;
  if (isError) return <h3>Oops, something went wrong</h3>;

  if (data === undefined) return <></>;

  return (
    <>
      <ul>
        {data.map(post => (
          <li key={post.id} className="post-title" onClick={() => setSelectedPost(post)}>
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button
          disabled={currentPage <= 1}
          onClick={() => {
            setCurrentPage(previousValue => previousValue - 1);
          }}
        >
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={maxPostPage <= currentPage}
          onClick={() => {
            setCurrentPage(previousValue => previousValue + 1);
          }}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
