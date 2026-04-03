(function () {
  "use strict";

  /** 파일명 끝의 Notion 블록 ID(공백 뒤 긴 hex) 제거 */
  function stripNotionSuffix(name) {
    if (!name) return "";
    var s = String(name).trim();
    s = s.replace(/\s+[0-9a-f]{12,}$/i, "").trim();
    return s;
  }

  function cleanFolderLabel(seg) {
    if (!seg) return "";
    try {
      seg = decodeURIComponent(seg.replace(/\+/g, " "));
    } catch (e) {}
    var t = stripNotionSuffix(seg);
    if (/^[0-9a-f]{16,}$/i.test(t)) return "";
    return t;
  }

  /** /notions/카테고리/.../파일.html → 부제목용 폴더 라벨 */
  function subtitleFromPath(path) {
    if (!path) return "";
    var u = path.replace(/\/+$/, "");
    var parts = u.split("/").filter(Boolean);
    if (parts.length <= 3) return "워크스페이스 루트";
    var parent = parts[parts.length - 2];
    var label = cleanFolderLabel(parent);
    if (!label) return "하위 폴더";
    return label;
  }

  var list = document.getElementById("notion-page-list");
  if (!list) return;

  var items = [].slice.call(list.querySelectorAll(".notion-file-item"));
  items.forEach(function (li) {
    var base = li.getAttribute("data-basename") || "";
    var path = li.getAttribute("data-path") || "";
    var titleEl = li.querySelector(".notion-card__title");
    var subEl = li.querySelector(".notion-card__sub");
    var a = li.querySelector(".notion-card");
    if (!a || !titleEl || !subEl) return;

    var title = stripNotionSuffix(base);
    if (!title) title = base || "문서";

    titleEl.textContent = title;
    subEl.textContent = subtitleFromPath(path);

    a.setAttribute("aria-label", title + " — " + subEl.textContent);
    titleEl.removeAttribute("aria-hidden");
    subEl.removeAttribute("aria-hidden");
  });

  // 제목 기준 정렬 (한글 로케일)
  items.sort(function (a, b) {
    var ta = a.querySelector(".notion-card__title");
    var tb = b.querySelector(".notion-card__title");
    var A = ta ? ta.textContent : "";
    var B = tb ? tb.textContent : "";
    return A.localeCompare(B, "ko");
  });
  items.forEach(function (li) {
    list.appendChild(li);
  });

  var pageSize = parseInt(list.getAttribute("data-page-size"), 10);
  if (!pageSize || pageSize < 1) pageSize = 7;

  var meta = document.getElementById("notion-list-meta");
  var totalEl = document.getElementById("notion-total-count");
  var nav = document.getElementById("notion-pagination");
  var label = document.getElementById("notion-page-label");
  var prev = document.getElementById("notion-prev");
  var next = document.getElementById("notion-next");

  var total = items.length;
  if (totalEl) totalEl.textContent = String(total);
  if (meta) meta.hidden = false;

  var totalPages = Math.max(1, Math.ceil(total / pageSize));
  var current = 1;

  function render() {
    var start = (current - 1) * pageSize;
    items.forEach(function (el, i) {
      el.hidden = i < start || i >= start + pageSize;
    });
    if (label) label.textContent = current + " / " + totalPages;
    if (prev) prev.disabled = current <= 1;
    if (next) next.disabled = current >= totalPages;
    if (nav) nav.hidden = totalPages <= 1;
  }

  list.hidden = false;
  list.classList.add("notion-list-ready");

  if (prev) {
    prev.addEventListener("click", function () {
      if (current > 1) {
        current -= 1;
        render();
        list.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }
  if (next) {
    next.addEventListener("click", function () {
      if (current < totalPages) {
        current += 1;
        render();
        list.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  render();
})();
