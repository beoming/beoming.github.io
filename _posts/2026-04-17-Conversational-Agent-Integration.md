---
title: "Conversational Agent Integration"
date: 2026-04-17
categories:
  - Cloud
  - GCP
tags:
  - GCP
  - DialogFlow CX
  - Java
---
# Conversational Agent Integration

## 프로젝트 보고서

> 작성일: 2025년 12월
> 
> 
> **프로젝트명**: Conversational Agent Integration
> 
> **기술 스택**: Spring Boot 3.3.5, Java 17, Google Cloud Platform
> 

---

## 목차

1. [프로젝트 개요](about:blank#1-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EA%B0%9C%EC%9A%94)
2. [시스템 아키텍처](about:blank#2-%EC%8B%9C%EC%8A%A4%ED%85%9C-%EC%95%84%ED%82%A4%ED%85%8D%EC%B2%98)
3. [기술 스택 및 의존성](about:blank#3-%EA%B8%B0%EC%88%A0-%EC%8A%A4%ED%83%9D-%EB%B0%8F-%EC%9D%98%EC%A1%B4%EC%84%B1)
4. [주요 기능](about:blank#4-%EC%A3%BC%EC%9A%94-%EA%B8%B0%EB%8A%A5)
5. [데이터 흐름 및 동기화](about:blank#5-%EB%8D%B0%EC%9D%B4%ED%84%B0-%ED%9D%90%EB%A6%84-%EB%B0%8F-%EB%8F%99%EA%B8%B0%ED%99%94)
6. [배포 구조](about:blank#6-%EB%B0%B0%ED%8F%AC-%EA%B5%AC%EC%A1%B0)
7. [프로젝트 구조](about:blank#7-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EA%B5%AC%EC%A1%B0)
8. [현재 상태 및 완성도](about:blank#8-%ED%98%84%EC%9E%AC-%EC%83%81%ED%83%9C-%EB%B0%8F-%EC%99%84%EC%84%B1%EB%8F%84)
9. [주요 이슈 및 해결 방안](about:blank#9-%EC%A3%BC%EC%9A%94-%EC%9D%B4%EC%8A%88-%EB%B0%8F-%ED%95%B4%EA%B2%B0-%EB%B0%A9%EC%95%88)
10. [향후 개선 방향](about:blank#10-%ED%96%A5%ED%9B%84-%EA%B0%9C%EC%84%A0-%EB%B0%A9%ED%96%A5)
11. [리스크 및 고려사항](about:blank#11-%EB%A6%AC%EC%8A%A4%ED%81%AC-%EB%B0%8F-%EA%B3%A0%EB%A0%A4%EC%82%AC%ED%95%AD)

---

## 1. 프로젝트 개요

### 1.1 프로젝트 목적

**Conversational Agent Integration**은 고객과 상담사 간의 실시간 채팅을 지원하는 AI 챗봇 시스템입니다. Google Dialogflow CX를 활용하여 자연어 처리를 수행하고, 상담사가 실시간으로 대화를 모니터링하고 개입할 수 있는 기능을 제공합니다.

### 1.2 핵심 가치

- **실시간 양방향 통신**: 고객-상담사 간 실시간 메시지 동기화
- **AI 기반 자동 응답**: Dialogflow CX를 통한 지능형 챗봇 응답
- **상담사 지원 도구**: KMS, SOP, 응답 템플릿 등 상담 효율성 향상
- **확장 가능한 아키텍처**: 서버 분리 및 독립적 스케일링

### 1.3 주요 사용자

- **고객**: 웹 채팅을 통한 상품 문의, 주문 관리 등
- **상담사**: 실시간 대화 모니터링 및 개입, AI 분석 결과 활용

---

## 2. 시스템 아키텍처

### 2.1 전체 아키텍처 다이어그램

<img width="657" height="565" alt="스크린샷_2025-12-23_11 22 32" src="https://github.com/user-attachments/assets/523d2044-0122-4f48-9a36-d0cfbeaea575" />


### 2.2 서버 구조

### Chat Server (chat profile)

- **역할**: 고객용 채팅 서버
- **주요 기능**:
    - 고객 메시지 수신 및 처리
    - Dialogflow CX API 호출
    - Pub/Sub을 통한 Monitor Server와 메시지 동기화
- **배포**: Google Cloud Run (`customer-chat-server`)
- **포트**: 8080
- **데이터베이스**: H2 In-Memory (독립적)

### Monitor Server (monitor profile)

- **역할**: 상담사용 모니터링 서버
- **주요 기능**:
    - 실시간 대화 모니터링
    - 상담사 메시지 처리
    - AI 분석 결과 표시 (Intent, Entity, 세션 파라미터)
    - KMS/SOP/응답 템플릿 제공
    - WebSocket/SSE 실시간 통신
- **배포**: Google Cloud Run (`agent-monitor-server`)
- **포트**: 8080
- **데이터베이스**: H2 In-Memory (독립적, Chat Server와 분리)

### 2.3 핵심 아키텍처 원칙

1. **메시지 처리의 일관성**: 고객 메시지와 상담사 메시지 모두 동일한 흐름으로 처리
    - 메시지 입력 → DB 저장 → Dialogflow CX 호출 → AI 응답 저장 → Pub/Sub 발행
2. **양방향 동기화**: Pub/Sub을 통한 Chat Server ↔︎ Monitor Server 양방향 메시지 동기화
3. **독립적인 데이터베이스**: 각 서버는 독립적인 H2 In-Memory DB를 사용하며, Pub/Sub으로 동기화

---

## 3. 기술 스택 및 의존성

### 3.1 Backend 기술 스택

| 카테고리 | 기술 | 버전 | 용도 |
| --- | --- | --- | --- |
| **언어** | Java | 17 | 백엔드 개발 |
| **프레임워크** | Spring Boot | 3.3.5 | 애플리케이션 프레임워크 |
| **ORM** | Spring Data JPA | 3.3.5 | 데이터베이스 접근 |
| **보안** | Spring Security | 3.3.5 | 인증 및 인가 |
| **HTTP 클라이언트** | Spring WebFlux | 3.3.5 | 비동기 HTTP 통신 |
| **WebSocket** | Spring WebSocket | 3.3.5 | 실시간 통신 |
| **데이터베이스** | H2 Database | - | In-Memory 데이터베이스 |
| **빌드 도구** | Gradle | - | 의존성 관리 및 빌드 |

### 3.2 Google Cloud 서비스

| 서비스 | 용도 | 버전/설정 |
| --- | --- | --- |
| **Dialogflow CX** | AI 챗봇 플랫폼 | API v3 |
| **Cloud Pub/Sub** | 서버 간 메시지 동기화 | Topic: `chat-events` |
| **Cloud Run** | 컨테이너 기반 서버리스 배포 | 리전: `asia-northeast3` |
| **Cloud SQL** | KMS 데이터베이스 (Monitor Server) | MySQL 8.0 |

### 3.3 Frontend 기술 스택

| 기술 | 용도 |
| --- | --- |
| **HTML5 / CSS3** | 마크업 및 스타일링 |
| **Vanilla JavaScript (ES6+)** | 클라이언트 로직 |
| **SSE (Server-Sent Events)** | 실시간 이벤트 수신 (Monitor Server) |
| **WebSocket** | 양방향 실시간 통신 (Monitor Server) |

### 3.4 주요 의존성

```groovy
// Google Cloud Libraries
- google-cloud-dialogflow-cx: Dialogflow CX Java Client
- google-cloud-pubsub: Pub/Sub 클라이언트
- google-auth-library-oauth2-http: Google 인증

// Spring Boot Starters
- spring-boot-starter-web: REST API
- spring-boot-starter-data-jpa: JPA 지원
- spring-boot-starter-security: 보안
- spring-boot-starter-webflux: 비동기 HTTP
- spring-boot-starter-websocket: WebSocket 지원

// Database
- h2database: H2 In-Memory DB
- mysql-connector-j: MySQL 연결
- mysql-socket-factory-connector-j-8: Cloud SQL 연결
```

---

## 4. 주요 기능

### 4.1 Chat Server 기능

### 고객 채팅

- 실시간 고객 채팅 UI (`/static/index.html`)
- Dialogflow CX를 통한 AI 자동 응답
- Rich Content 지원 (이미지, 상품 카드, 버튼)
- 폴링 기반 실시간 메시지 업데이트
- 세션별 독립적인 채팅 관리

### API 엔드포인트

- `POST /api/send-message`: 고객 메시지 처리
- `GET /api/sessions/{sessionId}/messages`: 세션 메시지 조회
- `POST /pubsub/push`: Pub/Sub Push Subscription (Monitor Server 메시지 수신)

### 4.2 Monitor Server 기능

### 상담사 모니터링

- 실시간 대화 모니터링 대시보드 (`/static/agent-monitor.html`)
- 모든 고객 세션 목록 조회 및 관리
- 세션별 대화 내용 실시간 확인
- 상담사 직접 메시지 전송 및 개입

### AI 분석 결과

- **Intent 분석**: `session_summary`에서 추출한 모든 인텐트 리스트 표시
- **Entity 추출**: Dialogflow CX에서 추출한 엔티티 정보 표시
- **세션 파라미터**: Dialogflow CX의 모든 세션 파라미터 표시 (JSON 형식)

### 상담사 지원 도구

- **KMS (Knowledge Management System)**: 인텐트 기반 정책 문서 자동 검색 및 추천
- **SOP (Standard Operating Procedure)**: 인텐트별 업무 절차 안내 (섹션별 파싱)
- **응답 템플릿**: LLM 기반 상담사 응답 템플릿 생성 및 원클릭 삽입
- **액션 버튼**: 인텐트별 빠른 액션 버튼 제공

### 실시간 통신

- **SSE (Server-Sent Events)**: 우선 사용되는 실시간 이벤트 스트림
- **WebSocket**: SSE 실패 시 백업으로 사용
- **폴링**: SSE/WebSocket 모두 실패 시 사용 (60초 간격)

### API 엔드포인트

- `GET /api/agent/sessions`: 모든 세션 목록 조회
- `GET /api/agent/sessions/{sessionId}`: 특정 세션 정보 조회
- `GET /api/agent/sessions/{sessionId}/messages`: 세션 메시지 조회
- `POST /api/agent/sessions/{sessionId}/respond`: 상담사 응답 전송
- `GET /api/agent/kms/search?intentName={intent}`: KMS 정책 문서 검색
- `GET /api/agent/sop/search?intentName={intent}`: SOP 문서 검색
- `GET /api/agent/response-template?intentName={intent}`: 응답 템플릿 생성
- `GET /api/agent/events`: SSE 이벤트 스트림
- `WebSocket /ws/agent`: WebSocket 연결
- `POST /pubsub/push`: Pub/Sub Push Subscription (Chat Server 메시지 수신)

### 4.3 공통 기능

### Dialogflow CX 통합

- 12개 Tools 연동 (상품 검색, 주문 관리, 배송 조회 등)
- Webhook 엔드포인트 (`/api/agent-callback`)
- 세션 파라미터 추출 및 저장 (`session_summary`)

### Pub/Sub 양방향 동기화

- Chat Server → Monitor Server: 고객 메시지 및 AI 응답 동기화
- Monitor Server → Chat Server: 상담사 메시지 및 AI 응답 동기화
- 중복 방지: `responseId` 기반 중복 체크

---

## 5. 데이터 흐름 및 동기화

### 5.1 고객 메시지 처리 흐름

```
[고객 입력]
  ↓
[Chat Server UI: script.js]
  POST /api/send-message
  ↓
[ChatService.processMessage()]
  ↓
1. 세션 저장/조회
2. Dialogflow CX API 호출
   - DialogflowCxApiService.detectIntent()
   - 세션 파라미터 추출 (session_summary)
3. Chat Server DB에 저장
   - userMessage: 고객 메시지
   - reply: AI 응답
   - intentList, entities, sessionParameters 저장
4. Pub/Sub 발행
   - 고객 메시지 이벤트 (sender="user")
   - AI 응답 이벤트 (sender="bot")
  ↓
[Pub/Sub Topic: chat-events]
  ↓
[Monitor Server: PubSubPushController]
  ↓
1. Monitor Server DB에 저장
2. WebSocket/SSE 브로드캐스트
  ↓
[Monitor Server UI: agent-monitor.js]
  - 실시간 UI 업데이트
  - AI 분석 결과 표시
  - KMS/SOP/템플릿 업데이트
```

### 5.2 상담사 메시지 처리 흐름

```
[상담사 입력]
  ↓
[Monitor Server UI: agent-monitor.js]
  POST /api/agent/sessions/{sessionId}/respond
  ↓
[AgentMonitorService.saveAgentResponse()]
  ↓
1. Monitor Server DB에 상담사 메시지 저장
   - status: "AGENT_RESPONSE"
2. Pub/Sub 발행 (상담사 메시지 이벤트)
3. Dialogflow CX API 직접 호출
4. Monitor Server DB에 AI 응답 저장
5. Pub/Sub 발행 (AI 응답 이벤트)
  ↓
[Pub/Sub Topic: chat-events]
  ↓
[Chat Server: ChatPubSubPushController]
  ↓
1. Chat Server DB에 저장
  ↓
[고객 챗 서버 UI: script.js]
  - 폴링으로 메시지 조회
  - 상담사 메시지 및 AI 응답 표시
```

### 5.3 Pub/Sub 아키텍처

### Topic 및 Subscriptions

**Topic**: `chat-events`

**Subscriptions**:
1. **agent-monitor-sub** (Monitor Server용)
- 타입: Push Subscription
- Push Endpoint: `https://agent-monitor-server-{region}.run.app/pubsub/push?token={VERIFY_TOKEN}`
- 수신 메시지: Chat Server에서 발행한 고객 메시지 및 AI 응답

1. **customer-chat-sub** (Chat Server용)
    - 타입: Push Subscription
    - Push Endpoint: `https://customer-chat-server-{region}.run.app/pubsub/push?token={VERIFY_TOKEN}`
    - 수신 메시지: Monitor Server에서 발행한 상담사 메시지 및 AI 응답

### ChatEvent 모델

```java
ChatEvent {
    conversationId: String      // 세션 ID
    messageId: String          // 고유 메시지 ID (responseId)
    sender: String             // "user" | "bot" | "agent"
    text: String               // 메시지 내용
    timestamp: String          // ISO 8601 형식
    intentDisplayName: String  // 인텐트 이름
    intentConfidence: Double   // 인텐트 신뢰도
    intentList: List<String>   // session_summary에서 추출한 모든 인텐트
    status: String             // "SUCCESS", "ERROR", "AGENT_RESPONSE"
}
```

### 5.4 메시지 순서 보장

**정렬 기준**:
1. `createdAt` (시간순, 우선순위)
2. 타입 순서 (같은 시간일 경우)
- 고객 발화 (1)
- AI 응답 (2)
- 상담사 메시지 (3)
3. `id` (최종 정렬)

**같은 레코드의 userMessage와 reply 처리**:
- `sortTime` 필드를 사용하여 고객 메시지가 AI 응답보다 먼저 표시되도록 보장

---

## 6. 배포 구조

### 6.1 Google Cloud Run 배포

### Chat Server

- **서비스명**: `customer-chat-server`
- **리전**: `asia-northeast3`
- **프로파일**: `chat`
- **이미지**: `asia-northeast3-docker.pkg.dev/{PROJECT_ID}/chat-monitor-backend/chat-monitor-backend:latest`
- **Service Account**: `chat-sa@{PROJECT_ID}.iam.gserviceaccount.com`

### Monitor Server

- **서비스명**: `agent-monitor-server`
- **리전**: `asia-northeast3`
- **프로파일**: `monitor`
- **이미지**: 동일한 이미지 사용 (프로파일로 구분)
- **Service Account**: `monitor-sa@{PROJECT_ID}.iam.gserviceaccount.com`
- **Cloud SQL 연결**: KMS 데이터베이스 (`gsneotek-ncc-demo:us-central1:kms-database`)

### 6.2 환경 변수

### Chat Server

```bash
SPRING_PROFILES_ACTIVE=chat
DFCX_PROJECT_ID={PROJECT_ID}
DFCX_LOCATION=asia-northeast1
DFCX_AGENT_ID={AGENT_ID}
DFCX_ENVIRONMENT=draft
PUBSUB_TOPIC=chat-events
PUBSUB_PROJECT_ID={PROJECT_ID}
PUBSUB_VERIFY_TOKEN=secret-token
```

### Monitor Server

```bash
SPRING_PROFILES_ACTIVE=monitor
DFCX_PROJECT_ID={PROJECT_ID}
DFCX_LOCATION=asia-northeast1
DFCX_AGENT_ID={AGENT_ID}
PUBSUB_TOPIC=chat-events
PUBSUB_PROJECT_ID={PROJECT_ID}
PUBSUB_VERIFY_TOKEN=secret-token
KMS_DATASOURCE_URL=jdbc:mysql:///kms_database?cloudSqlInstance=...
```

### 6.3 Service Account 및 IAM 권한

### Chat Server Service Account

- `roles/dialogflow.admin`: Dialogflow CX API 호출
- `roles/pubsub.publisher`: Pub/Sub 이벤트 발행
- `roles/pubsub.subscriber`: Pub/Sub Push Subscription 수신

### Monitor Server Service Account

- `roles/dialogflow.admin`: Dialogflow CX API 호출
- `roles/pubsub.publisher`: Pub/Sub 이벤트 발행
- `roles/pubsub.subscriber`: Pub/Sub Push Subscription 수신
- `roles/aiplatform.user`: Vertex AI (LLM 응답 템플릿 생성)
- Cloud SQL 연결 권한

### 6.4 배포 스크립트

- `infra/cloudrun-deploy-chat.sh`: Chat Server 배포 및 Pub/Sub Subscription 설정
- `infra/cloudrun-deploy-monitor.sh`: Monitor Server 배포 및 Pub/Sub Subscription 설정
- `infra/setup-cloud-run.sh`: 초기 Cloud Run 설정
- `infra/fix-permissions.sh`: Service Account IAM 권한 설정

---

## 7. 프로젝트 구조

```
Conversational-Agent-Integration/
├── Dev/                              # 메인 애플리케이션 (Chat & Monitor Server)
│   ├── src/main/java/com/gsneotek/conversationalagent/
│   │   ├── config/                   # 설정 클래스
│   │   │   ├── SecurityConfig.java
│   │   │   ├── CorsConfig.java
│   │   │   ├── WebSocketConfig.java
│   │   │   ├── ChatDataSourceConfig.java
│   │   │   └── KmsDataSourceConfig.java
│   │   ├── controller/               # REST 컨트롤러
│   │   │   ├── ChatController.java
│   │   │   ├── AgentMonitorController.java
│   │   │   ├── PubSubPushController.java
│   │   │   ├── ChatPubSubPushController.java
│   │   │   ├── WebhookController.java
│   │   │   └── ToolsApiController.java
│   │   ├── service/                  # 비즈니스 로직
│   │   │   ├── ChatService.java
│   │   │   ├── AgentMonitorService.java
│   │   │   ├── DialogflowCxApiService.java
│   │   │   ├── ChatEventPublisher.java
│   │   │   ├── KmsSearchService.java
│   │   │   └── AgentSessionManager.java
│   │   ├── entity/                   # JPA 엔티티
│   │   │   ├── ChatSession.java
│   │   │   ├── ChatResponse.java
│   │   │   └── kms/KmsDocument.java
│   │   ├── repository/               # JPA 리포지토리
│   │   └── model/                    # 데이터 모델
│   │       └── ChatEvent.java
│   ├── src/main/resources/
│   │   ├── application.yml           # 공통 설정
│   │   ├── application-chat.yml      # Chat Server 설정
│   │   ├── application-monitor.yml   # Monitor Server 설정
│   │   └── static/                   # 정적 파일
│   │       ├── index.html            # 고객 채팅 UI
│   │       ├── script.js             # 고객 채팅 JavaScript
│   │       └── styles.css
│   ├── build.gradle
│   └── Dockerfile
│
├── MonitorServer/                    # 별도 Monitor Server (선택적)
│   ├── src/main/java/com/gsneotek/MonitorServer/
│   └── src/main/resources/static/
│       ├── agent-monitor.html
│       ├── agent-monitor.js
│       └── agent-monitor.css
│
├── infra/                            # 인프라 및 배포 스크립트
│   ├── cloudrun-deploy-chat.sh
│   ├── cloudrun-deploy-monitor.sh
│   ├── pubsub-create.sh
│   ├── setup-cloud-run.sh
│   └── check-*.sh                    # 모니터링 스크립트
│
├── ARCHITECTURE.md                   # 상세 아키텍처 문서
├── README.md                         # 프로젝트 개요
└── PROJECT_REPORT.md                 # 이 보고서
```

### 7.1 주요 컴포넌트

### Chat Server (chat profile)

- **서비스**: `ChatService`, `DialogflowCxApiService`, `ChatEventPublisher`
- **컨트롤러**: `ChatController`, `ChatPubSubPushController`, `HealthController`

### Monitor Server (monitor profile)

- **서비스**: `AgentMonitorService`, `DialogflowCxApiService`, `ChatEventPublisher`, `KmsSearchService`, `AgentSessionManager`
- **컨트롤러**: `AgentMonitorController`, `PubSubPushController`, `HealthController`

---

## 8. 현재 상태 및 완성도

### 8.1 완료된 기능

### Backend

- Chat Server 및 Monitor Server 분리 구조
- Dialogflow CX API 통합
- Pub/Sub 양방향 메시지 동기화
- H2 In-Memory 데이터베이스 설정
- WebSocket/SSE 실시간 통신 (Monitor Server)
- KMS 연동 (인텐트 기반 정책 문서 검색)
- SOP 연동 (인텐트 기반 업무 절차 검색)
- 응답 템플릿 생성 (LLM 기반)
- 세션 파라미터 추출 및 저장 (`session_summary`)
- Intent 리스트 추출 및 저장
- Entity 추출 및 저장
- Google Cloud Run 배포 설정
- Service Account 및 IAM 권한 설정

### Frontend

- 고객 채팅 UI (`index.html`, `script.js`)
- 상담사 모니터링 대시보드 (`agent-monitor.html`, `agent-monitor.js`)
- 실시간 메시지 업데이트 (SSE/WebSocket/폴링)
- AI 분석 결과 표시 (Intent, Entity, 세션 파라미터)
- KMS 정책 문서 표시
- SOP 단계 표시 (섹션별 파싱)
- 응답 템플릿 생성 및 삽입
- 메시지 순서 보장 (시간순 정렬)
- 페이지네이션 (세션 목록, 상담 이력)

### 8.2 진행 중 / 개선 필요

- **데이터베이스 영구 저장**: 현재 H2 In-Memory 사용 → Cloud SQL 또는 Firestore 마이그레이션 필요
- **에러 처리**: Pub/Sub 실패 시 재시도 로직 추가 필요
- **모니터링**: Cloud Monitoring 통합 필요
- **Chat Server WebSocket**: 고객 UI에도 WebSocket 추가 검토

### 8.3 코드 품질

- **아키텍처**: 명확한 서버 분리 및 책임 분리
- **코드 구조**: MVC 패턴 준수, 서비스 레이어 분리
- **에러 처리**: 기본적인 예외 처리 구현
- **테스트**: 단위 테스트 및 통합 테스트 추가 필요
- **문서화**: API 문서 (Swagger) 추가 검토

---

## 9. 주요 이슈 및 해결 방안

### 9.1 해결된 이슈

### 1. 메시지 순서 문제

- **문제**: AI 응답이 고객 발화보다 먼저 표시되는 현상
- **원인**: 같은 레코드의 `userMessage`와 `reply`가 같은 `createdAt`을 사용
- **해결**: `sortTime` 필드를 추가하여 고객 메시지가 AI 응답보다 먼저 오도록 보장

### 2. 화면 반짝임 문제 (Monitor Server)

- **문제**: 폴링 방식으로 인한 화면 반짝임
- **해결**: SSE (Server-Sent Events) 우선 사용, WebSocket 백업, 폴링은 최후 수단으로 사용

### 3. 중복 메시지 방지

- **문제**: Pub/Sub을 통한 메시지 동기화 시 중복 저장 가능성
- **해결**: `responseId` 기반 중복 체크 (`existsByResponseId()`)

### 9.2 현재 이슈 및 대응 방안

### 1. H2 In-Memory 데이터베이스

- **이슈**: 재시작 시 데이터 손실
- **대응**: Cloud SQL 또는 Firestore 마이그레이션 계획 수립

### 2. Pub/Sub 실패 처리

- **이슈**: Pub/Sub 발행 실패 시 재시도 로직 없음
- **대응**: Exponential Backoff 재시도 로직 추가 예정

### 3. 모니터링 부재

- **이슈**: 시스템 상태 모니터링 도구 없음
- **대응**: Cloud Monitoring 통합 계획 수립

---

## 10. 향후 개선 방향

### 10.1 단기 개선 (1-2개월)

1. **데이터베이스 마이그레이션**
    - H2 In-Memory → Cloud SQL (MySQL) 또는 Firestore
    - 데이터 영구 저장 및 백업
2. **에러 처리 강화**
    - Pub/Sub 재시도 로직
    - Dialogflow CX API 실패 시 재시도
    - 상세한 에러 로깅
3. **모니터링 통합**
    - Cloud Monitoring 대시보드
    - 에러 알림 설정
    - 성능 메트릭 수집

### 10.2 중기 개선 (3-6개월)

1. **Chat Server WebSocket 추가**
    - 고객 UI에도 WebSocket 지원
    - 폴링 대신 실시간 업데이트
2. **테스트 코드 작성**
    - 단위 테스트 (Service, Controller)
    - 통합 테스트 (API, Pub/Sub)
    - E2E 테스트
3. **API 문서화**
    - Swagger/OpenAPI 통합
    - API 사용 가이드 작성

### 10.3 장기 개선 (6개월 이상)

1. **성능 최적화**
    - 캐싱 전략 수립
    - 데이터베이스 쿼리 최적화
    - 메시지 배치 처리
2. **확장성 개선**
    - 로드 밸런싱
    - 오토스케일링 설정
    - 다중 리전 지원
3. **보안 강화**
    - OAuth 2.0 인증
    - API Rate Limiting
    - 데이터 암호화

---

## 11. 리스크 및 고려사항

### 11.1 기술적 리스크

| 리스크 | 영향도 | 대응 방안 |
| --- | --- | --- |
| **H2 In-Memory DB 데이터 손실** | 높음 | Cloud SQL 마이그레이션 우선 진행 |
| **Pub/Sub 메시지 손실** | 중간 | 재시도 로직 및 Dead Letter Queue 설정 |
| **Dialogflow CX API 실패** | 중간 | 재시도 로직 및 Fallback 응답 |
| **Cloud Run Cold Start** | 낮음 | Min Instances 설정 고려 |

### 11.2 운영 리스크

| 리스크 | 영향도 | 대응 방안 |
| --- | --- | --- |
| **모니터링 부재** | 높음 | Cloud Monitoring 통합 우선 진행 |
| **에러 추적 어려움** | 중간 | 구조화된 로깅 및 에러 추적 시스템 |
| **배포 프로세스 복잡** | 낮음 | CI/CD 파이프라인 구축 |

### 11.3 비즈니스 리스크

| 리스크 | 영향도 | 대응 방안 |
| --- | --- | --- |
| **확장성 제한** | 중간 | 오토스케일링 및 로드 밸런싱 설정 |
| **비용 증가** | 낮음 | 리소스 사용량 모니터링 및 최적화 |

### 11.4 고려사항

1. **데이터베이스 선택**
    - Cloud SQL: 관계형 데이터, 복잡한 쿼리 필요 시
    - Firestore: NoSQL, 실시간 동기화 필요 시
2. **비용 관리**
    - Cloud Run 인스턴스 수 모니터링
    - Pub/Sub 메시지 볼륨 모니터링
    - Dialogflow CX API 호출 횟수 모니터링
3. **보안**
    - Service Account 권한 최소화
    - Pub/Sub 토큰 검증 강화
    - API Rate Limiting 적용

---

## 요약

### 프로젝트 현황

- **완성도**: 약 85%
- **핵심 기능**: 모두 구현 완료
- **운영 준비도**: 약 70% (모니터링 및 영구 저장소 필요)

### 주요 성과

1. **양방향 실시간 동기화**: Pub/Sub을 통한 Chat Server ↔︎ Monitor Server 메시지 동기화 완료
2. **상담사 지원 도구**: KMS, SOP, 응답 템플릿 등 상담 효율성 향상 도구 구현
3. **실시간 통신**: SSE/WebSocket을 통한 실시간 UI 업데이트 구현
4. **AI 분석 결과**: Intent, Entity, 세션 파라미터 추출 및 표시

### 다음 단계

1. **우선순위 높음**: 데이터베이스 영구 저장소 마이그레이션
2. **우선순위 중간**: 모니터링 통합 및 에러 처리 강화
3. **우선순위 낮음**: 테스트 코드 작성 및 API 문서화

---

**작성자**: 권신범

**최종 업데이트**: 2025년 12월
