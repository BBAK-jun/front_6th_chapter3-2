# 반복 일정 서버 통합 및 UI 연동 - Brownfield Addition

## User Story

As a **사용자**,  
I want **반복 일정 설정 후 서버에 저장되고 UI에 반영되도록**,  
So that **생성된 반복 일정을 실제로 관리할 수 있다**.

## Story Context

**Existing System Integration:**

- Integrates with: Story 1.1과 1.2에서 구현된 반복 패턴 계산 함수, useEventOperations 훅, 서버 API
- Technology: React 19.1.0, TypeScript, Express.js, Material-UI, Vite, Vitest
- Follows pattern: 기존 이벤트 저장 패턴, API 호출 패턴, UI 상태 관리 패턴
- Touch points: 반복 일정 서버 저장, UI 상태 업데이트, 사용자 피드백

## Acceptance Criteria

**Functional Requirements:**

1. 반복 패턴 계산 결과를 기반으로 개별 이벤트들을 생성해야 한다
2. 생성된 모든 반복 일정이 서버 API를 통해 저장되어야 한다
3. 반복 일정 저장 후 성공 메시지가 표시되어야 한다
4. 저장된 반복 일정이 UI에 즉시 반영되어야 한다
5. 반복 일정 생성 중 오류가 발생하면 적절한 에러 메시지가 표시되어야 한다

**Integration Requirements:**

6. 기존 useEventOperations 훅의 saveEvent 함수와 연동되어야 한다
7. 기존 이벤트 데이터 구조와 호환되어야 한다
8. 기존 일정 생성/수정 UI와 통합되어야 한다

**Quality Requirements:**

9. 반복 일정 저장 기능에 대한 통합 테스트가 작성되어야 한다
10. 기존 단일 일정 생성 기능이 정상 동작함을 확인해야 한다
11. 에러 처리 및 사용자 피드백이 적절히 구현되어야 한다

## Technical Notes

- **Integration Approach:** 기존 saveEvent 함수를 확장하여 반복 일정을 개별 이벤트로 변환하고 저장, UI 상태를 업데이트하여 즉시 반영
- **Existing Pattern Reference:** 기존 이벤트 저장 패턴, API 호출 패턴, 성공/실패 메시지 표시 패턴
- **Key Constraints:** 기존 이벤트 생성 로직을 건드리지 않고 반복 일정 처리 로직만 추가, 서버 API 변경 없이 클라이언트에서 처리

## Definition of Done

- [ ] 반복 패턴 계산 결과를 기반으로 개별 이벤트들이 정상 생성됨
- [ ] 모든 반복 일정이 서버에 정상 저장됨
- [ ] 반복 일정 저장 후 성공 메시지가 표시됨
- [ ] 저장된 반복 일정이 UI에 즉시 반영됨
- [ ] 반복 일정 생성 중 오류 발생 시 적절한 에러 메시지가 표시됨
- [ ] 기존 단일 일정 생성 기능이 정상 동작함을 확인
- [ ] 반복 일정 저장 기능에 대한 통합 테스트가 통과함
- [ ] 코드가 기존 프로젝트 패턴과 표준을 따름

## Risk and Compatibility Check

**Minimal Risk Assessment:**

- **Primary Risk:** 반복 일정 저장 로직의 복잡성으로 인한 기존 이벤트 저장 기능과의 충돌
- **Mitigation:** 기존 saveEvent 함수를 건드리지 않고 별도 함수로 분리하여 구현, 철저한 테스트를 통한 검증
- **Rollback:** 반복 일정 저장 로직만 제거하여 기존 기능 복원 가능

**Compatibility Verification:**

- [x] No breaking changes to existing APIs (기존 /api/events 엔드포인트 유지)
- [x] Database changes (if any) are additive only (기존 이벤트 구조에 반복 정보만 추가)
- [x] UI changes follow existing design patterns (기존 UI 패턴 활용)
- [x] Performance impact is minimal (기존 이벤트 저장 성능에 미치는 영향 최소화)

## Implementation Details

**Server Integration:**
- 반복 패턴 계산 결과를 개별 이벤트로 변환하는 함수 구현
- 기존 saveEvent 함수에 반복 일정 처리 로직 통합
- 반복 일정들을 순차적으로 서버에 저장

**UI Integration:**
- 반복 일정 생성 후 UI 상태 즉시 업데이트
- 성공/실패 메시지 표시
- 로딩 상태 표시 (긴 작업 시간에 대한 피드백)

**Data Structure:**
- 반복 일정을 개별 이벤트로 변환하는 로직 구현
- 반복 정보를 이벤트 데이터에 포함하여 저장
- 기존 이벤트 데이터 구조와의 호환성 유지

## Testing Strategy

**Integration Tests:**
- 반복 일정 저장 기능과 서버 API와의 통합 테스트
- UI 상태 업데이트 테스트
- 사용자 피드백 메시지 테스트

**Regression Tests:**
- 기존 단일 일정 생성 기능 검증
- 기존 일정 수정/삭제 기능 검증
- 기존 이벤트 목록 표시 기능 검증

**Error Handling Tests:**
- 서버 오류 발생 시 에러 처리 테스트
- 네트워크 오류 발생 시 에러 처리 테스트
- 잘못된 데이터에 대한 유효성 검사 테스트

## Success Metrics

- 반복 패턴 계산 결과가 정확하게 개별 이벤트로 변환됨
- 모든 반복 일정이 서버에 정상적으로 저장됨
- 반복 일정 저장 후 즉시 UI에 반영됨
- 적절한 성공/실패 메시지가 표시됨
- 기존 단일 일정 생성 기능의 성능이 유지됨
- 반복 일정 저장 기능에 대한 테스트 커버리지가 100% 달성됨
- 사용자가 반복 일정을 실제로 관리할 수 있게 됨

## Dependencies

- **Prerequisite**: Story 1.1 (기본 반복 패턴 계산) 및 Story 1.2 (고급 반복 옵션) 완료 필요
- **Integration Points**: 기존 useEventOperations 훅, 서버 API, UI 상태 관리 시스템

---

# Story 1.3: 반복 일정 수정/삭제 기능 구현

## Story Goal

반복 일정을 개별적으로 수정하거나 삭제할 수 있도록 하여, 사용자가 특정 반복 일정만 선택적으로 관리할 수 있도록 합니다.

**중요한 제약사항**: 백엔드 마이그레이션은 배제하고, 프론트엔드에서만 반복 일정 수정/삭제 기능을 구현합니다.

## User Story

**As a** 사용자,  
**I want** 반복 일정을 수정하거나 삭제할 수 있도록,  
**so that** 특정 일정만 선택적으로 변경하거나 제거할 수 있다.

## Acceptance Criteria

1. 반복 일정 수정 시 해당 일정만 단일 일정으로 변경되어야 한다
2. 수정된 일정은 반복 일정 아이콘이 사라져야 한다
3. 수정된 일정은 **기존 JSON 파일에 저장**되어야 한다
4. 반복 일정 삭제 시 해당 일정만 삭제되어야 한다
5. 삭제된 일정은 **기존 JSON 파일에서 제거**되어야 한다
6. 수정/삭제 후 성공 메시지가 표시되어야 한다
7. **백엔드 시스템은 전혀 변경되지 않아야 한다**

## Technical Notes

**Implementation Approach:**
- 기존 이벤트 수정/삭제 로직에 반복 일정 처리 로직 추가
- 반복 일정을 단일 일정으로 변환하는 로직 구현
- 기존 API 엔드포인트를 활용하여 데이터 처리

**Key Functions to Implement:**
- `convertRepeatingToSingleEvent(event)`: 반복 일정을 단일 일정으로 변환
- `handleRepeatingEventEdit(event, newData)`: 반복 일정 수정 처리
- `handleRepeatingEventDelete(eventId)`: 반복 일정 삭제 처리

**Data Structure Changes:**
- 기존 Event 인터페이스 활용 (변경 없음)
- 반복 일정 수정 시 repeat 필드를 'none'으로 변경

**Integration Points:**
- 기존 useEventOperations 훅
- 기존 PUT /api/events/:id API 엔드포인트
- 기존 DELETE /api/events/:id API 엔드포인트
- 기존 이벤트 상태 관리 로직

## Definition of Done

- [ ] 반복 일정 수정 시 해당 일정만 단일 일정으로 변경됨
- [ ] 수정된 일정의 반복 일정 아이콘이 사라짐
- [ ] 수정된 일정이 기존 JSON 파일에 올바르게 저장됨
- [ ] 반복 일정 삭제 시 해당 일정만 삭제됨
- [ ] 삭제된 일정이 기존 JSON 파일에서 제거됨
- [ ] 수정/삭제 후 성공 메시지가 표시됨
- [ ] 기존 이벤트 수정/삭제 기능이 정상적으로 동작함
- [ ] **백엔드 시스템이 전혀 변경되지 않았음을 확인**
- [ ] 단위 테스트가 작성되고 통과함
- [ ] 기존 기능과의 호환성이 검증됨

## Risk Assessment

**Technical Risks:**
- 기존 이벤트 수정/삭제 로직과의 충돌
- 반복 일정을 단일 일정으로 변환하는 과정에서의 데이터 손실

**Integration Risks:**
- 기존 API 엔드포인트와의 호환성 문제
- 기존 이벤트 상태 관리와의 충돌

**Mitigation Strategies:**
- TDD 방식으로 단계적 구현
- 기존 로직을 최대한 유지하면서 확장
- 기존 기능과의 호환성 지속적 검증
- **백엔드 변경 없음으로 인한 위험 최소화**

## Testing Requirements

**Unit Tests:**
- 반복 일정을 단일 일정으로 변환하는 함수 테스트
- 반복 일정 수정 처리 함수 테스트
- 반복 일정 삭제 처리 함수 테스트

**Integration Tests:**
- 기존 API 엔드포인트와의 호환성 테스트
- 기존 이벤트 상태 관리와의 연동 테스트
- 기존 UI 컴포넌트와의 통합 테스트

**Regression Tests:**
- 기존 이벤트 수정 기능 테스트
- 기존 이벤트 삭제 기능 테스트
- 기존 이벤트 목록 업데이트 기능 테스트

## Dependencies

**Prerequisites:**
- Story 1.1이 완료되어 반복 일정 생성 로직이 구현되어야 함
- Story 1.2가 완료되어 반복 일정 시각적 구분이 구현되어야 함
- 기존 이벤트 수정/삭제 기능이 정상 동작해야 함

**External Dependencies:**
- 기존 API 엔드포인트
- 기존 이벤트 상태 관리 시스템

**Internal Dependencies:**
- 기존 Event 타입 정의
- 기존 이벤트 CRUD 로직
- 기존 이벤트 상태 관리 로직

## Integration Verification

**IV1:** 기존 이벤트 수정 기능이 정상적으로 동작하는지 확인
**IV2:** 기존 이벤트 삭제 기능이 정상적으로 동작하는지 확인
**IV3:** 기존 이벤트 목록 업데이트가 정상적으로 동작하는지 확인
**IV4:** **백엔드 시스템이 전혀 변경되지 않았는지 확인**

---

## 🚨 **TDD 준수 강제 지시사항**

### **⚠️ 절대 금지사항**
- **구현 코드를 먼저 작성하는 것**
- **테스트 없이 코드 작성하는 것**
- **테스트를 나중에 작성하는 것**

### **✅ 필수 준수사항**
1. **반드시 테스트를 먼저 작성해야 함**
2. **테스트가 실패하는 것을 확인한 후에만 구현 시작**
3. **테스트를 통과하는 최소한의 코드만 작성**
4. **각 단계마다 테스트 실행 및 통과 확인**

### **🔒 TDD 개발 순서 강제**
```
1단계: 테스트 작성 (Red) → 2단계: 구현 (Green) → 3단계: 리팩토링 (Refactor)
```

**위 순서를 절대 바꿀 수 없습니다!**

### **🎯 Red-Green-Refactor 전략 상세 가이드**

#### **Red 단계 (테스트 작성)**
- **목표**: 실패하는 테스트 작성
- **행동**: 구현하려는 기능에 대한 테스트 케이스 작성
- **결과**: 테스트가 반드시 실패해야 함 (Red)
- **검증**: `pnpm test --run` 실행하여 실패 확인 (빠른 피드백)

#### **Green 단계 (구현)**
- **목표**: 테스트를 통과하는 최소한의 코드 작성
- **행동**: 테스트가 통과할 수 있는 가장 간단한 코드 구현
- **결과**: 테스트가 반드시 통과해야 함 (Green)
- **검증**: `pnpm test --run` 실행하여 통과 확인 (빠른 피드백)

#### **Refactor 단계 (리팩토링)**
- **목표**: 코드 품질 개선 (기능 변경 없이)
- **행동**: 중복 제거, 가독성 향상, 구조 개선
- **결과**: 테스트가 여전히 통과해야 함
- **검증**: `pnpm test --run` 실행하여 통과 유지 확인 (빠른 피드백)

---

## TDD 개발 가이드

### TDD 개발 원칙

#### Red-Green-Refactor 사이클
1. **Red**: 실패하는 테스트 작성
2. **Green**: 테스트를 통과하는 최소한의 코드 작성
3. **Refactor**: 코드 개선 (기능 변경 없이)

#### 핵심 규칙
- **테스트 우선**: 구현 코드보다 테스트 코드를 먼저 작성
- **최소한의 코드**: 테스트를 통과하는 최소한의 코드만 작성
- **지속적 리팩토링**: 각 단계마다 코드 품질 개선

### 개발 워크플로우

#### 일일 개발 사이클
1. **아침**: 오늘 구현할 기능의 테스트 작성
2. **오후**: 테스트를 통과하는 코드 구현
3. **저녁**: 코드 리팩토링 및 내일 테스트 계획

#### 스토리별 완료 체크리스트
- [ ] 모든 테스트 케이스 작성 완료
- [ ] 테스트 통과 확인
- [ ] 코드 리팩토링 완료
- [ ] 기존 기능 회귀 테스트 통과
- [ ] 백엔드 변경 없음 확인

### 테스트 작성 가이드

#### 테스트 파일 구조
```typescript
// src/__tests__/hooks/useEventOperations.spec.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEventOperations } from '../../hooks/useEventOperations';

describe('useEventOperations - Repeating Events', () => {
  // 테스트 그룹들...
});
```

#### 기본 테스트 패턴
```typescript
it('should convert repeating event to single event when editing', async () => {
  // Given: 반복 일정 데이터
  const repeatingEvent = {
    id: '1',
    title: '반복 회의',
    date: '2024-12-20',
    repeat: { type: 'daily', interval: 1 }
  };
  
  // When: 반복 일정 수정
  const { result } = renderHook(() => useEventOperations());
  await act(async () => {
    await result.current.updateEvent('1', { title: '수정된 회의' });
  });
  
  // Then: 반복 일정이 단일 일정으로 변환되어야 함
  expect(result.current.events.find(e => e.id === '1')?.repeat.type).toBe('none');
});
```

#### 테스트 실행 명령어
```bash
# 특정 테스트 파일 실행
pnpm test src/__tests__/hooks/useEventOperations.spec.ts

# 테스트 커버리지 확인
pnpm run test:coverage

# 테스트 UI 실행
pnpm run test:ui
```

### 스토리별 테스트 전략

#### 반복 일정 변환 로직 테스트
- **단위 테스트**: convertRepeatingToSingleEvent 함수의 정확성 검증
- **경계값 테스트**: 다양한 반복 설정에 대한 변환 검증
- **에러 케이스 테스트**: 잘못된 데이터에 대한 처리 검증

#### 반복 일정 수정 기능 테스트
- **기능 테스트**: 반복 일정 수정 로직 검증
- **통합 테스트**: 기존 API 엔드포인트와의 연동 검증
- **상태 관리 테스트**: 이벤트 상태 업데이트 검증

#### 반복 일정 삭제 기능 테스트
- **기능 테스트**: 반복 일정 삭제 로직 검증
- **통합 테스트**: 기존 삭제 API와의 연동 검증
- **UI 업데이트 테스트**: 삭제 후 UI 상태 변경 검증

### TDD 구현 단계

#### 1단계: 테스트 환경 설정
```bash
# 테스트 파일 생성
mkdir -p src/__tests__/hooks
touch src/__tests__/hooks/useEventOperations.spec.ts
```

#### 2단계: 첫 번째 테스트 작성 (Red 단계)
```typescript
// 반복 일정을 단일 일정으로 변환하는 테스트
it('should convert repeating event to single event when editing', async () => {
  const repeatingEvent = {
    id: '1',
    title: '반복 회의',
    date: '2024-12-20',
    repeat: { type: 'daily', interval: 1 }
  };
  
  const { result } = renderHook(() => useEventOperations());
  await act(async () => {
    await result.current.updateEvent('1', { title: '수정된 회의' });
  });
  
  expect(result.current.events.find(e => e.id === '1')?.repeat.type).toBe('none');
});
```

#### 3단계: 최소한의 구현 (Green 단계)
```typescript
// 최소한의 구현으로 테스트 통과
export function useEventOperations() {
  const updateEvent = async (id: string, updates: Partial<Event>) => {
    // 반복 일정을 단일 일정으로 변환하는 로직
    if (updates.title) {
      // 간단한 변환 로직
      return { ...updates, repeat: { type: 'none' } };
    }
    return updates;
  };
  
  return { updateEvent };
}
```

#### 4단계: 추가 테스트 작성 (Red 단계)
```typescript
// 반복 일정 삭제 테스트 추가
it('should delete only the specified repeating event', async () => {
  const events = [
    { id: '1', title: '반복 회의 1', repeat: { type: 'daily' } },
    { id: '2', title: '반복 회의 2', repeat: { type: 'daily' } }
  ];
  
  const { result } = renderHook(() => useEventOperations());
  await act(async () => {
    await result.current.deleteEvent('1');
  });
  
  expect(result.current.events).toHaveLength(1);
  expect(result.current.events[0].id).toBe('2');
});
```

#### 5단계: 실제 로직 구현 (Green 단계)
```typescript
// 실제 반복 일정 수정/삭제 로직 구현
export function useEventOperations() {
  const updateEvent = async (id: string, updates: Partial<Event>) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updates,
          repeat: { type: 'none' } // 반복 일정을 단일 일정으로 변환
        })
      });
      
      if (!response.ok) throw new Error('Failed to update event');
      
      return await response.json();
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  };
  
  const deleteEvent = async (id: string) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete event');
      
      // 로컬 상태에서 이벤트 제거
      setEvents(prev => prev.filter(event => event.id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  };
  
  return { updateEvent, deleteEvent };
}
```

#### 6단계: 리팩토링 (Refactor 단계)
```typescript
// 반복 일정 변환 로직을 별도 함수로 분리
function convertRepeatingToSingleEvent(event: Event, updates: Partial<Event>): Partial<Event> {
  return {
    ...updates,
    repeat: { type: 'none' }
  };
}

// API 호출 로직을 별도 함수로 분리
async function callEventAPI(endpoint: string, options: RequestInit) {
  const response = await fetch(endpoint, options);
  if (!response.ok) throw new Error(`API call failed: ${response.statusText}`);
  return response;
}

export function useEventOperations() {
  const updateEvent = async (id: string, updates: Partial<Event>) => {
    const event = events.find(e => e.id === id);
    if (!event) throw new Error('Event not found');
    
    const updatedData = convertRepeatingToSingleEvent(event, updates);
    
    try {
      await callEventAPI(`/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      
      // 로컬 상태 업데이트
      setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updatedData } : e));
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  };
  
  // ... deleteEvent 로직
}
```

---

## Story Handoff

**Developer Prompt:**

```
Assignment-7 프로젝트의 기존 시스템 아키텍처 문서를 참조하여 다음 요구사항을 구현해주세요:

**핵심 구현 요구사항:**
- 반복 일정을 단일 일정으로 변환하는 로직 구현
- 반복 일정 수정 시 기존 API 엔드포인트 활용
- 반복 일정 삭제 시 기존 API 엔드포인트 활용
- 기존 이벤트 상태 관리와의 통합 및 호환성 보장

**중요한 제약사항 (백엔드 마이그레이션 배제):**
- 백엔드 시스템은 전혀 변경하지 않음
- 기존 JSON 파일 기반 시스템을 그대로 유지
- 기존 API 엔드포인트 구조를 그대로 활용
- 기존 이벤트 데이터 구조를 그대로 활용

**기존 시스템과의 통합 요구사항:**
- 기존 useEventOperations 훅과의 호환성 보장
- 기존 API 엔드포인트와의 호환성 보장
- 기존 이벤트 상태 관리와의 호환성 보장
- 기존 UI 컴포넌트와의 호환성 보장

**구현 순서:**
1. 반복 일정을 단일 일정으로 변환하는 로직 구현
2. 기존 수정 API와의 연동 로직 구현
3. 기존 삭제 API와의 연동 로직 구현
4. 단위 테스트 작성 및 실행
5. 기존 기능과의 호환성 검증

**중요:** 모든 구현은 기존 시스템의 무결성을 유지하면서 진행되어야 하며, 백엔드 변경은 절대 금지입니다. TDD 방식으로 개발하여 안정성을 확보하세요.
```

---

**Story Manager Notes:**
This story focuses on implementing edit and delete functionality for repeating events. It should be implemented using TDD approach and must maintain compatibility with existing functionality. **Backend changes are strictly prohibited** - all logic should be implemented on the frontend only.

**🚨 TDD 준수 강제**: 개발 에이전트는 반드시 테스트를 먼저 작성하고, 테스트가 실패하는 것을 확인한 후에만 구현을 시작해야 합니다. 구현 코드를 먼저 작성하는 것은 절대 금지됩니다.
