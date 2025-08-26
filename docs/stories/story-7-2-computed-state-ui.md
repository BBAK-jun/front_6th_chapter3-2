# Story 7-2: 상태 축소와 computed UI

## Goal

파생 가능한 값을 상태로 보관하지 않고 selector/computed로 유도하여 `App.tsx`의 불필요 상태를 줄이고 재렌더링 비용을 낮춘다.

## Acceptance Criteria

1. 파생값/뷰용 임시값은 `useMemo`/selector로 계산한다.
2. 이벤트 리스트 가공/검색/필터/반복 미리보기 등은 computed로 전환한다.
3. 불필요한 setState 제거 및 의존성 정리로 재렌더링 횟수 감소.
4. 테스트/성능 지표(렌더 횟수 샘플링)로 개선 확인.

## Technical Notes

- computed 우선: 입력 상태 최소화 → 파생값 계산
- 메모이제이션 가이드: 입력이 바뀔 때만 계산, 키 함수 명확화
- selector 위치: 훅 또는 유틸로 분리, UI는 결과만 소비

## Tasks

- [ ] `App.tsx` 불필요 로컬 상태 제거(파생값 → computed)
- [ ] 검색/필터/반복 미리보기 selector로 이동
- [ ] 렌더 횟수 샘플 측정 및 문서화

## Definition of Done

- [ ] 로컬 상태 수 30%+ 감소
- [ ] 린트/타입/테스트 그린
- [ ] 성능 측정 결과(샘플) 문서화


