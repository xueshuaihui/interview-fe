## 8. 你知道v-model的原理吗？说说看

### 8.1. **表单元素中的** `v-model`

#### 8.1.1. **基础实现,input标签**

```
<input v-model="message">
```

等价于

```
<input 
  :value="message" 
  @input="message = $event.target.value"
>
```

**原理**：

- **属性绑定**：将数据 `message` 绑定到 `value` 属性。
- **事件监听**：监听 `input` 事件，更新数据到 `message`。

#### 8.1.2. **其他表单元素的适配**

- `<textarea>`：与 `<input>` 相同。
- `<select>`：监听 `change` 事件。
- 复选框（Checkbox）和单选框（Radio）：处理 `checked` 属性和 `change` 事件。

### 8.2. **组件中的** `v-model`

#### 8.2.1. vue2

**默认行为**：

- **Prop**：`value`
- **事件**：`input`

```
<!-- 父组件 -->
<ChildComponent v-model="message" />
```

等价于

```
<ChildComponent 
  :value="message" 
  @input="message = $event"
/>
```

**自定义修改**：  
通过 `model` 选项可修改默认的 prop 和事件名：

```
// 子组件
export default {
  model: {
    prop: 'title',    // 修改 prop 名为 title
    event: 'change'   // 修改事件名为 change
  }
}
```

#### 8.2.2. vue3

**默认行为**：

- **Prop**：`modelValue`
- **事件**：`update:modelValue`

```
<!-- 父组件 -->
<ChildComponent v-model="message" />
```

等价于

```
<ChildComponent 
  :modelValue="message" 
  @update:modelValue="message = $event"
/>
```

### 8.3. 底层实现

#### 8.3.1. **1. 数据 → 视图（响应式更新）**

- **依赖追踪**：通过响应式系统（如 `Object.defineProperty` 或 `Proxy`），当数据变化时，触发组件的重新渲染。
- **虚拟 DOM 对比**：生成新的虚拟 DOM 并与旧 DOM 对比，更新变化的部分。

#### 8.3.2. **2. 视图 → 数据（事件触发）**

- 监听表单输入事件（如 `input`、`change`）。
- 在事件回调中更新数据，触发响应式系统的依赖通知。

```
数据变化 → 更新视图（响应式系统）
视图输入 → 触发事件 → 更新数据（事件监听）
```
