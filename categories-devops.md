---
layout: default
title: DevOps
permalink: /categories/devops/
---

# DevOps

<ul>
  {% for post in site.categories["DevOps"] %}
    <li>
      <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
      <span> — {{ post.date | date: "%Y년 %m월 %d일" }}</span>
    </li>
  {% endfor %}
</ul>
