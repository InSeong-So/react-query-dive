import { useQuery, useMutation } from 'react-query';

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

  // 인수 제공 가능
  const deleteMutation = useMutation((postId: string) => deletePost(postId));

  const updateMutation = useMutation(() => updatePost(post.id));

  if (data === undefined) return <></>;

  if (isError) return <h3>Something haven Wrong!</h3>;
  if (isLoading) return <h3>is Loading...</h3>;

  return (
    <>
      <h3 style={{ color: 'blue' }}>{post.title}</h3>
      <button onClick={() => deleteMutation.mutate(post.id)}>Delete</button>
      {deleteMutation.isError && <p style={{ color: 'red' }}>Error deleteing the post</p>}
      {deleteMutation.isLoading && <p style={{ color: 'purple' }}>Deleting the post</p>}
      {deleteMutation.isSuccess && <p style={{ color: 'green' }}>Post has (not) been deleted</p>}
      <button onClick={() => updateMutation.mutate()}>Update title</button>
      {updateMutation.isError && <p style={{ color: 'red' }}>Error updating the post</p>}
      {updateMutation.isLoading && <p style={{ color: 'purple' }}>Updating the post</p>}
      {updateMutation.isSuccess && <p style={{ color: 'green' }}>Post has (not) been updated</p>}
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
