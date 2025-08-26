# Story 7-4: 선언적 다이얼로그 관리(overlay-kit 도입)

## Goal

`App.tsx` 및 관련 UI에서 사용하는 다이얼로그/모달을 선언적 API로 전환한다. 기존 `useState` 기반 열림/닫힘 상태와 핸들러 분산을 제거하고, `overlay.open`/`overlay.openAsync`를 사용해 가독성과 재사용성을 높인다.

- 라이브러리: [overlay-kit](https://github.com/toss/overlay-kit)

## Why

- 상태(state)와 UI 로직이 섞여 있어 다이얼로그 제어 로직이 산재함
- 동일한 열기/닫기/결과 반환 코드 반복(DRY 위반) 및 테스트 가독성 저하
- Promise 기반 결과 처리로 절차를 단순화하고 SRP를 강화

## Scope

- 대상 다이얼로그(시각적 변경 없음)
  - 일정 겹침 경고 다이얼로그
  - 그룹 수정(일괄 제목 변경) 다이얼로그
  - 삭제 확인 다이얼로그

## Acceptance Criteria

1. 모든 다이얼로그가 `overlay-kit`으로 마이그레이션된다.
2. 다이얼로그 open 상태를 나타내는 지역 상태(`useState`)가 제거되고, 호출부는 `overlay.open` 또는 `overlay.openAsync`로 결과를 처리한다.
3. UI 텍스트/동작은 기존과 동일하다(시각적/접근성 동작 동일: ESC/백드롭 닫힘 등).
4. 테스트 전부 통과(필요 시 테스트 보완). 회귀 없음.

## Technical Notes

- 선언적 사용 예시 ([overlay-kit 레포](https://github.com/toss/overlay-kit))

```tsx
import { overlay } from 'overlay-kit';

// 확인 다이얼로그
const confirmed = await overlay.openAsync<boolean>(({ isOpen, close, unmount }) => (
  <Dialog open={isOpen} onClose={() => close(false)} onExit={unmount}>
    <DialogTitle>삭제 확인</DialogTitle>
    <DialogActions>
      <Button onClick={() => close(false)}>취소</Button>
      <Button color="error" onClick={() => close(true)}>삭제</Button>
    </DialogActions>
  </Dialog>
));
if (confirmed) {
  await deleteBulkEvents(ids);
}
```

- 컴포넌트/로직 경계
  - 다이얼로그 UI는 작은 표현 컴포넌트(또는 인라인 렌더러)로 구성
  - 호출부는 `open/openAsync`로 결과만 처리
- 접근성
  - `onClose`, `onExit`로 닫힘/언마운트 일관 처리
  - 키보드(ESC) 및 백드롭 닫힘 기존 동작 유지
- 설치/세팅
  - `pnpm add overlay-kit`
  - 루트(예: `main.tsx`)에 필요한 설정이 있다면 추가(라이브러리 가이드 준수)

## Tasks

- [ ] overlay-kit 설치 및 루트 세팅
- [ ] 겹침 경고 다이얼로그를 `overlay.openAsync`로 전환
- [ ] 그룹 수정(일괄 제목 변경) 다이얼로그를 `overlay.openAsync`로 전환
- [ ] 삭제 확인 다이얼로그를 `overlay.openAsync`로 전환
- [ ] App.tsx에서 다이얼로그 관련 `useState` 제거 및 호출부 단순화
- [ ] 테스트 보완(다이얼로그 열림/확정 플로우를 사용자 상호작용 그대로 유지)
- [ ] 린트/타입/테스트 그린

## Definition of Done

- [ ] App.tsx에서 다이얼로그 제어용 상태/핸들러 제거
- [ ] overlay-kit 기반 호출로 치환 완료(중복 로직 제거)
- [ ] 시각적/동작 동일, 모든 테스트 통과
- [ ] 문서에 전환 포인트와 설계 근거 반영


