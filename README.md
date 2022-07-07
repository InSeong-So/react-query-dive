# 1
- 리액트 쿼리 설치
- 쿼리 클라이언트/쿼리 클라이언트 프로바이더 주입
- 리액트 쿼리 개발자 도구 추가

# 2
- useInfiniteQuery와 useQuery의 차이점
  - 반환 객체에서 반환되는 데이터 프로퍼티 형태가 다름
    - useQuery : 단순히 쿼리 함수에서 반환되는 데이터
    - useInfiniteQuery : 두 개의 프로퍼티를 가지며 하나는 데이터 페이지 객체의 배열, 다른 하나는 각 페이지의 매개변수가 기록된 pageParams
  - 모든 쿼리는 페이지 배열에 고유한 요소를 가지는데 이 요소는 해당 쿼리에 대한 데이터에 해당
    - 페이지가 진행되면 쿼리도 바뀌니 pageParams는 검색된 쿼리의 키를 추적함
    - pageParams는 흔하게 사용되진 않음
  - 구문이 다름
    - 무한 스크롤을 계속할 수 있게 해줌
    - pageParam은 쿼리 함수에 전달되는 매개변수
    - 쿼리 키, 매개변수(객체 구조 분해된 pageParam 사용), defaultUrl을 사용해서 fetch 함수 호출
    - getNextPageParam : 다음 페이지로 가는 방식을 정의하는 함수
      - 마지막 페이지의 데이터 또는 모든 페이지에 대한 데이터를 가져옴
  - 다른 프로퍼티
    - fetchNextPage : 사용자가 더 많은 데이터를 요청할 때 호출하는 함수
    - hasNextPage : getNextPageParam을 기반으로 하며 undefined인 경우 더 이상 데이터가 없다는 것, pageParam은 다음 페이지가 있다는 것
    - isFetchingNextPage : useQuery에는 없고 일반적인 페칭인지 구별 가능

# 3
- 동작 흐름
  1. 컴포넌트 마운트
  2. 첫 번째 페이지 fetch
  3. getNextPageParam이 동작하고 pageParam을 업데이트
  4. 사용자의 scrolls / clicks 으로 fetchNextPage 실행

# 4 요약
- 양방향 스크롤(bi-directional scrolling)
  - 데이터의 중간부터 시작할 때 유용(시작점 이후뿐 아니라 이전 데이터도 가져와야 함)
  - fetchNextPage, hasNextPage, getNextPageParam 함수와 같은 Previous 함수도 존재
    - 이전 페이지에 대해서도 동일한 기능을 수행할 수 있음
- 무한 스크롤은 많은 기능을 제공
  - 페이지네이션 혹은 컴포넌트에서 페이지 처리
  - pageParam 배열은 가져와야 할 다음 페이지를 나타냄
    - getNextPageParam 옵션을 통해 관리되며 두 가지 매개변수를 사용
    - lastPage, allPages로 API의 응답에 따라 취사선택
    - hasNextPage 값도 제어
      - 불리언 값은 pageParam이 쫀재하면 참, 아니라면 거짓을 반환
  - fetchNextPage는 컴포넌트의 영향을 받음
    - 컴포넌트가 데이터를 불러와야 할 때를 결정
  - hasNextPage 프로퍼티로 데이터를 그만 가져오게 할 수 있음