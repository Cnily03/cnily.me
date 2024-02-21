const http = require('http');
let crypto = require('crypto');
const exec = require('child_process').exec;

const CONFIG = require("./webhook.config.js");

(function () {
    var _console_log = console.log
    var _console_info = console.info
    var _console_warn = console.warn
    var _console_error = console.error
    console.log = (...args) => _console_log(`[${new Date().toTimeString().split(' ')[0]}]`, ...args)
    console.info = (...args) => _console_info(`[${new Date().toTimeString().split(' ')[0]}]`, ...args)
    console.warn = (...args) => _console_warn(`[${new Date().toTimeString().split(' ')[0]}]`, ...args)
    console.error = (...args) => _console_error(`[${new Date().toTimeString().split(' ')[0]}]`, ...args)
})();

// 处理 CONFIG.verify
(function () {
    keys = Object.keys(CONFIG.verify)
    keys.forEach(key => {
        if (key == 'content_type') return
        else if (key == 'payload') { // payload
            CONFIG.verify.payload = !CONFIG.verify.payload ? {} : CONFIG.verify.payload
            return
        } else if (key == 'secret') { // secret
            CONFIG.verify.secret = typeof CONFIG.verify.secret == 'string' ? CONFIG.verify.secret : false
            return
        }

        // to array
        if (!Array.isArray(CONFIG.verify[key]))
            CONFIG.verify[key] = !CONFIG.verify[key] ? false : [CONFIG.verify[key]]

        if (key == 'path') { // path
            for (let i = 0; i < CONFIG.verify.path.length; i++)
                CONFIG.verify.path[i] = CONFIG.verify.path[i][0] == '/' ? CONFIG.verify.path[i] : '/' + CONFIG.verify.path[i]
        }
    })
    // commands
    if (!Array.isArray(CONFIG.commands))
        CONFIG.commands = typeof CONFIG.commands == 'string' ? [CONFIG.commands] : []
})();

var latest_call_time = Date.now()

function response(res, info) {
    res.statusCode = info.code
    res.end(info.message)
}

http.createServer((req, res) => {
    var chunks = Buffer.alloc(0)
    req.on('data', chunk => {
        chunks = Buffer.concat([chunks, chunk])
    })
    req.on('end', () => {
        var verifyHeadPassedExceptEvent = false
        try {
            if ((verifyHeadPassedExceptEvent = verifyHeaderExceptEvent(req, res, chunks)) &&
                verifyXGithubEvent(req, res, chunks) && verifyBody(req, res, chunks)) { // 验证
                handler(req, res, chunks) // 处理
                console.info(`ACCEPT ${req.method} ${req.url}`)
            } else throw new Error("Unexpected Request")
        } catch (e) {
            if (req.headers['x-github-event'] == 'ping') {
                // 处理 ping 的情况
                verifyHeadPassedExceptEvent ?
                    response(res, {
                        code: 200,
                        message: "[Ping] Successfully verify the HTTP header"
                    }) :
                    response(res, {
                        code: 502,
                        message: "[Ping] HTTP header verification failed"
                    })
            } else if (e.message === "Unexpected Request") {
                // 验证失败
                response(res, {
                    code: 502,
                    message: "Verification Failed"
                })
            } else {
                // 未知错误
                console.error(e)
                response(res, {
                    code: 502,
                    message: "Rejection due to unkown reason"
                })
            }
            console.info(`REJECT ${req.method} ${req.url}`)
        }
    })
}).listen(CONFIG.server_port)

// 获取请求来源的部分信息
function locationInfo(req) {
    var [Hostname, Port] = (req.headers.host || "").split(':')
    const hostname = Hostname
    const port = Port || 80
    const path = req.url
    return {
        hostname,
        port,
        path
    }
}

function type(t) {
    if (Array.isArray(t)) return 'array'
    return typeof t
}

// 用于比较 payload
function compare(part, src) {
    if (type(part) != type(src)) return false
    if (type(part) == 'array') {
        result = true
        part.forEach(e => {
            if (!src.includes(e)) {
                result = false
                return
            }
        })
        return result
    }
    if (type(part) == 'object') {
        for (const key of Object.keys(part)) {
            if (!compare(part[key], src[key]))
                return false
        }
        return true
    }
    return part == src
}

// Verify the signature
function verifySig(sha, chunks) {
    var algorithm = sha.split("=")[0]
    if (['sha1', 'sha128', 'sha256'].includes(algorithm)) {
        const SIG = algorithm + "=" + crypto.createHmac(algorithm, CONFIG.verify.secret).update(String(chunks), "utf-8").digest('hex')
        return SIG == sha
    } else return false
}

// Verify whether the request is expected (not hacker)
function verifyHeaderExceptEvent(req, res, chunks) {
    // verify header
    const request = locationInfo(req)
    return req.method == "POST" &&
        (!CONFIG.verify.hostname.length || CONFIG.verify.hostname.includes(request.hostname)) &&
        (!CONFIG.verify.port.length || CONFIG.verify.port.includes(request.port)) &&
        (!CONFIG.verify.path.length || CONFIG.verify.path.includes(request.path)) &&
        (!CONFIG.verify.secret || verifySig(req.headers['x-hub-signature-256'] || req.headers['x-hub-signature'], chunks)) &&
        (!CONFIG.verify.content_type.length || CONFIG.verify.content_type == req.headers['content-type'])
}

function verifyXGithubEvent(req, res, chunks) {
    return !CONFIG.verify.x_github_event.length || CONFIG.verify.x_github_event == req.headers['x-github-event']
}

function verifyBody(req, res, chunks) {
    // verify body
    var data = req.headers['content-type'] == "application/json" ?
        JSON.parse(String(chunks)) :
        JSON.parse(decodeURIComponent(`${String(chunks).replace(/\+/g,'%20')}&`.match(/payload=(.*?)&/)[1] || '{}'))
    return compare(CONFIG.verify.payload, data)
}

// Handle the expected request
function _logcmd(error, stdout, stderr) {
    if (error) console.log(error)
    if (stdout) console.log(stdout)
    if (stderr) console.log(stderr)
}

function handler(req, res, chunks) {
    // data = JSON.parse(String(chunks))
    res.setHeader("Content-Type", "text/html");

    if (Date.now() >= latest_call_time + CONFIG.ttl) {
        latest_call_time = Date.now()
        console.log(`[INFO] Commands triggered.` + (CONFIG.delay > 0 ? ` It will be run in ${CONFIG.delay/1000} seconds` : ""))
        // Call the command
        setTimeout(function () {
            command = CONFIG.commands.join(" && ")
            if (CONFIG.cd_path) command = CONFIG.cd_path + " && " + command

            exec(command, _logcmd)
        }, CONFIG.delay > 0 ? CONFIG.delay : 0)

        response(res, {
            code: 202,
            message: "Successfully called commands on the server"
        })
    } else {
        response(res, {
            code: 200,
            message: "Request in TTL"
        })
        console.warn('[WARN] Ignored one request due to TTL')
    }
}

console.info("Sever is running at port " + CONFIG.server_port + "...")