<h1 id="pYyO3">js中的数据类型</h1>
<h2 id="sVBgA">数据类型有8种：</h2>
undefined、null、boolean、string、number、object、symbol、bigint

<h2 id="lDIko">特别的：</h2>
symbol: 唯一的， 主要是为了解决属性、变量名的冲突问题

bigint:表示大整数， 问了解决超出number最大范围的整数

<h3 id="Jkb39">symbol</h3>
1. 创建唯一属性键，避免与常规的字符串属性键冲突

```javascript
const mySymbol = Symbol("mySymbol")
const obj = {}
obj[mySymbol] = "123"
```

2. 模拟私有属性

```javascript
// 定义一个class类
const privateProperty = Symbol('private');

class MyClass {
  constructor() {
    this[privateProperty] = 'This is a private value';
  }

  getPrivateValue() {
    return this[privateProperty];
  }
}
// 使用class类
const instance = new MyClass();
// console.log(instance) 会发现instance的属性键为Symbol类型， 外面在直接使用instance时是无法直接读取的， 只有通过提供的getPrivateValue方法才行
```

<h3 id="j78EJ">bigint</h3>
通过在整数后面添加`n`来定义一个bigint类型的值

```javascript
const num = 434242342423423423423n
```

或者通过`BigInt()`进行转换

```javascript
BigInt(123)
```

<h2 id="re4Ic">分类</h2>
原始数据类型：undefined、null、boolean、string、number、symbol、bigint

引用数据类型：object、function、array

<h2 id="NHQ7W">区别：</h2>
原始数据类型和引用数据类型的区别

1. 存储方式不同：
    1. 原始数据类型主要存储在栈中，访问速度快；
    2. 引用数据类型主要存储在堆中， 栈中存储的是数据的地址
2. 复制方式不同：
    1. 原始数据类型复制是创建一个完全独立的新空间存储拷贝的新数据， 修改新数据时旧数据不会发生改变
    2. 引用数据类型复制是复制的引用地址，不管修改新旧数据哪一个本地都操作的是一套数据
3. 比较方式不同：
    1. 原始数据类型通过`===`比较时，直接比较的值
    2. 引用数据类型通过`===`比较时， 比较的是栈中存储的引用地址。只有两个地址都指向同一个值时才为true
4. 传递方式不同：

首先得清楚一点， 函数传参时传递的是值的副本，根据原始数据类型和引用数据类型的特性，不难推断

    1. 原始数据类型传递的是值的副本， 内部操作不用想外面的原始值
    2. 引用数据类型传递的是地址的副本。本质操作的都是一套数据

<h2 id="plyyc">数据类型检测</h2>
<h3 id="lckyR">typeof</h3>
1. `typeof`可以检测undefined、boolean、string、number、symbol、bigint
2. null、object都会返回“object”
3. 特殊的

```javascript
const as = Symbol('asd') 
typeof as // 'symbol'
typeof 42423423n // 'bigint'
```

<h3 id="bl8kf">instanceof</h3>
可以检测引用数据类型的数据， 不能检测原始数据类型. 原因：**其内部运行机制是判断在其原型链中能否找到该类型的原型**

```javascript
324243 instanceof Number // false
[] instanceof Array // true
const a1 = () => {}
a1 instanceof Function // true
const b1 = {}
b1 instanceof Object // true
```

<h3 id="PM2qW"><font style="color:rgba(0, 0, 0, 0.85);">Object.prototype.toString.call()</font></h3>
可以准确地检测各种数据类型，返回一个形如 `"[object Type]"` 的字符串，其中 `Type` 是数据类型的名称。
