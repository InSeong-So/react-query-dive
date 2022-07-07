import InfiniteScroll from 'react-infinite-scroller';
import { useInfiniteQuery } from 'react-query';
import { Person } from './Person';

export interface Result {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  films: string[];
  species: string[];
  vehicles: string[];
  starships: string[];
  created: Date;
  edited: Date;
  url: string;
}

export interface RootObject {
  count: number;
  next: string;
  previous: boolean | null | undefined;
  results: Result[];
}

const initialUrl = 'https://swapi.dev/api/people/';
const fetchUrl = async (url: string) => {
  const response = await fetch(url);
  return response.json();
};

export function InfinitePeople() {
  const { data, fetchNextPage, hasNextPage, isLoading, isFetching, isError, error } = useInfiniteQuery<RootObject>(
    'sw-people',
    ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    {
      getNextPageParam: lastPage => lastPage.next || undefined,
    },
  );

  if (data === undefined) return <></>;

  if (isLoading) return <div className="loading">Loading...</div>;

  if (isError) return <div>Error! {(error as Error).toString()}</div>;

  return (
    <>
      {isFetching && <div className="loading">Loading...</div>}
      <InfiniteScroll loadMore={() => fetchNextPage()} hasMore={hasNextPage}>
        {data.pages.map(pageData => {
          return pageData.results.map(person => (
            <Person key={person.name} name={person.name} hairColor={person.hair_color} eyeColor={person.eye_color} />
          ));
        })}
      </InfiniteScroll>
    </>
  );
}
