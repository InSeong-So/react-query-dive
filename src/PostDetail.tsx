import { useQuery } from 'react-query';

async function fetchComments(postId: string) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
  return response.json();
}

async function deletePost(postId: string) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/postId/${postId}`, { method: 'DELETE' });
  return response.json();
}

async function updatePost(postId: string) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/postId/${postId}`, {
    method: 'PATCH',
    //@ts-ignore
    data: { title: 'REACT QUERY FOREVER!!!!' },
  });
  return response.json();
}

export function PostDetail({ post }: { post: { id: string; title: string; body: string } }) {
  // replace with useQuery
  const { data, isLoading, isError } = useQuery<{ id: string; email: string; body: string }[]>(
    ['comments', post.id],
    () => fetchComments(post.id),
  );

  if (data === undefined) return <></>;

  if (isError) return <h3>Something haven Wrong!</h3>;
  if (isLoading) return <h3>is Loading...</h3>;

  return (
    <>
      <h3 style={{ color: 'blue' }}>{post.title}</h3>
      <button>Delete</button> <button>Update title</button>
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map(comment => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
