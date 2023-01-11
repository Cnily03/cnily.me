// Naughty Powered-By Engine :)
(function () {
    const footerEl = document.querySelector(".footer .footer-container #footer-engine").getElementsByTagName("a")[0]
    if (!window.__hugo_engine__)
        window.__hugo_engine__ = footerEl.cloneNode(true);
    // settings
    const CUSTOM = [{
        title: "W0rdPress",
        Text: "W0rdPress"
    }, {
        title: "Hex0",
        Text: "Hex0"
    }, {
        title: "JekyI1",
        Text: "JekyI1"
    }, {
        title: "F4rB0x",
        Text: "F4rB0x"
    }, {
        title: "Gh0st",
        Text: "Gh0st"
    }]

    // random render
    const ea = document.createElement("a");
    let rnd = CUSTOM[Math.floor(Math.random() * CUSTOM.length)];
    ea.href = "javascript:void(0)"
    ea.title = rnd.title || ea.title
    ea.innerHTML = rnd.Text || ""

    // click to restore
    ea.onclick = function () {
        ea.parentElement.insertBefore(__hugo_engine__, ea)
        ea.remove()
    }

    // apply render
    footerEl.parentElement.insertBefore(ea, footerEl)
    footerEl.remove()
})();

// Tooltip Modifier
(function () {
    const TOOLTIP = {
        TOP: "tooltip-top",
        BOTTOM: "tooltip-bottom",
        LEFT: "tooltip-left",
        RIGHT: "tooltip-right"
    }
    const DOM = {
        remove_title: [],
        // elements: string | [string, valueof TOOLTIP]
        title_to_tooltip: []
    }

    // remove title
    document.querySelectorAll(DOM.remove_title.join(", ") || undefined).forEach(e => {
        e.removeAttribute("title")
    });

    // title to tooltip
    for (let _v of DOM.title_to_tooltip) {
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