---
layout: default
title: 글 관리
---

{% assign repo = site.github.repository_nwo | default: site.blog_repository %}
{% assign branch = site.blog_branch %}
{% assign notion_files = site.static_files | where_exp: "f", "f.path contains '/notions/'" | sort: "path" %}
{% assign admin_key = "beom-admin-unlock" %}
{% assign sha_cfg = site.admin_unlock_sha256 | strip %}

{% if sha_cfg != "" %}
<div id="admin-gate" class="admin-gate" role="dialog" aria-labelledby="admin-gate-title">
  <div class="admin-gate-box">
    <h2 id="admin-gate-title">관리자 확인</h2>
    <p class="admin-gate-note">이 브라우저 탭에서만 유지됩니다. 기기를 잃었으면 GitHub에서 암호·URL을 바꾸세요.</p>
    <label class="admin-gate-label" for="admin-pass-input">암호</label>
    <input class="admin-gate-input" id="admin-pass-input" type="password" autocomplete="current-password" />
    <p id="admin-gate-err" class="admin-gate-err" role="alert" hidden></p>
    <button type="button" class="admin-gate-submit" id="admin-pass-submit">들어가기</button>
  </div>
</div>
<div id="admin-protected" class="admin-protected" hidden>
{% endif %}

<p class="admin-security-note"><strong>보안 안내:</strong> GitHub Pages는 서버 로그인이 없습니다. 실제로 저장소를 수정할 수 있는 사람은 <strong>해당 GitHub 저장소 권한이 있는 계정</strong>뿐입니다. 이 페이지의 난수 주소와 아래 선택 암호는 검색·우발적 유입을 줄이기 위한 것이며, 저장소가 공개라면 설정값도 코드에 남습니다. 완전 비공개 운영이 필요하면 저장소를 비공개로 두거나 별도 인증(Cloudflare Access 등)을 쓰세요.</p>

# 글 관리

GitHub에 로그인한 상태에서만 아래 링크가 동작합니다. Notion HTML·이미지 등은 <strong>편집</strong> 화면 상단에서 파일명을 바꿔 저장하면 이름 변경(이동)됩니다.

<p>
  <a class="btn-admin" href="https://github.com/{{ repo }}/new/{{ branch }}/_posts">새 포스트 작성 (GitHub)</a>
  <a class="btn-admin btn-admin-secondary" href="https://github.com/{{ repo }}/new/{{ branch }}/notions">notions에 새 파일 (GitHub)</a>
</p>

## 포스트 목록

<table class="admin-table">
  <thead>
    <tr>
      <th scope="col">제목</th>
      <th scope="col">날짜</th>
      <th scope="col">작업</th>
    </tr>
  </thead>
  <tbody>
    {% for post in site.posts %}
    <tr>
      <td><a href="{{ post.url | relative_url }}">{{ post.title }}</a></td>
      <td>{{ post.date | date: "%Y-%m-%d" }}</td>
      <td class="admin-actions">
        <a href="https://github.com/{{ repo }}/edit/{{ branch }}/{{ post.path }}">편집·이름 변경</a>
        <span aria-hidden="true"> · </span>
        <a href="https://github.com/{{ repo }}/delete/{{ branch }}/{{ post.path }}">삭제</a>
      </td>
    </tr>
    {% endfor %}
  </tbody>
</table>

{% if site.posts.size == 0 %}
<p class="post-meta">아직 포스트가 없습니다. 위의 <strong>새 포스트 작성</strong>에서 <code>_posts/YYYY-MM-DD-slug.md</code> 형식으로 추가하세요.</p>
{% endif %}

## Notion 문서·리소스 (<code>notions/</code>)

<p class="post-meta">목록은 빌드 시점 기준입니다. 경로에 공백·한글이 있어도 GitHub로 연결되도록 인코딩됩니다. 긴 목록은 브라우저에서 검색(Ctrl+F / ⌘F)하세요.</p>

<div class="admin-table-wrap">
<table class="admin-table admin-table--notions">
  <thead>
    <tr>
      <th scope="col">경로</th>
      <th scope="col">사이트</th>
      <th scope="col">GitHub</th>
    </tr>
  </thead>
  <tbody>
    {% for f in notion_files %}
    <tr>
      <td class="admin-path-cell"><code>{{ f.path | xml_escape }}</code></td>
      <td class="admin-actions"><a href="{{ f.path | relative_url }}">보기</a></td>
      <td class="admin-actions">
        <a href="#" data-gh="edit" data-path="{{ f.path | xml_escape }}">편집·이름 변경</a>
        <span aria-hidden="true"> · </span>
        <a href="#" data-gh="delete" data-path="{{ f.path | xml_escape }}">삭제</a>
        <span aria-hidden="true"> · </span>
        <a href="#" data-gh="blob" data-path="{{ f.path | xml_escape }}">Blob</a>
      </td>
    </tr>
    {% endfor %}
  </tbody>
</table>
</div>

{% if notion_files.size == 0 %}
<p class="post-meta"><code>notions/</code>에 정적 파일이 없습니다.</p>
{% endif %}

<p class="post-meta">저장소: <code>{{ repo }}</code> · 브랜치: <code>{{ branch }}</code> · 관리 URL은 <code>_config.yml</code>의 <code>defaults → admin.md → permalink</code> 에 정의되어 있습니다.</p>

<script>
(function () {
  var repo = {{ repo | jsonify }};
  var branch = {{ branch | jsonify }};
  function ghUrl(kind, path) {
    var segs = path.replace(/^\//, '').split('/').map(function (s) { return encodeURIComponent(s); }).join('/');
    var base = 'https://github.com/' + repo + '/';
    if (kind === 'edit') return base + 'edit/' + branch + '/' + segs;
    if (kind === 'delete') return base + 'delete/' + branch + '/' + segs;
    if (kind === 'blob') return base + 'blob/' + branch + '/' + segs;
    return '#';
  }
  document.querySelectorAll('a[data-gh][data-path]').forEach(function (a) {
    var kind = a.getAttribute('data-gh');
    var path = a.getAttribute('data-path');
    if (path) a.setAttribute('href', ghUrl(kind, path));
  });
})();
</script>

{% if sha_cfg != "" %}
</div>
<script>
(function () {
  var expected = {{ sha_cfg | jsonify }}.trim().toLowerCase();
  var key = {{ admin_key | jsonify }};
  var gate = document.getElementById('admin-gate');
  var inner = document.getElementById('admin-protected');
  var input = document.getElementById('admin-pass-input');
  var btn = document.getElementById('admin-pass-submit');
  var err = document.getElementById('admin-gate-err');
  if (!gate || !inner) return;

  function showMain() {
    gate.setAttribute('hidden', '');
    inner.removeAttribute('hidden');
  }

  function sha256Hex(s) {
    var enc = new TextEncoder();
    return crypto.subtle.digest('SHA-256', enc.encode(s)).then(function (buf) {
      return Array.from(new Uint8Array(buf))
        .map(function (b) { return b.toString(16).padStart(2, '0'); })
        .join('');
    });
  }

  if (!expected) {
    showMain();
    return;
  }
  try {
    if (sessionStorage.getItem(key) === expected) showMain();
  } catch (e) {}

  btn.addEventListener('click', function () {
    err.hidden = true;
    var pass = (input && input.value) || '';
    if (!pass) {
      err.textContent = '암호를 입력하세요.';
      err.hidden = false;
      return;
    }
    sha256Hex(pass).then(function (hex) {
      if (hex.toLowerCase() === expected) {
        try { sessionStorage.setItem(key, expected); } catch (e) {}
        showMain();
      } else {
        err.textContent = '암호가 맞지 않습니다.';
        err.hidden = false;
      }
    }).catch(function () {
      err.textContent = '이 브라우저에서는 Web Crypto를 쓸 수 없습니다.';
      err.hidden = false;
    });
  });
})();
</script>
{% endif %}
