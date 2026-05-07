---
title: "GitLab CI/CD"
date: 2026-05-07
categories:
  - DevOps
  - CI/CD
tags:
  - Gitlab
  - Infra

---
## AWS 단일 계정 통합 및 GitLab CI/CD 파이프라인 최적화 (WiseNTalk Frontend & Zendesk App)

프론트엔드 정적 자산(S3/CloudFront)과 고객사별 Zendesk Private App의 배포 효율성 및 보안성을 극대화하기 위해 CI/CD 인프라의 대대적인 마이그레이션 및 최적화 작업을 진행했습니다.

기존의 복잡했던 **계정 간 역할 위임(Cross-Account AssumeRole) 방식에서 벗어나, 모든 리소스를 하나의 AWS 계정에 통합(Single-Account)**하여 아키텍처를 단순화하고 배포 속도를 향상시킨 과정과 그 기술적 배경을 공유하고자 합니다.

---
<img width="1698" height="926" alt="ChatGPT Image 2026년 5월 6일 오후 05_56_46" src="https://github.com/user-attachments/assets/b344e922-d098-40d9-8495-c88f602ad47d" />


## 1. 배포 아키텍처 개요: 복잡성에서 단순함으로

### 기존 아키텍처의 페인 포인트 (Cross-Account AssumeRole)

과거에는 CI/CD Runner가 위치한 AWS 계정과 실제 서비스 리소스(S3, CloudFront)가 위치한 계정이 분리되어 있었습니다. 이로 인해 다음과 같은 기술적/운영적 비용이 발생했습니다.

1.  **복잡한 IAM 신뢰 관계(Trust Relationship) 관리:** 배포 대상 계정(B)의 IAM 역할이 Runner가 있는 계정(A)을 신뢰하도록 설정하고, 다시 Runner EC2는 그 역할을 빌려오도록(`sts:assume-role`) 설정해야 했습니다.
2.  **파이프라인 스크립트의 비대화:** 배포할 때마다 임시 자격 증명을 발급받고 환경 변수에 셋팅하는 로직이 `.gitlab-ci.yml`에 포함되어야 했으며, 이는 유지보수 비용을 증가시켰습니다.
3.  **디버깅의 어려움:** 권한 문제가 발생했을 때 문제의 원인이 어떤 계정의 어떤 IAM 설정에 있는지 파악하는 데 시간이 소요되었습니다.

### 최적화된 단일 계정(Single-Account) 아키텍처

우리는 모든 리소스를 하나의 AWS 계정(Seoul 리전)으로 통합했습니다. 그 결과는 놀라웠습니다.

<img src="/files/4326456169887787273" alt="WiseNTalk Optimized CI/CD Architecture" width="1274" />

* **시작점 (Left):** 개발자가 자체 구축된 GitLab 서버(`ncc-scm.com`)로 코드를 `Git Push`합니다.
* **핵심 동작 (Center):** EC2 기반의 전용 GitLab Runner(`WiseNTalk-Runner`)가 파이프라인의 브레인 역할을 합니다.
* **권한 (Bottom):** 러너 EC2는 배포에 필요한 강력한 **직접 권한(`S3FullAccess`, `CloudFrontFullAccess`)이 담긴 `IAM Instance Profile`을 입고 있습니다.** 더 이상 임시 출입증을 빌려올 필요가 없습니다.
* **최종 도달점 (Right):** 러너는 빌드 산출물을 S3에 다이렉트로 업로드하고 CloudFront 캐시를 무효화(Invalidation)하며, 마지막으로 Zendesk API를 호출하여 프라이빗 앱을 업데이트합니다.

---

## 2. 깊이 있는 핵심 기술 개념

이번 마이그레이션을 진행하며 심도 있게 다루었던 기술적 포인트들을 공유합니다.

### 2-1. GitLab Runner의 폴링 메커니즘과 네트워크 보안의 재발견

많은 엔지니어들이 오해하는 부분 중 하나가 **"GitLab 서버가 코드가 배포될 때 러너에게 먼저 리퀘스트를 보낸다"**는 것입니다.

**하지만 사실은 그 반대입니다.**

> **GitLab 서버는 배포할 코드가 생겨도 러너에게 먼저 연락하지 않습니다.**

* **동작 방식 (Outbound Polling):** 러너 데몬은 약 **3~5초에 한 번씩 아웃바운드(EC2 ➔ GitLab, HTTPS/443)**로 요청을 보냅니다. "나 일할 거 있어?"
* **기술적 이점 (인바운드 룰 Zero화):** 이 폴링 방식 덕분에, Runner EC2의 인바운드 보안 그룹을 싹 다 막아놔도(퍼블릭 IP 통신 기준) 파이프라인은 정상 작동합니다. GitLab 서버의 IP를 방화벽에 등록할 필요가 0.1%도 없습니다. 오직 관리자의 터미널 접속을 위한 SSH(22) 포트만 내 IP(`My IP`)로 한정하여 열어두면 됩니다.

### 2-2. AMI Migration: 상태(State)와 환경(Environment)의 분리

기존 EC2 서버를 새로운 계정으로 이관할 때 AMI(아마존 머신 이미지)를 활용했습니다. AMI는 서버를 통째로 복사하는 강력한 도구이지만, **'복사되는 것'과 '복사되지 않는 것'**을 명확히 구분해야 합니다.

* **AMI에 담긴 것 (상태 복사):** OS 설정, 설치된 패키지(Node.js, AWS CLI, `gitlab-runner`), 그리고 홈 폴더의 앱 디렉토리 및 파일들. 덕분에 복구는 매우 빨랐습니다.
* **AMI에 담기지 않은 것 (환경/권한):** AWS 인프라 권한(`IAM Instance Profile`), 새로운 네트워크 VPC/서브넷 ID, 그리고 GitLab 서버와의 새로운 통신 식별자(**Runner Token**).

**마이그레이션 트러블슈팅:** AMI 설치 직후 러너가 `Verification Fail` 되는 문제를 겪었습니다. 원인은 이전 계정의 러너 토큰 정보가 남아있었기 때문입니다. `sudo gitlab-runner unregister --all-runners`로 이전 흔적을 깔끔히 지우고, `ncc-scm.com` URL과 새로운 토큰으로 다시 **`sudo` 권한을 사용하여 시스템 레벨(`config.toml`)에 등록**함으로써 문제를 해결했습니다.

---

## 3. 강력한 파이프라인 구성 및 운영 전략

### 3-1. `.gitlab-ci.yml` 파이프라인의 다이어트 (AssumeRole 제거)

이제 파이프라인 스크립트에서 복잡한 임시 자격 증명 발급 로직(`sts assume-role`)은 모두 **삭제**되었습니다. EC2가 강력한 권한을 입고 있으므로, 곧바로 `aws s3 sync` 명령어를 치기만 하면 됩니다.

기존 코드에서 불필요해진 부분을 걷어낸 최종 수정본의 모습입니다.

```yaml
# ... (생략) ...

# ==========================================
# 2. Deploy to Dev (S3 + CloudFront)
# ==========================================
deploy_to_dev:
  stage: deploy-dev
  dependencies:
    - build_app
  script:
    - echo "Deploying to Dev S3..."
    # 임시 토큰 발급 로직이 완벽하게 제거되었습니다
    - aws s3 sync ./build s3://$DEV_S3_BUCKET --delete
    - aws cloudfront create-invalidation --distribution-id $DEV_CF_ID --paths "/*"
  only:
    - main

# ... (생략) ...

# ==========================================
# 4. Promote to Prod (S3/CF 이관) - Build once, deploy many
# ==========================================
promote_to_prod:
  stage: promote-prod
  needs: ["update_zendesk_dev"]
  when: manual # QA 완료 후 수동 승인
  script:
    - |
      set -e
      TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
      ROLLBACK_PATH="rollback/${TIMESTAMP}"

      # 백업 로직: 운영 환경의 안정성을 위해 기존 Prod 버킷 내용을 백업 폴더로 이관
      echo "Backing up Prod → ${ROLLBACK_PATH}"
      aws s3 sync s3://${PROD_S3_BUCKET} s3://${PROD_S3_BUCKET}/${ROLLBACK_PATH} --exclude "rollback/*"

      # 이관 로직: Dev S3 정적 파일을 Prod S3로 이관. 다시 빌드하지 않고 산출물만 이동!
      echo "Promoting Dev → Prod"
      aws s3 sync s3://${DEV_S3_BUCKET} s3://${PROD_S3_BUCKET} --delete --exclude "rollback/*"

      aws cloudfront create-invalidation --distribution-id ${PROD_CF_ID} --paths "/*"
      echo "Promote to Prod completed"
  only:
    - main
```

**"Build once, deploy many!"**: 저희는 `Promote-Prod` 단계에서 다시 빌드하지 않고, `Dev S3`에 이미 검증된 산출물을 `Prod S3`로 다이렉트로 이관(`sync`)합니다. 이는 환경 간 불일치를 원천 차단하는 베스트 프랙티스입니다.

### 3-2. Zendesk App 업데이트 전략: ZCLI와 Bash 간접 참조의 마법

이번 마이그레이션의 꽃은 고객사별 Zendesk Private App 업데이트 로직입니다. 템플릿(`.update_zendesk_template`) 내부에 구현되어 있습니다.

#### 기술적 난제 1: 유연한 변수 확장성 (Bash Indirect Referencing)

고객사가 늘어날 때마다 `If/Else` 문을 추가하는 것은 비효율적입니다. 저희는 Bash의 **간접 참조(`${!VAR}`)** 기술을 활용했습니다.

* **동적 환경 매핑:** `ENV_PREFIX` (`DEV` 또는 `PROD`)를 주입받아, 파이프라인이 실행될 때 동적으로 `DEV_ZENDESK_TOKEN` 또는 `PROD_ZENDESK_APP_ID` 형태의 GitLab 변수명을 조합하고, 그 안의 실제 값을 낚아챕니다. 이로써 고객사가 수십 개로 늘어나도 Job 블록만 복사하면 끝나는 유연한 구조를 완성했습니다.

#### 기술적 난제 2: SaaS API의 불안정성 극복 (Retry Logic)

Zendesk API 서버(SaaS)는 가끔 일시적인 순단(502 Bad Gateway)이 발생합니다. 파이프라인이 이 한 번의 실패로 멈추는 것을 막기 위해 강력한 **재시도(Retry)** 로직을 쉘 스크립트로 구현했습니다.

```bash
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  RETRY_COUNT=$((RETRY_COUNT + 1))
  echo "Running npx zcli apps:update (Attempt $RETRY_COUNT)..."
  
  # DEBUG 모드 활성화로 API 에러 상세 출력
  DEBUG=zcli:api npx --yes @zendesk/zcli apps:update > /tmp/zcli_update.log 2>&1
  ZCLI_EXIT_CODE=$?
  
  if [ $ZCLI_EXIT_CODE -eq 0 ]; then
    UPDATE_SUCCESS=true; break
  else
    ERROR_LOG=$(cat /tmp/zcli_update.log 2>/dev/null || echo "")
    cat /tmp/zcli_update.log
    
    # 502 error detected시에만 10초 대기 후 retry 진행
    if echo "$ERROR_LOG" | grep -qE "502|Bad Gateway|ERR_BAD_RESPONSE"; then
      echo "502 error detected. Retrying in 10 seconds..."
      sleep 10
    else
      # 권한 등 다른 에러는 즉시 fail 처리
      echo "Non-retryable error occurred."; exit 1
    fi
  fi
done
```

또한, `DEBUG=zcli:api` 환경변수를 켜두어, 앱 업로드 실패 시 Zendesk 서버가 뱉어내는 상세 에러 사유(예: 401 Unauthorized)를 로그에 빨간색으로 출력하게 만들어 트러블슈팅 효율성을 극대화했습니다.

---

### 마치며..

이번 마이그레이션을 통해 저희는 복잡했던 IAM 권한 문제를 해결하고, 파이프라인 코드를 획기적으로 줄이며, 보안을 더욱 강화할 수 있었습니다. 특히 단일 계정 통합과 폴링 방식의 결합은 유지보수 비용을 낮추고 배포의 안정성을 높이는 데 핵심적인 역할을 했습니다.

*(본 매뉴얼과 매핑하여 이해하시면 됩니다.)*
