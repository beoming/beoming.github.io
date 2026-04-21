---
title: "모니터링 시스템 (PLG Stack)"
date: 2026-04-21
categories:
  - DevOps
  - Monitoring
tags:
  - Prometheus
  - Grafana
  - Loki
  - Monitoring System
---



**Prometheus + Fluent bit +  Loki + Grafana**

# Spring Boot 기반

## 풀스택 모니터링 시스템 아키텍처 및 구축 요약

## 1. 시스템 아키텍처

AWS EC2 인스턴스 내에서 **Docker Compose v2**를 기반으로 실행되며, 애플리케이션의 상태(Metrics)와 애플리케이션이 남기는 기록(Logs)을 각각 분리된 파이프라인으로 수집하여 **Grafana**라는 단일 관제탑에서 통합 모니터링하는 구조입니다.

- **Target App:** Spring Boot 3.x (Java 17)
- **Metrics Pipeline:** Micrometer & Actuator → Prometheus
- **Logging Pipeline:** Docker Fluentd Driver → Fluent Bit → Loki
- **Visualization:** Grafana (Dashboard ID: 19004)

## 2. 인프라 및 환경 설정

- **Host OS:** AWS EC2 Ubuntu 22.04 LTS
- **Container Engine:** Docker & Docker Compose v2 플러그인 (v1 구버전 충돌 이슈 해결)
- **Network & Security (Inbound Ports):**
    - `8080`: Spring Boot Application (API 서빙)
    - `9090`: Prometheus (메트릭 수집 및 상태 확인)
    - `3100`: Loki (로그 저장 및 쿼리)
    - `3000`: Grafana (시각화 대시보드)
    - `24224`: Fluent Bit (로그 수집용 내부 포트)

## 3. 파이프라인별 상세 구현 내역

### 3.1. 애플리케이션 계층 (Spring Boot 3.x)

- **의존성 추가:** `spring-boot-starter-actuator`, `micrometer-registry-prometheus`를 통해 JVM 메트릭을 프로메테우스 포맷으로 노출(`/actuator/prometheus`).
- **커스텀 메트릭 구현:** `io.micrometer.core.instrument.Counter`를 사용하여 `/api/test` 엔드포인트 호출 시 TPS(초당 트랜잭션) 추적을 위한 `http_requests_total` 지표 생성.
- **로그 생성 로직:** API 호출 시점에 `System.out.println()`을 통해 표준 출력(stdout) 로그를 발생시키도록 구현.
- **[핵심 트러블슈팅] Micrometer Tagging:**
    - 기본 설정 시 Grafana 대시보드가 애플리케이션을 식별하지 못하는 문제 발생.
    - `application.yml`에 `management.metrics.tags.application=${spring.application.name}` 설정을 추가하여 모든 추출 지표에 애플리케이션 이름표(Tag)를 강제로 부여함으로써 대시보드 연동 문제 해결.

### 3.2. 메트릭 파이프라인 (Prometheus)

- **Pull 모델 방식 수집:** `prometheus.yml`의 `scrape_configs`에 타겟을 `app:8080`으로 지정하여 스프링부트 컨테이너의 메트릭을 5초(`scrape_interval: 5s`) 주기로 당겨옴(Pull).
- 도커 내부 네트워크망을 사용하여 컨테이너 이름(`app`)으로 직접 통신 처리.

### 3.3. 로깅 파이프라인 (Fluent Bit + Loki)

- **Docker Logging Driver 연동:** `docker-compose.yml`에서 애플리케이션 컨테이너의 로깅 드라이버를 기본값(json-file)에서 `fluentd`로 변경하여, 컨테이너에서 발생하는 모든 표준 출력(stdout)을 Fluent Bit(`localhost:24224`)로 직접 스트리밍.
- **가공 및 포워딩 (`fluent-bit.conf`):**
    - `[INPUT]`: Forward 플러그인으로 도커 로그 수신.
    - `[OUTPUT]`: Loki 플러그인을 사용하여 `http://loki:3100`으로 로그 데이터 전송. 이때 그라파나에서 검색하기 쉽도록 `job=spring-app` 라벨을 부착하여 인덱싱.

### 3.4. 시각화 계층 (Grafana)

- **Data Source 연동:** 도커 내부 DNS를 활용하여 Prometheus(`http://prometheus:9090`)와 Loki(`http://loki:3100`) 연결.
- **[핵심 트러블슈팅] Dashboard 호환성:**
    - Spring Boot 3.x 환경에서는 레거시 대시보드(ID: 4701)의 메트릭 쿼리 구조와 일부 불일치 발생.
    - Spring Boot 3.x 및 Java 17에 최적화된 **신규 대시보드(ID: 19004)** 로 임포트 대상을 변경하여 JVM Heap, CPU, GC 메트릭 정상 시각화 성공.
- **로그 실시간 모니터링:** `Explore` 탭에서 Loki 쿼리(`{job="spring-app"}`)를 활용하여 Live Tailing 기능 구현.

## 4. 구축 중 발생한 주요 트러블슈팅

1. **Docker 볼륨 마운트 디렉토리 오작동:**
    - **현상:** `fluent-bit.conf` 파일 마운트 시 'Are you trying to mount a directory onto a file'</em> 에러 발생.
    - **원인:** 호스트(EC2)에 파일이 존재하지 않는 상태에서 Docker 데몬이 해당 경로를 디렉토리로 임의 생성.
    - **해결:** 호스트에서 디렉토리를 `sudo rm -rf`로 강제 삭제하고 일반 사용자 권한으로 파일을 명시적 생성 후 재마운트.
2. **Docker Compose 버전 충돌 (Python KeyError):**
    - **현상:** 빌드 시 `KeyError: 'ContainerConfig'` 발생.
    - **원인:** Ubuntu `apt` 기본 패키지인 `docker-compose`(v1, Python 기반)와 최신 도커 엔진 간의 호환성 결여.
    - **해결:** v1 구버전을 삭제하고, 최신 Go 언어 기반의 플러그인인 `docker compose` (v2) 환경으로 업그레이드. (기존 구버전 컨테이너 찌꺼기 삭제 포함)
3. **로깅 파이프라인 누락 현상:**
    - **현상:** 애플리케이션 기동 로그만 보이고 API 호출 시 생성되는 런타임 실시간 로그 누락.
    - **원인:** Spring Controller에 실제로 로그를 발생시키는 코드(`System.out.println` 또는 `log.info`) 부재 및 로깅 드라이버 의존성 순서(depends\_on) 이슈.
    - **해결:** 소스 코드에 로깅 로직 추가 및 `docker compose down & up`을 통한 도커 로깅 파이프라인(app -> fluent-bit) 완전 재연결 수행.

<img width="1617" height="859" alt="스크린샷_2026-04-16_14 32 37" src="https://github.com/user-attachments/assets/4ad17dfa-c45d-45ac-8b3a-8df47ffb16b0" />
<img width="1611" height="902" alt="스크린샷_2026-04-16_14 36 25" src="https://github.com/user-attachments/assets/5694b875-2b16-48dd-89e5-ac403c32cccc" />
<img width="1612" height="898" alt="스크린샷_2026-04-16_14 36 54" src="https://github.com/user-attachments/assets/65574bac-fcae-4a4d-a9f5-f5d0bc2b580c" />

