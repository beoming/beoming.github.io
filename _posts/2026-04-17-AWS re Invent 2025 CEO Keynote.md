---
title: "AWS re:Invent 2025 CEO Keynote"
date: 2026-04-17
categories:
  - Cloud
  - AWS
tags:
  - AWS
  - Re;Invent
  - Keynote
---

# AWS re:Invent 2025 CEO Keynote

### ― Agentic AI 시대, AWS의 기술 진화와 AICC 사업 전략에 대한 시사점 ―

작성 관점: 기술·플랫폼·사업 전략 종합

분석 대상: AWS CEO Matt Garman Keynote (re:Invent 2025)

---

## 1. 보고서 목적 및 배경

본 보고서는 **2025 AWS re:Invent Keynote에서 발표된 AWS의 기술 전략, 플랫폼 구조, 신규 서비스 및 장기 비전**을 분석하고, 이를 **AICC(Application Intelligent Contact Center)** 사업 관점에서 해석함으로써 향후 **AICC 기술 로드맵, 서비스 구조, 경쟁 전략 수립에 참고 지표**를 제공하는 것을 목적으로 한다.

이번 키노트는 단순한 신기술 발표가 아니라,

> “AI를 어떻게 산업과 조직 안에서 운영 가능한 형태로 정착시키는가”
> 
> 
> 에 대한 AWS의 **명확한 선언적 메시지**였다.
> 

---

## 2. AWS 전략 변화의 본질적 해석

### 2.1 기존 AWS 포지셔닝 (과거)

- 인프라(IaaS) 중심 클라우드
- 확장 가능한 컴퓨팅 리소스 제공자
- AI는 “고객이 사용하는 워크로드 중 하나”

### 2.2 현재 AWS 포지셔닝 (2025)

- **AI 인프라 + AI 플랫폼 + AI 운영체제**
- AI를 단순한 기능이 아닌 **“조직의 행위 주체(Agent)”**로 상정
- 핵심 키워드:
    - *Agentic*
    - *System-level Control*
    - *Enterprise-grade Trust*

> 즉, AWS는 이제 “AI를 실행하는 클라우드”가 아니라,
> 
> 
> “AI가 일하도록 설계된 세계의 운영체제”를 지향한다.
> 

---

## 3. AI 인프라 전략: 규모·전력·운영 효율의 재정의

### 3.1 Trainium 중심의 수직 통합 전략

### 주요 내용

- Trainium2 → Trainium3 GA → Trainium4 개발 발표
- 전 세대 대비:
    - 연산 성능(Compute) 증가
    - 메모리 대역폭 대폭 확장
    - **전력 대비 토큰 처리량(토큰/MW) 5배 이상 개선**

AWS는 단순히 “더 빠른 칩”이 아니라,

> **“AI 연산 단가를 구조적으로 낮출 수 있는 전용 아키텍처”**를 만들고 있음
> 

### 3.2 Data Center = Computer 패러다임

- UltraServer 단위의 Scale-up
- EFA 기반 수십만 칩 Scale-out
- 단일 인스턴스에 수백 PFLOPS

이는 곧:

- 대규모 실시간 추론
- 수백만 Agent 동시 실행
- 24x7 AI 서비스

를 **운영 관점에서 지속 가능**하게 만든다는 의미

### AICC 관점 시사점

- 실시간 STT, 대화 요약, 정책 검증, Agent 행동 통제까지
    
    **하나의 상시 추론 파이프라인으로 구성 가능**
    
- “GPU 부담 때문에 못 한다”는 제약이 전략적으로 사라짐
- **대규모 컨택센터 Agent 자동화의 경제성 확보**

---

## 4. 모델 전략: 멀티모델 & 목적 분업 구조의 공식화

### 4.1 Bedrock의 역할 변화

Bedrock은 더 이상 “모델 마켓플레이스”가 아니라,

> Enterprise AI Control Plane 으로 진화함.
> 
- 모델 선택
- 모델 조합
- 트래픽 분기
- 보안 격리
- 정책 적용

을 모두 중앙에서 통제

---

### 4.2 Amazon Nova 2 패밀리의 전략적 의미

| 모델 | 핵심 포지션 |
| --- | --- |
| Nova 2 Lite | 대량 트래픽 처리, 비용 최적화 |
| Nova 2 Pro | 복합 추론, Agent reasoning |
| Nova 2 Sonic | 실시간 음성 Agent |
| Nova 2 Omni | 멀티모달 통합 인지 |

AWS는 명확히 전제함:

> “현실의 업무는 단일 모델로 해결되지 않는다.”
> 

### AICC 적용 시나리오 예시

- 실시간 통화:
    - STT → Nova Sonic
- 상담 처리 중:
    - 고객 의도 판단 → Nova Lite
- 정책/업무 판단:
    - 승인/보류/전달 → Nova Pro
- 상담 요약 + CRM 기록:
    - Omni 활용 가능

-> 기존 “LLM 1개로 다 처리” 구조 붕괴

---

## 5. Nova Forge: 기업 전용 LLM의 패러다임 전환

### 5.1 기존 기업 AI 통합 방식의 한계

| 방식 | 한계 |
| --- | --- |
| RAG | 실시간 컨텍스트 얕음 |
| Fine-tuning | 도메인 심층 이해 불가 |
| Post-training | 지식 망각 문제 |

### 5.2 Nova Forge의 핵심 가치

- Pre-training 단계에서
    - Amazon curated corpus
    - 고객 proprietary data
        
        **동시에 병합**
        
- 단계별 학습 제어
- 결과물은 고객 독점 모델 (*Novella*)

이는 곧:

> “모델이 우리 회사의 업무 DNA를 이해한다”
> 

는 의미

### AICC 관점 

- 상담 로그
- QA 판단 기준
- 클레임 처리 패턴
- 운영 정책

을 **프롬프트가 아니라 모델 구조 자체에 내재화** 가능

→ **사람 상담원의 숙련도를 AI로 재현**

---

## 6. AgentCore: 엔터프라이즈 Agent 운영체제

### 6.1 AgentCore 구성의 핵심 철학

AgentCore는 단순 SDK가 아니라,

> “Agent를 신뢰할 수 있게 만드는 최소 요건의 집합”
> 

| 구성요소 | 역할 |
| --- | --- |
| Runtime | 세션 격리 |
| Memory | 지속적 맥락 |
| Identity | 권한 통제 |
| Gateway | API/Tool 연결 |
| Observability | 행동 추적 |
| Policy | 행위 제한 |
| Evaluations | 품질 검증 |

---

### 6.2 Policy & Evaluations의 실질적 의미

### Policy

- Agent의 **“무엇을 할 수 없는가”**를 명시
- 실행 이전 차단 (사후 로그 아님)
- 금융·공공 규제 충족의 핵심 기술

### Evaluations

- Agent 판단 품질을 상시 점수화
- 모델 변경 시 자동 Regression Evaluation

### AICC 시사점

- AI 상담이 “보조 도구”가 아니라
    
    **주 업무 처리 주체**로 승격 가능
    
- 내부 통제·감사·규제 이슈 해결

---

## 7. Frontier Agents: 인간 중심 조직 구조의 변화

### 7.1 Frontier Agent의 정의

AWS 정의:

- Autonomous
- Massively Scalable
- Long-running

즉,

> “지시받고 끝나는 AI가 아니라,
> 
> 
> 목표를 맡기고 결과를 검증하는 AI”
> 

---

### 7.2 Connect와 Frontier Agent의 결합 가능성

현재 기준으로 보면:

- Connect: 채널/플로우/음성 처리
- Bedrock: 추론
- AgentCore: 통제

→ **완전 자율 상담 Agent 기술적 조건 충족**

남은 것은:

- 제도
- 책임 모델
- 조직 설계

---

## 8. Amazon Connect: AICC 진화의 중심축

### 8.1 단순 CCaaS를 넘은 변화

- 연 ARR 10억 달러 돌파
- AI-native CCaaS 플랫폼

Connect는 이제:

> “상담 엔진이 아니라 CX Agent 플랫폼”
> 

### 8.2 향후 방향성

- Human Agent → Supervisor
- AI Agent → 1차 처리자
- QA → 실시간 자동화

---

### 8.3 AICC 전용 기술 아키텍처

### (Amazon Connect × Amazon Bedrock AgentCore 기반)

---

### 8.3.1. 아키텍처 목적

본 아키텍처는 **AWS re:Invent 2025**에서 발표된 방향성(에이전트 시대, AgentCore, Nova 2, AI Factory 등)을 반영하여, AICC(기업 컨택센터)를 위한 **차세대 “Agentic Contact Center” 표준 구조**를 정의하는 것을 목표로 한다.

특히 다음을 핵심 목표로 삼는다.

1. **옴니채널 상담 경험 고도화**
    - 음성(대표번호, 콜센터), 채팅(웹/앱), 메시징(카카오톡, SMS) 채널을 Connect로 통합.
    - 고객 앞단에는 **AI 에이전트(셀프 서비스)**, 상담사 뒤에는 **AI Agent Assist**를 배치.
2. **AgentCore 기반 에이전트 운영 플랫폼**
    - Amazon Bedrock AgentCore를 **AICC의 중앙 오케스트레이터**로 사용.
    - RAG, Tool Calling, Policy, Evaluations 등을 통해 **안전하고 통제 가능한 AI 에이전트** 제공.
3. **AICC 도메인 지식 기반의 전용 LLM 활용**
    - Amazon Nova, Open-weights(Mistral, Gemma 등), 서드파티 모델(필요 시)을 선택적으로 활용.
    - 장기적으로는 Nova Forge(Novella) 기반의 **금융/통신/제조 등 도메인 특화 사내 모델**로 확장.
4. **보안·컴플라이언스·운영 자동화 내재화**
    - AWS Security Agent, DevOps Agent, AgentCore Policy/Observability/Evaluations를 활용해
        
        “**보안/운영까지 포함한 완전한 AICC 플랫폼**” 구현.
        

---

### 8.3.2. 전체 High-level 아키텍처

```
[고객 채널]
  ├─ PSTN / SIP (전화)
  ├─ Web Chat / In-App Chat
  └─ Messaging (SMS, 카카오톡 등)
        │
        ▼
[Amazon Connect]
  ├─ Contact Flows (IVR, Routing)
  ├─ Queues / Routing Profiles
  ├─ Contact Lens (STT, 감정/키워드 분석)
  └─ Chat / Task Routing
        │  (Lambda / API 호출)
        ▼
[AICC Agent Layer - Bedrock AgentCore]
  ├─ Customer Service Agent (셀프 서비스 / FAQ / 업무처리)
  ├─ Agent Assist Agent (상담사 지원)
  ├─ Supervisor/QA Agent (품질/모니터링)
  ├─ Backoffice Automation Agent (정산/리포트 자동화)
  ├─ AgentCore Identity & Policy (도구/데이터 접근 통제)
  └─ AgentCore Evaluations & Observability
        │
        ▼
[AI / Data / Tooling Layer]
  ├─ Amazon Bedrock (Nova 2 Lite, Pro, Sonic, Omni 등)
  ├─ Open-weights Models (Mistral, Gemma, Nemotron 등)
  ├─ RAG 데이터 소스
  │    ├─ S3 + S3 Tables + S3 Vectors
  │    ├─ OpenSearch (벡터 인덱스)
  │    └─ RDS/Redshift/DocumentDB 등 업무 DB
  ├─ 사내 업무 시스템 API (CRM, 청구/Billing, ERP, 티켓/ITSM, WFO/WFM)
  └─ 보안/로깅 (CloudWatch, CloudTrail, GuardDuty, Security Hub, Security Agent, DevOps Agent)

```

---

### 8.3.3. 주요 구성 요소

### 3.1 채널 & 콜 처리 계층 – Amazon Connect

1. **채널 인입**
    - PSTN, SIP Trunk → Amazon Connect 인바운드 라우팅.
    - Web/App Chat → Connect Chat.
    - 필요 시 Visual IVR / Web-based BOT도 Connect Task/Chat로 통합.
2. **Contact Flow 설계**
    - 초입부에서 **“AI 셀프 서비스”와 “사람 상담” 선택 분기**.
    - 고객 인증(휴대폰번호, 계좌/고객번호), 기본 IVR 메뉴, 큐/스킬 기반 라우팅.
    - “AI 에이전트 호출”이 필요한 지점에서 Contact Flow에서 **Lambda 블록**을 통해 AgentCore 호출.
3. **Contact Lens**
    - 실시간 STT, 감정 분석, 키워드 추출, 규제 문구 준수 여부 탐지.
    - 이후 Agent Assist Agent가 사용할 **요약/키워드/감정 정보**를 메타데이터로 공급.
4. **기본 데이터 저장**
    - 콜/채팅 이력: Connect Contact Trace Record(CTR) + S3.
    - 음성 녹취: S3.
    - Contact Lens 결과: S3 + Athena/Redshift로 분석.

---

### 3.2 AICC Agent Layer – Bedrock AgentCore

### 3.2.1 AgentCore Runtime & Gateway

- **Runtime**
    - 각 에이전트 세션을 **격리된 서버리스 런타임**에서 실행.
    - Connect에서 들어온 요청(콜/채팅 컨텍스트, 고객 정보, 발화 내용 등)을 기반으로 AgentCore 내부 에이전트가 플로우를 구성.
- **Gateway**
    - Connect → Lambda → API Gateway/Private ALB → **AgentCore Gateway(Private VPC)** 구조.
    - Gateway 레벨에서 **Tool/데이터 소스 Discovery**, 네트워크 경계(프라이빗 서브넷/보안 그룹) 관리.

### 3.2.2 에이전트 종류

1. **Customer Service Agent (고객 셀프 서비스 에이전트)**
    - 역할: 고객의 의도를 파악하고, FAQ 응답, 단순 업무 처리(요금 조회, 주소 변경, 비밀번호 재설정, 배송 현황 조회 등) 수행.
    - 입력:
        - ASR 텍스트(Connect/Contact Lens)
        - 채널 정보(음성/채팅), 고객 식별자, 이전 대화 기록.
    - 도구:
        - RAG: AICC FAQ, 약관, 상품 설명서, 업무 매뉴얼(→ S3 Vectors + OpenSearch).
        - 사내 API: CRM, 청구, 주문 관리, 배송 시스템, 티켓 시스템.
    - 출력:
        - Connect IVR/Chat 응답 텍스트, TTS용 메시지, 후속 작업(티켓 생성, 알림 발송 등).
2. **Agent Assist Agent (상담사 지원 에이전트)**
    - 역할: 실시간 콜 중 상담사 화면에 **요약, 다음에 물어볼 질문, 추천 답변, Cross-sell/Up-sell 제안** 제공.
    - 입력:
        - 실시간 STT/Contact Lens 이벤트 스트림.
        - 고객 프로필/과거 상담 이력/상품 보유 현황.
    - 기능:
        - 실시간 콜 요약 / 콜 종료 후 최종 요약.
        - “다음으로 안내해야 할 절차” 가이드.
        - 내부 지식 문서 기반의 답변 초안 생성.
    - 출력:
        - 상담사 Desktop(CTI/WebUI) 위젯에 표시할 텍스트, 버튼(Script, 추천 문구 등).
3. **Supervisor / QA Agent (품질/감독 에이전트)**
    - 역할: 녹취/Transcript/Contact Lens 결과를 기반으로 **QA 스코어링, 교육이 필요한 상담사 탐지, 스크립트 미준수 케이스 자동 추출**.
    - 입력:
        - 하루/한 주 단위 콜 Transcripts + Contact Lens 텍스트.
    - 기능:
        - AgentCore Evaluations + Nova 2 모델 활용해 샘플링 또는 전수 품질 평가.
        - “고객 이탈 리스크 높음”, “규제 문구 누락” 등의 태깅.
    - 출력:
        - QA 리포트, 교육 대상 상담사 리스트, 콜별 코멘트.
4. **Backoffice Automation Agent (내부 업무 자동화 에이전트)**
    - 역할: 일 단위/주 단위 보고서 작성, 정산, 캠페인 목록 정리 등 반복 업무를 자동 수행.
    - 사용 예:
        - Connect CTR + 청구 DB를 기반으로 “일간 콜 트래픽/판매 conversion 리포트” 자동 작성.
        - IVR 이탈 구간 분석 후 개선 제안 문서 생성.

---

### 3.3 AgentCore 거버넌스 – Policy & Evaluations

1. **AgentCore Policy**
    - Cedar 기반 정책 언어를 사용하여, **에이전트가 어떤 도구를 어떤 상황에서 사용할 수 있는지**를 “정책”으로 강제.
    - 예시 정책:
        - “환불 금액이 100,000원 초과일 경우, 에이전트는 자동 환불 API를 호출할 수 없다. Supervisor 승인 플로우로 전환.”
        - “계좌번호, 주민번호 등의 민감 정보는 RAG 컨텍스트로 사용하되, LLM 응답에 노출해서는 안 됨.”
    - 정책은 AgentCore Gateway에서 **에이전트 코드와 완전히 분리된 계층에서 평가**되므로,
        
        프롬프트 우회/코드 버그와 관계 없이 **“정책 위반 액션”은 절대 실행되지 않도록** 보장.
        
2. **AgentCore Evaluations**
    - 에이전트의 실제 응답에 대해 **Helpfulness/Correctness/Harmfulness/On-brand 여부**를 지속적으로 자동 평가.
    - 사전 정의된 13개 평가 + AICC 전용 커스텀 평가(예: “민원 유발 가능 표현 사용 여부”, “금융규제 문구 누락 여부”) 구성.
    - 운영 방식:
        - 신규 모델 버전/프롬프트 변경 시, 샘플 대화셋에 대해 오프라인 평가 실행.
        - 실서비스 트래픽에 대해서는 샘플링 기반 온라인 평가 실행 → CloudWatch 대시보드로 모니터링.
    - 목표:
        - **에이전트 품질 저하를 조기 탐지**하고, 즉시 모델 롤백 또는 프롬프트/정책 조정 가능.

---

### 8.3.4. AI / 데이터 / Tool 계층

### 4.1 모델 레이어 – Amazon Bedrock + Nova

1. **기본 모델 전략**
    - **Nova 2 Lite**: 고빈도, 비용 민감한 업무(FAQ, 스크립트 제안, 요약 등)의 “워크호스 모델”.
    - **Nova 2 Pro**: Reasoning이 중요한 복잡 업무(민원 성격 판단, 케이스 라우팅, Cross-sell 추천).
    - **Nova 2 Sonic**: 실시간 음성 기반 Agent Assist/대화형 봇용.
    - **Nova 2 Omni**:
        - 음성 + 화면(IVR 메뉴, Visual IVR, 상담사 화면)을 모두 입력 받아, “한 세션 전체를 이해”해야 하는 고급 에이전트용.
2. **서드파티 및 오픈웨이트 모델**
    - Mistral Large, Ministral 3, Gemma, Nemotron 등을 상황에 맞게 선택:
        - 예: 특정 언어/도메인에 강점이 있는 모델을 RAG 질문 응답에 활용.
    - 모델 라우팅 전략:
        - AgentCore에서 Task 특성(속도/정확도/비용)을 기준으로 **모델 선택 또는 다중 모델 앙상블**.
3. **향후: Nova Forge 기반 사내 전용 모델(Novella)**
    - Connect/CRM/FAQ/업무 매뉴얼/QA 평가 데이터 등 AICC 도메인 데이터를
        
        **Nova 2 Lite/Pro의 “Open Training 모델 체크포인트” 단계에 주입**해 전용 Novella 생성.
        
    - 결과:
        - “우리 회사/우리 고객/우리 업무 프로세스에 최적화된 LLM” 확보.
        - 개인정보/규제 데이터는 VPC 내에서 처리, Bedrock의 데이터 격리/보안 모델 활용.

---

### 4.2 데이터 & RAG 구조

1. **Knowledge Data Lake**
    - S3 + S3 Tables + S3 Vectors 기반으로 **컨택센터 지식/문서의 중앙 저장소** 구성.
    - 예:
        - 업무 매뉴얼, FAQ, 공지사항, 상품 설명서, 약관 PDF, 내부 Wiki Export.
    - ETL:
        - Glue/Spark/EMR로 문서 파싱 → chunking → 임베딩 생성 → S3 Vectors & OpenSearch 인덱스.
2. **대화/업무 데이터**
    - Connect CTR/Contact Lens 결과: S3, Athena/Redshift.
    - CRM/CTI: RDS/DocumentDB/외부 SaaS API.
    - QA 결과/에이전트 평가: RDS/Redshift.
    - 이 데이터는 **RAG 컨텍스트 + Nova Forge 학습 데이터 + BI/리포트**로 재활용.
3. **벡터 검색 계층**
    - S3 Vectors + OpenSearch GPU 가속 인덱스 사용:
        - 대규모 문서/콜 로그에 대한 **고속 유사도 검색 + 메타데이터 필터링** 제공.
        - 예: “최근 30일, 상품 A 관련 민원 콜 중, ‘해지 위협’ 키워드가 포함된 사례만 검색해 요약.”

---

### 4.3 Tooling & 업무 시스템 연동

- **사내 CRM/청구/Billing/주문/배송/ERP/WFM/WFO/티켓 시스템**을
    
    AgentCore Tool로 등록 (Lambda, API Gateway, MCP 서버 형식 등).
    
- AgentCore Policy를 통해:
    - **“조회 전용”과 “쓰기 가능” 작업**을 명확히 구분.
    - 금액/권한/직무/시간대에 따른 **업무권한 한도**를 정책으로 제어.

---

### 8.3.5. 보안·운영 아키텍처

### 5.1 보안

1. **기본 보안 프레임워크**
    - IAM, VPC, 보안 그룹, Private Subnet, PrivateLink, KMS, Secrets Manager.
    - Connect ↔ AgentCore ↔ Bedrock ↔ 사내 시스템 간 모든 트래픽은 TLS + 프라이빗 경로.
2. **AWS Security Agent 연계**
    - AICC 전체 코드베이스(Connect 연동 Lambda, AgentCore 관련 마이크로서비스, API, 인프라 코드(CDK/Terraform))에 대해:
        - 보안 취약점 자동 스캔.
        - 카드 정보/개인정보 처리 경로에 대한 설계/코드 리뷰 자동화.
    - 결과:
        - 보안 리뷰 주기를 연 단위 → 주/일 단위로 단축, 릴리즈 속도와 보안성을 동시에 확보.
3. **데이터 보호**
    - PII/민감정보:
        - Contact Lens의 Redaction 기능 활용.
        - AgentCore Policy에서 “LLM 응답에 포함 금지” 룰 정의.
    - 데이터 마스킹/토큰화:
        - RDS/Redshift/Glue Transformation에서 계정/카드번호 마스킹 처리 후 RAG/분석용으로 사용.

### 5.2 운영 & 관제

1. **AWS DevOps Agent**
    - Connect/AgentCore/Bedrock 호출/백엔드 마이크로서비스에 대한:
        - 장애 탐지 → 원인 분석 → 수정 제안 코드(PR)까지 자동화.
    - 인시던트 대응:
        - CloudWatch/3rd-party Observability(Dynatrace, Datadog 등) 이벤트를 수집.
        - 잘못된 IAM 정책, 잘못된 배포/릴리즈, 설정 오류 등을 찾아 CDK 코드/파이프라인 수정안 제시.
2. **AgentCore Observability**
    - 에이전트별:
        - 평균 응답시간, Tool 호출 수, 모델 토큰 사용량, 실패율, 정책 위반 건수 등 대시보드 제공.
    - AICC 운영팀은:
        - 비즈니스 KPI(해결률, AHT, FCR, NPS)와 에이전트 품질 지표(Helpfulness, On-brand 등)를 연계 분석.

---

### 8.3.6. 단계적 도입 로드맵 

1. **Phase 1 – AI Agent Assist 도입 (상담사 뒤에 먼저)**
    - Connect + Contact Lens + Bedrock(Nova 2 Lite/Pro) + AgentCore 기반 **Agent Assist Agent** 구축.
    - 상담사 화면에 “요약/추천 멘트/지식 검색결과” 제공 → 리스크 적고, 효과 빠르게 체감.
2. **Phase 2 – 고객 셀프 서비스 에이전트 확대**
    - 주요 단순 문의(운영시간, 주소, 요금 조회, 배송 상태 등)를 Customer Service Agent로 이관.
    - 콜 Deflection, 평균 대기시간 감소, 야간/주말 24×7 대응.
3. **Phase 3 – QA/슈퍼바이저/Backoffice 에이전트**
    - QA Agent로 품질 평가/코칭 자동화.
    - Backoffice Automation Agent로 일/주 단위 리포트, 캠페인 리스트, 정산 보조 업무 자동화.
4. **Phase 4 – Nova Forge 기반 AICC 전용 Novella + Frontier Agents 연계**
    - AICC 도메인 데이터로 학습된 전용 모델(Novella)을 도입.
    - Kiro Autonomous Agent, Security Agent, DevOps Agent를 AICC 개발/운영 파이프라인에 결합,
        
        “**AICC 플랫폼 자체를 Frontier Agents가 개발·보안·운영하는 구조**”로 진화.
        

---

## 9. 종합 전략 회고

AWS는 명확히 다음을 노리고 있다.

1. **AI는 기능이 아니라 행위자다**
2. 행위자는 통제 가능해야 한다
3. 통제가 가능할 때 산업 적용이 된다

AICC는 이 흐름에서 **가장 빨리 완전자율화가 가능한 산업 영역** 중 하나다.

---



## 최종 결론

> AWS re:Invent 2025는 “AI 기술 행사”가 아니라
“AI 조직 운영 방식의 전환점”이었다.
> 

AICC는

- 더 이상 사람을 보조하는 AI가 아니라
- **사람의 일을 대신 수행하는 Agent를 설계해야 하는 단계**에 진입했다.

---
