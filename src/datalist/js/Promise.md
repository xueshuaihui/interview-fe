# Promise

`Promise` 是 JavaScript 中用于处理异步操作的一种对象。它提供了一种更结构化和可管理的方式来处理异步任务的结果。

## **基本概念**

-   `Promise` 对象有三种状态：

<!---->

-   -   `pending`（初始状态，既不是成功也不是失败）
    -   `fulfilled`（操作成功完成）
    -   `rejected`（操作失败）

状态只能从 `pending` 转变为 `fulfilled` 或者 `rejected` ，且状态一旦改变就不可再变。

## **创建** `Promise` **对象**

使用 `new Promise((resolve, reject) => {...})` 来创建。在执行器函数中，异步操作成功时调用 `resolve` 函数来改变状态为 `fulfilled` 并传递结果值；异步操作失败时调用 `reject` 函数来改变状态为 `rejected` 并传递错误原因。

## `Promise` **的方法**

-   `then`：接收两个回调函数作为参数，第一个函数在 `Promise` 状态变为 `fulfilled` 时被调用，第二个函数（可选）在 `Promise` 状态变为 `rejected` 时被调用。它返回一个新的 `Promise` 对象，支持链式调用。
-   `catch`：专门用于处理 `Promise` 被拒绝（`rejected`）的情况，相当于 `then` 方法中只处理错误的部分。它也返回一个新的 `Promise` 对象。
-   `finally`：无论 `Promise` 的最终状态是成功还是失败，都会执行 `finally` 中指定的回调函数。它返回一个新的 `Promise` 对象，其状态和值与前一个 `Promise` 相同。

## `Promise` **的链式调用**

通过 `then` 方法的连续调用，可以形成一个 `Promise` 链，依次处理每个异步操作的结果，并将结果传递给下一个 `then` 。

**错误处理：**

如果在 `Promise` 链中的某个环节发生了错误，会沿着链传递，直到被 `catch` 方法捕获处理。  
`Promise` **的组合：**

-   `Promise.all`：接收一个 `Promise` 数组，只有当所有的 `Promise` 都成功时，返回的 `Promise` 才成功，结果是一个包含所有成功结果的数组。如果有一个 `Promise` 失败，整个组合就失败。
-   `Promise.race`：接收一个 `Promise` 数组，只要其中一个 `Promise 成功或失败`，返回的 `Promise` 就会相应地成功或失败，并返回第一个完成的 `Promise` 的结果。

## **优点**

-   使异步代码更具可读性和可维护性。
-   更好地处理错误。
-   支持优雅的异步流程控制和组合。

## 手写实现promise

自定义 Promise 类，模拟原生 Promise 的基本功能

```
class Promise{
  /**
   * 构造函数，初始化 Promise 实例
   * @param {function} executor - 执行器函数，接收 resolve 和 reject 作为参数
   */
  constructor(executor){
    // 初始化 Promise 状态为 pending
    this.state = 'pending';
    // 初始化 Promise 成功的值
    this.value = undefined;
    // 初始化 Promise 失败的原因
    this.reason = undefined;
    // 存储成功回调的数组
    this.onResolvedCallbacks = [];
    // 存储失败回调的数组
    this.onRejectedCallbacks = [];

    /**
     * 改变 Promise 状态为 fulfilled，并传递成功的值
     * @param {*} value - 成功的值
     */
    let resolve = value => {
      // 只有状态为 pending 时才能改变状态
      if (this.state === 'pending') {
        // 将状态改为 fulfilled
        this.state = 'fulfilled';
        // 保存成功的值
        this.value = value;
        // 依次执行成功回调数组中的回调函数
        this.onResolvedCallbacks.forEach(fn=>fn());
      }
    };

    /**
     * 改变 Promise 状态为 rejected，并传递失败的原因
     * @param {*} reason - 失败的原因
     */
    let reject = reason => {
      // 只有状态为 pending 时才能改变状态
      if (this.state === 'pending') {
        // 将状态改为 rejected
        this.state = 'rejected';
        // 保存失败的原因
        this.reason = reason;
        // 依次执行失败回调数组中的回调函数
        this.onRejectedCallbacks.forEach(fn=>fn());
      }
    };

    try{
      // 执行执行器函数，并传入 resolve 和 reject
      executor(resolve, reject);
    } catch (err) {
      // 若执行器函数抛出错误，调用 reject 方法
      reject(err);
    }
  }

  /**
   * 为 Promise 实例添加成功和失败的回调函数，并返回一个新的 Promise 实例
   * @param {function} onFulfilled - 成功回调函数
   * @param {function} onRejected - 失败回调函数
   * @returns {Promise} 一个新的 Promise 实例
   */
  then(onFulfilled,onRejected) {
    // 若 onFulfilled 不是函数，将其转换为返回传入值的函数
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    // 若 onRejected 不是函数，将其转换为抛出错误的函数
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };

    let promise2 = new Promise((resolve, reject) => {
      if (this.state === 'fulfilled') {
        // 异步执行成功回调函数
        setTimeout(() => {
          try {
            // 执行成功回调函数并获取结果
            let x = onFulfilled(this.value);
            // 解析结果
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            // 若执行过程中出现错误，调用 reject 方法
            reject(e);
          }
        }, 0);
      };

      if (this.state === 'rejected') {
        // 异步执行失败回调函数
        setTimeout(() => {
          try {
            // 执行失败回调函数并获取结果
            let x = onRejected(this.reason);
            // 解析结果
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            // 若执行过程中出现错误，调用 reject 方法
            reject(e);
          }
        }, 0);
      };

      if (this.state === 'pending') {
        // 将成功回调函数添加到成功回调数组中
        this.onResolvedCallbacks.push(() => {
          // 异步执行成功回调函数
          setTimeout(() => {
            try {
              // 执行成功回调函数并获取结果
              let x = onFulfilled(this.value);
              // 解析结果
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              // 若执行过程中出现错误，调用 reject 方法
              reject(e);
            }
          }, 0);
        });

        // 将失败回调函数添加到失败回调数组中
        this.onRejectedCallbacks.push(() => {
          // 异步执行失败回调函数
          setTimeout(() => {
            try {
              // 执行失败回调函数并获取结果
              let x = onRejected(this.reason);
              // 解析结果
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              // 若执行过程中出现错误，调用 reject 方法
              reject(e);
            }
          }, 0)
        });
      };
    });

    // 返回新的 Promise 实例
    return promise2;
  }

  /**
   * 捕获 Promise 链中的错误
   * @param {function} fn - 错误处理函数
   * @returns {Promise} 一个新的 Promise 实例
   */
  catch(fn){
    // 调用 then 方法，只传入失败回调函数
    return this.then(null,fn);
  }
}

/**
 * 解析 Promise 的结果
 * @param {Promise} promise2 - 新的 Promise 实例
 * @param {*} x - 上一个 Promise 的结果
 * @param {function} resolve - 解决 Promise 的函数
 * @param {function} reject - 拒绝 Promise 的函数
 */
function resolvePromise(promise2, x, resolve, reject){
  // 避免循环引用
  if(x === promise2){
    return reject(new TypeError('Chaining cycle detected for promise'));
  }
  // 标记是否已经调用过 resolve 或 reject
  let called;
  // 判断 x 是否为对象或函数
  if (x != null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      // 获取 x 的 then 方法
      let then = x.then;
      // 判断 then 是否为函数
      if (typeof then === 'function') { 
        // 调用 then 方法
        then.call(x, y => {
          // 避免重复调用
          if(called)return;
          called = true;
          // 递归解析 y
          resolvePromise(promise2, y, resolve, reject);
        }, err => {
          // 避免重复调用
          if(called)return;
          called = true;
          // 拒绝 Promise
          reject(err);
        })
      } else {
        // 若 then 不是函数，直接将 x 作为结果
        resolve(x);
      }
    } catch (e) {
      // 若执行过程中出现错误，避免重复调用
      if(called)return;
      called = true;
      // 拒绝 Promise
      reject(e); 
    }
  } else {
    // 若 x 不是对象或函数，直接将 x 作为结果
    resolve(x);
  }
}

/**
 * 返回一个状态为 fulfilled 的 Promise 实例
 * @param {*} val - 成功的值
 * @returns {Promise} 一个新的 Promise 实例
 */
// resolve 方法
Promise.resolve = function(val){
  return new Promise((resolve,reject)=>{
    // 调用 resolve 方法
    resolve(val)
  });
}

/**
 * 返回一个状态为 rejected 的 Promise 实例
 * @param {*} val - 失败的原因
 * @returns {Promise} 一个新的 Promise 实例
 */
// reject 方法
Promise.reject = function(val){
  return new Promise((resolve,reject)=>{
    // 调用 reject 方法
    reject(val)
  });
}

/**
 * 接受一个 Promise 数组，返回一个新的 Promise，只要数组中的任何一个 Promise 状态改变，新的 Promise 就会以相同的状态和结果结束
 * @param {Array<Promise>} promises - Promise 数组
 * @returns {Promise} 一个新的 Promise 实例
 */
// race 方法 
Promise.race = function(promises){
  return new Promise((resolve,reject)=>{
    for(let i=0;i<promises.length;i++){
      // 为每个 Promise 添加成功和失败回调
      promises[i].then(resolve,reject)
    };
  })
}

/**
 * 接受一个 Promise 数组，返回一个新的 Promise，只有当数组中的所有 Promise 都成功时，新的 Promise 才会成功，结果是一个包含所有 Promise 结果的数组；如果有任何一个 Promise 失败，新的 Promise 就会立即失败
 * @param {Array<Promise>} promises - Promise 数组
 * @returns {Promise} 一个新的 Promise 实例
 */
// all 方法(获取所有的 promise，都执行 then，把结果放到数组，一起返回)
Promise.all = function(promises){
  // 存储所有 Promise 结果的数组
  let arr = [];
  // 记录已完成的 Promise 数量
  let i = 0;

  /**
   * 处理每个 Promise 的结果
   * @param {number} index - 结果在数组中的索引
   * @param {*} data - 结果数据
   */
  function processData(index,data){
    // 将结果存储到数组中
    arr[index] = data;
    // 已完成的 Promise 数量加 1
    i++;
    if(i == promises.length){
      // 若所有 Promise 都已完成，调用 resolve 方法
      resolve(arr);
    };
  };

  return new Promise((resolve,reject)=>{
    for(let i=0;i<promises.length;i++){
      // 为每个 Promise 添加成功和失败回调
      promises[i].then(data=>{
        // 处理成功结果
        processData(i,data);
      },reject);
    };
  });
}
```

#