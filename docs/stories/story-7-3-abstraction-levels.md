# Story 7-3: 추상화 레벨 정렬

## Goal

도메인 로직/상태/표현을 각 레이어에 배치하고, 의존 방향을 types → utils → states → hooks → components → entry로 정렬한다.

## Acceptance Criteria

1. 도메인/검증/계산 로직은 유틸·훅으로 이동, 컴포넌트는 표현만 담당.
2. 네이밍 컨벤션 통일(액션/데이터 패턴), 동일 의도 동일 명칭 유지.
3. 의존 역전(컴포넌트→유틸) 해소, 순환 의존 없음.
4. 품질 리포트(check:deps/cycles/dup) 그린 유지.

## Technical Notes

- 경계 위반 탐지: import 경로 점검, madge로 순환 확인
- 네이밍: create/get/update/delete/validate/compute 등 표준 접두어 적용

## Tasks

- [ ] App.tsx 내 도메인 로직을 훅/유틸로 이동
- [ ] import 경로/배럴 정리, 순환 제거
- [ ] 네이밍/레벨 위반 발생지 점검 및 수정

## Definition of Done

- [ ] 린트/타입/테스트/품질 리포트 그린
- [ ] 변경 포인트와 의존 흐름 문서화


