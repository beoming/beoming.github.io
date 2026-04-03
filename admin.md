---
layout: default
title: 글 관리
permalink: /admin/
---

{% assign repo = site.github.repository_nwo | default: site.blog_repository %}
{% assign branch = site.blog_branch %}

# 글 관리

GitHub에 로그인한 뒤 아래 링크로 마크다운 포스트를 추가·편집·삭제할 수 있습니다. GitHub Pages는 정적 사이트이므로 변경 사항은 저장소에 반영된 뒤 빌드되어 공개됩니다.

<p>
  <a class="btn-admin" href="https://github.com/{{ repo }}/new/{{ branch }}/_posts">새 글 작성 (GitHub)</a>
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
        <a href="https://github.com/{{ repo }}/edit/{{ branch }}/{{ post.path }}">편집</a>
        <span aria-hidden="true"> · </span>
        <a href="https://github.com/{{ repo }}/delete/{{ branch }}/{{ post.path }}">삭제</a>
      </td>
    </tr>
    {% endfor %}
  </tbody>
</table>

{% if site.posts.size == 0 %}
<p class="post-meta">아직 포스트가 없습니다. 위의 <strong>새 글 작성</strong>에서 <code>_posts/YYYY-MM-DD-slug.md</code> 형식으로 추가하세요.</p>
{% endif %}

## Notion HTML 문서

Notion에서 내보낸 HTML은 <code>notions/</code> 폴더에 있습니다. 내용을 바꾸려면 같은 경로에서 파일을 교체한 뒤 저장소에 푸시하면 됩니다.

<p class="post-meta">저장소: <code>{{ repo }}</code> · 브랜치: <code>{{ branch }}</code></p>
