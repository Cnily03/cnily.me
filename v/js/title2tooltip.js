// Tooltip Modifier
(function () {
    const TOOLTIP = {
        TOP: "tooltip-top",
        BOTTOM: "tooltip-bottom",
        LEFT: "tooltip-left",
        RIGHT: "tooltip-right"
    }

    // === CONFIG ===
    const DOM_SELECTORS = {
        // remove_title: string | array
        remove_title: [],
        // title_to_tooltip: string | [string, valueof TOOLTIP]
        title_to_tooltip: []
    }
    // === END ===

    // remove title
    document.querySelectorAll((typeof DOM_SELECTORS.remove_title == "string" ?
            DOM_SELECTORS.remove_title : DOM_SELECTORS.remove_title.join(", ") || undefined))
        .forEach(e => {
            e.removeAttribute("title")
        });

    // title to tooltip
    for (let _v of DOM_SELECTORS.title_to_tooltip) {
        document.querySelectorAll(typeof _v == "string" ? _v : _v[0]).forEach(e => {
            e.classList.add("tooltip")
            if (Array.isArray(_v) && _v[1]) e.classList.add(_v[1])
            e.classList.add("tooltip-title")
        });
    }
    document.querySelectorAll(".tooltip-title").forEach(e => {
        e.setAttribute("data-tooltip", e.getAttribute("title"))
        e.removeAttribute("title")
    })
})();