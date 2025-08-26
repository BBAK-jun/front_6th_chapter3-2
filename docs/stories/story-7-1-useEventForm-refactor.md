# Story 7-1: useEventForm 리팩터링

## Goal

`useEventForm` 훅을 단일 책임 원칙에 맞춰 분해하고, 검증/계산/저장 로직을 헬퍼로 이동하여 가독성과 테스트 용이성을 높인다.

## Acceptance Criteria

1. 훅 본문은 상태 선언/이벤트 바인딩/헬퍼 호출에 집중한다.
2. 검증/시간 비교/중복 검사/저장 흐름은 `useEventForm.helpers.ts` 등으로 이동한다.
3. 함수는 20줄 미만, 복잡도 경고 해결 또는 완화.
4. 기존 테스트 100% 그린, 추가 단위 테스트로 검증/시간 로직 커버 강화.

## Technical Notes

- 네이밍 규칙: action 함수는 `create*/get*/update*/delete*/validate*/compute*` 패턴
- 의존 정리: 유틸은 `src/utils`, 도메인 흐름은 `src/hooks` 또는 `src/states`
- 테스트: GWT 패턴, 스냅샷 최소화, 빌더/픽스처 활용

## Tasks

- [ ] 훅에서 검증/계산/저장 흐름 분리(`useEventForm.helpers.ts`)
- [ ] 시간/겹침/반복 관련 유틸 재사용 및 중복 제거
- [ ] 단위 테스트 보강: 실패/경계/성공 경로

## Definition of Done

- [ ] 린트/타입/테스트 그린
- [ ] 함수 20줄/복잡도 기준 충족(또는 합리적 예외 문서화)
- [ ] PR 설명에 변경 포인트와 리스크/완화 기록


