---
title: "GitHub + NPM 的自动化发版【Semantic Release 详细教程】"
date: "2024-12-02"
categories: "CICD"
summary: "flip 并不是一个插件或者一个库，仅仅是一个动画实现的思路。例如 `Vue`的内置组件 `transitionGroup` 就有用到。"
---

## 前言

作为个人开发者，开源项目很简单，把代码提交到 github 公共仓库就 OK 了。`不过！要想维护好一个开源项目，并非易事`。

### 繁琐的发版流程

一直以来，我都在使用 github 管理着自己的 npm 包，但随着开源项目使用的人越来越多，避免不了需要频繁发版。通常问题的修复流程如下：

1. 修复 bug

2. 书写 CHANGE_LOG.md

3. 升级版本：修改 package.json 的 version 字段，v1.0.0 -> v1.0.1

4. git commit 代码

5. git 打版本 tag（v1.0.0 -> v1.0.1）

6. 发布 npm 包（npm login > npm publish）

7. github Releases 发布新版本内容（新增 Releases， 编写内容，发布）

**这可能是所有个人开发者都在面临的问题，说实话，原本修复 bug 只需要改几行代码，不过接下来的发版的这一套流程...真的很难受。**

### 转机

这样问题，一直困扰着我，持续了很久。直到有一天，我真的受不了了，搜索发现了 `semantic-release` ，使用后发现它一键完成了我所有的需求。

### 写作目的

由于 `semantic-release` 相关的中文教程教程极少，官方文档对新人又不友好，遇到问题又很难通过搜索解决，在使用过程中真的是异常坎坷！

你无法想象一个报错会困扰我一下午（上周在图书馆里焦头烂额一下午也没解决）。一度让我想换一个工具，不过没找大更合适的替代品。

于是乎，有了这篇文章，**我将完整的从 0-1 教会大家如何使用，还总结了我之前所遇到的所有问题。`我希望帮助更多人，让他们在使用这个工具的时候不至于浪费太多的时间!`**

## semantic-release 是什么？

[semantic-release](https://semantic-release.gitbook.io/semantic-release) 是一个全自动的版本管理和发布工具。它通过分析 commit 信息，从而自动完成：确认下一个版本号、修改版本、打 tag 、修改变更日志、自动发布等一系列流程。

所以，`commit信息` 很关键，需要遵循以下原则：

示例：当前版本是 v1.0.0

- fix: xxxx ,三级版本号自动加 1，v1.0.0 --> v1.0.1

- feat: xxxx , 二级版本号自动加 1，v1.0.0 --> v1.1.0

- perf:xxx | BREAKING CHANGE:xxx, 一级版本号自动加 1，v1.0.0 --> v2.0.0

更多规范参考：[Angular Commit Message Format](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#-commit-message-format) ,注意，除了以上类型，其他类型不会触发 release 流程。

## 本地安装

本文将使用 github + semantic-release 的方式完成自动化。当然，你也可以使用其他方式，例如 gitlab CICD 。本文就不详细介绍了，具体参考： [CI Configuration | semantic-release](https://semantic-release.gitbook.io/semantic-release/usage/ci-configuration)。

### 1. 仓库中安装 semantic-release

```shell
npm install --save-dev semantic-release
```

### 2. 仓库中安装插件

> 每一插件都有自己的作用，具体作用看下面的 .releaserc.js 说明，可以按需安装。

```
npm install --save-dev @semantic-release/commit-analyzer
npm install --save-dev @semantic-release/release-notes-generator
npm install --save-dev @semantic-release/changelog
npm install --save-dev @semantic-release/npm
npm install --save-dev @semantic-release/github
npm install --save-dev @semantic-release/git
```

### 3. 根目录下，新建 .releaserc.js 文件

```js
module.exports = {
  // 这里改成你自己的仓库地址
  repositoryUrl: "https://github.com/chennlang/walk-tree-list.git",
  branches: ["master"], // 指定在哪个分支下要执行发布操作
  plugins: [
    // 1. 解析 commit 信息，默认就是 Angular 规范
    "@semantic-release/commit-analyzer",
    // 2. 生成发布信息
    "@semantic-release/release-notes-generator",
    // 3. 把发布日志写入该文件
    [
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGELOG.md",
      },
    ],
    // 4. 发布 NPM
    "@semantic-release/npm",
    // 5. 将变更发布到 GitHub Release
    "@semantic-release/github",
    // 6. 前面说到日志记录和版本号是新增修改的，需要 push 回 Git
    [
      "@semantic-release/git",
      {
        assets: ["CHANGELOG.md", "package.json"],
      },
    ],
  ],
};
```

### 4. 配置 Github action

根目录下新建一个 .github/workflows/release.yml 文件，内容如下：

```yaml
name: Release

# 当 master 分支被 push,就会触发
on:
  push:
    branches: [master]
# 权限
permissions:
  contents: write
  issues: write
  pull-requests: write
  packags: write
  id-token: write

jobs:
  release:
    runs-on: ubuntu-latest

    steps:
      - name: 签出代码
        uses: actions/checkout@v3
        with:
          fetch-depth: 0
          persist-credentials: false

      - name: 安装 nodejs
        uses: actions/setup-node@v2.5.2
        with:
          node-version: "20.8.1" # node 版本

      - name: 构建 dist # 构建，根据自己的仓库构建命令来
        run: |
          npm install -g pnpm@latest-8
          pnpm install
          pnpm run build

      - name: 发布 npm 包
        env:
          GITHUB_TOKEN: ${{ secrets.PUBLISH_GH_TOKEN }}
          NPM_TOKEN: ${{ secrets.PUBLISH_NPM_TOKEN }}
        run: |
          npm cache clean --force
          npx semantic-release
```

## 获取 TOKEN

要想通过 workflow 自动发布 npm 版本和提交版本变更信息，还需要去获得两个 TOKEN。

- `GITHUB_TOKEN`：授权后，能提交代码、打 tag、生成 变更信息。

- `NPM_TOKEN`：授权后，不需要手动登录就能自动发布 npm 包。

### NPM_TOKEN 获取流程

输入 https://www.npmjs.com/ ，登录你的 npm 账号后，点击头像，选择 Access Tokens。

然后选择创建 `Classic Token`

![](https://cdn.jsdelivr.net/gh/chennlang/doc-images//picGo/20241104164341.png)

创建页面，输入名称，选择 `Publish`

![](https://cdn.jsdelivr.net/gh/chennlang/doc-images//picGo/20241104164634.png)

创建成功，将 token `复制并记录起来！后面要用到`。

![](https://cdn.jsdelivr.net/gh/chennlang/doc-images//picGo/20241104164742.png)

> 如果你不想所有 npm 包都有权限，你还可以通过创建 Granular Access Token，更加细粒度的控制放开权限。

### GITHUB_TOKEN 获取流程

登录 github 点击头像 》 选择 `Settings` 》 选择 `Developer settings`。

选择 `Generate new token`

> semantic-release 需要用到 github 仓库的读写权限，个人感觉 github 仓库的读写权限很敏感，最好别都放开。所以我这里创建一个只对某个仓库生效的 token.

![](https://cdn.jsdelivr.net/gh/chennlang/doc-images//picGo/20241104165627.png)

创建页面-基础

![](https://cdn.jsdelivr.net/gh/chennlang/doc-images//picGo/20241104170553.png)

创建页面-权限配置

![](https://cdn.jsdelivr.net/gh/chennlang/doc-images//picGo/20241104170849.png)

权限有很多，需要修改的配置如下：

- **Commit statuses**: Read and write

- **Contents** : Read and write

- **Deployments**：Read and write

- **Issues**： Read and write

- **Pull requests**： Read and write

修改完成后，点击创建。

![](https://cdn.jsdelivr.net/gh/chennlang/doc-images//picGo/20241104171600.png)

创建成功，将 token `复制并记录起来！后面要用到。`

## github 仓库配置

OK, 上面我们拿到了两个 token, 分别是 npm 创建的 token 和 github 创建的 token。接下来，我们需要将这两个 token 添加到你的 github 仓库的 `secrets` 里，这样，在运行 CI 流水线的时候，就能安全的读取到这两个 token。

### 配置 secrets

在目标仓库下，点击 Settings

![](https://cdn.jsdelivr.net/gh/chennlang/doc-images//picGo/20241104172414.png)

创建好如下两个 secrets：

- `PUBLISH_GH_TOKEN` ：Name 别改，然后将之前在 github 创建好的 token 填进去。

- `PUBLISH_NPM_TOKEN`：Name 别改，然后将之前在 npm 创建好的 token 填进去。

> 这里创建好的名称和 .github/workflows/release.yml 用到的名称要一致。如下
>
> ```yaml
> - name: 发布 npm 包
>         env:
>           GITHUB_TOKEN: ${{ secrets.PUBLISH_GH_TOKEN }} # 这里
>           NPM_TOKEN: ${{ secrets.PUBLISH_NPM_TOKEN }} # 这里
>         run: |
>           npm cache clean --force
>           npx semantic-release
> ```

### 配置 action 权限

运行的 workflow 中需要调用一些仓库的权限是需要单独设置的，不然后出现 `403` 报错。

在目标仓库下，点击 Settings，选择 Actions > General

![](https://cdn.jsdelivr.net/gh/chennlang/doc-images//picGo/20241105104530.png)

Workflow permissions 勾如上选。其他可以不用管。

## 提交代码

最后，将本地的修改 push 到远程，就可以触发流水线自动开始部署了。

![](https://cdn.jsdelivr.net/gh/chennlang/doc-images//picGo/20241104174014.png)

## 调试

如果你还在开发阶段，不确定配置能否在 github action 中正常运行，为了避免触自动发发版。我们可以使用 `dryRun` 模式。这个模式下将自动跳过发布、推送等动作，只校验配置是否正确，推送是否有权限。

.releaserc.js

```json
{
  "dryRun": true // 记得一切没问题后，设置为 false ！！！
}
```

如果我们还没准备好，只是想调试和测试 CI 运行是否正常，可临时添加这个配置，避免发版。

[GitHub - chennlang/walk-tree-list: Traversing tree nodes](https://github.com/chennlang/walk-tree-list) 这个是本次演示的仓库，里面有完整的配置，可以自行参考。

## 遇到的问题和解决方案

### CI 执行时报错： 403 无权限

- 检查是否有 `配置 action 权限`？

- 检查 github token 权限，如果权限不够可以重新获取。

### CI 执行时报错：没有推送权限 Cannot push to the Git repository.

```shell
[10:03:25 AM] [semantic-release] › ✘  EGITNOPERMISSION Cannot push to the Git repository.
```

在 release.yaml 中添加如下权限

```yaml
# 权限
permissions:
  contents: write
  issues: write
  pull-requests: write
  packags: write
  id-token: write
```

### CI 执行时报错：：npm ERR! Cannot read properties of null (reading 'matches')

报错原因：

> 问题出在`npm@8`默认情况下 npm 处理工作区，因此在运行`npm version`npm 时，它将尝试更新`node_modules`所有工作区的，`package-lock.json`但由于我们使用 semantic-release，我们在 package.json 中提交的版本是假的（`0.0.0-semantic-release`），因此当 npm 尝试更新依赖关系树时，它无法检索`0.0.0-semantic-release`版本，因为它不再是我们工作区中引用的版本（因此默认情况下它会检查 NPM）。
>
> 添加该选项`--no-workspaces-update`可防止 npm 考虑工作区

官方说明参考：

- [fix: do not update workspaces when applying new version by KillianHmyd · Pull Request #482 · semantic-release/npm · GitHub](https://github.com/semantic-release/npm/pull/482)

- [no-workspaces-update option · Issue #495 · semantic-release/npm · GitHub](https://github.com/semantic-release/npm/issues/495#issuecomment-1230379945)

解决方案：在根目录添加 `.npmrc` 文件

```shell
workspaces = true
workspaces-update = false
```

### 流水线执行成功，却未发布新版本

本质上，semantic-release 是通过 tag 来递增发版的。如果你之前的发版没有打 tag，semantic-release 第一次就会新增一个 tag 为 v1.0.0。而如果你的 package.json 版本是 1.4.0，那么就会有冲突。

所以，解决方法就是，手动新建一个 tag v1.4.0，和当前仓库的 package.json version 要一致！然后新增 一个 commit 再 push。

### 不支持 Monorepos 仓库

semantic-release 作者明确表明，不计划支持 Monorepos 仓库。如果有需要，可以使用 [GitHub - pmowrer/semantic-release-monorepo](https://github.com/pmowrer/semantic-release-monorepo) 代替。
