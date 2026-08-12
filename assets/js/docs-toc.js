/* ==========================================================================
   Documentation sidebar navigation.

   Builds the table of contents from the headings in `.docs-content` so the
   nav can never drift out of step with the page, then highlights the entry
   for whichever section is currently in view.

   Markup expected:
     <div class="docs-layout">
       <aside class="docs-sidebar">...<ol class="docs-toc"></ol></aside>
       <div class="docs-content"> h2/h3 headings </div>
     </div>
   ========================================================================== */
(function () {
  "use strict";

  var content = document.querySelector(".docs-content");
  var toc = document.querySelector(".docs-toc");
  if (!content || !toc) return;

  var headings = Array.prototype.slice.call(
    content.querySelectorAll("h2[id], h3[id]")
  );
  if (!headings.length) return;

  // ---- Build the list -----------------------------------------------------

  var links = [];
  var sublist = null;

  headings.forEach(function (heading) {
    var item = document.createElement("li");
    var link = document.createElement("a");
    link.href = "#" + heading.id;
    // Headings may carry extra markup (links, code); the nav wants plain text.
    link.textContent = heading.textContent.trim();
    item.appendChild(link);
    links.push(link);

    if (heading.tagName === "H2") {
      toc.appendChild(item);
      sublist = null;
    } else {
      // h3s hang off the preceding h2 in a nested list.
      if (!sublist) {
        sublist = document.createElement("ul");
        sublist.className = "docs-toc__sub";
        (toc.lastElementChild || toc).appendChild(sublist);
      }
      sublist.appendChild(item);
    }
  });

  // ---- Highlight the section in view --------------------------------------

  var active = null;

  function setActive(link) {
    if (link === active) return;
    if (active) active.classList.remove("is-active");
    if (link) link.classList.add("is-active");
    active = link;

    // Keep the current entry visible when the nav has its own scrollbar.
    if (link && toc.parentElement.scrollHeight > toc.parentElement.clientHeight) {
      var panel = toc.parentElement;
      var top = link.offsetTop - panel.offsetTop;
      if (top < panel.scrollTop || top > panel.scrollTop + panel.clientHeight - 40) {
        panel.scrollTop = top - panel.clientHeight / 2;
      }
    }
  }

  // The heading counted as "current" is the last one whose top has passed a
  // line a little below the top of the window.
  function currentIndex() {
    var line = window.innerHeight * 0.2;
    var index = 0;

    for (var i = 0; i < headings.length; i++) {
      if (headings[i].getBoundingClientRect().top - line > 0) break;
      index = i;
    }

    // At the very bottom of the page the last section may be too short to
    // ever cross the line, so select it explicitly.
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
      index = headings.length - 1;
    }
    return index;
  }

  var queued = false;
  function onScroll() {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(function () {
      queued = false;
      setActive(links[currentIndex()]);
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
})();
