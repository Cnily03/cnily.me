# Blog | Static | Cnily03

A static blog powered by Hugo.

Website: [cnily.me](cnily.me)

## WebHook Config

在根目录下创建 `webhook.config.js`，内容如下：

```javascript
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
```

## Extensions

### 网页设置

#### 自定义 JS/CSS/RAW

在 `config.yml` 文件下，可进行类似如下配置：

```yaml
params:
  custom:
    libraries:
      <id>:
        js: 
          - src: https://code.jquery.com/jquery-3.6.3.min.js
            defer: false
            async: false
        css:
          - src: https://cdn.jsdelivr.net/npm/bootstrap/dist/css/bootstrap.min.css
            defer: false
        raw:
          - <script>console.log("Hello World")</script>
```

其中 `defer` `async` 的值均为默认值。 `js` `css` `raw` 均可为字符串或非数组。

`<id>` 具有以下选择：

- `head` 插入到所有页面的 `<head>` 标签的末尾
- `page-start` 在文章或页面开始前插入
- `page-end` 在文章或页面结束前插入
- `footer-start` 插入到所有页面的 `<footer>` 标签之前
- `footer-end` 插入到所有页面的 `<footer>` 标签之后

同 `<id>` 的加载顺序为 CSS -> JS -> RAW.

相应的模板文件见 `layouts/partials/custom/libraries.html`

#### Title 转化为 Tooltip

如果需要移除标签的 title，或者将 title 转化为 toolip, 可以在 `static/v/js/title2tooltip.js` 相应的列表中添加选择器。

### Markdown 相关

#### 警示语言未翻译（配置项）

注解一篇文章（或页面）没有被翻译，可以在 Markdown 前配置插入

```yml
warnlang: true
```

显示语言提示的相应翻译和源码见 `layouts/partials/single/pre-content/warn-lang.html`.

#### 提示转载授权（配置项）

注解一篇文章（或页面）转载自某个网页，可在 Markdown 前配置插入

```yml
repost-link: https://example.com/path/to
repost-text: "Some Text Here"
```

当 `repost-text` 设置值时，`repost-link` 无效.

值的内容可以使用 MarkDown 链接语法即 `[]()` ，使用 `[[]]()` 表示该链接右悬浮对齐；值的内容可以使用 `${icon}` 来作为链接图标。

Example:

```yml
repost-text: |
    本文经过原作者授权转载，[[${icon} 原文地址]](http://example.com/path/to)
```

显示转载提示的相应翻译和源码见 `layouts/partials/single/pre-content/repost-info.html`.

#### 首行缩进（配置项）

若需要全文设置首行缩进，可在 Markdown 前配置插入

```yml
indent: <number> # 单位为 em
```

另外，`static/v/js/auto-indent.js` 实现了将段落开头的全角空格（其他符号可在文件中定义）转化为缩进，当设置 `indent` 是将追加缩进。

#### 增大行、段间距（配置项）

用于一些大篇幅、文字较多的文章时，增大行、段间距可以优化阅读体验，只需在 Markdown 前配置插入

```yml
margin: large
```

#### 淡化 blockquote（配置项）

原有的蓝色 blockquote 过于醒目，有时仅仅作为一段普通的引用影响观感，若要淡化 blockquote，可在 Markdown 前配置插入

```yml
quote: light
```

#### 新增样式

`/assets/css/functions/style-class.scss` 中用 class 封装了一些常用的 style.

##### 链接

使用 `{{< link >}}` 使，可添加的 `class` 参数值新增如下

- `obscure`: 不醒目的链接样式
- `underliend`: 链接的初始状态自带下划线
- `color-only`: 仅限颜色变更（禁用下划线）

#### SVG Injection

修改了主题原有 Image Plugin：

- 新增属性 `injected`，在图片为 SVG 类型时启用，可将 img 标签替换为 svg 标签（开启此选项后 `Linked` 属性的默认值将变为 `false`）
- 新增属性 `autofit`，SVG 图片根据窗口大小自适应缩放（仅在 `injected=true` 时有效）
- 新增属性 `max-width`，调整 SVG 图片的最大宽度，默认单位为 px（仅在 `injected=true` 时有效）

Example:

```markdown
{{< image src="images/filename.svg" injected=true autofit=true max-width=500 >}}
```

相应的模板文件见 `layouts/partials/plugin/image.html` 和 `layouts/shortcodes/image.html`.

#### 自定义 ICON

自制的 Font Awesome 扩展图标，见 `static/icon/cc` 目录，可使用 [IcoMoon](https://icomoon.io/app) 制作。

## Adjustments

### 调整 admonition

当未指定 `title` 或指定 `title=false` 时，横幅不显示标题栏。

Example:

```markdown
{{< admonition type=quote >}} something {{< /admonition >}}
{{< admonition type=quote title=false >}} something {{< /admonition >}}
{{< admonition quote >}} something {{< /admonition >}}
{{< admonition quote false >}} something {{< /admonition >}}
```

## 第三方库

- Theme: [DoIt](https://github.com/HEIGE-PCloud/DoIt)
- [SVG Inject](https://github.com/iconfu/svg-inject)
