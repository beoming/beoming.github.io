#!/usr/bin/env python3
"""Notion 내보내기 파일에서 자격 증명·개인정보 패턴을 마스킹합니다. (한 번 실행)"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "notions"

# 순서 중요: 긴 리터럴·고정 문자열 먼저
FIXED = [
    ("kwonsbum980@gmail.com", "[이메일-마스킹]"),
    ("kwonsbum98@gsneotek.com", "[이메일-마스킹]"),
    ("dw.kim@gsneotek.com", "[이메일-마스킹]"),
    ("https://gsnbeomtest.my.connect.aws/", "https://[connect-인스턴스별칭].my.connect.aws/"),
    ("https://gsnbeomtest.my.connect.aws", "https://[connect-인스턴스별칭].my.connect.aws"),
    ("amazon-connect-c137b8a96d54/connect/gsnbeomtest", "amazon-connect-[리소스ID-마스킹]/connect/[인스턴스별칭]"),
    ("/aws/connect/gsnbeomtest", "/aws/connect/[인스턴스별칭]"),
    (">Mozzi<", ">[로그인-ID-마스킹]<"),
    (">Beoming98~<", ">[비밀번호-마스킹]<"),
    ("nccwisentm!", "[비밀번호-마스킹]"),
    (
        "gsn-cafeteria-conversation-591@kwon-shin-beom-ncc.iam.gserviceaccount.com",
        "service-account@[YOUR_GCP_PROJECT].iam.gserviceaccount.com",
    ),
    ("gsn-cafeteria-conversation-591", "[YOUR_SA_NAME]"),
    ("GOOGLE_CLOUD_PROJECT=gsneotek-ncc-demo", "GOOGLE_CLOUD_PROJECT=your-gcp-project"),
]

# AWS Access Key ID (20 chars typical)
RE_AKIA = re.compile(r"AKIA[A-Z0-9]{16}")
RE_AKIAT = re.compile(r"AKIAT[A-Z0-9]{16}")
# Google API key style
RE_AIZA = re.compile(r"AIzaSy[A-Za-z0-9_-]{20,}")
# 임의 이메일 (예시/문서용 your-email@ 은 제외)
RE_EMAIL = re.compile(
    r"(?<![\w.-])([a-zA-Z0-9._%+-]{2,})@(gsneotek\.com|gmail\.com|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(?![\w.-])"
)


def redact_text(s: str) -> str:
    for old, new in FIXED:
        s = s.replace(old, new)
    s = RE_AKIA.sub("AKIA****************", s)
    s = RE_AKIAT.sub("AKIA****************", s)
    s = RE_AIZA.sub("AIzaSy_마스킹_공개저장소에_키_금지", s)
    def _email(m):
        local, domain = m.group(1), m.group(2)
        if domain.startswith("example.") or local in ("your-email", "user", "john.doe", "support"):
            return m.group(0)
        return "[이메일-마스킹]"
    s = RE_EMAIL.sub(_email, s)
    return s


def main() -> int:
    if not ROOT.is_dir():
        print("notions/ 폴더가 없습니다.", file=sys.stderr)
        return 1
    exts = {".html", ".htm", ".csv"}
    n = 0
    for path in sorted(ROOT.rglob("*")):
        if not path.is_file() or path.suffix.lower() not in exts:
            continue
        raw = path.read_text(encoding="utf-8", errors="surrogateescape")
        new = redact_text(raw)
        if new != raw:
            path.write_text(new, encoding="utf-8", newline="")
            n += 1
            print(path.relative_to(ROOT.parent))
    print(f"업데이트된 파일: {n}개")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
