## 9. Vue是怎样依赖收集的？

### 9.1. **核心概念**

1.  **响应式对象**  
    通过 `Object.defineProperty` (Vue 2) 或 `Proxy` (Vue 3) 劫持数据访问，将普通对象转为响应式对象。
1.  **依赖（Dep）**  
    每个响应式属性对应一个 `Dep` 实例，用于管理所有依赖该属性的观察者（Watcher）。
1.  **观察者（Watcher）**  
    表示一个依赖关系，如组件渲染函数、计算属性或用户自定义的 `watch`。当数据变化时，`Watcher` 负责执行更新。

### 9.2. 依赖收集流程

#### 9.2.1. **Vue 2 的依赖收集（基于 Object.defineProperty）**

-   -   **步骤**：

1.  1.  1.  **初始化响应式数据**：  
            递归遍历对象，为每个属性创建 `Dep` 并劫持 `getter/setter`。

```
function defineReactive(obj, key) {
  const dep = new Dep();  // 每个属性一个 Dep
  let value = obj[key];
  Object.defineProperty(obj, key, {
    get() {
      if (Dep.target) {  // 当前正在计算的 Watcher
        dep.depend();   // 将 Watcher 添加到 Dep
      }
      return value;
    },
    set(newVal) {
      value = newVal;
      dep.notify();      // 通知所有 Watcher 更新
    }
  });
}
```

1.  1.  2.  **组件初始化时创建 Watcher**：  
            每个组件实例对应一个渲染 `Watcher`，在 `mount` 阶段首次执行渲染函数。
        2.  **触发依赖收集**：  
            渲染过程中访问数据属性，触发 `getter`，将当前 `Watcher` 收集到属性的 `Dep` 中。

-   -   **依赖关系示例**：

```
// 数据
const data = { count: 0 };
// 转为响应式
observe(data);

// 组件 Watcher
new Watcher(() => {
  console.log(data.count);  // 访问 count，触发 getter
});

// 输出：0
data.count = 1;  // 触发 setter，Watcher 重新执行
```

#### 9.2.2. **Vue 3 的依赖收集（基于 Proxy）**

-   **步骤**：

1.  1.  **创建响应式对象**：  
        使用 `Proxy` 拦截对象操作，无需递归初始化。

```
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      track(target, key);  // 依赖收集
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      Reflect.set(target, key, value, receiver);
      trigger(target, key);  // 触发更新
    }
  });
}
```

1.  2.  **全局依赖管理**：  
        通过 `track` 函数将当前活动的 `effect`（类似 Watcher）记录到全局的 `targetMap` 中。
    2.  **依赖触发**：  
        数据修改时，`trigger` 函数从 `targetMap` 中找到依赖并执行。

### 9.3. 注意

#### 9.3.1. **Dep 与 Watcher 的多对多关系**

-   **Dep → Watcher**：一个属性可被多个组件或计算属性依赖。
-   **Watcher → Dep**：一个 `Watcher` 可能依赖多个属性（如模板中使用多个数据）。

#### 9.3.2. **2. 避免重复收集**

-   **Vue 2**：通过 `Dep.target` 标识当前 `Watcher`，确保同一 `Watcher` 不会重复添加到 `Dep`。
-   **Vue 3**：使用 `activeEffect` 和 `effectStack` 管理当前活动的副作用。

#### 9.3.3. **3. 嵌套组件的依赖收集**

-   父组件渲染时遇到子组件，会先完成子组件的依赖收集，再回到父组件。

### 9.4. **依赖更新的触发**

#### 9.4.1. **同步更新流程**

```
graph TD
  A[数据修改] --> B[触发 setter/Proxy set]
  B --> C[Dep.notify / trigger]
  C --> D[遍历所有 Watcher/Effect]
  D --> E[执行 Watcher.run / effect scheduler]
  E --> F[重新渲染或执行回调]
```

#### 9.4.2. **异步更新流程**

**批量更新优化**：  
多次数据修改会合并到一次更新中，避免重复渲染。

### 9.5. **特殊场景处理**

#### 9.5.1. **数组的依赖收集**

-   **Vue 2**：重写数组方法（`push`、`pop` 等），在方法调用时手动触发通知。
-   **Vue 3**：`Proxy` 直接监听数组索引变化和方法调用。

#### 9.5.2. **2. 计算属性与侦听器**

-   **计算属性**：  
    惰性求值，只有当依赖变化时才重新计算。
-   **侦听器（watch）** ：  
    显式指定依赖源，变化时触发回调。

