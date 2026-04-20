---
title: "MQTT · EMQX · NLB · ALB 개념 정리"
date: 2026-04-20
categories:
  - Cloud
  - AWS
tags:
  - AWS
  - Network
  - LoadBalancer
  - Protocol
---

# MQTT · EMQX · NLB · ALB

# 개념 및 적용 방안 정리

---

## **MQTT(Message Queuing Telemerty Transport)**

메세지 큐잉 텔레메트리 전송 프로토콜로 IoT(Internet of Things)디바이스 간의 높은 지연 시간, 데이터 통과율, 및 전력 사용량에 대한 문제를 해결하기 위해 설계 되었다.

이 프로토콜은 Publish/Subscribe 모델을 사용하여, 서버(브로커)와 클라이언트 사이에서 메세지를 전달해준다.

![](https://blog.kakaocdn.net/dna/cnALqB/btssfFoYti7/AAAAAAAAAAAAAAAAAAAAAGBtjRjvBtHcvSgYeAsv-DNpwlSxlVW-wB99I5xldjUQ/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1772290799&allow_ip=&allow_referer=&signature=by4DgCTn0yNSeu4wxufbOotjmhw%3D)

기본적인 매커니즘은 공식문서를 보면 IoT장치가 인터넷을 통해 데이터를 게시하고 구독하는 방법을 정의하는 일련의 규칙을 말한다. 프로토콜은 이벤트 기반이며 게시/구독(Pub/Sub)패턴을 사용하여 장치를 연결.

***발신자(게시자)와 수신자(구독자)는 주제(Topic)를 통해 통신하며 서로 분리된다.***

### MQTT 통신은 반드시 Broker(중앙 중계자)를 기준으로 이루어진다.

[기본 구성 요소]

- Publisher(게시자)
    
    메세지를 보내는 주체(디바이스, 서버 등)
    
- Subscriber(구독자)
    
    메세지를 받는 주체(서버, 다른 디바이스 등)
    
- Broker
    
    메세지를 받아서 적절한 Subscriber에게 전달하는 중개 서버
    

---

### Topic 기반 통신

MQTT는 Topic을 기준으로 메시지를 분류한다.

```python
wisentm/device/123/status
wisentm/device/123/command
wisentm/device/+/telemetry
```

- 계층 구조 사용
- `+`, `#` 와일드카드 지원
- 하나의 메시지를 여러 Subscriber가 동시에 수신 가능

**→ 1:N 통신이 매우 자연스럽다**

특징으로 가볍고 개방적이며 단순하게 구현되도록 설계되어 이를 특성으로 작은 코드 공간이 필요하거나 네트워크 대역폭이 중요한 M2M(Machine to Machine)및 IoT컨텍스트의 통신과 같은 제한된 환경을 포함하여 다양한 상황에서 사용하기에 이상적이다.

### 그럼 MQTT의 Pub/Sub 분리기능이란?

![](https://blog.kakaocdn.net/dna/nyshP/btssgtuNWdv/AAAAAAAAAAAAAAAAAAAAAI0K9mOydtU-ByjjoOnVTmSDjxiwNDf_Q9rVl0jeQEaA/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1772290799&allow_ip=&allow_referer=&signature=RPSmqSTH%2FB4j8ZNZQc%2BedDvW8QA%3D)

### MQTT Pub/Sub 분리의 의미

기존의 **요청 - 응답 접근 방식**에서 클라이언트가 서버 엔드포인트와 직접 통신함으로써 생기는 병목현상을 Pub/Sub아키텍쳐로 메세지 게시자와 구독자를 나누어 중간에 브로커라는 구성 요소로 이들 간의 연결을 처리하여 더 빠르고 효율적인 통신 프로세스를 구성해준다.

- **공간 분리** : 게시자와 구독자는 서로 알 필요가 없음(예 : IP주소 및 포트 교환이 없음)
- **시간 분리** : 게시자와 구독자가 동시에 실행될 필요가 없다.
- **동기화 분리** : 게시 또는 수신 중에 두 구성 요소의 작업을 중단할 필요가 없다.

이를 통해 MQTT Pub/Sub아키텍쳐로 얻는 중요한 이점은

향상된 확장성으로 브로커로써 모든 메세지 중앙 허브 역할을 하여 성능 저하 없이 많은 클라이언트를 처리할 수 있으며, 아키텍처의 분리된 특징을 이용하여 향상된 내결함성을 제공한다.

기존 방식으로는 클라이언트 - 서버 모델에서는 서버가 다운되면 연결된 모든 클라이언트의 연결이 끊어졌지만 Pub/Sub으로 구성되어있으면 **브로커가 클라이언트와 다시 연결될 때까지 메세지를 저장**하여 메세지가 손실되지 않도록 할 수 있다.

또한 유연성을 장점으로 낮은 대역폭, 긴 대기 시간 등등의 네트워크의 문제를 상쇄할 수 있는 유연성을 가지고 있다.

---

## MQTT 활용 사례 ① : IoT 디바이스 상태 수집

![https://cdn.prod.website-files.com/5ff66329429d880392f6cba2/6708f5b15374117c840d5fcc_6708ee20807b31c351ce6a22_7%2520-%252010.10-min.jpeg](https://cdn.prod.website-files.com/5ff66329429d880392f6cba2/6708f5b15374117c840d5fcc_6708ee20807b31c351ce6a22_7%2520-%252010.10-min.jpeg)

**시나리오**

- 수천 대 디바이스가 주기적으로 상태 정보 전송

**구성**

```
Device →publish("device/{id}/status")
Server →subscribe("device/+/status")
```

**효과**

- 서버에서 주기적 Polling 불필요
- 실시간 상태 수집
- 네트워크 트래픽 최소화

## MQTT 활용 사례 ② : 원격 제어 / 명령 전달

![https://iotatlas.net/en/implementations/aws/command/command1/architecture.svg](https://iotatlas.net/en/implementations/aws/command/command1/architecture.svg)

![https://docs.iotechsys.com/edge-xpert23/assets/images/device-services/mqtt/getcomand.png](https://docs.iotechsys.com/edge-xpert23/assets/images/device-services/mqtt/getcomand.png)

**시나리오**

- 중앙 시스템에서 특정 디바이스 제어

**구성**

```
Server →publish("device/123/command")
Device →subscribe("device/123/command")
```

**효과**

- 디바이스 IP를 몰라도 제어 가능
- 오프라인 후 재접속 시 메시지 수신 가능(QoS/세션 활용)
- 대량 디바이스 제어에 적합

---

## **EMQ X**

EMQ X는 고성능, 확장성 있는 MQTT 브로커 플랫폼으로 높은 처리량과 낮은 지연 시간을 제공해준다. 그리고 다양한 IoT프로젝트와 서비스에 적용될 수 있다. EMQ X는 다양한 메세지 브로커에 대한 관리 기능과 함께, 고급 보안 기능, 클러스터링, 여러종류의 IoT프로토콜 지원등을 제공한다.

먼저 EMQX는 오픈소스이다. MQTT브로커이며 HTTP,QUIC 및 WebSocket을 포함한 다양한 프로토콜을 지원해준다.

그리고 TLS/SSL 및 다양한 인증 매커니즘을 통해 MQTT와의 안전한 양뱡향 통신을 제공하여 IoT장치 및 애플리케이션을 위한 안정적이고 효율적인 통신 인프라를 보장해준다.

![](https://blog.kakaocdn.net/dna/mN8Bw/btssk3IB0Jg/AAAAAAAAAAAAAAAAAAAAADyDN6MSGNJmwlkSoxmTv7dg2nurNyBzijppUu9Aqrqb/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1772290799&allow_ip=&allow_referer=&signature=SVp6hBOHvmJrNayRN%2FrgyfOpBF4%3D)

EMQX는 단일 클러스터에서 동시 MQTT연결을 최대 1억개 까지의 확장이 가능하고, 초당 수백만개의 MQTT메세지를 처리, 낮은 대기시간을 제공하여 메세지로의 통신이 즉각적으로 수신된다.

여기까지 대충 정리하자면

MQTT는 메세징 프로토콜 EMQ X는 MQTT프로토콜을 구현한 브로커 소프트웨어이다.

즉, MQTT는 "어떻게" 메세지를 전달할 것인가에 대한 규칙을 정의, EMQ X는 그러한 규칙을 실제로 실행하는 브로커 역할을 가진다.

---

## EMQX가 제공하는 주요 기능들

### ① 대규모 연결 처리 (Scalability)

- 수십만 ~ 수백만 MQTT 클라이언트 동시 연결
- 클러스터 구성으로 수평 확장 가능
- 낮은 지연시간 유지

→ 디바이스 수가 폭증해도 구조 변경 불필요

---

### ② 다양한 프로토콜 지원

- MQTT 3.1 / 3.1.1 / **MQTT 5.0**
- MQTT over WebSocket
- QUIC
- HTTP 연계

→ 브라우저, 모바일, 서버 모두 연결 가능

---

### ③ 인증(Authentication) 기능

- Username / Password
- JWT
- TLS Client Certificate (mTLS)
- 외부 인증 서버 연동

→  디바이스 보안의 핵심 축

---

### ④ 권한 제어 (ACL)

- Topic 단위 접근 제어
- Publish / Subscribe 권한 분리

예:

```
device/123 → device/123/*
device/456 → device/456/*
```

→  디바이스 간 메시지 침범 방지

---

### ⑤ Rule Engine @중요@

![https://docs.emqx.com/assets/data-integration-arch.Ks3i3xqY.jpg](https://docs.emqx.com/assets/data-integration-arch.Ks3i3xqY.jpg)

![https://assets.emqx.com/images/8ea87178108fd15755534ac746118d3f.png?x-image-process=image%2Fresize%2Cw_1520%2Fformat%2Cwebp](https://assets.emqx.com/images/8ea87178108fd15755534ac746118d3f.png?x-image-process=image%2Fresize%2Cw_1520%2Fformat%2Cwebp)

MQTT 메시지를 **다른 시스템으로 자동 전달**할 수 있다.

- HTTP API 호출
- Backend 서버 연동
- DB 저장
- Kafka, Lambda 등 연계

→  **“MQTT 통신 ↔ 비즈니스 로직” 연결 고리**

---

### ⑥ Webhook / 데이터 통합

- 특정 Topic 수신 시 자동 이벤트 트리거
- 실시간 이벤트 기반 처리 가능

---

### ⑦ 모니터링 & 관리 기능

- 연결 수
- 메시지 처리량
- 지연 시간
- 에러/Disconnect 원인
- Admin UI 제공

→  운영 가시성 확보

---

## **NLB (Network Load Balancer)**

![Image](https://d2908q01vomqb2.cloudfront.net/fc074d501302eb2b93e2554793fcaf50b3bf7291/2021/11/04/RStudio_Arch_Latest-1024x954.png)

![Image](https://miro.medium.com/1%2AKi7PQVUG3kJHXjsM763Ryw.png)

![Image](https://learnkube.com/a/c8064d5fe89ad7ac42017414019bdbfe.svg)

NLB는 AWS에서 제공하는 **네트워크 계층(L4) 로드 밸런서**로, TCP/UDP 기반 트래픽을 **아주 빠르고 단순하게 분산**하기 위해 설계되었다. ALB처럼 HTTP 요청 내용을 해석하지 않고, **IP 주소와 포트 단위로 네트워크 연결(Connection)을 그대로 전달**한다.

즉,

NLB는 애플리케이션을 이해하지 않고

**“연결 자체를 안정적으로 나눠주는 역할”에 집중한다.**

---

### NLB가 등장한 배경

기존 로드밸런서(L7 중심)는 다음과 같은 한계를 가진다.

- HTTP/HTTPS 요청에 최적화
- 요청/응답 단위의 짧은 연결
- 지속 연결(Long-lived connection)에 취약

하지만 IoT, 메시징, 스트리밍 환경에서는 다음 요구가 있다.

- TCP 연결을 오래 유지
- 수십만~수백만 디바이스 동시 접속
- 초저지연(Low latency)
- 패킷을 거의 가공하지 않는 전달

→  이런 요구를 충족하기 위해 등장한 것이 **NLB**

---

### NLB의 기본 동작 방식

```
[ Device / Client ]
        │  TCP
        ▼
     [  NLB  ]
        │  (Connection 그대로 전달)
        ▼
[ Target (EMQX, TCP Server) ]
```

1. 디바이스 또는 클라이언트가 NLB의 **고정 IP**로 접속
2. NLB는 TCP 연결을 하나의 단위로 유지
3. Target Group에 속한 서버로 연결을 분산
4. 이후 통신은 **같은 TCP 세션으로 지속**

> **NLB는 요청(Request)을 분산하지 않고, 연결(Connection)을 분산한다**
> 

---

### NLB의 주요 특징

- OSI Layer 4 (TCP/UDP)
- 초저지연
- 초고성능 (수백만 연결 처리)
- 고정 IP 제공
- Long-lived connection 지원
- MQTT, WebSocket에 최적

---

### NLB가 특히 적합한 경우

- MQTT 브로커 (EMQX)
- WebSocket 서버
- TCP 기반 커스텀 프로토콜
- 실시간 메시징 / 스트리밍
- 게임 서버

→  **MQTT + EMQX 구조에서는 NLB가 사실상 필수**

---

### NLB 한 줄 요약

> **NLB는 TCP/UDP 연결 자체를 빠르고 안정적으로 분산시키는네트워크 레벨 로드밸런서이다.                       NLB는 L4 연결(TCP/TLS)을 받고, 그 트래픽을 ALB로 전달한 뒤 ALB가 HTTP 요청으로 해석하고 라우팅한다.**
> 

---

## **ALB (Application Load Balancer)**

![Image](https://labresources.whizlabs.com/7beff6c1fdf74cf2387e32e394c0cca7/aws-elb-diagram.png)

![Image](https://d2908q01vomqb2.cloudfront.net/fe2ef495a1152561572949784c16bf23abb28057/2024/01/04/Solution-overview.jpg)

ALB는 AWS에서 제공하는 **애플리케이션 계층(L7) 로드 밸런서**로, HTTP/HTTPS 요청을 **이해하고 해석하여** 트래픽을 분산한다. NLB와 달리 요청의 내용(URL, Header, Method 등)을 분석하여 **조건 기반 라우팅**을 수행할 수 있다.

즉,

ALB는 단순한 트래픽 분산기가 아니라

**애플리케이션 트래픽 제어 장치이다.**

---

### ALB의 기본 동작 방식

```
[ User / System ]
        │  HTTPS
        ▼
      [ ALB ]
   ┌────┼────────┐
   │    │        │
 /api  /admin   /health
   │    │        │
[API] [Admin] [Health]
```

1. 클라이언트가 HTTPS로 ALB에 요청
2. ALB가 요청을 해석
    - URL Path
    - Host Header
    - HTTP Method
3. 사전에 정의된 Rule에 따라 Target Group 선택
4. 백엔드 애플리케이션으로 전달

---

### ALB의 주요 특징

- OSI Layer 7 (HTTP/HTTPS)
- URL / Header / Host 기반 라우팅
- TLS 종료(Termination)
- 인증 연동(OIDC, Cognito 등)
- REST API, Web 서비스에 최적

---

### ALB가 적합한 경우

- 관리자 웹 UI
- REST API 서버
- 마이크로서비스 아키텍처
- 인증이 필요한 서비스
- JSON 기반 요청/응답 시스템

→  **사람 또는 시스템이 호출하는 “API 영역”**

---

### ALB 한 줄 요약

> **ALB는 HTTP 요청을 이해하고 애플리케이션 관점에서 트래픽을 제어하는 로드밸런서이다.**
> 

---

## **NLB vs ALB 비교 정리**

![Image](https://miro.medium.com/v2/resize%3Afit%3A1200/1%2AYuG-jq-PGFfiHlsI7daA2w.png)

![Image](https://kemptechnologies.com/images/kemptechnologieslibraries/about/picture1.png?sfvrsn=453f0d1f_1)

| 항목 | NLB | ALB |
| --- | --- | --- |
| OSI 계층 | L4 | L7 |
| 처리 대상 | TCP / UDP | HTTP / HTTPS |
| 요청 해석 | ❌ | ✅ |
| 지속 연결 | ✅ | ❌ |
| MQTT 적합성 | ✅ | ❌ |
| API / Web | ❌ | ✅ |
| 주요 대상 | 디바이스, 브로커 | 사용자, 서비스 |
| 고정 IP 제공 | ✅ | ❌ |

---

## 정리

- **MQTT**
    
    → 메시지를 *어떻게* 전달할 것인가에 대한 규칙
    
- **EMQX**
    
    → MQTT 규칙을 *실제로 수행하는* 메시지 브로커
    
- **NLB**
    
    → EMQX 같은 **TCP 기반 서비스의 연결을 안정적으로 분산**
    
- **ALB**
    
    → 관리자/API 같은 **HTTP 서비스 트래픽을 지능적으로 제어**
    

---
