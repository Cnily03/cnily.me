# Blog | Static | Cnily03

A static blog powered by Hugo.

Website: [cnily.me](cnily.me)

## WebHook Config

在根目录下创建 `webhook.config.js`，内容如下

```javascript
module.exports = {
  verify: { // 验证收到的 WebHook 数据（留空为不验证），可以是数组
    hostname: "", // 请求主机或域名
    port: false, // 请求端口
    path: "webhook", // 请求路径
    secret: "",
    content_type: "application/x-www-form-urlencoded",
    x_github_event: ["workflow_run"],
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
```

## Extension

### Language Warning

注解一篇文章（或页面）没有被翻译，可以在 Markdown 前插入

```yml
warnlang: true
```

显示 WARNING 的相应翻译和源码见 `layouts/partials/single/pre-content.html`

### Custom Icon

自制的 Font Awesome 扩展图标，见 `static/icon/cc` 目录，可使用 [IcoMoon](https://icomoon.io/app) 制作
