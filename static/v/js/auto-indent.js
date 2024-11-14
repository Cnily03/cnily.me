// Automatically convert space or other defined charactors to `text-indent` style
(function () {
    // === CONFIG ===
    // one string equals to 1em
    const INDENT_CHAR = "　"
    // === END ===

    const indentChar = typeof INDENT_CHAR == "string" ? INDENT_CHAR : [INDENT_CHAR]
    document.querySelectorAll(".single .content p").forEach(e => {
        var count = 0
        let t = e.innerHTML

        function _once() {
            for (const c of indentChar) {
                if (!t.indexOf(c)) {
                    t = t.replace(c, '')
                    count++
                    return true
                }
            }
            return false
        }

        while (_once());

        function _calc(src, add) {
            var originalStyle = src.replace(/calc\( *\)/, '').trim()
            // remove `calc()`
            var in_value = /^calc\(.+\)$/.test(originalStyle) ? originalStyle.substring(5, originalStyle.length - 1).trim() : originalStyle

            if (!originalStyle || /^[0-9]+em$/.test(in_value)) { // em + em,empty '' or 'xxx em' -> 'xxx em'
                var originalEm = parseFloat(in_value || "0") || 0
                src = String(originalEm + add) + "em"
            } else {
                src = `calc(${in_value} + ${add}em)`
            }
            return src
        }

        if (count) {
            /* calculate text-indent value */
            let ePx = parseFloat(window.getComputedStyle(e, false).textIndent)
            let emPx = parseFloat(window.getComputedStyle(e.parentElement, false).fontSize)
            e.style.textIndent = _calc(String(ePx / emPx) + 'em', count)
            /* set innerHTML */
            e.innerHTML = t
        }
    })
})()