---
title: "Amazon Bedrock AgentCore(1)"
date: 2026-05-12
categories:
  - Cloud
  - AWS
tags:
  - AgentCore
  - AI
---


> **출처**: AWS Korea YouTube - [AI 에이전트를 개발했다면? Amazon Bedrock AgentCore 알아보기](https://www.youtube.com/watch?v=cFh5d_D1wyQ)**발표자**: AWS 솔루션즈 아키텍트 관기원
**영상 제작 시점**: 2025년 12월 (re:Invent 2025 직후)
> 

---

## 왜 AgentCore인가? — 배경 및 문제 정의

![스크린샷 2026-05-12 09.39.16.png](Amazon%20Bedrock%20AgentCore(1)/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2026-05-12_09.39.16.png)
<img width="1344" height="752" alt="스크린샷_2026-05-12_09 39 16" src="https://github.com/user-attachments/assets/638d73f3-014f-419b-a54d-1bdaae1139f9" />

### AI 에이전트란?

사전 정의된 목표를 달성하기 위해 **환경과 상호 작용하며 필요한 작업을 스스로 결정해 수행하는 프로그램**.
단순 LLM 호출을 넘어서 아래 사이클을 반복한다:

```
사용자 요청 → LLM이 필요한 도구 스스로 결정 → 도구 실행 → 결과 기반으로 다음 동작 재계획 → 반복 → 최종 응답
```

### 왜 프로덕션이 어려운가?

LangGraph, LlamaIndex, OpenAI/Google/MS 프레임워크, AWS Strands Agents 등 덕분에 **간단한 에이전트는 몇 줄 코드**로 POC까지는 가능해졌다.
그러나 **프로토타입 → 프로덕션 전환** 시 4가지 장벽이 존재한다:

| 장벽 | 구체적 어려움 |
| --- | --- |
| **도구 통합** | 기존 서비스/리소스를 에이전트용 도구 형태로 변환 필요. 메모리·웹 검색·코드 실행 환경 등 특수 도구를 직접 구축해야 함 |
| **인프라 구축** | 프로덕션 인프라, 세션 격리, 상태 관리 — 에이전트 개발자의 전문 영역이 아님 |
| **인증/인가** | 에이전트 호출 및 도구 사용에 적절한 인증·권한 관리 필요 |
| **모니터링** | 비결정적(Non-deterministic) 특성상 에이전트 내부 추론 과정을 엔드투엔드로 세밀하게 관측해야 함 |

→ 결과적으로 많은 팀이 **POC에서 멈추거나 내부 생산성 도구로만 사용**하게 됨

### AgentCore의 답

**어떤 프레임워크, 어떤 모델이든** 관계없이 배포·운영에 필요한 기능을 **모듈식으로 조합**해서 쓸 수 있는 완전 관리형 플랫폼.
→ 모든 기능을 다 쓸 필요 없음. 필요한 것만 골라서 사용.

---

## 전체 아키텍처 구성

AgentCore는 **9개 기능**을 제공하며 크게 3개 영역으로 구분된다:

![스크린샷 2026-05-12 10.23.04.png](Amazon%20Bedrock%20AgentCore(1)/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2026-05-12_10.23.04.png)
<img width="1234" height="717" alt="스크린샷_2026-05-12_10 23 04" src="https://github.com/user-attachments/assets/efe9a3cb-fabd-4d8a-b866-28d5c38f78fc" />

---

## AgentCore Runtime — 에이전트 서버리스 배포

![스크린샷 2026-05-12 10.23.44.png](Amazon%20Bedrock%20AgentCore(1)/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2026-05-12_10.23.44.png)
<img width="1367" height="753" alt="스크린샷_2026-05-12_10 24 04" src="https://github.com/user-attachments/assets/0e818165-5b5e-402e-b6c1-b51b79793e80" />

### 핵심 개념

기존에 개발한 에이전트를 **코드 몇 줄 수정**만으로 서버리스 런타임으로 배포.
프레임워크(LangGraph, CrewAI, Strands 등)와 모델(Nova, GPT, Gemini 등) 무관하게 동작.

### Lambda와의 차이점

| 항목 | AWS Lambda | AgentCore Runtime |
| --- | --- | --- |
| 최대 실행 시간 | 15분 | **비동기 최대 8시간** |
| 최대 페이로드 | 6MB (sync) / 256KB (async) | **최대 100MB** |
| 세션 격리 | 미지원 | **마이크로VM 기반 세션 격리** |
| 에이전트 특화 | ✗ | MCP, A2A 프로토콜 내장 지원 |

### 프로토콜 지원

- **MCP (Model Context Protocol)**: 도구 호환성 — Runtime을 MCP 서버 호스팅으로도 활용 가능
- **A2A (Agent-to-Agent)**: 에이전트 간 상호 연결

### 세션 격리 방식

각 호출마다 **마이크로VM 아키텍처** 기반으로 세션을 격리 → 보안 + 낮은 지연 시간

### 배포 방법

```
방법 1 (컨테이너):
  Dockerfile 작성 → ECR 레포지토리에 업로드 → Runtime 생성

방법 2 (Python 기반):
  .zip으로 압축 → S3 업로드 → Runtime 생성
  (이후 AgentCore CLI로 배포)
```

### 코드 수정 핵심 3단계

![스크린샷 2026-05-12 10.24.57.png](Amazon%20Bedrock%20AgentCore(1)/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2026-05-12_10.24.57.png)
<img width="1357" height="756" alt="스크린샷_2026-05-12_10 23 44" src="https://github.com/user-attachments/assets/c3260fd3-f917-49d0-85d2-c9c23701ee69" />
```python
# Step 1: BedrockAgentCoreApp 인스턴스 생성
#   - HTTP 서버, 엔드포인트 라우팅, 요청 처리, 세션 관리 자동 처리
app = BedrockAgentCoreApp()

# Step 2: 에이전트 진입점 함수에 데코레이터 추가
@app.entrypoint
def invoke(payload):      # 매개변수를 payload로 설정
    ...

# Step 3: 앱 실행
# → 기존 에이전트 코드가 HTTP 서비스 웹서버 형태로 변환됨
app.run()
```

이후 **AgentCore CLI**로 배포하면 엔드포인트가 생성되어 에이전트 호출 가능.

![스크린샷 2026-05-12 10.24.04.png](Amazon%20Bedrock%20AgentCore(1)/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2026-05-12_10.24.04.png)
<img width="1361" height="753" alt="스크린샷_2026-05-12_10 24 57" src="https://github.com/user-attachments/assets/26b6dde5-a1c1-4b8a-a696-d238ada1ddda" />

---

## AgentCore Gateway — 도구 통합 허브

![스크린샷 2026-05-12 10.25.24.png](Amazon%20Bedrock%20AgentCore(1)/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2026-05-12_10.25.24.png)
<img width="1359" height="755" alt="스크린샷_2026-05-12_10 25 24" src="https://github.com/user-attachments/assets/94b423a3-5c7d-4ea5-a6b1-8d917c3a37de" />

### 문제: 에이전트 내부 툴 정의의 한계

에이전트 코드 안에 직접 툴을 정의하면 3가지 문제 발생:

1. **프레임워크 종속성**: 툴마다 특정 프레임워크에 묶임
2. **재배포 필요**: 툴 수정 시 에이전트 전체를 재배포해야 함
3. **공유 불가**: 여러 에이전트가 같은 툴을 쓰려면 각각에 중복 정의

### 해결: MCP 엔드포인트 기반 통합 게이트웨이

**MCP 프로토콜**을 기반으로 단일 엔드포인트를 제공 → 에이전트가 게이트웨이를 통해 도구에 접근.

![스크린샷 2026-05-12 10.25.41.png](Amazon%20Bedrock%20AgentCore(1)/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2026-05-12_10.25.41.png)
<img width="1357" height="753" alt="스크린샷_2026-05-12_10 25 41" src="https://github.com/user-attachments/assets/e74bae06-eadf-467f-af61-c01c8b942524" />

### 지원 타겟 4종

| 타겟 유형 | 방식 | 설명 |
| --- | --- | --- |
| REST API | AWS API Gateway 엔드포인트 or OpenAPI Spec | 기존 RESTful 서비스 연동 |
| MCP 서버 | Remote MCP Server 엔드포인트 | 외부 MCP 서버 통합 |
| Lambda 함수 | Lambda ARN + JSON Schema | AWS Lambda 함수 직접 등록 |
| Smithy 모델 | Smithy IDL | AWS API 설계 언어 (오픈소스) |

→ 타겟 등록 후 게이트웨이 생성 시 **단일 엔드포인트**로 모든 도구 접근 가능

### 내장 Semantic 도구 검색

![스크린샷 2026-05-12 10.26.25.png](Amazon%20Bedrock%20AgentCore(1)/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2026-05-12_10.26.25.png)
<img width="1357" height="751" alt="스크린샷_2026-05-12_10 26 25" src="https://github.com/user-attachments/assets/d1668248-4c89-4432-8a17-31cd71af06f2" />

수백 개의 도구가 등록된 경우를 해결하는 핵심 기능:

```
❌ 기존 방식:
  모든 도구 정보를 에이전트에 전달 → 프롬프트 길어짐 → 비용 증가 + 정확도 저하

✅ Gateway 검색 방식:
  미리 도구를 인덱싱 → 작업과 관련된 도구만 시멘틱 검색으로 반환
  → 컨텍스트 감소 → 정확도 향상 + 속도 향상 + 비용 절감
```

- Identity와 조합하여 인증 적용 가능 → 보안 강화

---

## AgentCore Code Interpreter — 안전한 코드 실행 환경

![스크린샷 2026-05-12 10.26.57.png](Amazon%20Bedrock%20AgentCore(1)/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2026-05-12_10.26.57.png)
<img width="1353" height="755" alt="스크린샷_2026-05-12_10 26 57" src="https://github.com/user-attachments/assets/687cefce-2695-41a7-a5a1-166b218a41b6" />

### 왜 필요한가?

LLM은 **트랜스포머 아키텍처** 기반으로 다음 토큰을 예측하는 방식 → 아래 작업에서 취약:

- 이번 달 매출 통계 분석
- 수학적 연산
- 정밀한 데이터 처리

→ **에이전트가 코드를 직접 생성하고 실행**하도록 하는 것이 효과적

### 동작 방식

```
LLM이 코드 생성 → Code Interpreter에서 실행 → 실행 결과를 응답에 활용
```

### 격리 방식

**에이전트와 완전히 격리된 마이크로VM 환경** 제공 → 차단 항목:

- 코드 실행 중 보안 위협
- 데이터 누출
- 외부 네트워크 접근

| 항목 | 내용 |
| --- | --- |
| 격리 방식 | Firecracker microVM 샌드박스 |
| 지원 언어 | Python, JavaScript, TypeScript |
| 기본 실행 시간 | 15분 (최대 8시간 연장 가능) |
| VPC 연결 | 지원 |

---

## AgentCore Browser — 클라우드 기반 웹 브라우저

### 역할

Code Interpreter가 **내부 데이터** 처리에 특화된다면, Browser는 **외부 데이터를 탐색하고 사용자 대신 웹 작업을 처리**하는 역할.

### 실제 동작 플로우

```
사용자: "아마존에서 신발을 구매해 줘"
    ↓
에이전트가 Browser 도구 호출
    ↓
에이전트 프레임워크가 Playwright / Puppeteer 명령어로 매핑
    ↓
브라우저 라이브러리가 CDP(Chrome DevTools Protocol) 명령어로 변환
    ↓
WebSocket 통신을 통해 AgentCore 상의 브라우저 조작
    ↓
Amazon DCV로 실시간 스트리밍 → 콘솔에서 AI 행동 투명하게 감시 / 개입 가능
```

### 주요 특징

- Firecracker microVM 기반 세션 격리
- **Amazon DCV**를 통한 실시간 라이브 뷰 스트리밍 → 모니터링 및 인터벤션 지원
- Nova Act, Strands, Playwright 연동
- **Web Bot Auth** (IETF 드래프트 프로토콜): AI 에이전트를 웹사이트에 암호학적으로 식별 → CAPTCHA 방해 감소

---

## AgentCore Policy — 도구 호출 정책 제어 *(re:Invent 2025 신규)*

![스크린샷 2026-05-12 10.41.46.png](Amazon%20Bedrock%20AgentCore(1)/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2026-05-12_10.41.46.png)
<img width="1361" height="754" alt="스크린샷_2026-05-12_10 41 46" src="https://github.com/user-attachments/assets/2d7568d4-1411-445c-a04d-9e6d14e46ef0" />

### 핵심 개념

Gateway를 통한 **도구 호출 흐름에서 호출을 허용할지 거부할지를 결정하는 정책**을 부여.

```
에이전트 → 도구 호출 시도 → Gateway에서 Policy 평가 (밀리초 이내) → 허용 or 거부 → 도구 실행
```

### 기존 방식과의 차이

```
❌ 기존 방식 (시스템 프롬프트):
  "이것을 하지 마라"라고 프롬프트에 작성 → 확률론적, 우회 가능

✅ AgentCore Policy:
  Gateway에서 툴 호출 인터셉트 → LLM 추론 루프 외부에서 동작 → 결정론적, 우회 불가
  에이전트 코드나 사용 모델에 관계없이 독립적으로 작동
```

### 정책으로 제어 가능한 항목

- Gateway에 접근할 수 있는 **Identity는 무엇인지**
- 어떤 **도구에 접근**할 수 있는지
- 어떤 **요청을 보낼 수 있는지** (조건 포함)

### 정책 정의: Cedar 언어

**Cedar** = AWS가 만든 오픈소스 정책 언어 (AWS Verified Permissions에서도 사용)
→ "누가(Principal) / 무엇을(Action) / 어떤 조건일 때 / 할 수 있는지 없는지"를 코드로 정의

```
// Cedar 정책 예시
permit(
  principal == AgentIdentity::"travel-agent",
  action == Action::"InvokeTool",
  resource == Tool::"FlightSearch"
);

forbid(
  principal,
  action == Action::"InvokeTool",
  resource == Tool::"DeleteBooking"
) when {
  context.environment == "production"
};
```

**자연어 → Cedar 자동 변환 기능** 내장:

> "이 에이전트는 프로덕션 환경에서 예약을 삭제할 수 없다" → Cedar 코드 자동 생성
> 

> ⚠️ Policy는 독립 사용 불가. 반드시 **AgentCore Gateway에 할당**하여 사용해야 함.
> 

---

## AgentCore Identity — 인증/인가 관리

![스크린샷 2026-05-12 10.42.31.png](Amazon%20Bedrock%20AgentCore(1)/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2026-05-12_10.42.31.png)
<img width="1363" height="759" alt="스크린샷_2026-05-12_10 42 31" src="https://github.com/user-attachments/assets/806494c2-862b-40b0-a79e-ae40f30b35fa" />

### 보호해야 할 두 방향

```
[인바운드 Auth] 허용된 사용자만 에이전트/도구를 호출할 수 있는가?
[아웃바운드 Auth] 에이전트가 허용된 범위의 리소스/API에만 접근하는가?
```

### 전체 인증 흐름

```
1. 사용자가 앱을 통해 에이전트 호출
2. [인바운드] Identity Provider를 통해 사용자 인증
3. 인증 성공 → 에이전트 실행
4. [아웃바운드] 에이전트가 외부 리소스 접근 시:
   - AWS 리소스: IAM 기반
   - 외부 API: API Key 또는 OAuth
```

### 지원 Identity Provider

**별도 마이그레이션 없이** 기존 IdP 그대로 연결 가능:

- Amazon Cognito
- Okta
- Google
- Microsoft Entra
- 기타 OIDC 호환 IdP

![스크린샷 2026-05-12 10.43.02.png](Amazon%20Bedrock%20AgentCore(1)/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2026-05-12_10.43.02.png)
<img width="1362" height="759" alt="스크린샷_2026-05-12_10 43 02" src="https://github.com/user-attachments/assets/583f4c92-bde3-445c-bc5c-1d37159f35fe" />

### 적용 범위

- **AgentCore Runtime** + **AgentCore Gateway** 모두에 인바운드/아웃바운드 Auth 구성 가능
- Runtime을 사용하지 않고 **직접 호스팅하는 경우에도** Identity만 독립적으로 사용 가능

### re:Invent 2025 신규: Custom Claims

멀티테넌트 환경에서 강화된 인증 규칙 적용 가능. 선택한 Identity Provider와의 통합을 유지하면서 세밀한 제어 가능.

---

## AgentCore Memory — 단기/장기 메모리

![스크린샷 2026-05-12 11.39.47.png](Amazon%20Bedrock%20AgentCore(1)/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2026-05-12_11.39.47.png)
<img width="1361" height="755" alt="스크린샷_2026-05-12_11 39 47" src="https://github.com/user-attachments/assets/4c087044-061e-4a95-b8e1-76f94a5ff759" />

### 왜 필요한가?

메모리 없이 새 대화를 시작하면 **에이전트는 이전 대화 내용을 전혀 반영하지 못함**.
쇼핑/여행 에이전트라면 사용자의 선호나 이전 경험을 기반으로 응답해야 사용자 경험이 높아짐.

### 왜 대화 전체를 저장하지 않는가?

> "대화 내용 전부를 메모리에 저장하면 **컨텍스트 길이가 너무 길어지는 문제**가 생김"
> 

→ **중요한 정보만 추출하여 저장**하고, 이후 대화에서 연관된 내용만 검색해서 에이전트에 제공하는 방식 채택

### 메모리 타입 비교

| 타입 | 저장 방식 | 저장 내용 | 특징 |
| --- | --- | --- | --- |
| **단기 메모리** | 로 데이터 그대로 저장 | 사용자-어시스턴트 Chat History | 연속적인 대화 유지 |
| **장기 메모리** | 비동기 후처리 후 저장 | 사용자 선호도, 세션 전체 요약, 대화 관련 사실 | 세션 간 사용자 맥락 유지 |

**저장 형태 예시**:

- 단기: `{user: "두부랑 신선한 채소 좀 사줘", assistant: "..."}` (원본 Chat 형태)
- 장기: `"사용자가 두부와 신선한 채소를 좋아한다고 말했다"` (가공된 정보)

### 구현 흐름

```
1. 에이전트 내에서 메시지 상태 관리 직접 구현
   (대부분의 프레임워크에 내장된 기능 활용 가능)
2. AgentCore Memory 구성
   → 에이전트 이벤트를 단기 메모리에 동기적으로 저장
3. AgentCore Memory가 비동기적으로 단기 메모리 내용을 처리
   → 장기 메모리에 자동 저장
4. (선택) 배치 API로 장기 메모리에 직접 추가도 가능
5. 에이전트에서 장기 메모리 검색 구현
   → 검색 결과를 에이전트 응답에 활용
```

### re:Invent 2025 신규: Episodic Memory

**경험 기반 학습**을 위한 장기 메모리 전략:

```
실행 중 구조화된 에피소드 캡처
  (Context → Reasoning → Actions → Outcomes)
        ↓
Reflection Agent가 패턴 자동 추출
        ↓
유사 상황 발생 시 관련 학습 내용 자동 검색 및 활용
```

**예시**: 여행 예약 에이전트가 특정 사용자의 출장 시 항공편 변경 패턴을 학습 → 이후 출장 예약 시 자동으로 유연한 반환 옵션 제안 (별도 프롬프트 없이)

**빌트인 Memory Strategy**:

- Semantic Memory Strategy
- User Preference Memory Strategy
- Summary Strategy

---

## AgentCore Observability — 에이전트 운영 관측

![스크린샷 2026-05-12 11.40.40.png](Amazon%20Bedrock%20AgentCore(1)/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2026-05-12_11.40.40.png)
<img width="1359" height="760" alt="스크린샷_2026-05-12_11 40 40" src="https://github.com/user-attachments/assets/0b43dbc5-4801-45ef-91f6-356564bc0a3b" />

### 왜 에이전트 모니터링이 특별히 어려운가?

> "에이전트는 모델의 추론을 기반으로 하는 **비결정적인 흐름**을 가지기 때문에, 개발 당시 잘 동작했더라도 운영 과정에서 계속 잘 응답한다는 보장이 없다."
> 
- 여러 도구를 호출하고 복잡한 추론 과정을 거치기 때문에, **성능 저하 시 어디서 문제가 생겼는지 파악이 어려움**
- 에이전트 출력에 대한 **정량적 기준으로 평가하는 것도 쉽지 않음**

### 제공 데이터

- 일반 지표: 지연 시간(Latency), 에러율 등
- **에이전트 전용**: 호출부터 응답까지 **엔드투엔드 트레이스 정보**
    - 어느 구간에서 에이전트가 어떤 응답을 했는지 상세 파악
    - 각 도구 호출 내역 및 소요 시간 확인
- **수집 범위**: Runtime뿐만 아니라 **AgentCore 모든 기능**에서 발생하는 Telemetry 데이터 통합 수집

### 대시보드 및 외부 연동

- 기본: AgentCore 대시보드 (Amazon CloudWatch 기반)
- **OpenTelemetry 지원** → 서드파티 도구와 연동 가능:
    - Datadog
    - LangFuse
    - 기타 OpenTelemetry 호환 도구

---

## AgentCore Evaluations — 에이전트 품질 자동 평가 *(re:Invent 2025 신규, Preview)*

![스크린샷 2026-05-12 11.41.11.png](Amazon%20Bedrock%20AgentCore(1)/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2026-05-12_11.41.11.png)
<img width="1359" height="758" alt="스크린샷_2026-05-12_11 41 11" src="https://github.com/user-attachments/assets/928b72ad-aeea-4d3b-a246-5fda4d062cf5" />

### 개념

> "Observability의 결과를 기반으로 **LLM을 통해 에이전트의 동작을 평가**한다."
> 

단순 모니터링(무슨 일이 일어났는가)에서 **품질 평가(잘 동작하고 있는가)**로 확장.

### 평가 항목

내장 평가 기준과 커스텀 기준을 조합:

| 카테고리 | 평가 항목 |
| --- | --- |
| 응답 품질 | Correctness (정확성), Helpfulness (유용성), Faithfulness (충실도) |
| 도구 사용 | Tool Selection Accuracy (올바른 도구 선택), 올바른 인자 전달 여부 |
| 목표 달성 | Goal Success Rate |
| 안전/어조 | Safety, 적절한 어조 |
| 컨텍스트 | Context Relevance |
| 커스텀 | 비즈니스 특화 평가 기준 직접 정의 가능 |

**총 13개 내장 평가 지표**

### 평가 모드

| 모드 | 설명 | 활용 |
| --- | --- | --- |
| Online Evaluations | 실제 프로덕션 인터랙션 샘플링하여 지속 평가 | 프로덕션 품질 모니터링 |
| On-demand Evaluations | 수동 트리거 | CI/CD 파이프라인 통합 |

### 평가 결과 활용

- 평가 결과는 **수치화**되어 대시보드에서 확인 가능
- *점수 산정 이유(Why)**도 함께 제공 → 에이전트 지속 개선에 활용
- Observability 대시보드와 통합되어 CloudWatch에서 확인
- **알람 설정 가능** (예: Tool Selection Accuracy 0.91 → 0.3으로 하락 시 즉시 감지)

---

## 전체 기능 조합 가이드

권장 사용 패턴:

```
여러분이 선호하는 프레임워크/모델로 만든 에이전트
        ↓
    [Runtime]으로 호스팅
        ↓
    [Gateway]를 통해 외부 도구 연결
    [Browser] / [Code Interpreter] 내장 도구 활용
        ↓
    [Policy]를 Gateway에 적용 → 안전한 도구 호출 제어
    [Identity]로 Runtime/Gateway 인증/인가 설정
        ↓
    [Memory]로 사용자 경험 향상
        ↓
    [Observability]로 전체 호출 과정 관측
    [Evaluations]로 에이전트 응답 품질 평가
```

### 시나리오별 최소 구성

| 시나리오 | 구성 |
| --- | --- |
| 단순 배포만 | Runtime |
| 대화 맥락 유지 | Runtime + Memory |
| 외부 API 연동 | Runtime + Gateway |
| 보안 강화 | Runtime + Gateway + Policy + Identity |
| 데이터 분석 에이전트 | Runtime + Gateway + Code Interpreter |
| 웹 자동화 에이전트 | Runtime + Gateway + Browser |
| 엔터프라이즈 프로덕션 | Runtime + Memory + Gateway + Identity + Policy + Code Interpreter + Browser + Observability + Evaluations |

---

## 핵심 요약

1. **AgentCore는 선택적으로 조합해서 쓰는 플랫폼** — 모든 기능이 필수가 아님
2. **프레임워크/모델 완전 자유** — LangGraph, CrewAI, OpenAI SDK 등 무엇이든 사용 가능
3. **Policy는 LLM 루프 외부에서 결정론적으로 동작** — 시스템 프롬프트 기반 제어보다 훨씬 신뢰성 높음
4. **Evaluations는 Observability 데이터 기반** — 단순 모니터링을 넘어 품질 관리 루프 완성
5. **Memory는 단기/장기 이원화 + Episodic** — 컨텍스트 비용과 사용자 경험을 동시에 해결

---

## 참고 자료

- [AWS 공식 AgentCore 페이지](https://aws.amazon.com/bedrock/agentcore/)
- [AWS Skill Builder 학습 자료](https://skillbuilder.aws/)
- [AWS Tech Blog - re:Invent 2025 AgentCore 신규 기능](https://aws.amazon.com/blogs/aws/amazon-bedrock-agentcore-adds-quality-evaluations-and-policy-controls-for-deploying-trusted-ai-agents/)
- [공식 문서](https://docs.aws.amazon.com/bedrock-agentcore/)
- [AgentCore Starter Toolkit (GitHub)](https://aws.github.io/bedrock-agentcore-starter-toolkit/)
