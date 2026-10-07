# Vue 개발자를 위한 React Stock 프로젝트 읽기

이 문서는 Vue 개발자가 이 프로젝트를 통해 React의 기본 개념을 익힌다는 가정으로 작성했습니다. React를 완전히 낯선 문법으로 보기보다, Vue에서 이미 알고 있는 `template`, `script setup`, `props`, `emit`, `v-model`, `v-for`, `computed`, Vue Router가 React에서는 어떤 모양으로 나타나는지 연결해서 보면 훨씬 빠르게 이해할 수 있습니다.

현재 프로젝트는 Vite, React, TypeScript로 만든 작은 주식 포트폴리오 예제입니다. 핵심 학습 범위는 컴포넌트, JSX, state, props, callback props, controlled input, 리스트 렌더링, 조건부 렌더링, `useMemo`, TypeScript 타입, React Router입니다.

## 1. Vue와 React의 큰 차이

Vue는 SFC(Single File Component) 안에서 `<template>`, `<script setup>`, `<style>`을 구역별로 나눕니다. React는 보통 컴포넌트 함수를 만들고, 그 함수가 JSX를 `return`합니다.

Vue에서:

```vue
<script setup lang="ts">
const title = "Portfolio";
</script>

<template>
  <h1>{{ title }}</h1>
</template>
```

React에서:

```tsx
function PortfolioTitle() {
  const title = "Portfolio";

  return <h1>{title}</h1>;
}
```

Vue의 템플릿 문법은 React에서 대부분 JavaScript 표현식으로 바뀝니다. 그래서 React를 공부할 때는 “HTML을 쓰는 방식”보다 “JavaScript 안에서 UI를 반환하는 방식”으로 이해하는 편이 좋습니다.

## 2. 앱의 시작점: main.tsx

`src/main.tsx`는 React 앱을 브라우저 DOM에 붙이는 진입점입니다.

```tsx
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

Vue의 `createApp(App).mount("#app")`와 비슷한 역할입니다. `main.tsx`가 직접 화면을 구성하지는 않고, 루트 컴포넌트인 `App`을 DOM에 연결합니다.

Vue 개발자 관점에서 보면:

- Vue: `createApp(App).mount("#app")`
- React: `createRoot(...).render(<App />)`
- Vue의 `App.vue`: React의 `App.tsx`와 비슷한 루트 컴포넌트

## 3. App.tsx: 라우터와 루트 레이아웃

`src/App.tsx`는 라우터를 설정하고, URL 경로에 따라 어떤 페이지 컴포넌트를 보여줄지 결정합니다.

```tsx
function App() {
  return (
    <BrowserRouter>
      <nav className="app-nav" aria-label="Main navigation">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/portfolio">Portfolio</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="*" element={<Navigate to="/portfolio" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
```

Vue Router에 익숙하다면 다음처럼 대응해서 보면 됩니다.

| Vue Router | React Router |
| --- | --- |
| `createRouter(...)` | `<BrowserRouter>` |
| `routes: [{ path, component }]` | `<Route path element />` |
| `<RouterLink>` | `<Link>` 또는 `<NavLink>` |
| `<RouterView />` | `<Routes>` 안에서 선택되는 `element` |
| `redirect` | `<Navigate />` |

React Router에서는 라우트 설정도 JSX 컴포넌트처럼 작성합니다. 처음에는 낯설 수 있지만, “이 경로에서는 이 element를 렌더링한다”는 선언이라고 보면 됩니다.

## 4. NavLink: 현재 페이지 링크 표시

상단 내비게이션은 `NavLink`를 사용합니다.

```tsx
<NavLink to="/">Home</NavLink>
<NavLink to="/portfolio">Portfolio</NavLink>
```

`NavLink`는 현재 URL과 `to`가 일치하면 자동으로 `active` 클래스를 붙입니다. 그래서 `src/App.css`에서 현재 페이지 링크를 강조할 수 있습니다.

```css
.app-nav a.active {
  border-color: #cbd5e1;
  color: #2563eb;
  background: #ffffff;
}
```

단순 이동만 필요하면 `Link`를 써도 됩니다. 현재 페이지 상태에 따라 스타일을 바꾸고 싶다면 `NavLink`가 더 편합니다.

## 5. React 컴포넌트는 UI를 반환하는 함수

React 컴포넌트는 기본적으로 UI를 반환하는 함수입니다.

```tsx
function HomePage() {
  return <main className="app">...</main>;
}
```

Vue SFC와 비교하면:

- Vue의 `<template>`에 해당하는 부분이 React의 `return (...)` 안 JSX입니다.
- Vue의 `<script setup>`에 해당하는 로직은 컴포넌트 함수 본문에 들어갑니다.
- React 컴포넌트 이름은 대문자로 시작해야 합니다.

React는 컴포넌트 함수가 다시 실행되면서 UI를 갱신합니다. state가 바뀌면 React가 해당 컴포넌트를 다시 호출하고, 새 JSX 결과를 기준으로 화면을 업데이트합니다.

## 6. JSX: HTML처럼 보이는 JavaScript 표현식

React에서 화면을 그릴 때 사용하는 문법은 JSX입니다. HTML처럼 보이지만 실제로는 JavaScript 안에서 UI 구조를 표현하는 문법입니다.

```tsx
<td className={gain >= 0 ? "positive" : "negative"}>
  {formatCurrency(gain)}
</td>
```

Vue 템플릿 문법과 비교하면:

| Vue | React JSX |
| --- | --- |
| `:class="..."` | `className={...}` |
| `{{ value }}` | `{value}` |
| `@click="handler"` | `onClick={handler}` |
| `v-if` | `if`, 삼항 연산자, `&&` |
| `v-for` | `array.map(...)` |
| `v-model` | `value` + `onChange` |

JSX 안에서 JavaScript 값을 넣을 때는 `{}`를 사용합니다. HTML의 `class`는 JSX에서 `className`으로 씁니다.

## 7. state: Vue의 ref/reactive와 React의 useState

`src/features/portfolio/PortfolioPage.tsx`에는 이 페이지의 주요 상태가 있습니다.

```tsx
const [holdings, setHoldings] = useState<Holding[]>(initialHoldings);
const [draft, setDraft] = useState<HoldingDraft>(emptyDraft);
const [selectedId, setSelectedId] = useState<number | null>(null);
```

Vue의 `ref`나 `reactive`와 비슷하게 컴포넌트가 기억해야 하는 값을 담습니다. 다만 React에서는 상태 값을 직접 바꾸지 않고 setter 함수를 호출합니다.

```tsx
setSelectedId(nextHolding.id);
```

배열이나 객체도 직접 수정하지 않고 새 배열, 새 객체를 만들어 교체합니다.

```tsx
setHoldings([...holdings, nextHolding]);
```

Vue는 반응형 객체의 변경을 추적하는 느낌이 강하고, React는 “새 상태를 만들어 setter로 넘기면 다시 렌더링된다”는 모델에 가깝습니다.

## 8. props: 부모에서 자식으로 내려가는 데이터

`PortfolioPage`는 여러 자식 컴포넌트에 데이터를 전달합니다.

```tsx
<PortfolioSummary holdings={holdings} />

<PortfolioForm
  draft={draft}
  onDraftChange={setDraft}
  onAddHolding={addHolding}
/>

<PortfolioTable
  holdings={holdings}
  selectedId={selectedId}
  onSelectHolding={setSelectedId}
/>
```

React의 props는 Vue의 props와 거의 같은 개념입니다. 부모가 자식에게 값을 내려줍니다.

차이는 이벤트 처리 방식에서 더 크게 느껴집니다. Vue에서는 자식이 `emit("select", id)`처럼 이벤트를 올립니다. React에서는 부모가 함수를 props로 내려주고, 자식이 그 함수를 호출합니다.

```tsx
onClick={() => onSelectHolding(holding.id)}
```

React의 기본 데이터 흐름은 다음과 같습니다.

1. 부모 컴포넌트가 state를 가진다.
2. 부모가 자식에게 props로 데이터와 함수를 내려준다.
3. 자식이 사용자 이벤트에 반응해 props로 받은 함수를 호출한다.
4. 부모의 state가 바뀐다.
5. 바뀐 state가 다시 props로 내려가며 화면이 갱신된다.

## 9. callback props: Vue의 emit에 해당하는 흐름

`PortfolioTable`의 props 타입을 보면 React식 이벤트 전달 방식이 드러납니다.

```tsx
type PortfolioTableProps = {
  holdings: Holding[];
  selectedId: number | null;
  onSelectHolding: (id: number) => void;
};
```

`onSelectHolding`은 이벤트 이름이 아니라 함수 props입니다. 부모인 `PortfolioPage`는 여기에 `setSelectedId`를 넘깁니다.

```tsx
<PortfolioTable
  holdings={holdings}
  selectedId={selectedId}
  onSelectHolding={setSelectedId}
/>
```

자식인 `PortfolioTable`은 행을 클릭했을 때 그 함수를 실행합니다.

```tsx
onClick={() => onSelectHolding(holding.id)}
```

Vue로 치면 `emit("select", holding.id)`를 호출하고, 부모가 `@select="selectedId = $event"`로 받는 흐름과 비슷합니다. React는 이 연결을 별도 emit 문법 없이 함수 전달로 표현합니다.

## 10. controlled input: React식 v-model

`PortfolioForm`은 입력값을 `draft` state와 연결합니다.

```tsx
<input
  value={draft.symbol}
  onChange={(event) =>
    onDraftChange({ ...draft, symbol: event.target.value.toUpperCase() })
  }
  placeholder="TSLA"
/>
```

이런 방식을 React에서는 controlled component라고 부릅니다. input의 현재 값은 DOM이 독립적으로 들고 있는 것이 아니라 React state가 소유합니다.

Vue의 `v-model`과 비교하면:

- Vue: `v-model="draft.symbol"`
- React: `value={draft.symbol}` + `onChange={...}`

Vue의 `v-model`은 값 전달과 변경 이벤트를 축약해 줍니다. React는 현재 값과 변경 처리를 명시적으로 적습니다. 코드가 조금 길어지는 대신, 값이 어디서 오고 어떻게 바뀌는지 한눈에 드러납니다.

## 11. 객체 state는 복사해서 일부만 바꾼다

입력값 하나가 바뀔 때마다 `draft` 전체를 새 객체로 만듭니다.

```tsx
onDraftChange({ ...draft, company: event.target.value });
```

`...draft`는 기존 객체의 필드를 복사합니다. 그 다음 `company`만 새 값으로 덮어씁니다.

React state는 다음처럼 직접 바꾸면 안 됩니다.

```tsx
draft.company = event.target.value;
```

React에서는 “기존 값을 수정한다”보다 “새 값을 만들어 교체한다”고 생각하면 좋습니다. 배열에 항목을 추가할 때 `push` 대신 `[...holdings, nextHolding]`을 쓰는 것도 같은 이유입니다.

## 12. 리스트 렌더링: v-for 대신 map

Vue에서 `v-for`를 쓰는 자리는 React에서 JavaScript의 `map`을 사용합니다.

```tsx
{holdings.map((holding) => {
  return (
    <tr key={holding.id} onClick={() => onSelectHolding(holding.id)}>
      ...
    </tr>
  );
})}
```

`key`는 Vue의 `:key`와 같은 역할입니다. React가 리스트 항목을 안정적으로 구분하고 갱신하기 위해 필요합니다.

Vue 개발자가 특히 주의할 점은 JSX 안에서도 그냥 JavaScript를 쓴다는 점입니다. 반복을 위한 별도 디렉티브가 없고, 배열 메서드 결과를 JSX 안에 넣습니다.

## 13. 조건부 렌더링: v-if 대신 JavaScript 조건문

`SelectedHoldingPanel`처럼 선택된 주식이 없을 때 아무것도 렌더링하지 않는 컴포넌트는 보통 `null`을 반환합니다.

```tsx
if (!holding) {
  return null;
}
```

React에서 `null`을 반환하면 화면에 아무것도 그리지 않습니다. Vue의 `v-if="holding"`과 비슷한 효과입니다.

JSX 안에서는 삼항 연산자나 `&&`도 자주 씁니다.

```tsx
{selectedId === holding.id ? "selected" : ""}
{holding && <SelectedHoldingPanel holding={holding} />}
```

## 14. 계산 값: computed와 useMemo

포트폴리오 요약 값은 별도 state로 저장하지 않고 `holdings`에서 계산합니다.

```tsx
const totalCost = getPortfolioCost(holdings);
const totalValue = getPortfolioValue(holdings);
const totalGain = totalValue - totalCost;
```

Vue의 `computed`처럼 “원본 상태에서 계산 가능한 값은 따로 상태로 두지 않는다”는 원칙은 React에서도 유효합니다.

`PortfolioPage`에서는 선택된 주식을 찾기 위해 `useMemo`를 사용합니다.

```tsx
const selectedHolding = useMemo(
  () => holdings.find((holding) => holding.id === selectedId),
  [holdings, selectedId]
);
```

`useMemo`는 Vue의 `computed`와 비슷하게 볼 수 있습니다. 의존성 배열인 `[holdings, selectedId]` 안의 값이 바뀔 때만 다시 계산합니다.

다만 React에서 `useMemo`는 “항상 써야 하는 계산 상태”가 아니라 최적화 도구에 가깝습니다. 계산이 가볍다면 그냥 변수로 계산해도 됩니다.

## 15. TypeScript로 props와 도메인 모델을 명확히 한다

포트폴리오 데이터 타입은 `src/features/portfolio/types.ts`에 있습니다.

```ts
export type Holding = {
  id: number;
  symbol: string;
  company: string;
  shares: number;
  averagePrice: number;
  currentPrice: number;
};
```

입력 중인 임시 데이터는 별도 타입으로 둡니다.

```ts
export type HoldingDraft = {
  symbol: string;
  company: string;
  shares: string;
  averagePrice: string;
  currentPrice: string;
};
```

`Holding`과 `HoldingDraft`가 나뉘는 이유는 브라우저 input 값이 기본적으로 문자열이기 때문입니다. 사용자가 입력 중인 값은 `string`으로 보관하고, 실제 포트폴리오 항목으로 추가할 때 `Number(...)`로 변환합니다.

```tsx
const nextHolding: Holding = {
  id: Date.now(),
  symbol: draft.symbol.trim(),
  company: draft.company.trim(),
  shares: Number(draft.shares),
  averagePrice: Number(draft.averagePrice),
  currentPrice: Number(draft.currentPrice),
};
```

컴포넌트 props도 타입으로 명확히 표현합니다.

```tsx
type PortfolioSummaryProps = {
  holdings: Holding[];
};
```

Vue에서 `defineProps<...>()`로 props 타입을 선언하는 것과 비슷한 목적입니다.

## 16. feature 단위 파일 구조

이 프로젝트는 포트폴리오 관련 코드를 `src/features/portfolio` 아래에 모았습니다.

```text
src/features/portfolio
├─ components
├─ constants
├─ utils
├─ PortfolioPage.tsx
└─ types.ts
```

각 폴더의 역할은 다음과 같습니다.

- `components`: 화면을 이루는 작은 컴포넌트입니다.
- `constants`: 초기 데이터나 고정값입니다.
- `utils`: 계산, 포맷팅 같은 순수 함수입니다.
- `types.ts`: 데이터 타입입니다.
- `PortfolioPage.tsx`: state를 가지고 여러 컴포넌트를 조립하는 페이지 컴포넌트입니다.

Vue 프로젝트에서도 feature 단위 구조를 쓰는 경우가 많기 때문에 이 부분은 비교적 익숙할 것입니다. React에서는 정해진 폴더 규칙이 강하지 않으므로, 팀이나 프로젝트에 맞춰 구조를 정하는 경우가 많습니다.

## 17. 이 프로젝트를 읽는 추천 순서

React가 처음이라면 다음 순서로 보면 좋습니다.

1. `src/main.tsx`: React 앱이 어디서 시작되는지 확인합니다.
2. `src/App.tsx`: React Router가 경로별 페이지를 고르는 방식을 봅니다.
3. `src/features/portfolio/PortfolioPage.tsx`: state, props, callback props의 전체 흐름을 봅니다.
4. `src/features/portfolio/components/PortfolioForm.tsx`: controlled input과 객체 state 업데이트를 봅니다.
5. `src/features/portfolio/components/PortfolioTable.tsx`: `map`, `key`, 클릭 이벤트를 봅니다.
6. `src/features/portfolio/components/PortfolioSummary.tsx`: props로 받은 데이터에서 계산 값을 만드는 방식을 봅니다.
7. `src/features/portfolio/types.ts`: React 컴포넌트와 TypeScript 타입이 어떻게 연결되는지 봅니다.

## 18. Vue 개발자가 특히 헷갈리기 쉬운 지점

### 디렉티브가 없다

React에는 `v-if`, `v-for`, `v-model` 같은 디렉티브가 없습니다. 대신 JavaScript 문법을 그대로 사용합니다.

- `v-if`: `if`, 삼항 연산자, `&&`
- `v-for`: `array.map(...)`
- `v-model`: `value` + `onChange`
- `:class`: `className={...}`
- `@click`: `onClick={...}`

### emit 대신 함수를 내려준다

Vue에서는 자식이 이벤트를 올리고 부모가 받습니다. React에서는 부모가 함수를 내려주고 자식이 호출합니다.

```tsx
<PortfolioTable onSelectHolding={setSelectedId} />
```

```tsx
onClick={() => onSelectHolding(holding.id)}
```

### 상태를 직접 바꾸지 않는다

React에서는 배열이나 객체를 직접 수정하지 않습니다.

```tsx
setHoldings([...holdings, nextHolding]);
```

```tsx
onDraftChange({ ...draft, company: event.target.value });
```

이 방식은 React가 “상태가 바뀌었다”는 사실을 안정적으로 감지하고 다시 렌더링하는 데 중요합니다.

### JSX는 템플릿이 아니라 JavaScript에 가깝다

React JSX는 Vue template처럼 보이지만, 실제 감각은 JavaScript에 더 가깝습니다. 조건, 반복, 값 삽입, 이벤트 연결을 모두 JavaScript 표현식으로 처리합니다.

## 19. 아직 이 프로젝트에 거의 나오지 않는 React 개념

현재 코드에는 다음 개념이 거의 등장하지 않습니다. 지금 당장 우선순위가 높지는 않습니다.

- `useEffect`: API 호출, DOM 이벤트 구독, 외부 시스템과의 동기화
- Context API: 여러 단계 아래 컴포넌트로 전역성 데이터를 전달
- 상태 관리 라이브러리: Zustand, Redux 등
- 서버 상태 라이브러리: TanStack Query 등
- 폼 라이브러리: React Hook Form 등

먼저 이 프로젝트 안에 이미 있는 `useState`, props, callback props, controlled input, list rendering, conditional rendering, React Router, TypeScript props 타입을 확실히 잡는 것이 좋습니다.

## 핵심 요약

Vue 개발자 관점에서 이 프로젝트의 React 코드는 다음 흐름으로 이해하면 됩니다.

`main.tsx`가 `App`을 브라우저에 붙이고, `App.tsx`가 React Router로 페이지를 고릅니다. `PortfolioPage`는 state를 가지고 자식 컴포넌트에 props를 내려줍니다. 자식 컴포넌트는 Vue의 `emit` 대신 props로 받은 callback 함수를 호출합니다. JSX 안에서는 Vue 디렉티브 대신 JavaScript 표현식으로 조건, 반복, 이벤트, class를 처리합니다.

즉, React를 배울 때 가장 중요한 전환은 “템플릿 디렉티브 중심”에서 “JavaScript 함수와 값 흐름 중심”으로 사고방식을 바꾸는 것입니다.
