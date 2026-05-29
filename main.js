/* =========================================================================
   Julian Garratt - portfolio interactions
   Page transition: a tiny opacity/translate fade between internal pages.
   All gestures respect prefers-reduced-motion.
   ========================================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!reduceMotion) {
    document.body.classList.add("page-fade");

    var isInternal = function (anchor) {
      if (!anchor) return false;
      if (anchor.target === "_blank") return false;
      if (anchor.hasAttribute("download")) return false;
      var href = anchor.getAttribute("href");
      if (!href || href.charAt(0) === "#") return false;
      if (/^(https?:|mailto:|tel:)/i.test(href)) {
        return anchor.hostname === window.location.hostname;
      }
      return true; // relative link within the site
    };

    document.addEventListener("click", function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      var anchor = e.target.closest && e.target.closest("a");
      if (!isInternal(anchor)) return;

      e.preventDefault();
      var dest = anchor.href;
      document.body.classList.add("is-leaving");
      var navigated = false;
      var go = function () {
        if (navigated) return;
        navigated = true;
        window.location.href = dest;
      };
      document.body.addEventListener("transitionend", go, { once: true });
      // Fallback in case transitionend doesn't fire.
      setTimeout(go, 220);
    });

    // Restore visibility if the page is shown from the bfcache (back button).
    window.addEventListener("pageshow", function () {
      document.body.classList.remove("is-leaving");
    });
  }
})();
