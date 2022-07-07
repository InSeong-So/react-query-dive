# 1
- 리액트 쿼리 설치
- 쿼리 클라이언트 설치
  - 쿼리/서버의 데이터 캐시를 관리하는 클라이언트
- 자식 컴포넌트에 캐시/클라이언트 구성을 공유할 쿼리 프로바이더 구성
  - 이에 대한 값으로 사용될 쿼리 클라이언트도 필요
- 서버에서 데이터를 가져오기 위해 useQuery 훅을 사용
  - 서버에서 데이터를 가져오는 훅

# 2
- isFetching
  - 비동기 쿼리가 해결되지 않았음을 의미
  - 이 경우 아직 페칭(Fetching)을 완료하지 않았지만 쿼리가 Axios 호출 또는 GraphQL 호출일 수도 있음
- isLoading
  - isFetching의 하위 집합(isFetching이 참이면서 쿼리에 대해 캐시된 데이터가 없는 상태)
  - 가져오는 상태로 비동기 쿼리가 해결되지 않았음을 의미
  - 데이터를 가져오는 중이며 표시할 캐시 데이터도 없다는 것
  - 추후 페이지네이션을 진행하면 캐시된 데이터가 있을 때, 없을 때를 구분해야 함
  - ReactQuery는 기본값으로 세 번 시도한 뒤 해당 데이터를 가져올 수 없다고 결정함
    - 시도하는 동안엔 로드 중으로 표시되고, 완료된 후에는 오류 상태로 표시됨

- isError
  - 반환 객체에는 불리언을 반환하면서 쿼리 함수에서 전달하는 오류도 존재

# 3
- React-Query-Devtools
  - 개발 중인 모든 쿼리의 상태 표시
  - 최근 실행 시간 표시
  - 쿼리 키로 쿼리 표시
  - 활성, 비활성, 만료 등 모든 쿼리의 상태를 알려줌

- 개발자 도구에서 데이터가 만료(stale) 상태로 변경
- 만료 상태란?
  - 만료된 데이터는 오래된 식빵과 비슷함
  - 데이터 리패칭은 만료된 데이터에서만 실행
  - 데이터 리패칭 실행에는 만료된 데이터 외에 여러 트리거가 존재
    - 컴포넌트가 다시 마운트되거나 윈도우가 다시 포커스가 된 경우
    - 단, 만료된 데이터일 경우에만 리패칭이 실행
  - staleTime은 결국 데이터를 허용하는 '최대 나이'라고 할 수 있음
    - 달리 말하면 데이터가 만료되었다고 판단하기 전까지 허용하는 시간이 staleTime임
    - 데이터의 성격에 따라 staleTime은 모두 달라질 수 있음
  - 그럼 왜 staleTime의 기본값은 0인가?
    - 업데이트가 왜 안되죠? 보다 데이터가 어떻게 늘 최신 상태를 유지하나요? 가 훨씬 나은 질문
    - staleTime을 0으로 설정했다는 것은 데이터는 항상 만료이기 때문에 서버에서 다시 가져와야 한다고 가정한다는 뜻
    - 그렇다면 클라이언트에게 만료된 데이터를 제공할 가능성이 줄어듦
- staleTime과 cacheTime의 차이?
  - 캐시는 나중에 다시 필요할 수도 있는 데이터
    - 특정 쿼리에 대한 활성 useQuery가 없는 경우 해당 데이터는 콜드 스토리지로 이동
    - 구성된 cacheTime이 지나면 캐시 데이터가 만료되며, 기본값은 5분
    - cacheTime이 관찰하는 시간의 양은 특정 쿼리에 대한 useQuery가 활성화된 후 경과한 시간
    - 페이지에 표시되는 컴포넌트가 특정 쿼리에 대해 useQuery를 사용한 시간을 말함
    - 캐시가 만료되면 가비지 컬렉션이 실행되고 클라이언트는 데이터를 사용할 수 없음
    - 데이터가 캐시에 있는 동안에는 패칭할 때 사용 가능
    - 데이터 패칭을 중지하지 않으므로 서버의 최신 데이터로 새로 고침이 가능
    - 단, 계속해서 빈 페이지만 보는 경우가 생길 수 있음
    - 새로운 데이터를 수집하는 동안 약간 오래된 데이터를 표시하는 것이 빈 페이지보다는 나음
    - 빈 페이지를 보여주고 싶거나 만료된 데이터가 위험할 수 있는 앱의 경우 cacheTime을 0으로 설정하면 됨

# 4
- 모든 쿼리가 동일한 쿼리 키를 사용하는 경우
  - 어떤 트리거가 있어야만 데이터를 가져옴
    - 컴포넌트를 다시 마운트할 때
    - 윈도우가 다시 포커스 될 때
    - useQuery에서 반환되어 수동으로 리페칭할 때
    - 지정된 간격으로 리페칭을 자동 실행할 때
    - 혹은 Mutation을 생성한 뒤 쿼리를 무효화할 때
  - 클라이언트의 데이터가 서버의 데이터와 불일치할 때 리페칭이 트리거
- 쿼리는 게시물 ID를 포함하기 때문에 쿼리별로 캐시를 남길 수 있음
  - 동일한 쿼리에 대한 캐시를 공유하지 않아도 됨
  - 즉, 각 쿼리에 대항하는 캐시를 가지고 쿼리에 라벨을 설정하면 됨
  - 바로 문자열이 아니라 배열 형태로 전달하는 것
  - 의존성 배열이 다르다면 완전히 다른 것으로 간주
  - 데이터를 가져올 때 사용하는 쿼리 함수에 있는 값이 쿼리 키에 포함되어야 함

# 5
- 프리패칭
  - 데이터를 캐시에 추가하여 구성할 수 있으나, 기본값으로 만료 상태임
  - 데이터를 사용하고자 할 때 만료 상태에서 데이터를 다시 가져옴
  - 데이터를 다시 가져오는 중에는 캐시에 있는 데이터를 이용해 앱에 나타냄
    - 단, 캐시가 만료되지 않았다는 가정 하
    - 가령 사용자가 특정 게시물 페이지에 cacheTime보다 오래 머무를 수 있는데, 다음 액션을 취할 캐시가 만료되어 로딩 인디케이터가 나타날 것
  - 이렇게 추후 사용자가 사용할 법한 모든 데이터에 프리패칭을 사용함
    - 페이지네이션 뿐만 아니라 다수의 사용자가 웹 사이트 방문 시 통계적으로 특정 탭을 누를 확률이 높다면 해당 데이터를 미리 가져오는 것이 맞음

# 6
- Mutation
  - 서버에 데이터를 업데이트하도록 서버에 네트워크 호출
  - 긍정적 업데이트 : 서버 호출에서 모든 내용이 잘 진행될 것으로 간주하는 것으로 사실이 아니라면 롤백을 진행
  - 변이 호출을 실행할 때 서버에서 받는 데이터를 취하고 업데이트된 해당 데이터로 React Query 캐시를 업데이트
  - 관련 쿼리 무효화 : 서버에서 리페치를 개시하여 클라이언트에 있는 데이터를 서버의 데이터와 최신 상태로 유지
- useMutation은 일부 예외를 제외하고 useQuery와 상당히 유사
  - mutate 함수를 반환하는데 이 mutate 함수는 변경 사항을 토대로 서버를 호출할 때 사용
  - 데이터를 저장하지 않으므로 쿼리 키는 필요하지 않음
  - isLoading은 존재하나 isFetching은 없음
  - 캐시된 항목이 없으므로 isFetching은 성립하지 않음
  - 변이에 관련된 캐시는 존재하지 않고 재시도 또한 기본값으로 존재하지 않음
    - useQuery는 기본값으로 3회 재시도
    - useMutation도 자동 재시도를 적용하고 싶다면 설정할 순 있음
- 변이의 주기를 다룰 수 있음
  - 반환 객체에 변이 속성을 실행하여 변이 호출 조절
  - 쿼리에서 진행한 것과 유사한 방식으로 주기 처리 가능

# 7 기초 요약
React Query의 기본 기능을 구현하는데 필요한 많은 부분을 다뤘습니다

먼저 패키지를 설치하고

QueryClient를 생성해서 QueryProvider에 추가했었죠

모든 자식 컴포넌트가 캐시와 훅을 사용할 수 있도록요

useQuery, useQuery 훅을 실행해서

데이터를 서버에서 가져오고 최신 상태인지 확인할 수 있었죠

반환 객체에는 isLoading, isFetching 그리고 Error가 있는데

특정 쿼리의 상태를 사용자에게 알려줄 때 사용했어요

staleTime에 대해서 알아봤는데요 윈도우가 다시 포커스될 때 같은

특정 트리거에서 쿼리 데이터를 다시 가져올지를 결정하죠

다르게 말하면 staleTime은

데이터가 사용 가능한 상태로 유지되는 시간이에요

서버로 돌아가 데이터가 여전히 정확한지 확인해야 하는 시점까지요

cacheTime은 데이터가 비활성화된 이후 남아 있는 시간을 말하죠

캐시된 데이터는 쿼리를 다시 실행했을 때 사용되죠

데이터가 최신 상태인지 서버에서 확인하는 동안

자리 표시자로 사용자에게 보여지게 됩니다

디펜던시 배열로 쿼리 키를 살펴봤었죠

쿼리 키가 변경됐을 때 useQuery hook은 쿼리를 반복해요

그래서 데이터 함수가 바뀌면 쿼리 키도 바뀌게 되죠

데이터를 변경해야 하는 경우 다시 실행될 수 있도록요

페이지 매김(Pagination)도 살펴봤었죠

페이지를 넘기려면 컴포넌트에서 상태를 어떻게 유지해야 하는지요

추가 페이지를 프리페칭하는 것도 알아봤고요

서버에서 최신인지 확인하는 동안 캐시된 데이터가 보여지게 말이죠

이번 섹션에선 페이지 매김을 연습해 볼 기회가 없었는데요

Day Spa 앱을 다룰 때 기회가 있을 거예요

끝으로 서버 사이드 이펙트 수행에 사용되는 useMutation을 알아봤죠

변이에 대해선 일부만 다뤘어요

서버 데이터는 바뀌지 않기 때문이죠
