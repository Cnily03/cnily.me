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