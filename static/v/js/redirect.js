!async function () {
    function GetUrlValue(name) {
        var list = window.location.search.substring(1).split("&");
        for (v of list) {
            let pair = v.split("=");
            if (pair[0] == name) {
                return pair[1];
            }
        }
        return null;
    }

    const URL_PREVENT = GetUrlValue("redirect") === "0" || GetUrlValue("r") === "0"

    function GetCookie(name) {
        var list = document.cookie.split("; ");
        for (v of list) {
            let pair = v.split("=");
            if (pair[0] == name) {
                return pair[1];
            }
        }
        return null;
    }

    function SetCookie(name, value, expire) {
        let d = new Date();
        d.setTime(d.getTime() + expire || 24 * 60 * 60 * 1000);
        let expires = "expires=" + d.toUTCString();
        document.cookie = name + "=" + value + "; " + expires + "; path=/";
    }

    function RemoveCookie(name) {
        return SetCookie(name, "", -1);
    }

    const REDIRECT_TO = "https://b.cnily.me"
    const COUNT_DOWN = 5;

    // Url Prevent - Set Cookie
    if (URL_PREVENT) {
        SetCookie("redirect", "0", 24 * 60 * 60 * 1000);
        let search_string = ''
        let new_search_string = window.location.search
        while (new_search_string !== search_string) {
            search_string = new_search_string;
            new_search_string = search_string.replace(/(&|\?)(redirect|r)(=[^&]*)?(&|$)?/
                , (match, p1, p2, p3, p4) => {
                    return ({
                        '?&': '?',
                        '?': '',
                        '&&': '&',
                        '&': ''
                    })[p1 + (p4 || '')]
                });
            new_search_string = new_search_string.replace(/&+/g, '&')
            if (new_search_string == '?') new_search_string = ''
        }
        window.location.href = window.location.href.replace(/\?.*$/, '') + search_string
    }

    // Click Renew - Remove Cookie
    document.addEventListener("DOMContentLoaded", () => {
        document.querySelectorAll("#renew-redirect").forEach(El => {
            El.parentElement.addEventListener('click', (e) => {
                RemoveCookie("redirect");
            })
        })
    })

    const TRANSLATE_MAP = {
        "/": {
            on: "本页面可能已停止更新，将在 ${{ count }} 秒后跳转至新页面...",
            done: "本页面可能已停止更新，正在跳转至新页面...",
            btn_continue: "仍然访问",
            btn_redirect: "立即跳转",
            redirect_to: REDIRECT_TO + "/?language=zh-cn"
        },
        "/en/": {
            on: "This page may have stopped updating. It will redirect to the new page in ${{ count }} second${{ count <= 1 ? '' : 's' }}...",
            done: "This page may have stopped updating. Redirecting to the new page...",
            btn_continue: "Cancel",
            btn_redirect: "Redirect",
            redirect_to: REDIRECT_TO + "/?language=en-us"
        }
    }

    // Alert: root path only, cookie allow, url not prevent
    if (!Object.keys(TRANSLATE_MAP).includes(window.location.pathname) || URL_PREVENT || GetCookie("redirect") == 0) return

    function translate(key, count) {
        return TRANSLATE_MAP[window.location.pathname][key].replace(/\$\{\{\s*(.*?)\s*\}\}/g, (match, p1) => {
            let eval_str = `((count)=>(${p1}))(${count})`;
            return eval(eval_str);
        });
    }

    await new Promise(r => {
        let itvid = setInterval(() => {
            if (document.body && document.querySelector("header")) clearInterval(itvid), r();
        }, 100)
    })

    document.documentElement.style.overflow = 'hidden';

    const HEADER_BACKGROUND = getComputedStyle(document.querySelector("header")).backgroundColor;
    const TEXT_COLOR = getComputedStyle(document.querySelector("header")).color;

    function setStyle(el, styleJSON) {
        for (let k in styleJSON) {
            let styleKey = k.split('-').map((v, i) => i ? (v[0].toUpperCase() + v.slice(1)) : v).join('');
            el.style[styleKey] = styleJSON[k];
        }
    }

    const style = document.createElement('style');
    style.innerHTML = `
    @keyframes loading {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    .modal-loading {
        color: transparent!important;
        min-height: .8rem;
        pointer-events: none;
        position: relative;
    }
    .modal-loading.modal-loading-lg::after {
        height: 1.6rem;
        margin-left: -.8rem;
        margin-top: -.8rem;
        width: 1.6rem;
    }
    .modal-loading::after {
        animation: loading .5s infinite linear;
        background: 0 0;
        border: .2rem solid ${TEXT_COLOR};
        border-radius: 50%;
        border-right-color: transparent;
        border-top-color: transparent;
        content: "";
        display: block;
        height: .8rem;
        left: 50%;
        margin-left: -.4rem;
        margin-top: -.4rem;
        opacity: 1;
        padding: 0;
        position: absolute;
        top: 50%;
        width: .8rem;
        z-index: 1;
    }

    .modal-btn.disabled, .modal-btn:disabled, .modal-btn[disabled] {
        cursor: default;
        opacity: .5;
        pointer-events: none;
    }

    .modal-btn.modal-btn-primary:focus, .modal-btn.modal-btn-primary:hover {
        background: #4240d4;
        border-color: #3634d2;
        color: #fff;
    }
    .modal-btn.modal-btn-link:focus, .modal-btn.modal-btn-link:hover {
        background: inherit;
        border-color: transparent;
    }
    .modal-btn:focus, .modal-btn:hover {
        background: #f1f1fc;
        border-color: #4b48d6;
        text-decoration: none;
    }
    .modal-btn:focus {
        box-shadow: 0 0 0 0.1rem rgba(87,85,217,.2);
    }

    .modal-btn.modal-btn-primary.active, .modal-btn.modal-btn-primary:active {
        background: #3a38d2;
        border-color: #302ecd;
        color: #fff;
    }
    .modal-btn.active, .modal-btn:active {
        background: #4b48d6;
        border-color: #3634d2;
        color: #fff;
        text-decoration: none;
    }

    .modal-btn.modal-btn-primary {
        background: #5755d9;
        border-color: #4b48d6;
        color: #fff !important;
    }
    .modal-btn.modal-btn-link {
        background: inherit;
        border-color: transparent;
    }
    .modal-btn:not(.modal-btn-link) {
        color: #5755d9;
    }
    .modal-btn {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background: #fff;
        border: .05rem solid #5755d9;
        border-radius: .1rem;
        cursor: pointer;
        display: inline-block;
        font-size: .9rem;
        height: 1.8rem;
        line-height: 1.2rem;
        outline: 0;
        padding: .25rem .4rem;
        text-align: center;
        text-decoration: none;
        transition: background .2s,border .2s, box-shadow .2s,color .2s;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        vertical-align: middle;
        white-space: nowrap;
        box-sizing: border-box;
    }
    `.replace(/\s+/g, ' ').trim();
    document.head.appendChild(style);

    const fullscreen = document.createElement('div');
    // fixed
    setStyle(fullscreen, {
        "position": 'fixed',
        "top": '0',
        "left": '0',
        "width": '100vw',
        "height": '100vh',
        "background-color": 'rgba(0,0,0,0.25)',
        "display": 'flex',
        "justify-content": 'center',
        "align-items": 'center',
        "z-index": '9999'
    });

    const modal = document.createElement('div');
    setStyle(modal, {
        "color": TEXT_COLOR,
        "background-color": HEADER_BACKGROUND,
        "padding": '20px',
        "box-shadow": '0 0 10px rgba(0,0,0,0.5)',
        "display": 'flex',
        "flex-direction": 'column',
        "align-items": 'stretch',
        "max-width": 'min(325px, calc(90vw - 50px))'
    });

    const modal_content = document.createElement('div');
    setStyle(modal_content, {
        "display": 'flex',
        "align-items": 'center',
    });
    modal_content.innerHTML = `<div class="modal-loading modal-loading-lg" style="min-width: 45px; min-height: 45px; margin: 0 15px 0 0;"></div>`;

    const textdiv = document.createElement('div');
    const textspan = document.createElement('span');
    textspan.innerHTML = translate("on", COUNT_DOWN)
    textdiv.appendChild(textspan);

    const modal_end = document.createElement('div');
    setStyle(modal_end, {
        "margin-top": '20px',
        "display": 'flex',
        "align-items": 'center',
        "justify-content": 'flex-end'
    });
    const CONTINUE_LINK = window.location.href.replace(/\?.*$/, '') + (p => `?${p}${p && '&'}r=0`)(window.location.search.substring(1));
    modal_end.innerHTML = [
        `<a class="modal-btn modal-btn-link" href="${CONTINUE_LINK}">${translate("btn_continue")}</a>`,
        `<a class="modal-btn modal-btn-primary" href="${translate("redirect_to")}">${translate("btn_redirect")}</a>`
    ].join(`<span style="width: 5px;"></span>`);
    const imm_redirect_btn = modal_end.querySelectorAll('a')[1];

    modal_content.appendChild(textdiv);
    modal.appendChild(modal_content);
    modal.appendChild(modal_end);

    fullscreen.appendChild(modal);
    document.body.appendChild(fullscreen);

    let countdown = COUNT_DOWN;
    let itvid = setInterval(() => {
        --countdown;
        textspan.innerHTML = translate("on", countdown)
        if (countdown <= 0) {
            textspan.innerHTML = translate("done")
            // imm_redirect_btn.click();
            window.location.href = translate("redirect_to");
            imm_redirect_btn.classList.add('disabled');
            imm_redirect_btn.innerHTML = "正在跳转"
            clearInterval(itvid);
        }
    }, 1000)
}()