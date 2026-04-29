---
title: "서버 인프라 최적화 방안(OS/DB/Redis/WAS)"
date: 2026-04-29
categories:
  - Develop
  - SpringBoot
tags:
  - 최적화
  - Infra

---
### ```성능 최적화는 '병목 현상 제거'와 '자원의 효율적 사용'이 핵심입니다.```

## 시작하며: 성능 병목의 원인을 찾아서
가용 영역(AZ-a, AZ-c)에 걸쳐 FortiGate VPN, 로드밸런서(ALB/NLB), Docker 컨테이너 기반 WAS, 그리고 데이터 계층(MariaDB/Redis)이 유기적으로 연결된 다중 계층 구조를 가지고 있는 서비스를 운영하고 있습니다(하기 이미지 참고).
<img width="1159" height="804" alt="스크린샷 2026-03-16 10 52 43" src="https://github.com/user-attachments/assets/5ce7d949-13f9-4b9b-ad01-c86172162444" />

안정적인 구조이지만, 트래픽이 몰리는 피크 타임에는 '접속 지연', '가끔 튀는 502 에러', 그리고 'DB 응답 속도 저하'라는 문제점에 직면했습니다. 하드웨어 스펙만 높이는 것은 임시방편일 뿐이었습니다. 문제의 근본 원인을 해결하기 위해 각 계층의 설정을 깊숙이 파고들기로 결정했습니다.

## 1\. 리눅스(OS) 커널 및 네트워크 최적화

<img width="2362" height="1824" alt="Gemini_Generated_Image_kly2a5kly2a5kly2" src="https://github.com/user-attachments/assets/2d1e087a-8ba4-4e45-b657-9ae88fb0d9d4" />

웹 서버(WAS)와 DB, Redis가 설치된 모든 EC2 인스턴스에 공통으로 적용해야 하는 시스템 레벨의 튜닝입니다. 트래픽이 몰릴 때 서버가 뻗는 현상을 방지합니다.

* **파일 디스크립터(File Descriptor) 한도 증가:** 리눅스는 모든 네트워크 연결(소켓)을 파일로 취급합니다. 기본값(보통 1024)은 턱없이 부족하므로 반드시 늘려야 합니다.

    * `/etc/security/limits.conf` 파일을 열고 아래 내용을 추가합니다.
    * `* soft nofile 65535`
    * `* hard nofile 65535`
* **TCP TIME\_WAIT 소켓 재사용:** 클라이언트와 연결이 끊긴 후에도 포트가 잠시 대기 상태(TIME\_WAIT)로 남게 되는데, 트래픽이 많으면 남은 포트가 고갈될 수 있습니다.

    * `sysctl -w net.ipv4.tcp_tw_reuse=1` 명령어로 재사용을 허용합니다.
* **로컬 포트 범위 확장:** 서버가 외부(DB, 외부 API 등)로 나갈 때 사용할 수 있는 포트의 범위를 최대로 넓힙니다.

    * `sysctl -w net.ipv4.ip_local_port_range="1024 65535"`
* **연결 대기 큐(Backlog Queue) 확장:** 갑자기 트래픽이 폭주할 때 연결 요청을 버리지 않고 대기시킬 수 있는 큐의 크기를 늘립니다.

    * `sysctl -w net.core.somaxconn=8192`

## 2\. 데이터베이스 (MariaDB) 최적화

<img width="2362" height="1824" alt="Gemini_Generated_Image_kly2a5kly2a5kly2 (1)" src="https://github.com/user-attachments/assets/6c996ce8-b9a6-4dae-9997-52236395fe5b" />

DB는 디스크 I/O가 가장 큰 병목이므로, 최대한 메모리(RAM)에서 처리하도록 설정하는 것이 중요합니다.

* **InnoDB 버퍼 풀 사이즈 (가장 중요):** MariaDB가 데이터와 인덱스를 메모리에 캐싱하는 공간입니다.

    * `my.cnf` 파일에서 `innodb_buffer_pool_size`를 DB 서버 전체 RAM 용량의 **70% \~ 80%** 로 설정합니다. (예: 16GB RAM이면 12GB로 설정)
* **최대 커넥션 수 조정:** WAS에서 들어오는 연결을 감당할 수 있도록 늘리되, 무작정 늘리면 메모리가 고갈됩니다.

    * `max_connections = 500` \~ `1000` 사이로 설정하되, WAS의 커넥션 풀(Connection Pool) 총합보다 약간 크게 설정합니다.
* **슬로우 쿼리(Slow Query) 로깅:** 성능 저하의 주범인 느린 쿼리를 찾아내기 위해 반드시 켜두어야 합니다.

    * `slow_query_log = 1`, `long_query_time = 2` (2초 이상 걸리는 쿼리 기록)로 설정하여 정기적으로 분석합니다.

## 3\. 캐시 서버 (Redis) 최적화

<img width="2362" height="1824" alt="Gemini_Generated_Image_kly2a5kly2a5kly2 (2)" src="https://github.com/user-attachments/assets/35aa7aab-b7eb-421c-8980-70f908c04c5b" />

Redis는 메모리 기반이므로 '메모리가 가득 찼을 때 어떻게 할 것인가'와 '데이터를 얼마나 자주 지울 것인가'를 설정해야 합니다.

* **용도별 캐시 만료 시간(TTL) 구체화:** 모든 데이터에 똑같은 캐시 주기를 적용하면 효율이 떨어집니다.

    * **공지사항, 상담 분류 코드 등 (정적 데이터):** 1시간(3600초) \~ 24시간.
    * **고객의 실시간 상태, 세션 정보:** 5분(300초) \~ 30분.
    * **임시 인증 번호 등:** 3분(180초).
* **메모리 한계 도달 시 삭제 정책(Eviction Policy):** 메모리가 꽉 찼을 때 서비스 장애를 막기 위한 설정입니다.

    * `redis.conf`에서 `maxmemory-policy allkeys-lru`로 설정합니다. (가장 오래전에 사용된 데이터부터 자동으로 삭제하여 공간 확보)
* **디스크 저장(Persistence) 최소화:** Redis를 단순 '캐시(날아가도 DB에서 다시 조회하면 되는 데이터)'로만 쓴다면, 디스크에 백업하는 기능을 꺼서 성능을 극대화할 수 있습니다.

    * `save ""` 로 설정하여 RDB 스냅샷 기능을 끕니다.

## 4\. WAS (컨테이너/어플리케이션) 최적화

<img width="1181" height="912" alt="Gemini_Generated_Image_kly2a5kly2a5kly2 (3)" src="https://github.com/user-attachments/assets/e42c91f9-3339-48a3-807e-ad7d721e71e5" />

도커(Docker) 위에 올라간 어플리케이션과 로드밸런서(ALB/NLB) 사이의 연결을 매끄럽게 해야 합니다.

* **커넥션 풀(Connection Pool) 최적화:** WAS가 DB와 통신할 때 매번 연결을 맺고 끊으면 느려집니다. (주로 HikariCP 사용)

    * `minimum-idle`과 `maximum-pool-size`를 동일하게 맞춥니다. (예: 컨테이너당 10\~20개). 풀 크기를 고정하면 런타임에 커넥션을 새로 맺는 오버헤드가 사라집니다.
* **로드밸런서(ALB)와 WAS의 Timeout 설정:** 이 부분이 어긋나면 사용자에게 '502 Bad Gateway' 에러가 뜹니다.

    * **규칙:** `WAS의 Keep-Alive Timeout` > `ALB의 Idle Timeout` 이어야 합니다.
    * 예를 들어 ALB의 Idle Timeout이 60초라면, WAS(예: Tomcat/Nginx)의 Keep-Alive Timeout은 65초 이상으로 설정하여 WAS가 먼저 연결을 끊지 못하게 해야 합니다.
* **도커 리소스 제한 (Resource Limit):** 특정 컨테이너가 서버의 CPU/RAM을 독식하여 다른 컨테이너가 죽는 것을 막아야 합니다.

    * `docker-compose`나 ECS 설정에서 각 컨테이너별로 `cpus`와 `mem_limit`을 명확히 할당합니다.
