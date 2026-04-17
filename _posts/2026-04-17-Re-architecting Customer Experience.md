---
title: "Re-architecting Customer Experience"
date: 2026-04-17
categories:
  - Cloud
  - AWS
tags:
  - AWS
  - Re;Invent
---

# Re-architecting Customer Experience

## Amazon Connect 기반 Agentic AI CX 운영 모델의 실제 구현과 전략적 시사점

**분석 대상 세션**

- MAM211 | *Turning Complexity into Effortless CX with Amazon Connect*
- BIZ217 | *Global Tourism Brand transforms customer service with Amazon Connect*
- BIZ221 | *Agentic AI advancements in customer experience with Amazon Connect*

---

## 1. 보고서 목적과 접근 방식

본 보고서는 AWS re:Invent 2025에서 발표된 **Amazon Connect 관련 3개 핵심 세션**을 기반으로,

Amazon Connect가 **단순 CCaaS를 넘어 ‘Agentic AI 기반 CX 운영 플랫폼’으로 진화하는 구조와 그 실증 사례**를 분석한다.

특히 다음 질문에 답하는 것을 목적으로 한다.

1. 왜 AWS는 CX 영역을 Agentic AI의 핵심 산업으로 보는가
2. Amazon Connect는 기존 CCaaS 대비 어떤 구조적 차별성을 갖는가
3. Agentic AI는 실제로 어디까지 사람을 대체하고, 어디서 사람을 강화하는가
4. 대기업 사례에서 검증된 운영 성과는 무엇인가
5. 기업은 어떤 순서와 방식으로 Agentic CX로 전환해야 하는가

---

## 2. CX 복잡성의 본질: 기술 문제가 아닌 “운영 구조 문제”

### 2.1 기존 CX 환경의 공통적 한계

세션 전반에서 공통적으로 등장하는 문제는 다음과 같다.

- CX 시스템 난립
    - 평균 20~80개 이상의 운영 시스템
    - 채널별, 지역별, 조직별 기술 파편화
- 데이터 단절
    - 고객 이력·의도·여정이 시스템 간 분리
    - 실시간 판단 불가
- 인간 중심 비효율
    - 상담원이 정보를 “찾는 데” 시간을 소비
    - 평균 처리 시간(AHT)의 상당 부분이 비부가 가치 영역

TUI, Centrica, 금융·보험·공공 고객 사례 모두

**“상담 실패의 원인은 상담원이 아니라 시스템 구조”**라는 결론에 도달했음을 명확히 보여준다.

---

## 3. Amazon Connect의 포지셔닝 변화

### CCaaS → Composable, Agentic CX Platform

### 3.1 Connect는 더 이상 ‘컨택센터 솔루션’이 아니다

Amazon Connect는 전통적인 CCaaS 정의에서 벗어나 다음 특성을 갖는 플랫폼으로 재정의되고 있다.

- 단일 애플리케이션이 아님
- **CX Orchestration Engine**
- **Human + AI Agent를 동일한 행위 주체로 취급**
- 채널·AI·데이터·운영을 하나의 엔진으로 통합

이는 AWS가 세션 내내 강조한 핵심 메시지다.

> “Amazon Connect는 AI가 붙은 CCaaS가 아니라
> 
> 
> AI가 중심이 되는 CX 운영 엔진이다.”
> 

---

## 4. Agentic AI의 실제 정의: IVR의 진화가 아닌, 운영 주체의 전환

### 4.1 세션에서 정의된 Agentic AI

세 가지 세션에서 공통적으로 정의된 Agentic AI의 조건은 다음과 같다.

| 항목 | 기존 봇 / IVR | Agentic AI |
| --- | --- | --- |
| 역할 | 요청 응답 | 목표 기반 행위 |
| 상태 | Stateless | Stateful (Memory) |
| 판단 | 규칙 기반 | Context + Reasoning |
| 실행 | 선형 플로우 | Tool 호출 + Action |
| 책임 | 없음 | Evaluation 대상 |

즉, Agentic AI는

**“대화를 하는 AI가 아니라, 일을 처리하는 AI”**다.

---

### 4.2 Amazon Connect의 Agentic 구현 방식이 중요한 이유

AWS는 Agentic AI를 다음 세 가지 원칙으로 제한 없이 열어두되, 위험 없이 운영 가능하게 설계했다.

1. **Continuum 접근**
    - 100% Human
    - Human + AI Assistance
    - Partial Agentic
    - 100% Agentic
        
        → 고객/업무별로 자유롭게 선택
        
2. **Action before Automation**
    - 이해만 하는 AI가 아님
    - 실제 업무(Action)를 수행하는 AI
3. **Evaluation-First 운영**
    - AI도 사람과 동일하게 평가
    - 성능·정책·품질 기준 통과 필수

---

## 5. 핵심 기술 구성 요소 분석

### 5.1 AI Native Contact Flow

- 음성/채팅 시작 시점부터 AI 개입
- 고객 인증, 의도 파악, 우선순위 판단 자동화
- 채널 전환(Voice → Chat → Push) 시 맥락 유지

“고객이 다시 설명하지 않아도 되는 CX” 구현

---

### 5.2 Low-code Agentic AI Builder

Agentic AI는 더 이상 연구 과제가 아니라 **현업 구성 가능 자산**으로 제공된다.

- Capability 기반 설계
    - 검색
    - 추천
    - 예약
    - 결제
    - 정책 확인
- MCP(Model Context Protocol) 기반 외부 시스템 연계
- 보안 프로파일로 접근 범위 명시

“AI를 개발하는 조직”이 아니라

“AI를 설계·통제하는 조직”으로 전환

---

### 5.3 Unified Data & Observability

Amazon Connect의 차별성은 **운영 데이터 통합**에 있다.

- Human Agent
- AI Agent
- Bot
- Channel
- Journey
- Action History

모두 동일한 기준으로 로그·지표·평가 가능

기존 AHT 중심 KPI에서

**문제 해결률, 성공 행동률, 재접촉률 기반 평가 체계**로 이동

---

## 6. 실증 사례 분석

### 6.1 NTT 사례 (MAM211)

- Agentic AI를 IVR 대체로 활용
- 대규모 음성 중심 CX 재정립
- 실시간 음성 분석 + 정책 위반 즉시 차단
- Human Agent 역할: 처리 → 감독·품질·공감

**“음성은 가장 높은 ROI를 내는 디지털 채널”이라는 재해석**

---

### 6.2 TUI 사례 (BIZ217)

- 85개 이상 시스템 → Amazon Connect 중심 단일화
- 10,000+ 에이전트 / 12개 국가 / 8개 언어 통합

**성과**

- 고객 접촉 30% 감소
- AHT 25% 단축
- CSAT 25% 상승
- 매출 전환 25% 증가
- 고객당 비용 10% 절감

**비용 절감과 고객 경험 개선의 동시 달성**

---

### 6.3 Centrica 사례 (BIZ221)

- 완전한 CC 시스템 단일화
- Auto Wrap, Agent Assist, Vulnerability Detection 활용

**성과**

- NPS 최대 89% 개선
- 평균 처리 시간 140s → 87s
- 민감 고객 대응 자동화

**AI는 비용 절감 도구가 아니라 리스크 관리 도구**

---

## 7. 전략적 시사점

### 7.1 CX의 미래는 “Effortless”가 아니라 “Invisible”

AWS가 말하는 Effortless CX의 본질은

고객이 느끼기에 **노력이 존재하지 않는 경험**이다.

- 기다리지 않는다
- 반복 설명하지 않는다
- 문제를 제기하기 전에 해결된다

이는 기술 문제가 아니라 **운영 철학의 변화**다.

---

### 7.2 Agentic AI의 현실적 도입 순서

AWS와 고객 사례가 공통적으로 제시하는 순서:

1. **Agent Assist**
2. **Supervisor AI**
3. **Partial Self-service Agent**
4. **Critical-free 영역 자율 Agent**
5. **End-to-End Agentic CX**

---

## 8. Agentic CX 전환 로드맵

### ― Amazon Connect 기반 단계적 실행 전략 ―

---

## 8.1. 로드맵 수립 배경

Agentic AI는 **“도입 여부의 문제”가 아니라 “도입 방식의 문제”**다.

AWS re:Invent 2025의 모든 Connect 관련 세션은 다음 사실을 반복적으로 증명한다.

> Agentic AI를 한 번에 전면 적용한 기업은 없다.
> 
> 
> 성공 기업은 모두 **단계적·선별적 확장 전략**을 사용한다.
> 

따라서 본 로드맵은 **AICC 조직이 리스크를 통제하면서도 실질 성과를 내기 위한 단계적 전환 경로**를 제시한다.

---

## 8.2. Agentic CX 전환의 5단계 구조 개요

| 단계 | 핵심 키워드 | AI 역할 | 사람 역할 |
| --- | --- | --- | --- |
| Phase 0 | 기반 정비 | 없음 | 전면 수행 |
| Phase 1 | Agent Assist | 조언자 | 실행자 |
| Phase 2 | Supervisor AI | 판단 보조 | 감독 |
| Phase 3 | Partial Agentic | 부분 실행 | 승인 |
| Phase 4 | Frontier Agent | 자율 실행 | 거버넌스 |

---

## 8.3. Phase 0 — AICC 기반 정비 단계

### (AI 도입 전 필수 단계)

### 3.1 목적

- AI 도입을 가로막는 **CX 구조적 복잡성 제거**
- “AI가 일을 못 하는 이유”를 기술이 아닌 운영에서 제거

---

### 3.2 핵심 과제

### ① CX 기술 단일화

- Amazon Connect를 CX Control Plane으로 지정
- 채널별 솔루션 흡수 또는 통합

[성공 기준]

- 상담원이 사용하는 화면 수 ↓
- CX 경로가 Connect 중심으로 수렴

---

### ② 데이터 정비 (Garbage In → Garbage Out 차단)

- 고객 정보
- 상담 이력
- 정책 문서
- 프로세스 정의

“정확하지 않은 데이터로 AI를 평가하지 않기 위한 단계”

---

### ③ KPI 전환 준비

- AHT 중심 KPI → 문제 해결 중심 KPI
    - First Contact Resolution
    - Re-contact Rate
    - Policy Violation
    - AI Recommendation Acceptance

---

## 8.4. Phase 1 — Agent Assist 중심 전환

### (가장 빠른 ROI 구간)

### 4.1 목표

- AI를 **고객이 아닌 상담원에게 먼저 적용**
- 비용 절감 + 품질 개선을 동시에 달성

---

### 4.2 적용 영역

### 실시간 Agent Assist

- 고객 발화 요약
- 다음 액션 추천
- 정책 위반 실시간 경고
- 자동 Wrap-up

이 단계에서 AI는 **절대 “결정권자”가 아님**

---

### 4.3 조직 변화

| 항목 | 변화 |
| --- | --- |
| 상담원 | 정보 탐색자 → 문제 해결자 |
| 관리자 | 사후 리뷰 → 실시간 대응 |
| QA | 샘플 검사 → 전수 평가 |

---

### 성공 지표

- AHT 15~30% 단축
- QA 비용 감소
- 상담원 이탈률 감소

---

## 8.5. Phase 2 — Supervisor AI 도입

### (운영 자동화 시작점)

### 5.1 목표

- **“사람이 관리하는 컨택센터”에서
“AI가 운영을 보조하는 컨택센터”로 전환**

---

### 5.2 적용 영역

### 실시간 운영 판단

- SLA 임계치 예측
- 큐/라우팅 자동 조정 제안
- 고위험 고객 자동 플래그
- 이탈 가능성 조기 감지

---

### 5.3 조직 변화

| 역할 | 변화 |
| --- | --- |
| Supervisor | 수동 관리 → 전략적 의사결정 |
| 관리자 | KPI 대응 → 원인 제거 |
| AI | 운영 분석가 |

---

### 성공 지표

- SLA 위반 사전 차단
- 관리자 1인당 관리 가능 인원 증가
- 운영 리스크 감소

---

## 8.6. Phase 3 — Partial Agentic CX

### (AI의 실행 권한 제한적 부여)

### 6.1 목표

- 반복·저위험 업무부터 AI에게 **“행동 권한” 부여**

> 핵심 원칙:
> 
> 
> **“실행은 허용하되, 책임은 사람에게”**
> 

---

### 6.2 적용 영역

### AI 단독 처리 업무

- 조회
- 예약 변경
- 일정 안내
- 인증 후 정보 제공

### AI + Human 승인

- 환불
- 상품 변경
- 약관 예외 적용

---

### 6.3 아키텍처 특징

- Policy Guardrail 필수
- Action Log 전면 기록
- Evaluation 자동 적용

---

### 성공 지표

- Self-service 해결률 증가
- Human Escalation 감소
- 고객 재접촉률 감소

---

## 8.7. Phase 4 — Frontier Agent 도입

### (Agentic CX 완성 단계)

### 7.1 목표

- AI가 **“상담원이 아닌 업무 주체”로 작동**
- 사람은 통제·감사·설계 역할로 전환

---

### 7.2 Frontier Agent의 역할

- 목표 기반 행동
- 채널 간 자율 이동
- 고객 여정 선제 개입
- 정책·윤리 기준 자동 준수

---

### 7.3 Human 역할 재정의

| 역할 | 변화 |
| --- | --- |
| 상담원 | 처리자 → 고난도 전문가 |
| 관리자 | 운영자 → AI 거버넌스 |
| QA | 검사자 → 기준 설계자 |

---

### 성공 지표

- 상담 인력 증대 없이 트래픽 처리
- AI 실패율 < 기준 이하
- 감사·컴플라이언스 통과율 유지

---

## 

## 9. 전략적 결론

AICC의 미래 경쟁력은

“얼마나 많은 AI를 쓰느냐”가 아니라

“AI에게 언제, 얼마나 책임을 맡기느냐”에 달려 있다.

Amazon Connect는

이 전환을 **현실적으로 실행할 수 있는 유일한 CX 플랫폼 중 하나**다.

---

## 10. 결론

> Amazon Connect는 CX 산업에서
> 
> 
> “AI를 붙일 것인가?”의 문제를 이미 넘어섰다.
> 

이제의 질문은:

- **누가 AI에게 어떤 권한을 줄 것인가**
- **어디까지 AI에게 책임을 맡길 것인가**
- **사람은 무엇에 집중해야 하는가**

Re:Invent 2025의 메시지는 명확하다.

> CX의 경쟁력은 더 많은 사람을 두는 것이 아니라,
사람과 AI를 어떻게 협업시키느냐에 달려 있다.
> 

---
