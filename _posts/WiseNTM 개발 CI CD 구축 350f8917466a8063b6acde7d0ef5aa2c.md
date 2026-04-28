# WiseNTM 개발 CI/CD 구축

## 1. 전체 CI/CD 아키텍처 흐름도

1. **GitLab Push:** 개발자가 코드를 푸시하면 깃랩 웹훅이 젠킨스(8080 포트)를 호출합니다.
2. **Jenkins Build:** 젠킨스가 코드를 받아 Maven으로 `.jar` 파일을 빌드합니다.
3. **Transfer (SCP):** 빌드된 `.jar` 파일과 `Dockerfile`을 두 대의 WAS 서버(EC2)로 전송합니다.
4. **Deploy (SSH & Docker):** 젠킨스가 WAS 서버에 접속하여 기존 도커 컨테이너를 중지/삭제하고, 새로운 이미지로 컨테이너를 실행합니다.

---

## 2. 도커(Docker)의 핵심 개념 (Docker Concepts)

도커는 애플리케이션을 가볍고 격리된 환경인 '컨테이너(Container)'에 담아 실행하는 기술입니다. 기존의 가상머신(VM) 방식과는 달리, 하드웨어 가상화가 아닌 **운영체제(OS) 수준의 격리**를 수행하므로 훨씬 가볍고 빠릅니다.

아래 다이어그램은 가상머신과 도커 컨테이너의 구조적 차이를 명확하게 보여줍니다.

- **Virtual Machine (VM):** 각 VM은 하이퍼바이저(Hypervisor) 위에서 독립된 Guest OS(운영체제)를 통째로 품고 있습니다. 따라서 부팅이 느리고 자원을 많이 차지합니다.
- **Docker Container:** 하스트 OS(Host OS) 위에서 도커 엔진(Docker Engine)을 통해 실행됩니다. **호스트 OS의 커널(Kernel)을 공유**하면서 컨테이너마다 애플리케이션 실행에 필요한 파일(Libs/Bins)과 설정만 격리하여 가지고 있습니다. 따라서 부팅이 빠르고 자원을 효율적으로 사용합니다.

---

## 3. 도커를 사용하는 이유

1. **환경 일관성 (Environment Consistency):** "내 컴퓨터에선 됐는데?" 라는 말을 완벽하게 없애줍니다. `Dockerfile`에 정의된 환경은 개발자 PC, 빌드 서버, 운영 서버(AWS) 어디서든 똑같이 돌아갑니다. "Build Once, Run Anywhere"의 가치를 실현합니다.
2. **격리와 보안 (Isolation & Security):** 현재 모바일 앱과 소켓 앱이 완벽하게 격리된 담장(컨테이너) 안에서 서로 간섭 없이 실행됩니다. 한 앱이 해킹당하거나 문제를 일으켜도 다른 앱과 호스트 운영체제는 보호됩니다. "No Dependency Conflicts"를 보장합니다.
3. **이식성 (Portability):** 규격화된 도커 이미지는 어떤 클라우드 인프라(AWS, Azure, GCP 등)로든 쉽게 옮길 수 있습니다. "Multi-Cloud Compatibility"를 제공하여 특정 인프라에 종속되는 것을 막아줍니다.
4. **빠른 배포 (Rapid Deployment):** 우리는 컨테이너를 1분 만에 빌드하고 배포할 수 있습니다. 이미지가 가벼워 서버 간 이동이 빠르고, 컨테이너 부팅이 즉각적이기 때문입니다. "Scale and Deliver Faster"를 가능하게 합니다.

---

## 4. Jenkinsfile 최종본 (파이프라인 스크립트)

여러 사람이 동시에 푸시했을 때 꼬이는 것을 방지하는 `disableConcurrentBuilds()` 옵션을 포함한 최종 버전입니다. 두 앱의 **포트, 파일명, 볼륨 마운트 경로**가 명확히 분리된 것이 핵심입니다.

### A. 모바일 앱 (`mobile` 레포지토리)

- **사용 포트:** 8089
- **마운트 폴더:** `/home/ec2-user/mobile`

Groovy

```docker
`pipeline {
    agent any
    options {
        disableConcurrentBuilds() // 동시 배포 충돌 방지 (한 줄 서기)
        buildDiscarder(logRotator(numToKeepStr: '5')) // 최근 5개 로그만 보관
    }
    environment {
        WAS1_IP = 'was1 서버 ip'
        WAS2_IP = 'was2 서버 ip'
        APP_NAME = 'wisentm-mobile'
        APP_PORT = '특정 앱 포트' 
    }
    stages {
        stage('Checkout') { steps { checkout scm } }
        stage('Build JAR') {
            agent { docker { image 'maven:3.9-eclipse-temurin-17'; args '-u root:root -v ${WORKSPACE}/.m2:/root/.m2'; reuseNode true } }
            steps { sh 'mvn clean package -DskipTests' }
        }
        stage('Deploy') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'wisentm-was-key', keyFileVariable: 'SSH_KEY', usernameVariable: 'SSH_USER')]) {
                    sh '''
                        SSH_OPTS="-o StrictHostKeyChecking=no -i $SSH_KEY"
                        JAR_FILE=$(find target -name "*.jar" | grep -v "original" | head -n 1)

                        # WAS 1 배포
                        scp $SSH_OPTS $JAR_FILE $SSH_USER@$WAS1_IP:~/app.jar
                        scp $SSH_OPTS Dockerfile $SSH_USER@$WAS1_IP:~/Dockerfile
                        ssh $SSH_OPTS $SSH_USER@$WAS1_IP "
                            docker stop $APP_NAME || true
                            docker rm $APP_NAME || true
                            docker build -t $APP_NAME -f ~/Dockerfile ~
                            docker run -d -p $APP_PORT:$APP_PORT -v /home/ec2-user/mobile:/app/config --name $APP_NAME $APP_NAME
                            docker image prune -f
                        "
                        # WAS 2 배포 (WAS1과 동일 생략)
                    '''
                }
            }
        }
    }
}
```

### B. 소켓 앱(`socket` 레포지토리)

- **사용 포트:** 8090
- **마운트 폴더:** `/home/ec2-user/socket`

```docker

`pipeline {
    agent any
    options { disableConcurrentBuilds(); buildDiscarder(logRotator(numToKeepStr: '5')) }
    environment {
        WAS1_IP = 'was1 서버 ip'
        WAS2_IP = 'was2 서버 ip'
        APP_NAME = 'wisentm-socket'
        APP_PORT = '특정 앱 포트' 
    }
    // ... Checkout, Build JAR 스테이지는 모바일과 동일 ...
        stage('Deploy') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'wisentm-was-key', keyFileVariable: 'SSH_KEY', usernameVariable: 'SSH_USER')]) {
                    sh '''
                        SSH_OPTS="-o StrictHostKeyChecking=no -i $SSH_KEY"
                        JAR_FILE=$(find target -name "*.jar" | grep -v "original" | head -n 1)

                        # WAS 1 배포 (파일명을 _socket으로 확실히 분리!)
                        scp $SSH_OPTS $JAR_FILE $SSH_USER@$WAS1_IP:~/app_socket.jar
                        scp $SSH_OPTS Dockerfile_socket $SSH_USER@$WAS1_IP:~/Dockerfile_socket
                        ssh $SSH_OPTS $SSH_USER@$WAS1_IP "
                            docker stop $APP_NAME || true
                            docker rm $APP_NAME || true
                            docker build -t $APP_NAME -f ~/Dockerfile_socket ~
                            docker run -d -p $APP_PORT:$APP_PORT -v /home/ec2-user/socket:/app/config --name $APP_NAME $APP_NAME
                            docker image prune -f
                        "
                    '''
                }
            }
        }
    }
}`
```

---

## 5. Dockerfile 최종본

서버에 복사된 JAR 파일을 컨테이너 내부로 가져와 실행하는 명세서입니다. 여기서 `COPY` 대상 파일명을 명확히 해주는 것이 핵심이었습니다.

**[모바일 용: `Dockerfile`]**

```docker
FROM eclipse-temurin:17-jre-alpine
RUN apk add --no-cache tzdata
ENV TZ=Asia/Seoul
WORKDIR /app
COPY app.jar /app/app.jar
CMD ["java", "-jar", "app.jar"]
```

**[소켓 용: `Dockerfile_socket`]**

```docker
FROM eclipse-temurin:17-jre-alpine
RUN apk add --no-cache tzdata
ENV TZ=Asia/Seoul
WORKDIR /app
# 주의: 서버에 있는 'app_socket.jar'를 가져와서 내부에서는 'app.jar'로 부름
COPY app_socket.jar /app/app.jar
CMD ["java", "-jar", "app.jar"]
```

---

## 6. 외부 설정 파일 연동 (볼륨 마운트)

도커 안에서 돌아가는 앱이 서버의 기존 설정 파일(`application.properties`)을 그대로 읽을 수 있게 만든 핵심 설정입니다. 도커의 '격리' 특성 때문에 아래 사항들을 반드시 수정해야 했습니다.

1. **DB 주소:** `localhost` ➔ `172.31.6.34` (WAS 내부 IP)
2. **녹취 등 파일 저장 경로:** `/home/ec2-user/...` ➔ `/app/config/...` (컨테이너 내부 경로 기준)
3. **로그 설정 연동:** `logging.config=file:/app/config/logback-spring.xml` (properties 파일 하단에 추가)

이제 설정 변경이 필요할 땐, 서버의 `~/mobile` 또는 `~/socket` 폴더에서 `vi application.properties`로 수정한 뒤, **`docker restart [컨테이너명]`** 만 치면 즉시 적용됩니다.

---

## 7. 트러블슈팅 요약

1. **GitLab Webhook 404 Error:**
    - **원인:** Jenkins 파이프라인 이름 오타 또는 Secret Token 불일치.
    - **해결:** Jenkins에서 새 토큰을 발급받아 GitLab에 업데이트하여 해결.
2. **Port already in use (8080 포트 충돌):**
    - **원인:** 기존 Raw Java 프로세스와 Docker 컨테이너의 포트 경합.
    - **해결:** `kill -9 $(cat catalina.pid)` 및 `sudo lsof -i` 명령어로 기존 프로세스 완벽 종료 후 모바일(8089), 소켓(8090)으로 포트 분리.
3. **Healthcheck 404 Error (소켓 앱):**
    - **원인:** `Dockerfile_socket`에서 실수로 모바일 앱(`app.jar`)을 복사(`COPY`)하여 실행함.
    - **해결:** `COPY app_socket.jar /app/app.jar`로 짝꿍을 맞춰주어 해결.

---