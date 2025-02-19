---
title: "FLIP 动画原理-图文详解"
date: "2023-02-13"
categories: "Principle"
summary: "flip 并不是一个插件或者一个库，仅仅是一个动画实现的思路。例如 `Vue`的内置组件 `transitionGroup` 就有用到。"
---

## FLIP 是什么？

flip 并不是一个插件或者一个库，仅仅是一个动画实现的思路。例如 `Vue`的内置组件 `transitionGroup` 就有用到。

## 作用

那么 flip 有什么用呢？一般情况我们给元素设置动画，都是提前知道开始和结束状态，例如设置一个从左到右的循环移动动画。我们是知道开始位置（0,0），结束位置为（200，0）。然后就可以通过如下方案实现：

![移动](https://raw.githubusercontent.com/chennlang/doc-images/main/picGo/Kapture%202022-09-13%20at%2011.31.51.gif)

### 方案 1：

css 实现

```html
<div id="box"></div>
```

```css
#box {
  width: 100px;
  height: 100px;
  background-color: red;
  animation: move 1s linear infinite;
}

@keyframes move {
  0% {
    transform: translateX(0px);
  }
  100% {
    transform: translateX(200px);
  }
}
```

### 方案 2：

js 实现

```js
const box = document.getElementById("box");
box.animate(
  [{ transform: `translateX(0px)` }, { transform: "translateX(200px)" }],
  {
    duration: 1000,
    iterations: Infinity,
  }
);
```

### 存在问题和解决思路

**如果事先我们并能提前知道结束状态该怎么办呢？** 例如一个随机的位移。我们要如何实现位移动画？或者从一种形态变成另一种未知形态。

```js
function randomNumber(min, max) {
  return parseInt(Math.random() * (max - min + 1) + min, 10);
}

const rand = randomNumber(1, 1000); // 随机数
box.style.transform = `translateX(${rand}px)`;
```

所以我们就可以设想，对于任意一个元素发生改变，如果在页面渲染前我们能拿到元素的开始和结束状态信息，并通过 js `animate` API 设置动画，此时页面再渲染，不就可以实现了吗? 这其实就是 flip 的原理。

## FLIP 基础概念

`FLIP`代表`First`和`Last`以及`Invert`还有`Play`四个单词的组合。

- First 初始状态

- Last 最终状态

- Invert 回到初始状态

- Play 执行动画

## 原理

记录目标元素开始和结束位置信息，在下一帧页面渲染前添加动画。也就是说再我们改变元素的属性后与浏览器实际渲染前有一个`空档期`,在 `空档期`我们可以拿到变化后的元素信息。

事实上每一次 UI 视图更新都会提前清空当前任务队列中的微任务和执行`requestAnimationFrame`回调。这两个地方都能拿到变化后的元素信息。下图可以更加直观的解释

![](https://raw.githubusercontent.com/chennlang/doc-images/main/picGo/202502181636868.png)

这里我们用一个简单的例子证实：

```js
const box = document.getElementById("box");
console.log("old:", box.getBoundingClientRect());

Promise.resolve().then(() => {
  console.log("then:", box.getBoundingClientRect());
});
requestAnimationFrame(() => {
  console.log("req:", box.getBoundingClientRect());
});
```

结果如下：

![](https://raw.githubusercontent.com/chennlang/doc-images/main/picGo/202502181637928.png)

上面的结果不仅证实了微任务和 `requestAnimationFrame` 能拿到更新后的元素信息，也能看出微任务是在 `requestAnimationFrame` 前面执行。具体的宏任务、微任务、动画执行原理，可以看看这篇文章，写的很好：[《深入解析你不知道的 EventLoop 和浏览器渲染、帧动画、空闲回调》](https://juejin.cn/post/6844904165462769678 "https://juejin.cn/post/6844904165462769678")，这里就不过多赘述了。

既然能提前拿到变化后的元素信息，那我们就可以使用上面 `方案2` 来实现动画了。

这里我们还是用一个随机位置变化的案例来演示，这次使用 flip 动画来实现：

```js
function randomNumber(min, max) {
  return parseInt(Math.random() * (max - min + 1) + min, 10);
}

const box = document.getElementById("box");
const oldPosition = box.getBoundingClientRect();

// 随机设置一个新的位置
box.style.left = randomNumber(1, 1000) + "px";
box.style.top = randomNumber(1, 1000) + "px";

// 微任务中设置动画
Promise.resolve().then(() => {
  const newPosition = box.getBoundingClientRect();
  const options = {
    duration: 300,
    easing: "cubic-bezier(0,0,0.32,1)",
  };
  box.animate(
    [
      { transform: `translateX(-${newPosition.x}px)` },
      { transform: "translateX(0)" },
    ],
    options
  );
});
```

> 这里要特别注意，`box.animate` 是从新的位置为开始关键帧，旧的位置为结束关键字，故上面动画相当于从过去的状态到新的状态的回放，因为正常 UI 更新是瞬间完成的，自定义的动画其实是在完成之后执行的，有点障眼法的意思。

## 案例

目标：点击商品进入商品详情页面，动画类似从某个商品卡片进入详情的视觉效果

![](https://raw.githubusercontent.com/chennlang/doc-images/main/picGo/Kapture%202023-02-10%20at%2014.43.21.gif)

- list.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>List</title>
    <style>
      * {
        margin: 0;
        padding: 0;
      }
      .list {
        margin-top: 100px;
        display: flex;
        flex-wrap: wrap;
      }
      .list-item {
        width: 33.33%;
        height: 200px;
        line-height: 200px;
        text-align: center;
        border: 1px solid #ccc;
        color: blue;
        cursor: pointer;
        box-sizing: border-box;
      }
    </style>
  </head>
  <body>
    <div class="list">
      <div class="list-item">商品1</div>
      <div class="list-item">商品2</div>
      <div class="list-item">商品3</div>
      <div class="list-item">商品4</div>
      <div class="list-item">商品5</div>
      <div class="list-item">商品6</div>
    </div>
  </body>
  <script>
    document.querySelector(".list").addEventListener("click", (e) => {
      const { x, y, width, height } = e.target.getBoundingClientRect();

      // 跳转到详情页面
      location.href = `./detail.html?x=${x}&y=${y}&width=${width}&height=${height}`;
    });
  </script>
</html>
```

- detail.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Detail</title>
    <style>
      * {
        margin: 0;
        padding: 0;
      }
      body {
        width: 100vw;
        height: 100vh;
      }
      #detail-content {
        margin-left: 10vw;
        width: 80vw;
        height: 80vh;
        border: 1px solid #333;
        text-align: center;
        color: blue;
      }
    </style>
  </head>
  <body>
    <div id="detail-content">商品详情</div>
  </body>
  <script>
    // 获取路由参数
    const query = location.href
      .split("?")[1]
      .split("&")
      .reduce((obj, str) => {
        obj[str.split("=")[0]] = str.split("=")[1];
        return obj;
      }, {});

    // 页面加载完成后执行动画
    window.onload = function () {
      const target = document.getElementById("detail-content");
      const { x, y, width, height } = target.getBoundingClientRect();
      const options = {
        duration: 1000,
        easing: "cubic-bezier(0,0,0.32,1)",
      };

      // 执行动画
      target.animate(
        [
          {
            transform: `translate(${Number(query.x) - x}px, ${
              Number(query.y) - y
            }px)`,
            width: query.width + "px",
            height: query.height + "px",
          },
          {
            transform: "translate(0, 0)",
            width,
            height,
          },
        ],
        options
      );
    };
  </script>
</html>
```

核心的思路是：通过 url 记录和传递点击卡片的信息给详情页面，详情页面加载完成之后，执行动画。先回到上个页面卡片点击的状态（位置、大小），动画执行过程中再过渡到现在的详情页面状态（位置、大小）。
