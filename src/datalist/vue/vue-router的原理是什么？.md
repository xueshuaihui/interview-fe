## 1. vue-router的原理是什么？

Vue Router 的核心是通过 **路由模式监听 URL 变化** → **动态匹配组件** → **响应式更新视图**，实现单页面应用的无刷新导航。选择 Hash 或 History 模式需根据项目需求权衡美观性、兼容性和服务器支持。对于复杂场景，可结合导航守卫、懒加载等特性优化用户体验

### 路由模式的核心实现

Vue Router 支持三种路由模式，其底层机制如下：

1. **Hash 模式（默认模式）**

- **原理**：利用 URL 中的 `#` 符号（哈希值）作为路由标识。哈希值的变化不会触发浏览器向服务器发送请求。
- **实现方式**：

<!---->

- - 通过 `window.addEventListener('hashchange', callback)` 监听哈希变化。
  - 哈希值变化时，解析路径并匹配对应组件，通过 `<router-view>` 动态渲染。

<!---->

- **优点**：兼容性好（支持所有浏览器），无需服务器配置。
- **缺点**：URL 中带有 `#`，不够美观。

2. **History 模式**

- **原理**：基于 HTML5 的 `History API`（`pushState` 和 `replaceState`），直接操作浏览器历史记录栈。
- **实现方式**：

<!---->

- - 通过 `history.pushState()` 或 `history.replaceState()` 修改 URL。
  - 通过 `window.addEventListener('popstate', callback)` 监听浏览器前进/后退操作。

<!---->

- **优点**：URL 无 `#`，更符合传统 URL 结构。
- **缺点**：需服务器配置（所有路径重定向到 `index.html`），否则直接访问子路径会返回 404。

3. **Memory** **模式**

- **原理**：通过数组模拟浏览器历史记录栈，不依赖浏览器 API，适用于非浏览器环境（如 Node.js 或移动端）

### Vue Router 的核心工作流程

1. **初始化路由表**  
    定义路由配置（`routes` 数组），将路径与组件映射。例如：

```
javascript


const routes = [
  { path: '/user/:id', component: User }, // 动态路由
  { path: '/parent', component: Parent, children: [...] } // 嵌套路由
];
```

2. **监听 URL 变化**

- - Hash 模式监听 `hashchange` 事件，History 模式监听 `popstate` 事件。

3. **动态匹配路由**

- - 根据当前 URL 解析路径参数（如 `/user/123` 中的 `id=123`），匹配路由表中对应的组件。

4. **组件渲染**

- - 通过 `<router-view>` 组件作为占位符，动态渲染匹配到的组件。

5. **状态更新**

- - 使用响应式变量（如 `current`）跟踪当前路由状态，触发视图更新。

### 关键特性与进阶实现

#### 1. **动态路由与嵌套路由**

- **动态路由**：通过冒号 `:` 定义路径参数（如 `/user/:id`），在组件中通过 `$route.params` 获取参数。
- **嵌套路由**：通过 `children` 配置子路由，父组件中嵌套 `<router-view>` 渲染子组件。

#### 2. **导航守卫**

- **作用**：在路由跳转前后执行逻辑（如权限验证、数据预加载）。
- **类型**：

<!---->

- - 全局守卫（`router.beforeEach`）。
  - 路由独享守卫（`beforeEnter`）。
  - 组件内守卫（`beforeRouteEnter`、`beforeRouteLeave`）。

#### 3. **懒加载**

- **实现**：通过动态导入语法（`() => import('./Component.vue')`）按需加载组件，提升首屏性能

### **Hash 模式和History 模式**对比

| **对比维度**    | **Hash 模式** | **History 模式**                |
| ----------- | ----------- | ----------------------------- |
| **URL 美观性** | 带有 `#`      | 无 `#`，更接近传统 URL               |
| **兼容性**     | 支持所有浏览器     | 需浏览器支持 History API            |
| **服务器配置**   | 无需特殊配置      | 需配置重定向（如 Nginx 的 `try_files`） |
| **适用场景**    | 简单项目、兼容性要求高 | 需 SEO 优化、URL 美观的正式项目          |
