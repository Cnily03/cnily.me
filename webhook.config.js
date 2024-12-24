module.exports = {
  verify: { // 验证收到的 WebHook 数据（留空为不验证）
    hostname: "", // 请求主机或域名，可以是数组
    port: false, // 请求端口，可以是数组
    path: "webhook", // 请求路径，可以是数组
    secret: "",
    content_type: "application/json",
    x_github_event: ["workflow_run"], // 可以是数组
    payload: { // 与 Webhook 请求做类比（key 不止是 sender，可以是任意想要检查的）
      sender: {
        login: "Cnily03"
      }
    }
  },
  server_port: 2333, // WebHook 接收请求的本地端口
  cd_path: "", // 执行命令前的 cd 操作（留空不执行）
  commands: ["bash sync-static.sh"], // 要执行的命令（留空不执行），可以是数组也可以是字符串
  delay: 10 * 1000, // 收到请求多少毫秒后执行命令
  ttl: 10 * 1000 // 多少毫秒内不重复执行指令
}