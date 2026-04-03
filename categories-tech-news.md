---
layout: default
title: Tech News
permalink: /categories/tech-news/
---

# Tech News

<ul>
  {% for post in site.categories["Tech News"] %}
    <li>
      <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
      <span> — {{ post.date | date: "%Y년 %m월 %d일" }}</span>
    </li>
  {% endfor %}
</ul>
