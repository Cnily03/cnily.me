! function () {
    const IDENTIFIER_PREFIX = "[universal-payment]+"

    const DOM = {
        get IFRAME_DOM() {
            delete this.IFRAME_DOM
            return this.IFRAME_DOM = document.getElementById("sponsor-modal").getElementsByTagName("iframe")[0]
        },
        get MODAL_DOM() {
            delete this.MODAL_DOM
            return this.MODAL_DOM = document.getElementById("sponsor-modal")
        },
    }

    var isFirstOpen = true

    const windowMessageEventListeners = []
    const Message = {
        get ORIGIN() {
            DOM.IFRAME_DOM.src.match(/^(https?:\/\/)([^\/]+)/)
            delete this.ORIGIN
            return this.ORIGIN = RegExp.$1 + RegExp.$2
        },
        post: function (data, target = DOM.IFRAME_DOM) {
            target.contentWindow.postMessage(IDENTIFIER_PREFIX + JSON.stringify(data), this.ORIGIN)
        },
        receive: function (handler) {
            const listener = function (e) {
                if (typeof e.data == "string" && e.data.indexOf(IDENTIFIER_PREFIX) == 0) {
                    if (e.data) handler.call(this, JSON.parse(e.data.slice(IDENTIFIER_PREFIX.length)))
                }
            }
            window.addEventListener("message", listener)
            windowMessageEventListeners.push(listener)
        }
    }

    function get100vhValue() {
        const div = document.createElement("div")
        div.style.display = "block"
        div.style.position = "fixed"
        div.style.top = "0"
        div.style.height = "100vh"
        document.body.appendChild(div)
        const _100vh = parseInt(window.getComputedStyle(div).height)
        document.body.removeChild(div)
        return _100vh
    }

    function registerMessageReceiver() {
        Message.receive(function (data) {
            if (data.type == "size") {
                if (isFirstOpen) document.getElementById("sponsor-modal").style.opacity = "", isFirstOpen = false

                DOM.MODAL_DOM.style.height = data.value.height || DOM.MODAL_DOM.style.height
                DOM.MODAL_DOM.style.width = data.value.width || DOM.MODAL_DOM.style.width

                const maxHeight = window.getComputedStyle(DOM.MODAL_DOM).maxHeight
                if (data.value.height > maxHeight) DOM.IFRAME_DOM.setAttribute("scrolling", "yes")
                else DOM.IFRAME_DOM.setAttribute("scrolling", "no")
            } else if (data.type = "openurl") window.location.href = data.value
        })
    }

    const backupWindow = {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight
    }

    function windowResizeListener() {
        if (window.innerWidth != backupWindow.innerWidth) {
            Message.post({
                type: "qurey-resize"
            })
        }
        window.innerWidth = backupWindow.innerWidth, window.innerHeight = backupWindow.innerHeight
    }

    // Define open and close function

    const closeSponsorPage = () => {
        document.body.classList.remove("blur", "blur-header") // Cancel the blur on the page
        document.getElementById("sponsor-box").style.display = "none" // Hide the sponsor page

        document.body.parentElement.style.overflow = "" // Allow scrolling
        window.removeEventListener("resize", windowResizeListener) // destroy resize event listener
        // Destroy all message receivers
        for (const t of windowMessageEventListeners) window.removeEventListener("message", t), windowMessageEventListeners.shift()
    }

    const openSponsorPage = () => {
        document.body.classList.add("blur", "blur-header") // Blur the page
        if (isFirstOpen) document.getElementById("sponsor-modal").style.opacity = "0"
        document.getElementById("sponsor-box").style.display = "flex" // Display the sponsor page

        document.body.parentElement.style.overflow = "hidden" // Prevent scrolling
        window.addEventListener("resize", windowResizeListener) // Listen resize and justify the modal
        registerMessageReceiver() // Register message receiver

        // Fucking Edge Mobile: 100vh is not equal to innerHeight
        var _100vh = get100vhValue()
        if (_100vh > window.innerHeight) DOM.MODAL_DOM.style.marginBottom = (_100vh - window.innerHeight) / 2 + "px"

        //  Justify the modal
        Message.post({
            type: "qurey-resize"
        })
    }
    //window.sponsor = openSponsorPage

    // Activate the click event
    const sponsorBtns = [document.querySelector(".wrapper .main .sponsor > a")]
    sponsorBtns.map(e => {
        e.href = "javascript:void(0)"
        e.setAttribute("onclick", "return false")
        e.addEventListener("click", openSponsorPage)
    })

    // Insert DOM
    const div = document.createElement("div")
    document.body.insertBefore(div, document.getElementById("mask"))
    div.outerHTML = `
        <div id="sponsor-box" class="modal-container">
            <button type="button" id="close-modal-btn" class="modal-close-btn" title="Close">
                <i class="c-icon c-icon-cross"></i>
            </button>
            <div id="sponsor-modal" class="iframe-container">
                <iframe width="100%" height="100%" src="/pay" referrerpolicy="origin" frameborder="0"
                    title="Sponsor Page"></iframe>
            </div>
        </div>`
    document.getElementById("sponsor-box").style.display = "none"
    document.getElementById("sponsor-box").addEventListener("click", closeSponsorPage)
    document.getElementById("close-modal-btn").addEventListener("click", closeSponsorPage)
}()