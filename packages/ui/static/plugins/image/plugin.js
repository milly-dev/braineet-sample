/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 *
 * Version: 5.1.6 (2020-01-28)
 */
(function(domGlobals) {
    const global$1 = tinymce.util.Tools.resolve('tinymce.PluginManager');

    const noop = function() {};
    const constant = function(value) {
        return function() {
            return value;
        };
    };
    const identity = function(x) {
        return x;
    };
    const die = function(msg) {
        return function() {
            throw new Error(msg);
        };
    };
    const never = constant(false);
    const always = constant(true);

    const none = function() {
        return NONE;
    };
    var NONE = (function() {
        const eq = function(o) {
            return o.isNone();
        };
        const call = function(thunk) {
            return thunk();
        };
        const id = function(n) {
            return n;
        };
        const me = {
            fold(n, s) {
                return n();
            },
            is: never,
            isSome: never,
            isNone: always,
            getOr: id,
            getOrThunk: call,
            getOrDie(msg) {
                throw new Error(msg || 'error: getOrDie called on none.');
            },
            getOrNull: constant(null),
            getOrUndefined: constant(undefined),
            or: id,
            orThunk: call,
            map: none,
            each: noop,
            bind: none,
            exists: never,
            forall: always,
            filter: none,
            equals: eq,
            equals_: eq,
            toArray() {
                return [];
            },
            toString: constant('none()'),
        };
        if (Object.freeze) {
            Object.freeze(me);
        }
        return me;
    })();
    var some = function(a) {
        const constant_a = constant(a);
        const self = function() {
            return me;
        };
        const bind = function(f) {
            return f(a);
        };
        var me = {
            fold(n, s) {
                return s(a);
            },
            is(v) {
                return a === v;
            },
            isSome: always,
            isNone: never,
            getOr: constant_a,
            getOrThunk: constant_a,
            getOrDie: constant_a,
            getOrNull: constant_a,
            getOrUndefined: constant_a,
            or: self,
            orThunk: self,
            map(f) {
                return some(f(a));
            },
            each(f) {
                f(a);
            },
            bind,
            exists: bind,
            forall: bind,
            filter(f) {
                return f(a) ? me : NONE;
            },
            toArray() {
                return [a];
            },
            toString() {
                return `some(${a})`;
            },
            equals(o) {
                return o.is(a);
            },
            equals_(o, elementEq) {
                return o.fold(never, function(b) {
                    return elementEq(a, b);
                });
            },
        };
        return me;
    };
    const from = function(value) {
        return value === null || value === undefined ? NONE : some(value);
    };
    const Option = {
        some,
        none,
        from,
    };

    const typeOf = function(x) {
        if (x === null) {
            return 'null';
        }
        const t = typeof x;
        if (
            t === 'object' &&
            (Array.prototype.isPrototypeOf(x) ||
                (x.constructor && x.constructor.name === 'Array'))
        ) {
            return 'array';
        }
        if (
            t === 'object' &&
            (String.prototype.isPrototypeOf(x) ||
                (x.constructor && x.constructor.name === 'String'))
        ) {
            return 'string';
        }
        return t;
    };
    const isType = function(type) {
        return function(value) {
            return typeOf(value) === type;
        };
    };
    const isString = isType('string');
    const isObject = isType('object');
    const isArray = isType('array');
    const isBoolean = isType('boolean');
    const isFunction = isType('function');

    const nativeSlice = Array.prototype.slice;
    const nativePush = Array.prototype.push;
    const each = function(xs, f) {
        for (let i = 0, len = xs.length; i < len; i++) {
            const x = xs[i];
            f(x, i);
        }
    };
    const flatten = function(xs) {
        const r = [];
        for (let i = 0, len = xs.length; i < len; ++i) {
            if (!isArray(xs[i])) {
                throw new Error(
                    `Arr.flatten item ${i} was not an array, input: ${xs}`,
                );
            }
            nativePush.apply(r, xs[i]);
        }
        return r;
    };
    const head = function(xs) {
        return xs.length === 0 ? Option.none() : Option.some(xs[0]);
    };
    const from$1 = isFunction(Array.from)
        ? Array.from
        : function(x) {
              return nativeSlice.call(x);
          };

    var __assign = function() {
        __assign =
            Object.assign ||
            function __assign(t) {
                for (var s, i = 1, n = arguments.length; i < n; i++) {
                    s = arguments[i];
                    for (const p in s)
                        if (Object.prototype.hasOwnProperty.call(s, p))
                            t[p] = s[p];
                }
                return t;
            };
        return __assign.apply(this, arguments);
    };

    const exports$1 = {};
    const module = { exports: exports$1 };
    (function(define, exports, module, require) {
        (function(f) {
            if (typeof exports === 'object' && typeof module !== 'undefined') {
                module.exports = f();
            } else if (typeof define === 'function' && define.amd) {
                define([], f);
            } else {
                let g;
                if (typeof window !== 'undefined') {
                    g = window;
                } else if (typeof global !== 'undefined') {
                    g = global;
                } else if (typeof self !== 'undefined') {
                    g = self;
                } else {
                    g = this;
                }
                g.EphoxContactWrapper = f();
            }
        })(function() {
            return (function() {
                function r(e, n, t) {
                    function o(i, f) {
                        if (!n[i]) {
                            if (!e[i]) {
                                const c =
                                    typeof require === 'function' && require;
                                if (!f && c) return c(i, !0);
                                if (u) return u(i, !0);
                                const a = new Error(
                                    `Cannot find module '${i}'`,
                                );
                                throw ((a.code = 'MODULE_NOT_FOUND'), a);
                            }
                            const p = (n[i] = { exports: {} });
                            e[i][0].call(
                                p.exports,
                                function(r) {
                                    const n = e[i][1][r];
                                    return o(n || r);
                                },
                                p,
                                p.exports,
                                r,
                                e,
                                n,
                                t,
                            );
                        }
                        return n[i].exports;
                    }
                    for (
                        var u = typeof require === 'function' && require, i = 0;
                        i < t.length;
                        i++
                    )
                        o(t[i]);
                    return o;
                }
                return r;
            })()(
                {
                    1: [
                        function(require, module, exports) {
                            const process = (module.exports = {});
                            let cachedSetTimeout;
                            let cachedClearTimeout;
                            function defaultSetTimout() {
                                throw new Error(
                                    'setTimeout has not been defined',
                                );
                            }
                            function defaultClearTimeout() {
                                throw new Error(
                                    'clearTimeout has not been defined',
                                );
                            }
                            (function() {
                                try {
                                    if (typeof setTimeout === 'function') {
                                        cachedSetTimeout = setTimeout;
                                    } else {
                                        cachedSetTimeout = defaultSetTimout;
                                    }
                                } catch (e) {
                                    cachedSetTimeout = defaultSetTimout;
                                }
                                try {
                                    if (typeof clearTimeout === 'function') {
                                        cachedClearTimeout = clearTimeout;
                                    } else {
                                        cachedClearTimeout = defaultClearTimeout;
                                    }
                                } catch (e) {
                                    cachedClearTimeout = defaultClearTimeout;
                                }
                            })();
                            function runTimeout(fun) {
                                if (cachedSetTimeout === setTimeout) {
                                    return setTimeout(fun, 0);
                                }
                                if (
                                    (cachedSetTimeout === defaultSetTimout ||
                                        !cachedSetTimeout) &&
                                    setTimeout
                                ) {
                                    cachedSetTimeout = setTimeout;
                                    return setTimeout(fun, 0);
                                }
                                try {
                                    return cachedSetTimeout(fun, 0);
                                } catch (e) {
                                    try {
                                        return cachedSetTimeout.call(
                                            null,
                                            fun,
                                            0,
                                        );
                                    } catch (e) {
                                        return cachedSetTimeout.call(
                                            this,
                                            fun,
                                            0,
                                        );
                                    }
                                }
                            }
                            function runClearTimeout(marker) {
                                if (cachedClearTimeout === clearTimeout) {
                                    return clearTimeout(marker);
                                }
                                if (
                                    (cachedClearTimeout ===
                                        defaultClearTimeout ||
                                        !cachedClearTimeout) &&
                                    clearTimeout
                                ) {
                                    cachedClearTimeout = clearTimeout;
                                    return clearTimeout(marker);
                                }
                                try {
                                    return cachedClearTimeout(marker);
                                } catch (e) {
                                    try {
                                        return cachedClearTimeout.call(
                                            null,
                                            marker,
                                        );
                                    } catch (e) {
                                        return cachedClearTimeout.call(
                                            this,
                                            marker,
                                        );
                                    }
                                }
                            }
                            let queue = [];
                            let draining = false;
                            let currentQueue;
                            let queueIndex = -1;
                            function cleanUpNextTick() {
                                if (!draining || !currentQueue) {
                                    return;
                                }
                                draining = false;
                                if (currentQueue.length) {
                                    queue = currentQueue.concat(queue);
                                } else {
                                    queueIndex = -1;
                                }
                                if (queue.length) {
                                    drainQueue();
                                }
                            }
                            function drainQueue() {
                                if (draining) {
                                    return;
                                }
                                const timeout = runTimeout(cleanUpNextTick);
                                draining = true;
                                let len = queue.length;
                                while (len) {
                                    currentQueue = queue;
                                    queue = [];
                                    while (++queueIndex < len) {
                                        if (currentQueue) {
                                            currentQueue[queueIndex].run();
                                        }
                                    }
                                    queueIndex = -1;
                                    len = queue.length;
                                }
                                currentQueue = null;
                                draining = false;
                                runClearTimeout(timeout);
                            }
                            process.nextTick = function(fun) {
                                const args = new Array(arguments.length - 1);
                                if (arguments.length > 1) {
                                    for (let i = 1; i < arguments.length; i++) {
                                        args[i - 1] = arguments[i];
                                    }
                                }
                                queue.push(new Item(fun, args));
                                if (queue.length === 1 && !draining) {
                                    runTimeout(drainQueue);
                                }
                            };
                            function Item(fun, array) {
                                this.fun = fun;
                                this.array = array;
                            }
                            Item.prototype.run = function() {
                                this.fun.apply(null, this.array);
                            };
                            process.title = 'browser';
                            process.browser = true;
                            process.env = {};
                            process.argv = [];
                            process.version = '';
                            process.versions = {};
                            function noop() {}
                            process.on = noop;
                            process.addListener = noop;
                            process.once = noop;
                            process.off = noop;
                            process.removeListener = noop;
                            process.removeAllListeners = noop;
                            process.emit = noop;
                            process.prependListener = noop;
                            process.prependOnceListener = noop;
                            process.listeners = function(name) {
                                return [];
                            };
                            process.binding = function(name) {
                                throw new Error(
                                    'process.binding is not supported',
                                );
                            };
                            process.cwd = function() {
                                return '/';
                            };
                            process.chdir = function(dir) {
                                throw new Error(
                                    'process.chdir is not supported',
                                );
                            };
                            process.umask = function() {
                                return 0;
                            };
                        },
                        {},
                    ],
                    2: [
                        function(require, module, exports) {
                            (function(setImmediate) {
                                (function(root) {
                                    const setTimeoutFunc = setTimeout;
                                    function noop() {}
                                    function bind(fn, thisArg) {
                                        return function() {
                                            fn.apply(thisArg, arguments);
                                        };
                                    }
                                    function Promise(fn) {
                                        if (typeof this !== 'object')
                                            throw new TypeError(
                                                'Promises must be constructed via new',
                                            );
                                        if (typeof fn !== 'function')
                                            throw new TypeError(
                                                'not a function',
                                            );
                                        this._state = 0;
                                        this._handled = false;
                                        this._value = undefined;
                                        this._deferreds = [];
                                        doResolve(fn, this);
                                    }
                                    function handle(self, deferred) {
                                        while (self._state === 3) {
                                            self = self._value;
                                        }
                                        if (self._state === 0) {
                                            self._deferreds.push(deferred);
                                            return;
                                        }
                                        self._handled = true;
                                        Promise._immediateFn(function() {
                                            const cb =
                                                self._state === 1
                                                    ? deferred.onFulfilled
                                                    : deferred.onRejected;
                                            if (cb === null) {
                                                (self._state === 1
                                                    ? resolve
                                                    : reject)(
                                                    deferred.promise,
                                                    self._value,
                                                );
                                                return;
                                            }
                                            let ret;
                                            try {
                                                ret = cb(self._value);
                                            } catch (e) {
                                                reject(deferred.promise, e);
                                                return;
                                            }
                                            resolve(deferred.promise, ret);
                                        });
                                    }
                                    function resolve(self, newValue) {
                                        try {
                                            if (newValue === self)
                                                throw new TypeError(
                                                    'A promise cannot be resolved with itself.',
                                                );
                                            if (
                                                newValue &&
                                                (typeof newValue === 'object' ||
                                                    typeof newValue ===
                                                        'function')
                                            ) {
                                                const { then } = newValue;
                                                if (
                                                    newValue instanceof Promise
                                                ) {
                                                    self._state = 3;
                                                    self._value = newValue;
                                                    finale(self);
                                                    return;
                                                }
                                                if (
                                                    typeof then === 'function'
                                                ) {
                                                    doResolve(
                                                        bind(then, newValue),
                                                        self,
                                                    );
                                                    return;
                                                }
                                            }
                                            self._state = 1;
                                            self._value = newValue;
                                            finale(self);
                                        } catch (e) {
                                            reject(self, e);
                                        }
                                    }
                                    function reject(self, newValue) {
                                        self._state = 2;
                                        self._value = newValue;
                                        finale(self);
                                    }
                                    function finale(self) {
                                        if (
                                            self._state === 2 &&
                                            self._deferreds.length === 0
                                        ) {
                                            Promise._immediateFn(function() {
                                                if (!self._handled) {
                                                    Promise._unhandledRejectionFn(
                                                        self._value,
                                                    );
                                                }
                                            });
                                        }
                                        for (
                                            let i = 0,
                                                len = self._deferreds.length;
                                            i < len;
                                            i++
                                        ) {
                                            handle(self, self._deferreds[i]);
                                        }
                                        self._deferreds = null;
                                    }
                                    function Handler(
                                        onFulfilled,
                                        onRejected,
                                        promise,
                                    ) {
                                        this.onFulfilled =
                                            typeof onFulfilled === 'function'
                                                ? onFulfilled
                                                : null;
                                        this.onRejected =
                                            typeof onRejected === 'function'
                                                ? onRejected
                                                : null;
                                        this.promise = promise;
                                    }
                                    function doResolve(fn, self) {
                                        let done = false;
                                        try {
                                            fn(
                                                function(value) {
                                                    if (done) return;
                                                    done = true;
                                                    resolve(self, value);
                                                },
                                                function(reason) {
                                                    if (done) return;
                                                    done = true;
                                                    reject(self, reason);
                                                },
                                            );
                                        } catch (ex) {
                                            if (done) return;
                                            done = true;
                                            reject(self, ex);
                                        }
                                    }
                                    Promise.prototype.catch = function(
                                        onRejected,
                                    ) {
                                        return this.then(null, onRejected);
                                    };
                                    Promise.prototype.then = function(
                                        onFulfilled,
                                        onRejected,
                                    ) {
                                        const prom = new this.constructor(noop);
                                        handle(
                                            this,
                                            new Handler(
                                                onFulfilled,
                                                onRejected,
                                                prom,
                                            ),
                                        );
                                        return prom;
                                    };
                                    Promise.all = function(arr) {
                                        const args = Array.prototype.slice.call(
                                            arr,
                                        );
                                        return new Promise(function(
                                            resolve,
                                            reject,
                                        ) {
                                            if (args.length === 0)
                                                return resolve([]);
                                            let remaining = args.length;
                                            function res(i, val) {
                                                try {
                                                    if (
                                                        val &&
                                                        (typeof val ===
                                                            'object' ||
                                                            typeof val ===
                                                                'function')
                                                    ) {
                                                        const { then } = val;
                                                        if (
                                                            typeof then ===
                                                            'function'
                                                        ) {
                                                            then.call(
                                                                val,
                                                                function(val) {
                                                                    res(i, val);
                                                                },
                                                                reject,
                                                            );
                                                            return;
                                                        }
                                                    }
                                                    args[i] = val;
                                                    if (--remaining === 0) {
                                                        resolve(args);
                                                    }
                                                } catch (ex) {
                                                    reject(ex);
                                                }
                                            }
                                            for (
                                                let i = 0;
                                                i < args.length;
                                                i++
                                            ) {
                                                res(i, args[i]);
                                            }
                                        });
                                    };
                                    Promise.resolve = function(value) {
                                        if (
                                            value &&
                                            typeof value === 'object' &&
                                            value.constructor === Promise
                                        ) {
                                            return value;
                                        }
                                        return new Promise(function(resolve) {
                                            resolve(value);
                                        });
                                    };
                                    Promise.reject = function(value) {
                                        return new Promise(function(
                                            resolve,
                                            reject,
                                        ) {
                                            reject(value);
                                        });
                                    };
                                    Promise.race = function(values) {
                                        return new Promise(function(
                                            resolve,
                                            reject,
                                        ) {
                                            for (
                                                let i = 0, len = values.length;
                                                i < len;
                                                i++
                                            ) {
                                                values[i].then(resolve, reject);
                                            }
                                        });
                                    };
                                    Promise._immediateFn =
                                        typeof setImmediate === 'function'
                                            ? function(fn) {
                                                  setImmediate(fn);
                                              }
                                            : function(fn) {
                                                  setTimeoutFunc(fn, 0);
                                              };
                                    Promise._unhandledRejectionFn = function _unhandledRejectionFn(
                                        err,
                                    ) {
                                        if (
                                            typeof console !== 'undefined' &&
                                            console
                                        ) {
                                            console.warn(
                                                'Possible Unhandled Promise Rejection:',
                                                err,
                                            );
                                        }
                                    };
                                    Promise._setImmediateFn = function _setImmediateFn(
                                        fn,
                                    ) {
                                        Promise._immediateFn = fn;
                                    };
                                    Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(
                                        fn,
                                    ) {
                                        Promise._unhandledRejectionFn = fn;
                                    };
                                    if (
                                        typeof module !== 'undefined' &&
                                        module.exports
                                    ) {
                                        module.exports = Promise;
                                    } else if (!root.Promise) {
                                        root.Promise = Promise;
                                    }
                                })(this);
                            }.call(this, require('timers').setImmediate));
                        },
                        { timers: 3 },
                    ],
                    3: [
                        function(require, module, exports) {
                            (function(setImmediate, clearImmediate) {
                                const {
                                    nextTick,
                                } = require('process/browser.js');
                                const { apply } = Function.prototype;
                                const { slice } = Array.prototype;
                                const immediateIds = {};
                                let nextImmediateId = 0;
                                exports.setTimeout = function() {
                                    return new Timeout(
                                        apply.call(
                                            setTimeout,
                                            window,
                                            arguments,
                                        ),
                                        clearTimeout,
                                    );
                                };
                                exports.setInterval = function() {
                                    return new Timeout(
                                        apply.call(
                                            setInterval,
                                            window,
                                            arguments,
                                        ),
                                        clearInterval,
                                    );
                                };
                                exports.clearTimeout = exports.clearInterval = function(
                                    timeout,
                                ) {
                                    timeout.close();
                                };
                                function Timeout(id, clearFn) {
                                    this._id = id;
                                    this._clearFn = clearFn;
                                }
                                Timeout.prototype.unref = Timeout.prototype.ref = function() {};
                                Timeout.prototype.close = function() {
                                    this._clearFn.call(window, this._id);
                                };
                                exports.enroll = function(item, msecs) {
                                    clearTimeout(item._idleTimeoutId);
                                    item._idleTimeout = msecs;
                                };
                                exports.unenroll = function(item) {
                                    clearTimeout(item._idleTimeoutId);
                                    item._idleTimeout = -1;
                                };
                                exports._unrefActive = exports.active = function(
                                    item,
                                ) {
                                    clearTimeout(item._idleTimeoutId);
                                    const msecs = item._idleTimeout;
                                    if (msecs >= 0) {
                                        item._idleTimeoutId = setTimeout(
                                            function onTimeout() {
                                                if (item._onTimeout)
                                                    item._onTimeout();
                                            },
                                            msecs,
                                        );
                                    }
                                };
                                exports.setImmediate =
                                    typeof setImmediate === 'function'
                                        ? setImmediate
                                        : function(fn) {
                                              const id = nextImmediateId++;
                                              const args =
                                                  arguments.length < 2
                                                      ? false
                                                      : slice.call(
                                                            arguments,
                                                            1,
                                                        );
                                              immediateIds[id] = true;
                                              nextTick(function onNextTick() {
                                                  if (immediateIds[id]) {
                                                      if (args) {
                                                          fn.apply(null, args);
                                                      } else {
                                                          fn.call(null);
                                                      }
                                                      exports.clearImmediate(
                                                          id,
                                                      );
                                                  }
                                              });
                                              return id;
                                          };
                                exports.clearImmediate =
                                    typeof clearImmediate === 'function'
                                        ? clearImmediate
                                        : function(id) {
                                              delete immediateIds[id];
                                          };
                            }.call(
                                this,
                                require('timers').setImmediate,
                                require('timers').clearImmediate,
                            ));
                        },
                        {
                            'process/browser.js': 1,
                            timers: 3,
                        },
                    ],
                    4: [
                        function(require, module, exports) {
                            const promisePolyfill = require('promise-polyfill');
                            const Global = (function() {
                                if (typeof window !== 'undefined') {
                                    return window;
                                }
                                return Function('return this;')();
                            })();
                            module.exports = {
                                boltExport: Global.Promise || promisePolyfill,
                            };
                        },
                        { 'promise-polyfill': 2 },
                    ],
                },
                {},
                [4],
            )(4);
        });
    })(undefined, exports$1, module, undefined);
    const Promise = module.exports.boltExport;

    var nu = function(baseFn) {
        let data = Option.none();
        let callbacks = [];
        const map = function(f) {
            return nu(function(nCallback) {
                get(function(data) {
                    nCallback(f(data));
                });
            });
        };
        var get = function(nCallback) {
            if (isReady()) {
                call(nCallback);
            } else {
                callbacks.push(nCallback);
            }
        };
        const set = function(x) {
            data = Option.some(x);
            run(callbacks);
            callbacks = [];
        };
        var isReady = function() {
            return data.isSome();
        };
        var run = function(cbs) {
            each(cbs, call);
        };
        var call = function(cb) {
            data.each(function(x) {
                domGlobals.setTimeout(function() {
                    cb(x);
                }, 0);
            });
        };
        baseFn(set);
        return {
            get,
            map,
            isReady,
        };
    };
    const pure = function(a) {
        return nu(function(callback) {
            callback(a);
        });
    };
    const LazyValue = {
        nu,
        pure,
    };

    const errorReporter = function(err) {
        domGlobals.setTimeout(function() {
            throw err;
        }, 0);
    };
    var make = function(run) {
        const get = function(callback) {
            run().then(callback, errorReporter);
        };
        const map = function(fab) {
            return make(function() {
                return run().then(fab);
            });
        };
        const bind = function(aFutureB) {
            return make(function() {
                return run().then(function(v) {
                    return aFutureB(v).toPromise();
                });
            });
        };
        const anonBind = function(futureB) {
            return make(function() {
                return run().then(function() {
                    return futureB.toPromise();
                });
            });
        };
        const toLazy = function() {
            return LazyValue.nu(get);
        };
        const toCached = function() {
            let cache = null;
            return make(function() {
                if (cache === null) {
                    cache = run();
                }
                return cache;
            });
        };
        const toPromise = run;
        return {
            map,
            bind,
            anonBind,
            toLazy,
            toCached,
            toPromise,
            get,
        };
    };
    const nu$1 = function(baseFn) {
        return make(function() {
            return new Promise(baseFn);
        });
    };
    const pure$1 = function(a) {
        return make(function() {
            return Promise.resolve(a);
        });
    };
    const Future = {
        nu: nu$1,
        pure: pure$1,
    };

    var value = function(o) {
        const is = function(v) {
            return o === v;
        };
        const or = function(opt) {
            return value(o);
        };
        const orThunk = function(f) {
            return value(o);
        };
        const map = function(f) {
            return value(f(o));
        };
        const mapError = function(f) {
            return value(o);
        };
        const each = function(f) {
            f(o);
        };
        const bind = function(f) {
            return f(o);
        };
        const fold = function(_, onValue) {
            return onValue(o);
        };
        const exists = function(f) {
            return f(o);
        };
        const forall = function(f) {
            return f(o);
        };
        const toOption = function() {
            return Option.some(o);
        };
        return {
            is,
            isValue: always,
            isError: never,
            getOr: constant(o),
            getOrThunk: constant(o),
            getOrDie: constant(o),
            or,
            orThunk,
            fold,
            map,
            mapError,
            each,
            bind,
            exists,
            forall,
            toOption,
        };
    };
    var error = function(message) {
        const getOrThunk = function(f) {
            return f();
        };
        const getOrDie = function() {
            return die(String(message))();
        };
        const or = function(opt) {
            return opt;
        };
        const orThunk = function(f) {
            return f();
        };
        const map = function(f) {
            return error(message);
        };
        const mapError = function(f) {
            return error(f(message));
        };
        const bind = function(f) {
            return error(message);
        };
        const fold = function(onError, _) {
            return onError(message);
        };
        return {
            is: never,
            isValue: never,
            isError: always,
            getOr: identity,
            getOrThunk,
            getOrDie,
            or,
            orThunk,
            fold,
            map,
            mapError,
            each: noop,
            bind,
            exists: never,
            forall: always,
            toOption: Option.none,
        };
    };
    const fromOption = function(opt, err) {
        return opt.fold(function() {
            return error(err);
        }, value);
    };
    const Result = {
        value,
        error,
        fromOption,
    };

    var wrap = function(delegate) {
        const toCached = function() {
            return wrap(delegate.toCached());
        };
        const bindFuture = function(f) {
            return wrap(
                delegate.bind(function(resA) {
                    return resA.fold(
                        function(err) {
                            return Future.pure(Result.error(err));
                        },
                        function(a) {
                            return f(a);
                        },
                    );
                }),
            );
        };
        const bindResult = function(f) {
            return wrap(
                delegate.map(function(resA) {
                    return resA.bind(f);
                }),
            );
        };
        const mapResult = function(f) {
            return wrap(
                delegate.map(function(resA) {
                    return resA.map(f);
                }),
            );
        };
        const mapError = function(f) {
            return wrap(
                delegate.map(function(resA) {
                    return resA.mapError(f);
                }),
            );
        };
        const foldResult = function(whenError, whenValue) {
            return delegate.map(function(res) {
                return res.fold(whenError, whenValue);
            });
        };
        const withTimeout = function(timeout, errorThunk) {
            return wrap(
                Future.nu(function(callback) {
                    let timedOut = false;
                    const timer = domGlobals.setTimeout(function() {
                        timedOut = true;
                        callback(Result.error(errorThunk()));
                    }, timeout);
                    delegate.get(function(result) {
                        if (!timedOut) {
                            domGlobals.clearTimeout(timer);
                            callback(result);
                        }
                    });
                }),
            );
        };
        return {
            ...delegate,
            toCached,
            bindFuture,
            bindResult,
            mapResult,
            mapError,
            foldResult,
            withTimeout,
        };
    };
    const nu$2 = function(worker) {
        return wrap(Future.nu(worker));
    };
    const value$1 = function(value) {
        return wrap(Future.pure(Result.value(value)));
    };
    const error$1 = function(error) {
        return wrap(Future.pure(Result.error(error)));
    };
    const fromResult = function(result) {
        return wrap(Future.pure(result));
    };
    const fromFuture = function(future) {
        return wrap(future.map(Result.value));
    };
    const fromPromise = function(promise) {
        return nu$2(function(completer) {
            promise.then(
                function(value) {
                    completer(Result.value(value));
                },
                function(error) {
                    completer(Result.error(error));
                },
            );
        });
    };
    const FutureResult = {
        nu: nu$2,
        wrap,
        pure: value$1,
        value: value$1,
        error: error$1,
        fromResult,
        fromFuture,
        fromPromise,
    };

    const { hasOwnProperty } = Object.prototype;
    const shallow = function(old, nu) {
        return nu;
    };
    const deep = function(old, nu) {
        const bothObjects = isObject(old) && isObject(nu);
        return bothObjects ? deepMerge(old, nu) : nu;
    };
    const baseMerge = function(merger) {
        return function() {
            const objects = new Array(arguments.length);
            for (let i = 0; i < objects.length; i++) {
                objects[i] = arguments[i];
            }
            if (objects.length === 0) {
                throw new Error("Can't merge zero objects");
            }
            const ret = {};
            for (let j = 0; j < objects.length; j++) {
                const curObject = objects[j];
                for (const key in curObject) {
                    if (hasOwnProperty.call(curObject, key)) {
                        ret[key] = merger(ret[key], curObject[key]);
                    }
                }
            }
            return ret;
        };
    };
    var deepMerge = baseMerge(deep);
    const merge = baseMerge(shallow);

    const global$2 = tinymce.util.Tools.resolve('tinymce.dom.DOMUtils');

    const global$3 = tinymce.util.Tools.resolve('tinymce.util.Promise');

    const global$4 = tinymce.util.Tools.resolve('tinymce.util.XHR');

    const hasDimensions = function(editor) {
        return editor.getParam('image_dimensions', true, 'boolean');
    };
    const hasAdvTab = function(editor) {
        return editor.getParam('image_advtab', false, 'boolean');
    };
    const hasUploadTab = function(editor) {
        return editor.getParam('image_uploadtab', true, 'boolean');
    };
    const getPrependUrl = function(editor) {
        return editor.getParam('image_prepend_url', '', 'string');
    };
    const getClassList = function(editor) {
        return editor.getParam('image_class_list');
    };
    const hasDescription = function(editor) {
        return editor.getParam('image_description', true, 'boolean');
    };
    const hasImageTitle = function(editor) {
        return editor.getParam('image_title', false, 'boolean');
    };
    const hasImageCaption = function(editor) {
        return editor.getParam('image_caption', false, 'boolean');
    };
    const getImageList = function(editor) {
        return editor.getParam('image_list', false);
    };
    const hasUploadUrl = function(editor) {
        return !!getUploadUrl(editor);
    };
    const hasUploadHandler = function(editor) {
        return !!getUploadHandler(editor);
    };
    var getUploadUrl = function(editor) {
        return editor.getParam('images_upload_url', '', 'string');
    };
    var getUploadHandler = function(editor) {
        return editor.getParam('images_upload_handler', undefined, 'function');
    };
    const getUploadBasePath = function(editor) {
        return editor.getParam('images_upload_base_path', undefined, 'string');
    };
    const getUploadCredentials = function(editor) {
        return editor.getParam('images_upload_credentials', false, 'boolean');
    };
    const isAutomaticUploadsEnabled = function(editor) {
        return editor.getParam('automatic_uploads', true, 'boolean');
    };
    const Settings = {
        hasDimensions,
        hasUploadTab,
        hasAdvTab,
        getPrependUrl,
        getClassList,
        hasDescription,
        hasImageTitle,
        hasImageCaption,
        getImageList,
        hasUploadUrl,
        hasUploadHandler,
        getUploadUrl,
        getUploadHandler,
        getUploadBasePath,
        getUploadCredentials,
        isAutomaticUploadsEnabled,
    };

    const parseIntAndGetMax = function(val1, val2) {
        return Math.max(parseInt(val1, 10), parseInt(val2, 10));
    };
    const getImageSize = function(url, callback) {
        const img = domGlobals.document.createElement('img');
        const done = function(dimensions) {
            if (img.parentNode) {
                img.parentNode.removeChild(img);
            }
            callback(dimensions);
        };
        img.onload = function() {
            const width = parseIntAndGetMax(img.width, img.clientWidth);
            const height = parseIntAndGetMax(img.height, img.clientHeight);
            const dimensions = {
                width,
                height,
            };
            done(Result.value(dimensions));
        };
        img.onerror = function() {
            done(Result.error(`Failed to get image dimensions for: ${url}`));
        };
        const { style } = img;
        style.visibility = 'hidden';
        style.position = 'fixed';
        style.bottom = style.left = '0px';
        style.width = style.height = 'auto';
        domGlobals.document.body.appendChild(img);
        img.src = url;
    };
    const removePixelSuffix = function(value) {
        if (value) {
            value = value.replace(/px$/, '');
        }
        return value;
    };
    const addPixelSuffix = function(value) {
        if (value.length > 0 && /^[0-9]+$/.test(value)) {
            value += 'px';
        }
        return value;
    };
    const mergeMargins = function(css) {
        if (css.margin) {
            const splitMargin = String(css.margin).split(' ');
            switch (splitMargin.length) {
                case 1:
                    css['margin-top'] = css['margin-top'] || splitMargin[0];
                    css['margin-right'] = css['margin-right'] || splitMargin[0];
                    css['margin-bottom'] =
                        css['margin-bottom'] || splitMargin[0];
                    css['margin-left'] = css['margin-left'] || splitMargin[0];
                    break;
                case 2:
                    css['margin-top'] = css['margin-top'] || splitMargin[0];
                    css['margin-right'] = css['margin-right'] || splitMargin[1];
                    css['margin-bottom'] =
                        css['margin-bottom'] || splitMargin[0];
                    css['margin-left'] = css['margin-left'] || splitMargin[1];
                    break;
                case 3:
                    css['margin-top'] = css['margin-top'] || splitMargin[0];
                    css['margin-right'] = css['margin-right'] || splitMargin[1];
                    css['margin-bottom'] =
                        css['margin-bottom'] || splitMargin[2];
                    css['margin-left'] = css['margin-left'] || splitMargin[1];
                    break;
                case 4:
                    css['margin-top'] = css['margin-top'] || splitMargin[0];
                    css['margin-right'] = css['margin-right'] || splitMargin[1];
                    css['margin-bottom'] =
                        css['margin-bottom'] || splitMargin[2];
                    css['margin-left'] = css['margin-left'] || splitMargin[3];
            }
            delete css.margin;
        }
        return css;
    };
    const createImageList = function(editor, callback) {
        const imageList = Settings.getImageList(editor);
        if (typeof imageList === 'string') {
            global$4.send({
                url: imageList,
                success(text) {
                    callback(JSON.parse(text));
                },
            });
        } else if (typeof imageList === 'function') {
            imageList(callback);
        } else {
            callback(imageList);
        }
    };
    const waitLoadImage = function(editor, data, imgElm) {
        const selectImage = function() {
            imgElm.onload = imgElm.onerror = null;
            if (editor.selection) {
                editor.selection.select(imgElm);
                editor.nodeChanged();
            }
        };
        imgElm.onload = function() {
            if (!data.width && !data.height && Settings.hasDimensions(editor)) {
                editor.dom.setAttribs(imgElm, {
                    width: String(imgElm.clientWidth),
                    height: String(imgElm.clientHeight),
                });
            }
            selectImage();
        };
        imgElm.onerror = selectImage;
    };
    const blobToDataUri = function(blob) {
        return new global$3(function(resolve, reject) {
            const reader = new domGlobals.FileReader();
            reader.onload = function() {
                resolve(reader.result);
            };
            reader.onerror = function() {
                reject(reader.error.message);
            };
            reader.readAsDataURL(blob);
        });
    };
    const isPlaceholderImage = function(imgElm) {
        return (
            imgElm.nodeName === 'IMG' &&
            (imgElm.hasAttribute('data-mce-object') ||
                imgElm.hasAttribute('data-mce-placeholder'))
        );
    };
    const Utils = {
        getImageSize,
        removePixelSuffix,
        addPixelSuffix,
        mergeMargins,
        createImageList,
        waitLoadImage,
        blobToDataUri,
        isPlaceholderImage,
    };

    const { DOM } = global$2;
    const getHspace = function(image) {
        if (
            image.style.marginLeft &&
            image.style.marginRight &&
            image.style.marginLeft === image.style.marginRight
        ) {
            return Utils.removePixelSuffix(image.style.marginLeft);
        }
        return '';
    };
    const getVspace = function(image) {
        if (
            image.style.marginTop &&
            image.style.marginBottom &&
            image.style.marginTop === image.style.marginBottom
        ) {
            return Utils.removePixelSuffix(image.style.marginTop);
        }
        return '';
    };
    const getBorder = function(image) {
        if (image.style.borderWidth) {
            return Utils.removePixelSuffix(image.style.borderWidth);
        }
        return '';
    };
    const getAttrib = function(image, name) {
        if (image.hasAttribute(name)) {
            return image.getAttribute(name);
        }
        return '';
    };
    const getStyle = function(image, name) {
        return image.style[name] ? image.style[name] : '';
    };
    const hasCaption = function(image) {
        return (
            image.parentNode !== null && image.parentNode.nodeName === 'FIGURE'
        );
    };
    const setAttrib = function(image, name, value) {
        image.setAttribute(name, value);
    };
    const wrapInFigure = function(image) {
        const figureElm = DOM.create('figure', { class: 'image' });
        DOM.insertAfter(figureElm, image);
        figureElm.appendChild(image);
        figureElm.appendChild(
            DOM.create('figcaption', { contentEditable: 'true' }, 'Caption'),
        );
        figureElm.contentEditable = 'false';
    };
    const removeFigure = function(image) {
        const figureElm = image.parentNode;
        DOM.insertAfter(image, figureElm);
        DOM.remove(figureElm);
    };
    const toggleCaption = function(image) {
        if (hasCaption(image)) {
            removeFigure(image);
        } else {
            wrapInFigure(image);
        }
    };
    const normalizeStyle = function(image, normalizeCss) {
        const attrValue = image.getAttribute('style');
        const value = normalizeCss(attrValue !== null ? attrValue : '');
        if (value.length > 0) {
            image.setAttribute('style', value);
            image.setAttribute('data-mce-style', value);
        } else {
            image.removeAttribute('style');
        }
    };
    const setSize = function(name, normalizeCss) {
        return function(image, name, value) {
            if (image.style[name]) {
                image.style[name] = Utils.addPixelSuffix(value);
                normalizeStyle(image, normalizeCss);
            } else {
                setAttrib(image, name, value);
            }
        };
    };
    const getSize = function(image, name) {
        if (image.style[name]) {
            return Utils.removePixelSuffix(image.style[name]);
        }
        return getAttrib(image, name);
    };
    const setHspace = function(image, value) {
        const pxValue = Utils.addPixelSuffix(value);
        image.style.marginLeft = pxValue;
        image.style.marginRight = pxValue;
    };
    const setVspace = function(image, value) {
        const pxValue = Utils.addPixelSuffix(value);
        image.style.marginTop = pxValue;
        image.style.marginBottom = pxValue;
    };
    const setBorder = function(image, value) {
        const pxValue = Utils.addPixelSuffix(value);
        image.style.borderWidth = pxValue;
    };
    const setBorderStyle = function(image, value) {
        image.style.borderStyle = value;
    };
    const getBorderStyle = function(image) {
        return getStyle(image, 'borderStyle');
    };
    const isFigure = function(elm) {
        return elm.nodeName === 'FIGURE';
    };
    const isImage = function(elm) {
        return elm.nodeName === 'IMG';
    };
    const defaultData = function() {
        return {
            src: '',
            alt: '',
            title: '',
            width: '',
            height: '',
            class: '',
            style: '',
            caption: false,
            hspace: '',
            vspace: '',
            border: '',
            borderStyle: '',
        };
    };
    const getStyleValue = function(normalizeCss, data) {
        const image = domGlobals.document.createElement('img');
        setAttrib(image, 'style', data.style);
        if (getHspace(image) || data.hspace !== '') {
            setHspace(image, data.hspace);
        }
        if (getVspace(image) || data.vspace !== '') {
            setVspace(image, data.vspace);
        }
        if (getBorder(image) || data.border !== '') {
            setBorder(image, data.border);
        }
        if (getBorderStyle(image) || data.borderStyle !== '') {
            setBorderStyle(image, data.borderStyle);
        }
        return normalizeCss(image.getAttribute('style'));
    };
    const create = function(normalizeCss, data) {
        const image = domGlobals.document.createElement('img');
        write(normalizeCss, merge(data, { caption: false }), image);
        setAttrib(image, 'alt', data.alt);
        if (data.caption) {
            const figure = DOM.create('figure', { class: 'image' });
            figure.appendChild(image);
            figure.appendChild(
                DOM.create(
                    'figcaption',
                    { contentEditable: 'true' },
                    'Caption',
                ),
            );
            figure.contentEditable = 'false';
            return figure;
        }
        return image;
    };
    const read = function(normalizeCss, image) {
        return {
            src: getAttrib(image, 'src'),
            alt: getAttrib(image, 'alt'),
            title: getAttrib(image, 'title'),
            width: getSize(image, 'width'),
            height: getSize(image, 'height'),
            class: getAttrib(image, 'class'),
            style: normalizeCss(getAttrib(image, 'style')),
            caption: hasCaption(image),
            hspace: getHspace(image),
            vspace: getVspace(image),
            border: getBorder(image),
            borderStyle: getStyle(image, 'borderStyle'),
        };
    };
    const updateProp = function(image, oldData, newData, name, set) {
        if (newData[name] !== oldData[name]) {
            set(image, name, newData[name]);
        }
    };
    const normalized = function(set, normalizeCss) {
        return function(image, name, value) {
            set(image, value);
            normalizeStyle(image, normalizeCss);
        };
    };
    var write = function(normalizeCss, newData, image) {
        const oldData = read(normalizeCss, image);
        updateProp(image, oldData, newData, 'caption', function(
            image,
            _name,
            _value,
        ) {
            return toggleCaption(image);
        });
        updateProp(image, oldData, newData, 'src', setAttrib);
        updateProp(image, oldData, newData, 'alt', setAttrib);
        updateProp(image, oldData, newData, 'title', setAttrib);
        updateProp(
            image,
            oldData,
            newData,
            'width',
            setSize('width', normalizeCss),
        );
        updateProp(
            image,
            oldData,
            newData,
            'height',
            setSize('height', normalizeCss),
        );
        updateProp(image, oldData, newData, 'class', setAttrib);
        updateProp(
            image,
            oldData,
            newData,
            'style',
            normalized(function(image, value) {
                return setAttrib(image, 'style', value);
            }, normalizeCss),
        );
        updateProp(
            image,
            oldData,
            newData,
            'hspace',
            normalized(setHspace, normalizeCss),
        );
        updateProp(
            image,
            oldData,
            newData,
            'vspace',
            normalized(setVspace, normalizeCss),
        );
        updateProp(
            image,
            oldData,
            newData,
            'border',
            normalized(setBorder, normalizeCss),
        );
        updateProp(
            image,
            oldData,
            newData,
            'borderStyle',
            normalized(setBorderStyle, normalizeCss),
        );
    };

    const normalizeCss = function(editor, cssText) {
        const css = editor.dom.styles.parse(cssText);
        const mergedCss = Utils.mergeMargins(css);
        const compressed = editor.dom.styles.parse(
            editor.dom.styles.serialize(mergedCss),
        );
        return editor.dom.styles.serialize(compressed);
    };
    const getSelectedImage = function(editor) {
        const imgElm = editor.selection.getNode();
        const figureElm = editor.dom.getParent(imgElm, 'figure.image');
        if (figureElm) {
            return editor.dom.select('img', figureElm)[0];
        }
        if (
            imgElm &&
            (imgElm.nodeName !== 'IMG' || Utils.isPlaceholderImage(imgElm))
        ) {
            return null;
        }
        return imgElm;
    };
    const splitTextBlock = function(editor, figure) {
        const { dom } = editor;
        const textBlock = dom.getParent(
            figure.parentNode,
            function(node) {
                return editor.schema.getTextBlockElements()[node.nodeName];
            },
            editor.getBody(),
        );
        if (textBlock) {
            return dom.split(textBlock, figure);
        }
        return figure;
    };
    const readImageDataFromSelection = function(editor) {
        const image = getSelectedImage(editor);
        return image
            ? read(function(css) {
                  return normalizeCss(editor, css);
              }, image)
            : defaultData();
    };
    const insertImageAtCaret = function(editor, data) {
        const elm = create(function(css) {
            return normalizeCss(editor, css);
        }, data);
        editor.dom.setAttrib(elm, 'data-mce-id', '__mcenew');
        editor.focus();
        editor.selection.setContent(elm.outerHTML);
        const insertedElm = editor.dom.select('*[data-mce-id="__mcenew"]')[0];
        editor.dom.setAttrib(insertedElm, 'data-mce-id', null);
        if (isFigure(insertedElm)) {
            const figure = splitTextBlock(editor, insertedElm);
            editor.selection.select(figure);
        } else {
            editor.selection.select(insertedElm);
        }
    };
    const syncSrcAttr = function(editor, image) {
        editor.dom.setAttrib(image, 'src', image.getAttribute('src'));
    };
    const deleteImage = function(editor, image) {
        if (image) {
            const elm = editor.dom.is(image.parentNode, 'figure.image')
                ? image.parentNode
                : image;
            editor.dom.remove(elm);
            editor.focus();
            editor.nodeChanged();
            if (editor.dom.isEmpty(editor.getBody())) {
                editor.setContent('');
                editor.selection.setCursorLocation();
            }
        }
    };
    const writeImageDataToSelection = function(editor, data) {
        const image = getSelectedImage(editor);
        write(
            function(css) {
                return normalizeCss(editor, css);
            },
            data,
            image,
        );
        syncSrcAttr(editor, image);
        if (isFigure(image.parentNode)) {
            const figure = image.parentNode;
            splitTextBlock(editor, figure);
            editor.selection.select(image.parentNode);
        } else {
            editor.selection.select(image);
            Utils.waitLoadImage(editor, data, image);
        }
    };
    const insertOrUpdateImage = function(editor, data) {
        const image = getSelectedImage(editor);
        if (image) {
            if (data.src) {
                writeImageDataToSelection(editor, data);
            } else {
                deleteImage(editor, image);
            }
        } else if (data.src) {
            insertImageAtCaret(editor, data);
        }
    };

    const findMap = function(arr, f) {
        for (let i = 0; i < arr.length; i++) {
            const r = f(arr[i], i);
            if (r.isSome()) {
                return r;
            }
        }
        return Option.none();
    };

    const global$5 = tinymce.util.Tools.resolve('tinymce.util.Tools');

    const getValue = function(item) {
        return isString(item.value) ? item.value : '';
    };
    var sanitizeList = function(list, extractValue) {
        const out = [];
        global$5.each(list, function(item) {
            const text = isString(item.text)
                ? item.text
                : isString(item.title)
                ? item.title
                : '';
            if (item.menu !== undefined) {
                const items = sanitizeList(item.menu, extractValue);
                out.push({
                    text,
                    items,
                });
            } else {
                const value = extractValue(item);
                out.push({
                    text,
                    value,
                });
            }
        });
        return out;
    };
    const sanitizer = function(extracter) {
        if (extracter === void 0) {
            extracter = getValue;
        }
        return function(list) {
            if (list) {
                return Option.from(list).map(function(list) {
                    return sanitizeList(list, extracter);
                });
            }
            return Option.none();
        };
    };
    const sanitize = function(list) {
        return sanitizer(getValue)(list);
    };
    const isGroup = function(item) {
        return Object.prototype.hasOwnProperty.call(item, 'items');
    };
    var findEntryDelegate = function(list, value) {
        return findMap(list, function(item) {
            if (isGroup(item)) {
                return findEntryDelegate(item.items, value);
            }
            if (item.value === value) {
                return Option.some(item);
            }
            return Option.none();
        });
    };
    const findEntry = function(optList, value) {
        return optList.bind(function(list) {
            return findEntryDelegate(list, value);
        });
    };
    const ListUtils = {
        sanitizer,
        sanitize,
        findEntry,
    };

    const pathJoin = function(path1, path2) {
        if (path1) {
            return `${path1.replace(/\/$/, '')}/${path2.replace(/^\//, '')}`;
        }
        return path2;
    };
    function Uploader(settings) {
        const defaultHandler = function(blobInfo, success, failure, progress) {
            let xhr;
            let formData;
            xhr = new domGlobals.XMLHttpRequest();
            xhr.open('POST', settings.url);
            xhr.withCredentials = settings.credentials;
            xhr.upload.onprogress = function(e) {
                progress((e.loaded / e.total) * 100);
            };
            xhr.onerror = function() {
                failure(
                    `Image upload failed due to a XHR Transport error. Code: ${xhr.status}`,
                );
            };
            xhr.onload = function() {
                let json;
                if (xhr.status < 200 || xhr.status >= 300) {
                    failure(`HTTP Error: ${xhr.status}`);
                    return;
                }
                json = JSON.parse(xhr.responseText);
                if (!json || typeof json.location !== 'string') {
                    failure(`Invalid JSON: ${xhr.responseText}`);
                    return;
                }
                success(pathJoin(settings.basePath, json.location));
            };
            formData = new domGlobals.FormData();
            formData.append('file', blobInfo.blob(), blobInfo.filename());
            xhr.send(formData);
        };
        const uploadBlob = function(blobInfo, handler) {
            return new global$3(function(resolve, reject) {
                try {
                    handler(blobInfo, resolve, reject, noop);
                } catch (ex) {
                    reject(ex.message);
                }
            });
        };
        const isDefaultHandler = function(handler) {
            return handler === defaultHandler;
        };
        const upload = function(blobInfo) {
            return !settings.url && isDefaultHandler(settings.handler)
                ? global$3.reject('Upload url missing from the settings.')
                : uploadBlob(blobInfo, settings.handler);
        };
        settings = global$5.extend(
            {
                credentials: false,
                handler: defaultHandler,
            },
            settings,
        );
        return { upload };
    }

    const makeTab = function(info) {
        return {
            title: 'Advanced',
            name: 'advanced',
            items: [
                {
                    type: 'input',
                    label: 'Style',
                    name: 'style',
                },
                {
                    type: 'grid',
                    columns: 2,
                    items: [
                        {
                            type: 'input',
                            label: 'Vertical space',
                            name: 'vspace',
                            inputMode: 'numeric',
                        },
                        {
                            type: 'input',
                            label: 'Horizontal space',
                            name: 'hspace',
                            inputMode: 'numeric',
                        },
                        {
                            type: 'input',
                            label: 'Border width',
                            name: 'border',
                            inputMode: 'numeric',
                        },
                        {
                            type: 'selectbox',
                            name: 'borderstyle',
                            label: 'Border style',
                            items: [
                                {
                                    text: 'Select...',
                                    value: '',
                                },
                                {
                                    text: 'Solid',
                                    value: 'solid',
                                },
                                {
                                    text: 'Dotted',
                                    value: 'dotted',
                                },
                                {
                                    text: 'Dashed',
                                    value: 'dashed',
                                },
                                {
                                    text: 'Double',
                                    value: 'double',
                                },
                                {
                                    text: 'Groove',
                                    value: 'groove',
                                },
                                {
                                    text: 'Ridge',
                                    value: 'ridge',
                                },
                                {
                                    text: 'Inset',
                                    value: 'inset',
                                },
                                {
                                    text: 'Outset',
                                    value: 'outset',
                                },
                                {
                                    text: 'None',
                                    value: 'none',
                                },
                                {
                                    text: 'Hidden',
                                    value: 'hidden',
                                },
                            ],
                        },
                    ],
                },
            ],
        };
    };
    const AdvTab = { makeTab };

    const collect = function(editor) {
        const urlListSanitizer = ListUtils.sanitizer(function(item) {
            return editor.convertURL(item.value || item.url, 'src');
        });
        const futureImageList = Future.nu(function(completer) {
            Utils.createImageList(editor, function(imageList) {
                completer(
                    urlListSanitizer(imageList).map(function(items) {
                        return flatten([
                            [
                                {
                                    text: 'None',
                                    value: '',
                                },
                            ],
                            items,
                        ]);
                    }),
                );
            });
        });
        const classList = ListUtils.sanitize(Settings.getClassList(editor));
        const hasAdvTab = Settings.hasAdvTab(editor);
        const hasUploadTab = Settings.hasUploadTab(editor);
        const hasUploadUrl = Settings.hasUploadUrl(editor);
        const hasUploadHandler = Settings.hasUploadHandler(editor);
        const image = readImageDataFromSelection(editor);
        const hasDescription = Settings.hasDescription(editor);
        const hasImageTitle = Settings.hasImageTitle(editor);
        const hasDimensions = Settings.hasDimensions(editor);
        const hasImageCaption = Settings.hasImageCaption(editor);
        const url = Settings.getUploadUrl(editor);
        const basePath = Settings.getUploadBasePath(editor);
        const credentials = Settings.getUploadCredentials(editor);
        const handler = Settings.getUploadHandler(editor);
        const automaticUploads = Settings.isAutomaticUploadsEnabled(editor);
        const prependURL = Option.some(Settings.getPrependUrl(editor)).filter(
            function(preUrl) {
                return isString(preUrl) && preUrl.length > 0;
            },
        );
        return futureImageList.map(function(imageList) {
            return {
                image,
                imageList,
                classList,
                hasAdvTab,
                hasUploadTab,
                hasUploadUrl,
                hasUploadHandler,
                hasDescription,
                hasImageTitle,
                hasDimensions,
                hasImageCaption,
                url,
                basePath,
                credentials,
                handler,
                automaticUploads,
                prependURL,
            };
        });
    };

    const makeItems = function(info) {
        const imageUrl = {
            name: 'src',
            type: 'urlinput',
            filetype: 'image',
            label: 'Source',
        };
        const imageList = info.imageList.map(function(items) {
            return {
                name: 'images',
                type: 'selectbox',
                label: 'Image list',
                items,
            };
        });
        const imageDescription = {
            name: 'alt',
            type: 'input',
            label: 'Image description',
        };
        const imageTitle = {
            name: 'title',
            type: 'input',
            label: 'Image title',
        };
        const imageDimensions = {
            name: 'dimensions',
            type: 'sizeinput',
        };
        const classList = info.classList.map(function(items) {
            return {
                name: 'classes',
                type: 'selectbox',
                label: 'Class',
                items,
            };
        });
        const caption = {
            type: 'label',
            label: 'Caption',
            items: [
                {
                    type: 'checkbox',
                    name: 'caption',
                    label: 'Show caption',
                },
            ],
        };
        return flatten([
            [imageUrl],
            imageList.toArray(),
            info.hasDescription ? [imageDescription] : [],
            info.hasImageTitle ? [imageTitle] : [],
            info.hasDimensions ? [imageDimensions] : [],
            [
                {
                    type: 'grid',
                    columns: 2,
                    items: flatten([
                        classList.toArray(),
                        info.hasImageCaption ? [caption] : [],
                    ]),
                },
            ],
        ]);
    };
    const makeTab$1 = function(info) {
        return {
            title: 'General',
            name: 'general',
            items: makeItems(info),
        };
    };
    const MainTab = {
        makeTab: makeTab$1,
        makeItems,
    };

    const makeTab$2 = function(info) {
        const items = [
            {
                type: 'dropzone',
                name: 'fileinput',
            },
        ];
        return {
            title: 'Upload',
            name: 'upload',
            items,
        };
    };
    const UploadTab = { makeTab: makeTab$2 };

    const createState = function(info) {
        return {
            prevImage: ListUtils.findEntry(info.imageList, info.image.src),
            prevAlt: info.image.alt,
            open: true,
        };
    };
    const fromImageData = function(image) {
        return {
            src: {
                value: image.src,
                meta: {},
            },
            images: image.src,
            alt: image.alt,
            title: image.title,
            dimensions: {
                width: image.width,
                height: image.height,
            },
            classes: image.class,
            caption: image.caption,
            style: image.style,
            vspace: image.vspace,
            border: image.border,
            hspace: image.hspace,
            borderstyle: image.borderStyle,
            fileinput: [],
        };
    };
    const toImageData = function(data) {
        return {
            src: data.src.value,
            alt: data.alt,
            title: data.title,
            width: data.dimensions.width,
            height: data.dimensions.height,
            class: data.classes,
            style: data.style,
            caption: data.caption,
            hspace: data.hspace,
            vspace: data.vspace,
            border: data.border,
            borderStyle: data.borderstyle,
        };
    };
    const addPrependUrl2 = function(info, srcURL) {
        if (!/^(?:[a-zA-Z]+:)?\/\//.test(srcURL)) {
            return info.prependURL.bind(function(prependUrl) {
                if (srcURL.substring(0, prependUrl.length) !== prependUrl) {
                    return Option.some(prependUrl + srcURL);
                }
                return Option.none();
            });
        }
        return Option.none();
    };
    const addPrependUrl = function(info, api) {
        const data = api.getData();
        addPrependUrl2(info, data.src.value).each(function(srcURL) {
            api.setData({
                src: {
                    value: srcURL,
                    meta: data.src.meta,
                },
            });
        });
    };
    const formFillFromMeta2 = function(info, data, meta) {
        if (info.hasDescription && isString(meta.alt)) {
            data.alt = meta.alt;
        }
        if (info.hasImageTitle && isString(meta.title)) {
            data.title = meta.title;
        }
        if (info.hasDimensions) {
            if (isString(meta.width)) {
                data.dimensions.width = meta.width;
            }
            if (isString(meta.height)) {
                data.dimensions.height = meta.height;
            }
        }
        if (isString(meta.class)) {
            ListUtils.findEntry(info.classList, meta.class).each(function(
                entry,
            ) {
                data.classes = entry.value;
            });
        }
        if (info.hasImageCaption) {
            if (isBoolean(meta.caption)) {
                data.caption = meta.caption;
            }
        }
        if (info.hasAdvTab) {
            if (isString(meta.vspace)) {
                data.vspace = meta.vspace;
            }
            if (isString(meta.border)) {
                data.border = meta.border;
            }
            if (isString(meta.hspace)) {
                data.hspace = meta.hspace;
            }
            if (isString(meta.borderstyle)) {
                data.borderstyle = meta.borderstyle;
            }
        }
    };
    const formFillFromMeta = function(info, api) {
        const data = api.getData();
        const { meta } = data.src;
        if (meta !== undefined) {
            const newData = deepMerge({}, data);
            formFillFromMeta2(info, newData, meta);
            api.setData(newData);
        }
    };
    const calculateImageSize = function(helpers, info, state, api) {
        const data = api.getData();
        const url = data.src.value;
        const meta = data.src.meta || {};
        if (!meta.width && !meta.height && info.hasDimensions) {
            helpers.imageSize(url).get(function(result) {
                result.each(function(size) {
                    if (state.open) {
                        api.setData({ dimensions: size });
                    }
                });
            });
        }
    };
    const updateImagesDropdown = function(info, state, api) {
        const data = api.getData();
        const image = ListUtils.findEntry(info.imageList, data.src.value);
        state.prevImage = image;
        api.setData({
            images: image
                .map(function(entry) {
                    return entry.value;
                })
                .getOr(''),
        });
    };
    const changeSrc = function(helpers, info, state, api) {
        addPrependUrl(info, api);
        formFillFromMeta(info, api);
        calculateImageSize(helpers, info, state, api);
        updateImagesDropdown(info, state, api);
    };
    const changeImages = function(helpers, info, state, api) {
        const data = api.getData();
        const image = ListUtils.findEntry(info.imageList, data.images);
        image.each(function(img) {
            const updateAlt =
                data.alt === '' ||
                state.prevImage
                    .map(function(image) {
                        return image.text === data.alt;
                    })
                    .getOr(false);
            if (updateAlt) {
                if (img.value === '') {
                    api.setData({
                        src: img,
                        alt: state.prevAlt,
                    });
                } else {
                    api.setData({
                        src: img,
                        alt: img.text,
                    });
                }
            } else {
                api.setData({ src: img });
            }
        });
        state.prevImage = image;
        changeSrc(helpers, info, state, api);
    };
    const calcVSpace = function(css) {
        const matchingTopBottom =
            css['margin-top'] &&
            css['margin-bottom'] &&
            css['margin-top'] === css['margin-bottom'];
        return matchingTopBottom
            ? Utils.removePixelSuffix(String(css['margin-top']))
            : '';
    };
    const calcHSpace = function(css) {
        const matchingLeftRight =
            css['margin-right'] &&
            css['margin-left'] &&
            css['margin-right'] === css['margin-left'];
        return matchingLeftRight
            ? Utils.removePixelSuffix(String(css['margin-right']))
            : '';
    };
    const calcBorderWidth = function(css) {
        return css['border-width']
            ? Utils.removePixelSuffix(String(css['border-width']))
            : '';
    };
    const calcBorderStyle = function(css) {
        return css['border-style'] ? String(css['border-style']) : '';
    };
    const calcStyle = function(parseStyle, serializeStyle, css) {
        return serializeStyle(parseStyle(serializeStyle(css)));
    };
    const changeStyle2 = function(parseStyle, serializeStyle, data) {
        const css = Utils.mergeMargins(parseStyle(data.style));
        const dataCopy = deepMerge({}, data);
        dataCopy.vspace = calcVSpace(css);
        dataCopy.hspace = calcHSpace(css);
        dataCopy.border = calcBorderWidth(css);
        dataCopy.borderstyle = calcBorderStyle(css);
        dataCopy.style = calcStyle(parseStyle, serializeStyle, css);
        return dataCopy;
    };
    const changeStyle = function(helpers, api) {
        const data = api.getData();
        const newData = changeStyle2(
            helpers.parseStyle,
            helpers.serializeStyle,
            data,
        );
        api.setData(newData);
    };
    const changeAStyle = function(helpers, info, api) {
        const data = deepMerge(fromImageData(info.image), api.getData());
        const style = getStyleValue(helpers.normalizeCss, toImageData(data));
        api.setData({ style });
    };
    const changeFileInput = function(helpers, info, state, api) {
        const data = api.getData();
        api.block('Uploading image');
        head(data.fileinput).fold(
            function() {
                api.unblock();
            },
            function(file) {
                const blobUri = domGlobals.URL.createObjectURL(file);
                const uploader = Uploader({
                    url: info.url,
                    basePath: info.basePath,
                    credentials: info.credentials,
                    handler: info.handler,
                });
                const finalize = function() {
                    api.unblock();
                    domGlobals.URL.revokeObjectURL(blobUri);
                };
                const updateSrcAndSwitchTab = function(url) {
                    api.setData({
                        src: {
                            value: url,
                            meta: {},
                        },
                    });
                    api.showTab('general');
                    changeSrc(helpers, info, state, api);
                };
                Utils.blobToDataUri(file).then(function(dataUrl) {
                    const blobInfo = helpers.createBlobCache(
                        file,
                        blobUri,
                        dataUrl,
                    );
                    if (info.automaticUploads) {
                        uploader
                            .upload(blobInfo)
                            .then(function(url) {
                                updateSrcAndSwitchTab(url);
                                finalize();
                            })
                            .catch(function(err) {
                                finalize();
                                helpers.alertErr(api, err);
                            });
                    } else {
                        helpers.addToBlobCache(blobInfo);
                        updateSrcAndSwitchTab(blobInfo.blobUri());
                        api.unblock();
                    }
                });
            },
        );
    };
    const changeHandler = function(helpers, info, state) {
        return function(api, evt) {
            if (evt.name === 'src') {
                changeSrc(helpers, info, state, api);
            } else if (evt.name === 'images') {
                changeImages(helpers, info, state, api);
            } else if (evt.name === 'alt') {
                state.prevAlt = api.getData().alt;
            } else if (evt.name === 'style') {
                changeStyle(helpers, api);
            } else if (
                evt.name === 'vspace' ||
                evt.name === 'hspace' ||
                evt.name === 'border' ||
                evt.name === 'borderstyle'
            ) {
                changeAStyle(helpers, info, api);
            } else if (evt.name === 'fileinput') {
                changeFileInput(helpers, info, state, api);
            }
        };
    };
    const closeHandler = function(state) {
        return function() {
            state.open = false;
        };
    };
    const makeDialogBody = function(info) {
        if (info.hasAdvTab || info.hasUploadUrl || info.hasUploadHandler) {
            const tabPanel = {
                type: 'tabpanel',
                tabs: flatten([
                    [MainTab.makeTab(info)],
                    info.hasAdvTab ? [AdvTab.makeTab(info)] : [],
                    info.hasUploadTab &&
                    (info.hasUploadUrl || info.hasUploadHandler)
                        ? [UploadTab.makeTab(info)]
                        : [],
                ]),
            };
            return tabPanel;
        }
        const panel = {
            type: 'panel',
            items: MainTab.makeItems(info),
        };
        return panel;
    };
    const makeDialog = function(helpers) {
        return function(info) {
            const state = createState(info);
            return {
                title: 'Insert/Edit Image',
                size: 'normal',
                body: makeDialogBody(info),
                buttons: [
                    {
                        type: 'cancel',
                        name: 'cancel',
                        text: 'Cancel',
                    },
                    {
                        type: 'submit',
                        name: 'save',
                        text: 'Save',
                        primary: true,
                    },
                ],
                initialData: fromImageData(info.image),
                onSubmit: helpers.onSubmit(info),
                onChange: changeHandler(helpers, info, state),
                onClose: closeHandler(state),
            };
        };
    };
    const submitHandler = function(editor) {
        return function(info) {
            return function(api) {
                const data = deepMerge(
                    fromImageData(info.image),
                    api.getData(),
                );
                editor.undoManager.transact(function() {
                    insertOrUpdateImage(editor, toImageData(data));
                });
                editor.editorUpload.uploadImagesAuto();
                api.close();
            };
        };
    };
    const imageSize = function(editor) {
        return function(url) {
            return FutureResult.nu(function(completer) {
                Utils.getImageSize(
                    editor.documentBaseURI.toAbsolute(url),
                    function(data) {
                        const result = data.map(function(dimensions) {
                            return {
                                width: String(dimensions.width),
                                height: String(dimensions.height),
                            };
                        });
                        completer(result);
                    },
                );
            });
        };
    };
    const createBlobCache = function(editor) {
        return function(file, blobUri, dataUrl) {
            return editor.editorUpload.blobCache.create({
                blob: file,
                blobUri,
                name: file.name ? file.name.replace(/\.[^\.]+$/, '') : null,
                base64: dataUrl.split(',')[1],
            });
        };
    };
    const addToBlobCache = function(editor) {
        return function(blobInfo) {
            editor.editorUpload.blobCache.add(blobInfo);
        };
    };
    const alertErr = function(editor) {
        return function(api, message) {
            editor.windowManager.alert(message, api.close);
        };
    };
    const normalizeCss$1 = function(editor) {
        return function(cssText) {
            return normalizeCss(editor, cssText);
        };
    };
    const parseStyle = function(editor) {
        return function(cssText) {
            return editor.dom.parseStyle(cssText);
        };
    };
    const serializeStyle = function(editor) {
        return function(stylesArg, name) {
            return editor.dom.serializeStyle(stylesArg, name);
        };
    };
    const Dialog = function(editor) {
        const helpers = {
            onSubmit: submitHandler(editor),
            imageSize: imageSize(editor),
            addToBlobCache: addToBlobCache(editor),
            createBlobCache: createBlobCache(editor),
            alertErr: alertErr(editor),
            normalizeCss: normalizeCss$1(editor),
            parseStyle: parseStyle(editor),
            serializeStyle: serializeStyle(editor),
        };
        const open = function() {
            return collect(editor)
                .map(makeDialog(helpers))
                .get(function(spec) {
                    editor.windowManager.open(spec);
                });
        };
        return { open };
    };

    const register = function(editor) {
        editor.addCommand('mceImage', Dialog(editor).open);
    };
    const Commands = { register };

    const hasImageClass = function(node) {
        const className = node.attr('class');
        return className && /\bimage\b/.test(className);
    };
    const toggleContentEditableState = function(state) {
        return function(nodes) {
            let i = nodes.length;
            const toggleContentEditable = function(node) {
                node.attr('contenteditable', state ? 'true' : null);
            };
            while (i--) {
                const node = nodes[i];
                if (hasImageClass(node)) {
                    node.attr('contenteditable', state ? 'false' : null);
                    global$5.each(
                        node.getAll('figcaption'),
                        toggleContentEditable,
                    );
                }
            }
        };
    };
    const setup = function(editor) {
        editor.on('PreInit', function() {
            editor.parser.addNodeFilter(
                'figure',
                toggleContentEditableState(true),
            );
            editor.serializer.addNodeFilter(
                'figure',
                toggleContentEditableState(false),
            );
        });
    };
    const FilterContent = { setup };

    const register$1 = function(editor) {
        editor.ui.registry.addToggleButton('image', {
            icon: 'image',
            tooltip: 'Insert/edit image',
            onAction: Dialog(editor).open,
            onSetup(buttonApi) {
                return editor.selection.selectorChangedWithUnbind(
                    'img:not([data-mce-object],[data-mce-placeholder]),figure.image',
                    buttonApi.setActive,
                ).unbind;
            },
        });
        editor.ui.registry.addMenuItem('image', {
            icon: 'image',
            text: 'Image...',
            onAction: Dialog(editor).open,
        });
        editor.ui.registry.addContextMenu('image', {
            update(element) {
                return isFigure(element) ||
                    (isImage(element) && !Utils.isPlaceholderImage(element))
                    ? ['image']
                    : [];
            },
        });
    };
    const Buttons = { register: register$1 };

    function Plugin() {
        global$1.add('image', function(editor) {
            FilterContent.setup(editor);
            Buttons.register(editor);
            Commands.register(editor);
        });
    }

    Plugin();
})(window);
