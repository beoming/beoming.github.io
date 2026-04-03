---
layout: default
title: Insight
permalink: /categories/insight/
---

# Insight

<ul>
  {% for post in site.categories["Insight"] %}
    <li>
      <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
      <span> — {{ post.date | date: "%Y년 %m월 %d일" }}</span>
    </li>
  {% endfor %}
</ul>
