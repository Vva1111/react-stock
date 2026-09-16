# Vue 개발자를 위한 이 프로젝트의 React 기본 개념

이 프로젝트는 Vite, React, TypeScript로 만든 간단한 투자 포트폴리오 대시보드입니다. Vue를 이미 알고 있다면 모든 React 개념을 한 번에 외우기보다, 이 코드에서 실제로 등장하는 개념을 Vue의 익숙한 사고방식과 비교하면서 익히는 편이 좋습니다.

## 1. 컴포넌트는 함수다

React 컴포넌트는 기본적으로 UI를 반환하는 함수입니다.

이 프로젝트의 `src/App.tsx`를 보면 `App` 컴포넌트는 `PortfolioPage`를 반환합니다.

```tsx
function App() {
  return <PortfolioPage />
}
```

Vue의 SFC에서는 `<template>`, `<script>`, `<style>`이 파일 안에서 역할별로 나뉘지만, React에서는 컴포넌트 함수 안에서 화면 구조를 JSX로 반환합니다.

Vue 관점으로 보면:

- Vue의 `<template>`에 해당하는 부분이 React의 `return (...)` 안 JSX입니다.
- Vue의 `<script setup>`에 해당하는 로직이 컴포넌트 함수 본문에 들어갑니다.
- React 컴포넌트 이름은 반드시 대문자로 시작해야 합니다.

## 2. JSX는 HTML이 아니라 JavaScript 표현식이다

React에서 화면을 그릴 때 사용하는 문법은 JSX입니다. HTML처럼 보이지만 실제로는 JavaScript 안에서 UI 구조를 표현하는 문법입니다.

예를 들어 `src/features/portfolio/components/PortfolioTable.tsx`에는 이런 코드가 있습니다.

```tsx
<td className={gain >= 0 ? "positive" : "negative"}>
  {formatCurrency(gain)}
</td>
```

Vue의 템플릿과 비교하면 다음과 같습니다.

- Vue의 `:class`는 React에서 `className={...}`으로 씁니다.
- Vue의 `{{ value }}`는 React에서 `{value}`로 씁니다.
- Vue의 `@click`은 React에서 `onClick`으로 씁니다.
- HTML의 `class`는 React JSX에서 `className`입니다.

JSX 안에서 JavaScript 값을 사용할 때는 `{}`를 씁니다.

## 3. 상태 관리는 `useState`로 시작한다

이 프로젝트의 핵심 상태는 `src/features/portfolio/PortfolioPage.tsx`에 있습니다.

```tsx
const [holdings, setHoldings] = useState<Holding[]>(initialHoldings)
const [draft, setDraft] = useState<HoldingDraft>(emptyDraft)
const [selectedId, setSelectedId] = useState<number | null>(null)
```

React의 `useState`는 Vue의 `ref` 또는 `reactive`와 비슷한 역할을 합니다. 다만 사용 방식은 다릅니다.

Vue에서는 보통 값을 직접 바꾸는 느낌이 강합니다.

```ts
count.value += 1
```

React에서는 상태 값을 직접 수정하지 않고, setter 함수를 호출해서 새 값을 넣습니다.

```tsx
setSelectedId(nextHolding.id)
```

중요한 차이는 React 상태는 불변성을 지키는 방식으로 다룬다는 점입니다. 배열에 항목을 추가할 때도 기존 배열을 직접 수정하지 않고 새 배열을 만듭니다.

```tsx
setHoldings([...holdings, nextHolding])
```

Vue의 반응성은 객체 변경을 감지하는 쪽에 가깝고, React는 "새 상태를 넘기면 다시 렌더링한다"는 모델에 가깝습니다.

## 4. Props는 부모에서 자식으로 내려간다

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

React의 props는 Vue의 props와 거의 같은 개념입니다. 부모 컴포넌트가 자식 컴포넌트에 값을 내려줍니다.

차이가 있다면 React에서는 이벤트도 특별한 문법이 아니라 함수 props로 전달한다는 점입니다.

Vue에서는 자식이 보통 `emit('select', id)`처럼 이벤트를 올립니다. React에서는 부모가 함수를 내려주고, 자식이 그 함수를 호출합니다.

```tsx
onClick={() => onSelectHolding(holding.id)}
```

즉 React의 기본 데이터 흐름은 다음과 같습니다.

1. 부모가 state를 가진다.
2. 부모가 props로 데이터를 내려준다.
3. 자식은 props로 받은 콜백 함수를 호출한다.
4. 부모가 state를 변경한다.
5. 변경된 state가 다시 props로 내려가며 화면이 갱신된다.

## 5. Controlled Component: 입력값도 state로 관리한다

`PortfolioForm`의 input들은 전부 `draft` state와 연결되어 있습니다.

```tsx
<input
  value={draft.symbol}
  onChange={(event) =>
    onDraftChange({ ...draft, symbol: event.target.value.toUpperCase() })
  }
  placeholder="TSLA"
/>
```

이런 방식을 React에서는 controlled component라고 부릅니다. input의 현재 값은 DOM이 아니라 React state가 소유합니다.

Vue의 `v-model`과 비슷하지만, React는 다음 두 가지를 직접 적습니다.

- 현재 값: `value={draft.symbol}`
- 변경 처리: `onChange={...}`

Vue의 `v-model`이 양방향 바인딩을 간결하게 숨겨주는 문법이라면, React는 값을 내려주고 이벤트로 올리는 흐름을 명시적으로 보여줍니다.

## 6. 객체 상태는 복사해서 일부만 바꾼다

폼에서 `draft`의 일부 필드만 바꿀 때 이런 코드가 반복됩니다.

```tsx
onDraftChange({ ...draft, company: event.target.value })
```

여기서 `...draft`는 기존 객체를 복사하는 문법입니다. 그 뒤에 `company`만 새 값으로 덮어씁니다.

React에서는 다음처럼 직접 바꾸면 안 됩니다.

```tsx
draft.company = event.target.value
```

이렇게 하면 React가 상태 변경을 올바르게 감지하지 못하거나, 예측하기 어려운 버그가 생길 수 있습니다. React state는 "기존 값을 수정"하기보다 "새 값을 만들어 교체"한다고 생각하면 됩니다.

## 7. 리스트 렌더링에는 `map`과 `key`가 필요하다

Vue에서는 `v-for`를 사용하지만, React에서는 JavaScript의 `map`을 사용합니다.

```tsx
{holdings.map((holding) => {
  return (
    <tr key={holding.id}>
      ...
    </tr>
  )
})}
```

여기서 `key`는 React가 리스트 항목을 안정적으로 구분하기 위해 필요합니다. Vue의 `:key`와 같은 역할입니다.

이 프로젝트에서는 `holding.id`를 key로 사용합니다.

## 8. 조건부 렌더링은 JavaScript 조건문으로 한다

`SelectedHoldingPanel`은 선택된 주식이 없으면 아무것도 렌더링하지 않습니다.

```tsx
if (!holding) {
  return null
}
```

React에서 `null`을 반환하면 화면에 아무것도 그리지 않습니다.

Vue의 `v-if`와 비교하면, React는 별도 디렉티브가 아니라 일반 JavaScript 조건문을 사용합니다.

## 9. 파생값은 렌더링 중 계산하거나 `useMemo`로 계산한다

포트폴리오 요약값은 상태로 따로 저장하지 않습니다. `holdings`로부터 계산합니다.

```tsx
const totalCost = getPortfolioCost(holdings)
const totalValue = getPortfolioValue(holdings)
const totalGain = totalValue - totalCost
```

Vue의 `computed`와 비슷한 사고방식입니다. 원본 상태가 있으면, 그 상태에서 계산 가능한 값은 따로 state로 만들지 않는 것이 좋습니다.

`PortfolioPage`에서는 선택된 주식을 찾기 위해 `useMemo`를 사용합니다.

```tsx
const selectedHolding = useMemo(
  () => holdings.find((holding) => holding.id === selectedId),
  [holdings, selectedId]
)
```

`useMemo`는 Vue의 `computed`와 비슷하게 볼 수 있습니다. 의존성 배열에 들어간 값이 바뀔 때만 다시 계산합니다.

다만 처음 React를 배울 때 모든 계산에 `useMemo`를 붙일 필요는 없습니다. 비용이 크지 않은 계산은 그냥 렌더링 중 계산해도 됩니다. 이 프로젝트에서는 학습용으로 `useMemo`의 모양을 익히기 좋습니다.

## 10. TypeScript로 props와 domain model을 명확히 한다

이 프로젝트는 TypeScript를 사용합니다. 핵심 타입은 `src/features/portfolio/types.ts`에 있습니다.

```ts
export type Holding = {
  id: number
  symbol: string
  company: string
  shares: number
  averagePrice: number
  currentPrice: number
}
```

컴포넌트 props도 타입으로 정의합니다.

```tsx
type PortfolioSummaryProps = {
  holdings: Holding[]
}
```

Vue에서도 TypeScript로 `defineProps`를 쓰듯이, React에서도 props의 모양을 타입으로 명시하면 컴포넌트 계약이 분명해집니다.

특히 이 프로젝트에서는 `Holding`과 `HoldingDraft`가 분리되어 있습니다.

- `Holding`: 실제 포트폴리오 데이터입니다. 숫자는 `number`입니다.
- `HoldingDraft`: 폼 입력 중인 임시 데이터입니다. input 값이므로 숫자처럼 보여도 `string`입니다.

이 구분은 중요합니다. 브라우저 input의 값은 기본적으로 문자열이기 때문에, 저장할 때 `Number(...)`로 변환합니다.

## 11. 렌더링 진입점은 `main.tsx`다

`src/main.tsx`는 React 앱을 브라우저 DOM에 연결합니다.

```tsx
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

Vue의 `createApp(App).mount('#app')`와 비슷한 위치입니다.

React에서는 `createRoot(...).render(...)`로 루트 컴포넌트를 렌더링합니다. `StrictMode`는 개발 중 잠재적인 문제를 더 잘 발견하게 해주는 도구입니다.

## 12. 파일 구조는 feature 단위로 나뉜다

이 프로젝트는 `src/features/portfolio` 아래에 포트폴리오 관련 코드를 모아두었습니다.

```text
src/features/portfolio
├─ components
├─ constants
├─ utils
├─ PortfolioPage.tsx
└─ types.ts
```

이 구조에서 배울 점은 React 자체 문법보다 애플리케이션 설계에 가깝습니다.

- `components`: 화면 조각입니다.
- `constants`: 초기 데이터나 고정값입니다.
- `utils`: 계산, 포맷팅 같은 순수 함수입니다.
- `types.ts`: 데이터 타입입니다.
- `PortfolioPage.tsx`: 상태를 들고 여러 컴포넌트를 조립하는 페이지 컴포넌트입니다.

Vue 프로젝트에서도 feature 단위 구조를 쓰는 경우가 많기 때문에 이 부분은 낯설지 않을 것입니다.

## 13. 지금 이 프로젝트에서 우선 학습할 순서

React를 처음 접한다면 이 순서로 보면 좋습니다.

1. `main.tsx`: React 앱이 어디서 시작되는지 확인합니다.
2. `App.tsx`: 루트 컴포넌트가 어떤 페이지를 렌더링하는지 봅니다.
3. `PortfolioPage.tsx`: state, props, 이벤트 콜백의 전체 흐름을 봅니다.
4. `PortfolioForm.tsx`: controlled input과 state 업데이트를 봅니다.
5. `PortfolioTable.tsx`: 리스트 렌더링, key, 이벤트 핸들러를 봅니다.
6. `PortfolioSummary.tsx`: props로 받은 데이터에서 파생값을 계산하는 방식을 봅니다.
7. `types.ts`: React 컴포넌트와 TypeScript 타입이 어떻게 연결되는지 봅니다.

## 14. Vue 개발자가 특히 조심할 점

### 상태를 직접 바꾸지 않는다

React에서는 배열이나 객체를 직접 수정하지 않고 새 배열, 새 객체를 만들어 setter에 넣습니다.

```tsx
setHoldings([...holdings, nextHolding])
```

### 이벤트 emit 대신 함수 props를 쓴다

Vue의 `emit`에 해당하는 흐름은 React에서 콜백 props로 표현됩니다.

```tsx
<PortfolioTable onSelectHolding={setSelectedId} />
```

자식은 이 함수를 호출합니다.

```tsx
onClick={() => onSelectHolding(holding.id)}
```

### 디렉티브 대신 JavaScript를 쓴다

React에는 `v-if`, `v-for`, `v-model` 같은 디렉티브가 없습니다.

- `v-if` -> `if`, 삼항 연산자, `&&`
- `v-for` -> `array.map(...)`
- `v-model` -> `value` + `onChange`
- `:class` -> `className={...}`
- `@click` -> `onClick={...}`

### 컴포넌트가 다시 실행된다는 감각이 중요하다

React 컴포넌트는 상태나 props가 바뀌면 함수가 다시 실행되고, 그 결과로 새 UI가 계산됩니다.

그래서 렌더링 중에 계산 가능한 값은 자연스럽게 다시 계산됩니다. 반대로 렌더링 중에 부수 효과를 직접 실행하는 코드는 조심해야 합니다.

이 프로젝트에는 아직 `useEffect`가 없습니다. API 호출, localStorage 저장, 타이머, 구독 같은 부수 효과가 필요해질 때 `useEffect`를 학습하면 됩니다.

## 15. 이 프로젝트에서 아직 나오지 않는 React 개념

현재 코드에는 다음 개념들이 거의 등장하지 않습니다. 지금 당장 우선순위는 낮습니다.

- `useEffect`: API 호출, 외부 시스템 동기화, 타이머 처리
- Context API: 여러 단계 아래 컴포넌트로 전역성 데이터를 전달
- React Router: 페이지 라우팅
- 상태 관리 라이브러리: Zustand, Redux 등
- 서버 상태 라이브러리: TanStack Query 등
- form 라이브러리: React Hook Form 등

먼저 이 프로젝트에 이미 있는 `useState`, props, controlled input, list rendering, conditional rendering, TypeScript props 타입을 확실히 잡는 것이 좋습니다.

## 한 줄 요약

Vue 개발자 관점에서 이 프로젝트의 React 핵심은 "부모가 state를 가지고, 자식에게 props와 콜백을 내려주며, JSX 안에서 JavaScript로 화면을 구성한다"는 흐름을 익히는 것입니다.
