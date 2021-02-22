/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 *
 * Version: 5.1.6 (2020-01-28)
 */
(function(domGlobals) {
    var Cell = function(initial) {
        let value = initial;
        const get = function() {
            return value;
        };
        const set = function(v) {
            value = v;
        };
        const clone = function() {
            return Cell(get());
        };
        return {
            get,
            set,
            clone,
        };
    };

    const global = tinymce.util.Tools.resolve('tinymce.PluginManager');

    const global$1 = tinymce.util.Tools.resolve('tinymce.util.Tools');

    const noop = function() {};
    const constant = function(value) {
        return function() {
            return value;
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

    function create(width, height) {
        return resize(
            domGlobals.document.createElement('canvas'),
            width,
            height,
        );
    }
    function clone(canvas) {
        const tCanvas = create(canvas.width, canvas.height);
        const ctx = get2dContext(tCanvas);
        ctx.drawImage(canvas, 0, 0);
        return tCanvas;
    }
    function get2dContext(canvas) {
        return canvas.getContext('2d');
    }
    function resize(canvas, width, height) {
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }

    function getWidth(image) {
        return image.naturalWidth || image.width;
    }
    function getHeight(image) {
        return image.naturalHeight || image.height;
    }

    const promise = function() {
        const Promise = function(fn) {
            if (typeof this !== 'object') {
                throw new TypeError('Promises must be constructed via new');
            }
            if (typeof fn !== 'function') {
                throw new TypeError('not a function');
            }
            this._state = null;
            this._value = null;
            this._deferreds = [];
            doResolve(fn, bind(resolve, this), bind(reject, this));
        };
        const asap =
            Promise.immediateFn ||
            (typeof window.setImmediate === 'function' &&
                window.setImmediate) ||
            function(fn) {
                domGlobals.setTimeout(fn, 1);
            };
        function bind(fn, thisArg) {
            return function() {
                return fn.apply(thisArg, arguments);
            };
        }
        const isArray =
            Array.isArray ||
            function(value) {
                return (
                    Object.prototype.toString.call(value) === '[object Array]'
                );
            };
        function handle(deferred) {
            const me = this;
            if (this._state === null) {
                this._deferreds.push(deferred);
                return;
            }
            asap(function() {
                const cb = me._state
                    ? deferred.onFulfilled
                    : deferred.onRejected;
                if (cb === null) {
                    (me._state ? deferred.resolve : deferred.reject)(me._value);
                    return;
                }
                let ret;
                try {
                    ret = cb(me._value);
                } catch (e) {
                    deferred.reject(e);
                    return;
                }
                deferred.resolve(ret);
            });
        }
        function resolve(newValue) {
            try {
                if (newValue === this) {
                    throw new TypeError(
                        'A promise cannot be resolved with itself.',
                    );
                }
                if (
                    newValue &&
                    (typeof newValue === 'object' ||
                        typeof newValue === 'function')
                ) {
                    const { then } = newValue;
                    if (typeof then === 'function') {
                        doResolve(
                            bind(then, newValue),
                            bind(resolve, this),
                            bind(reject, this),
                        );
                        return;
                    }
                }
                this._state = true;
                this._value = newValue;
                finale.call(this);
            } catch (e) {
                reject.call(this, e);
            }
        }
        function reject(newValue) {
            this._state = false;
            this._value = newValue;
            finale.call(this);
        }
        function finale() {
            for (let _i = 0, _a = this._deferreds; _i < _a.length; _i++) {
                const deferred = _a[_i];
                handle.call(this, deferred);
            }
            this._deferreds = [];
        }
        function Handler(onFulfilled, onRejected, resolve, reject) {
            this.onFulfilled =
                typeof onFulfilled === 'function' ? onFulfilled : null;
            this.onRejected =
                typeof onRejected === 'function' ? onRejected : null;
            this.resolve = resolve;
            this.reject = reject;
        }
        function doResolve(fn, onFulfilled, onRejected) {
            let done = false;
            try {
                fn(
                    function(value) {
                        if (done) {
                            return;
                        }
                        done = true;
                        onFulfilled(value);
                    },
                    function(reason) {
                        if (done) {
                            return;
                        }
                        done = true;
                        onRejected(reason);
                    },
                );
            } catch (ex) {
                if (done) {
                    return;
                }
                done = true;
                onRejected(ex);
            }
        }
        Promise.prototype.catch = function(onRejected) {
            return this.then(null, onRejected);
        };
        Promise.prototype.then = function(onFulfilled, onRejected) {
            const me = this;
            return new Promise(function(resolve, reject) {
                handle.call(
                    me,
                    new Handler(onFulfilled, onRejected, resolve, reject),
                );
            });
        };
        Promise.all = function() {
            const values = [];
            for (let _i = 0; _i < arguments.length; _i++) {
                values[_i] = arguments[_i];
            }
            const args = Array.prototype.slice.call(
                values.length === 1 && isArray(values[0]) ? values[0] : values,
            );
            return new Promise(function(resolve, reject) {
                if (args.length === 0) {
                    return resolve([]);
                }
                let remaining = args.length;
                function res(i, val) {
                    try {
                        if (
                            val &&
                            (typeof val === 'object' ||
                                typeof val === 'function')
                        ) {
                            const { then } = val;
                            if (typeof then === 'function') {
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
                for (let i = 0; i < args.length; i++) {
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
        Promise.reject = function(reason) {
            return new Promise(function(resolve, reject) {
                reject(reason);
            });
        };
        Promise.race = function(values) {
            return new Promise(function(resolve, reject) {
                for (
                    let _i = 0, values_1 = values;
                    _i < values_1.length;
                    _i++
                ) {
                    const value = values_1[_i];
                    value.then(resolve, reject);
                }
            });
        };
        return Promise;
    };
    const Promise = window.Promise ? window.Promise : promise();

    function imageToBlob(image) {
        const { src } = image;
        if (src.indexOf('data:') === 0) {
            return dataUriToBlob(src);
        }
        return anyUriToBlob(src);
    }
    function blobToImage(blob) {
        return new Promise(function(resolve, reject) {
            const blobUrl = domGlobals.URL.createObjectURL(blob);
            const image = new domGlobals.Image();
            const removeListeners = function() {
                image.removeEventListener('load', loaded);
                image.removeEventListener('error', error);
            };
            function loaded() {
                removeListeners();
                resolve(image);
            }
            function error() {
                removeListeners();
                reject(`Unable to load data of type ${blob.type}: ${blobUrl}`);
            }
            image.addEventListener('load', loaded);
            image.addEventListener('error', error);
            image.src = blobUrl;
            if (image.complete) {
                loaded();
            }
        });
    }
    function anyUriToBlob(url) {
        return new Promise(function(resolve, reject) {
            const xhr = new domGlobals.XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'blob';
            xhr.onload = function() {
                if (this.status === 200) {
                    resolve(this.response);
                }
            };
            xhr.onerror = function() {
                const _this = this;
                const corsError = function() {
                    const obj = new Error('No access to download image');
                    obj.code = 18;
                    obj.name = 'SecurityError';
                    return obj;
                };
                const genericError = function() {
                    return new Error(`Error ${_this.status} downloading image`);
                };
                reject(this.status === 0 ? corsError() : genericError());
            };
            xhr.send();
        });
    }
    function dataUriToBlobSync(uri) {
        const data = uri.split(',');
        const matches = /data:([^;]+)/.exec(data[0]);
        if (!matches) {
            return Option.none();
        }
        const mimetype = matches[1];
        const base64 = data[1];
        const sliceSize = 1024;
        const byteCharacters = domGlobals.atob(base64);
        const bytesLength = byteCharacters.length;
        const slicesCount = Math.ceil(bytesLength / sliceSize);
        const byteArrays = new Array(slicesCount);
        for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
            const begin = sliceIndex * sliceSize;
            const end = Math.min(begin + sliceSize, bytesLength);
            const bytes = new Array(end - begin);
            for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
                bytes[i] = byteCharacters[offset].charCodeAt(0);
            }
            byteArrays[sliceIndex] = new Uint8Array(bytes);
        }
        return Option.some(new domGlobals.Blob(byteArrays, { type: mimetype }));
    }
    function dataUriToBlob(uri) {
        return new Promise(function(resolve, reject) {
            dataUriToBlobSync(uri).fold(function() {
                reject(`uri is not base64: ${uri}`);
            }, resolve);
        });
    }
    function canvasToBlob(canvas, type, quality) {
        type = type || 'image/png';
        if (domGlobals.HTMLCanvasElement.prototype.toBlob) {
            return new Promise(function(resolve, reject) {
                canvas.toBlob(
                    function(blob) {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject();
                        }
                    },
                    type,
                    quality,
                );
            });
        }
        return dataUriToBlob(canvas.toDataURL(type, quality));
    }
    function canvasToDataURL(canvas, type, quality) {
        type = type || 'image/png';
        return canvas.toDataURL(type, quality);
    }
    function blobToCanvas(blob) {
        return blobToImage(blob).then(function(image) {
            revokeImageUrl(image);
            const canvas = create(getWidth(image), getHeight(image));
            const context = get2dContext(canvas);
            context.drawImage(image, 0, 0);
            return canvas;
        });
    }
    function blobToDataUri(blob) {
        return new Promise(function(resolve) {
            const reader = new domGlobals.FileReader();
            reader.onloadend = function() {
                resolve(reader.result);
            };
            reader.readAsDataURL(blob);
        });
    }
    function revokeImageUrl(image) {
        domGlobals.URL.revokeObjectURL(image.src);
    }

    const blobToImage$1 = function(blob) {
        return blobToImage(blob);
    };
    const imageToBlob$1 = function(image) {
        return imageToBlob(image);
    };

    function create$1(getCanvas, blob, uri) {
        const initialType = blob.type;
        const getType = constant(initialType);
        function toBlob() {
            return Promise.resolve(blob);
        }
        function toDataURL() {
            return uri;
        }
        function toBase64() {
            return uri.split(',')[1];
        }
        function toAdjustedBlob(type, quality) {
            return getCanvas.then(function(canvas) {
                return canvasToBlob(canvas, type, quality);
            });
        }
        function toAdjustedDataURL(type, quality) {
            return getCanvas.then(function(canvas) {
                return canvasToDataURL(canvas, type, quality);
            });
        }
        function toAdjustedBase64(type, quality) {
            return toAdjustedDataURL(type, quality).then(function(dataurl) {
                return dataurl.split(',')[1];
            });
        }
        function toCanvas() {
            return getCanvas.then(clone);
        }
        return {
            getType,
            toBlob,
            toDataURL,
            toBase64,
            toAdjustedBlob,
            toAdjustedDataURL,
            toAdjustedBase64,
            toCanvas,
        };
    }
    function fromBlob(blob) {
        return blobToDataUri(blob).then(function(uri) {
            return create$1(blobToCanvas(blob), blob, uri);
        });
    }
    function fromCanvas(canvas, type) {
        return canvasToBlob(canvas, type).then(function(blob) {
            return create$1(Promise.resolve(canvas), blob, canvas.toDataURL());
        });
    }

    function rotate(ir, angle) {
        return ir.toCanvas().then(function(canvas) {
            return applyRotate(canvas, ir.getType(), angle);
        });
    }
    function applyRotate(image, type, angle) {
        const canvas = create(image.width, image.height);
        const context = get2dContext(canvas);
        let translateX = 0;
        let translateY = 0;
        angle = angle < 0 ? 360 + angle : angle;
        if (angle === 90 || angle === 270) {
            resize(canvas, canvas.height, canvas.width);
        }
        if (angle === 90 || angle === 180) {
            translateX = canvas.width;
        }
        if (angle === 270 || angle === 180) {
            translateY = canvas.height;
        }
        context.translate(translateX, translateY);
        context.rotate((angle * Math.PI) / 180);
        context.drawImage(image, 0, 0);
        return fromCanvas(canvas, type);
    }
    function flip(ir, axis) {
        return ir.toCanvas().then(function(canvas) {
            return applyFlip(canvas, ir.getType(), axis);
        });
    }
    function applyFlip(image, type, axis) {
        const canvas = create(image.width, image.height);
        const context = get2dContext(canvas);
        if (axis === 'v') {
            context.scale(1, -1);
            context.drawImage(image, 0, -canvas.height);
        } else {
            context.scale(-1, 1);
            context.drawImage(image, -canvas.width, 0);
        }
        return fromCanvas(canvas, type);
    }

    const flip$1 = function(ir, axis) {
        return flip(ir, axis);
    };
    const rotate$1 = function(ir, angle) {
        return rotate(ir, angle);
    };

    const blobToImageResult = function(blob) {
        return fromBlob(blob);
    };

    const global$2 = tinymce.util.Tools.resolve('tinymce.util.Delay');

    const global$3 = tinymce.util.Tools.resolve('tinymce.util.Promise');

    const global$4 = tinymce.util.Tools.resolve('tinymce.util.URI');

    const getToolbarItems = function(editor) {
        return editor.getParam(
            'imagetools_toolbar',
            'rotateleft rotateright flipv fliph editimage imageoptions',
        );
    };
    const getProxyUrl = function(editor) {
        return editor.getParam('imagetools_proxy');
    };
    const getCorsHosts = function(editor) {
        return editor.getParam('imagetools_cors_hosts', [], 'string[]');
    };
    const getCredentialsHosts = function(editor) {
        return editor.getParam('imagetools_credentials_hosts', [], 'string[]');
    };
    const getFetchImage = function(editor) {
        return Option.from(
            editor.getParam('imagetools_fetch_image', null, 'function'),
        );
    };
    const getApiKey = function(editor) {
        return editor.getParam(
            'api_key',
            editor.getParam('imagetools_api_key', '', 'string'),
            'string',
        );
    };
    const getUploadTimeout = function(editor) {
        return editor.getParam('images_upload_timeout', 30000, 'number');
    };
    const shouldReuseFilename = function(editor) {
        return editor.getParam('images_reuse_filename', false, 'boolean');
    };

    function getImageSize(img) {
        let width;
        let height;
        function isPxValue(value) {
            return /^[0-9\.]+px$/.test(value);
        }
        width = img.style.width;
        height = img.style.height;
        if (width || height) {
            if (isPxValue(width) && isPxValue(height)) {
                return {
                    w: parseInt(width, 10),
                    h: parseInt(height, 10),
                };
            }
            return null;
        }
        width = img.width;
        height = img.height;
        if (width && height) {
            return {
                w: parseInt(width, 10),
                h: parseInt(height, 10),
            };
        }
        return null;
    }
    function setImageSize(img, size) {
        let width;
        let height;
        if (size) {
            width = img.style.width;
            height = img.style.height;
            if (width || height) {
                img.style.width = `${size.w}px`;
                img.style.height = `${size.h}px`;
                img.removeAttribute('data-mce-style');
            }
            width = img.width;
            height = img.height;
            if (width || height) {
                img.setAttribute('width', size.w);
                img.setAttribute('height', size.h);
            }
        }
    }
    function getNaturalImageSize(img) {
        return {
            w: img.naturalWidth,
            h: img.naturalHeight,
        };
    }
    const ImageSize = {
        getImageSize,
        setImageSize,
        getNaturalImageSize,
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
    const isFunction = isType('function');

    const nativeSlice = Array.prototype.slice;
    const find = function(xs, pred) {
        for (let i = 0, len = xs.length; i < len; i++) {
            const x = xs[i];
            if (pred(x, i)) {
                return Option.some(x);
            }
        }
        return Option.none();
    };
    const from$1 = isFunction(Array.from)
        ? Array.from
        : function(x) {
              return nativeSlice.call(x);
          };

    const isValue = function(obj) {
        return obj !== null && obj !== undefined;
    };
    const traverse = function(json, path) {
        let value;
        value = path.reduce(function(result, key) {
            return isValue(result) ? result[key] : undefined;
        }, json);
        return isValue(value) ? value : null;
    };
    const requestUrlAsBlob = function(url, headers, withCredentials) {
        return new global$3(function(resolve) {
            let xhr;
            xhr = new domGlobals.XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    resolve({
                        status: xhr.status,
                        blob: this.response,
                    });
                }
            };
            xhr.open('GET', url, true);
            xhr.withCredentials = withCredentials;
            global$1.each(headers, function(value, key) {
                xhr.setRequestHeader(key, value);
            });
            xhr.responseType = 'blob';
            xhr.send();
        });
    };
    const readBlob = function(blob) {
        return new global$3(function(resolve) {
            const fr = new domGlobals.FileReader();
            fr.onload = function(e) {
                const data = e.target;
                resolve(data.result);
            };
            fr.readAsText(blob);
        });
    };
    const parseJson = function(text) {
        let json;
        try {
            json = JSON.parse(text);
        } catch (ex) {}
        return json;
    };
    const Utils = {
        traverse,
        readBlob,
        requestUrlAsBlob,
        parseJson,
    };

    const friendlyHttpErrors = [
        {
            code: 404,
            message: 'Could not find Image Proxy',
        },
        {
            code: 403,
            message: 'Rejected request',
        },
        {
            code: 0,
            message: 'Incorrect Image Proxy URL',
        },
    ];
    const friendlyServiceErrors = [
        {
            type: 'key_missing',
            message: 'The request did not include an api key.',
        },
        {
            type: 'key_not_found',
            message: 'The provided api key could not be found.',
        },
        {
            type: 'domain_not_trusted',
            message: 'The api key is not valid for the request origins.',
        },
    ];
    const isServiceErrorCode = function(code) {
        return code === 400 || code === 403 || code === 500;
    };
    const getHttpErrorMsg = function(status) {
        const message = find(friendlyHttpErrors, function(error) {
            return status === error.code;
        }).fold(constant('Unknown ImageProxy error'), function(error) {
            return error.message;
        });
        return `ImageProxy HTTP error: ${message}`;
    };
    const handleHttpError = function(status) {
        const message = getHttpErrorMsg(status);
        return global$3.reject(message);
    };
    const getServiceErrorMsg = function(type) {
        return find(friendlyServiceErrors, function(error) {
            return error.type === type;
        }).fold(constant('Unknown service error'), function(error) {
            return error.message;
        });
    };
    const getServiceError = function(text) {
        const serviceError = Utils.parseJson(text);
        const errorType = Utils.traverse(serviceError, ['error', 'type']);
        const errorMsg = errorType
            ? getServiceErrorMsg(errorType)
            : 'Invalid JSON in service error message';
        return `ImageProxy Service error: ${errorMsg}`;
    };
    const handleServiceError = function(status, blob) {
        return Utils.readBlob(blob).then(function(text) {
            const serviceError = getServiceError(text);
            return global$3.reject(serviceError);
        });
    };
    const handleServiceErrorResponse = function(status, blob) {
        return isServiceErrorCode(status)
            ? handleServiceError(status, blob)
            : handleHttpError(status);
    };
    const Errors = {
        handleServiceErrorResponse,
        handleHttpError,
        getHttpErrorMsg,
        getServiceErrorMsg,
    };

    const appendApiKey = function(url, apiKey) {
        const separator = url.indexOf('?') === -1 ? '?' : '&';
        if (/[?&]apiKey=/.test(url) || !apiKey) {
            return url;
        }
        return `${url + separator}apiKey=${encodeURIComponent(apiKey)}`;
    };
    const requestServiceBlob = function(url, apiKey) {
        const headers = {
            'Content-Type': 'application/json;charset=UTF-8',
            'tiny-api-key': apiKey,
        };
        return Utils.requestUrlAsBlob(
            appendApiKey(url, apiKey),
            headers,
            false,
        ).then(function(result) {
            return result.status < 200 || result.status >= 300
                ? Errors.handleServiceErrorResponse(result.status, result.blob)
                : global$3.resolve(result.blob);
        });
    };
    function requestBlob(url, withCredentials) {
        return Utils.requestUrlAsBlob(url, {}, withCredentials).then(function(
            result,
        ) {
            return result.status < 200 || result.status >= 300
                ? Errors.handleHttpError(result.status)
                : global$3.resolve(result.blob);
        });
    }
    const getUrl = function(url, apiKey, withCredentials) {
        return apiKey
            ? requestServiceBlob(url, apiKey)
            : requestBlob(url, withCredentials);
    };

    const compareDocumentPosition = function(a, b, match) {
        return (a.compareDocumentPosition(b) & match) !== 0;
    };
    const documentPositionPreceding = function(a, b) {
        return compareDocumentPosition(
            a,
            b,
            domGlobals.Node.DOCUMENT_POSITION_PRECEDING,
        );
    };
    const documentPositionContainedBy = function(a, b) {
        return compareDocumentPosition(
            a,
            b,
            domGlobals.Node.DOCUMENT_POSITION_CONTAINED_BY,
        );
    };
    const Node = {
        documentPositionPreceding,
        documentPositionContainedBy,
    };

    const firstMatch = function(regexes, s) {
        for (let i = 0; i < regexes.length; i++) {
            const x = regexes[i];
            if (x.test(s)) {
                return x;
            }
        }
        return undefined;
    };
    const find$1 = function(regexes, agent) {
        const r = firstMatch(regexes, agent);
        if (!r) {
            return {
                major: 0,
                minor: 0,
            };
        }
        const group = function(i) {
            return Number(agent.replace(r, `$${i}`));
        };
        return nu(group(1), group(2));
    };
    const detect = function(versionRegexes, agent) {
        const cleanedAgent = String(agent).toLowerCase();
        if (versionRegexes.length === 0) {
            return unknown();
        }
        return find$1(versionRegexes, cleanedAgent);
    };
    var unknown = function() {
        return nu(0, 0);
    };
    var nu = function(major, minor) {
        return {
            major,
            minor,
        };
    };
    const Version = {
        nu,
        detect,
        unknown,
    };

    const edge = 'Edge';
    const chrome = 'Chrome';
    const ie = 'IE';
    const opera = 'Opera';
    const firefox = 'Firefox';
    const safari = 'Safari';
    const isBrowser = function(name, current) {
        return function() {
            return current === name;
        };
    };
    const unknown$1 = function() {
        return nu$1({
            current: undefined,
            version: Version.unknown(),
        });
    };
    var nu$1 = function(info) {
        const { current } = info;
        const { version } = info;
        return {
            current,
            version,
            isEdge: isBrowser(edge, current),
            isChrome: isBrowser(chrome, current),
            isIE: isBrowser(ie, current),
            isOpera: isBrowser(opera, current),
            isFirefox: isBrowser(firefox, current),
            isSafari: isBrowser(safari, current),
        };
    };
    const Browser = {
        unknown: unknown$1,
        nu: nu$1,
        edge: constant(edge),
        chrome: constant(chrome),
        ie: constant(ie),
        opera: constant(opera),
        firefox: constant(firefox),
        safari: constant(safari),
    };

    const windows = 'Windows';
    const ios = 'iOS';
    const android = 'Android';
    const linux = 'Linux';
    const osx = 'OSX';
    const solaris = 'Solaris';
    const freebsd = 'FreeBSD';
    const chromeos = 'ChromeOS';
    const isOS = function(name, current) {
        return function() {
            return current === name;
        };
    };
    const unknown$2 = function() {
        return nu$2({
            current: undefined,
            version: Version.unknown(),
        });
    };
    var nu$2 = function(info) {
        const { current } = info;
        const { version } = info;
        return {
            current,
            version,
            isWindows: isOS(windows, current),
            isiOS: isOS(ios, current),
            isAndroid: isOS(android, current),
            isOSX: isOS(osx, current),
            isLinux: isOS(linux, current),
            isSolaris: isOS(solaris, current),
            isFreeBSD: isOS(freebsd, current),
            isChromeOS: isOS(chromeos, current),
        };
    };
    const OperatingSystem = {
        unknown: unknown$2,
        nu: nu$2,
        windows: constant(windows),
        ios: constant(ios),
        android: constant(android),
        linux: constant(linux),
        osx: constant(osx),
        solaris: constant(solaris),
        freebsd: constant(freebsd),
        chromeos: constant(chromeos),
    };

    const DeviceType = function(os, browser, userAgent, mediaMatch) {
        const isiPad = os.isiOS() && /ipad/i.test(userAgent) === true;
        const isiPhone = os.isiOS() && !isiPad;
        const isMobile = os.isiOS() || os.isAndroid();
        const isTouch = isMobile || mediaMatch('(pointer:coarse)');
        const isTablet =
            isiPad ||
            (!isiPhone && isMobile && mediaMatch('(min-device-width:768px)'));
        const isPhone = isiPhone || (isMobile && !isTablet);
        const iOSwebview =
            browser.isSafari() &&
            os.isiOS() &&
            /safari/i.test(userAgent) === false;
        const isDesktop = !isPhone && !isTablet && !iOSwebview;
        return {
            isiPad: constant(isiPad),
            isiPhone: constant(isiPhone),
            isTablet: constant(isTablet),
            isPhone: constant(isPhone),
            isTouch: constant(isTouch),
            isAndroid: os.isAndroid,
            isiOS: os.isiOS,
            isWebView: constant(iOSwebview),
            isDesktop: constant(isDesktop),
        };
    };

    const detect$1 = function(candidates, userAgent) {
        const agent = String(userAgent).toLowerCase();
        return find(candidates, function(candidate) {
            return candidate.search(agent);
        });
    };
    const detectBrowser = function(browsers, userAgent) {
        return detect$1(browsers, userAgent).map(function(browser) {
            const version = Version.detect(browser.versionRegexes, userAgent);
            return {
                current: browser.name,
                version,
            };
        });
    };
    const detectOs = function(oses, userAgent) {
        return detect$1(oses, userAgent).map(function(os) {
            const version = Version.detect(os.versionRegexes, userAgent);
            return {
                current: os.name,
                version,
            };
        });
    };
    const UaString = {
        detectBrowser,
        detectOs,
    };

    const contains = function(str, substr) {
        return str.indexOf(substr) !== -1;
    };

    const normalVersionRegex = /.*?version\/\ ?([0-9]+)\.([0-9]+).*/;
    const checkContains = function(target) {
        return function(uastring) {
            return contains(uastring, target);
        };
    };
    const browsers = [
        {
            name: 'Edge',
            versionRegexes: [/.*?edge\/ ?([0-9]+)\.([0-9]+)$/],
            search(uastring) {
                return (
                    contains(uastring, 'edge/') &&
                    contains(uastring, 'chrome') &&
                    contains(uastring, 'safari') &&
                    contains(uastring, 'applewebkit')
                );
            },
        },
        {
            name: 'Chrome',
            versionRegexes: [
                /.*?chrome\/([0-9]+)\.([0-9]+).*/,
                normalVersionRegex,
            ],
            search(uastring) {
                return (
                    contains(uastring, 'chrome') &&
                    !contains(uastring, 'chromeframe')
                );
            },
        },
        {
            name: 'IE',
            versionRegexes: [
                /.*?msie\ ?([0-9]+)\.([0-9]+).*/,
                /.*?rv:([0-9]+)\.([0-9]+).*/,
            ],
            search(uastring) {
                return (
                    contains(uastring, 'msie') || contains(uastring, 'trident')
                );
            },
        },
        {
            name: 'Opera',
            versionRegexes: [
                normalVersionRegex,
                /.*?opera\/([0-9]+)\.([0-9]+).*/,
            ],
            search: checkContains('opera'),
        },
        {
            name: 'Firefox',
            versionRegexes: [/.*?firefox\/\ ?([0-9]+)\.([0-9]+).*/],
            search: checkContains('firefox'),
        },
        {
            name: 'Safari',
            versionRegexes: [
                normalVersionRegex,
                /.*?cpu os ([0-9]+)_([0-9]+).*/,
            ],
            search(uastring) {
                return (
                    (contains(uastring, 'safari') ||
                        contains(uastring, 'mobile/')) &&
                    contains(uastring, 'applewebkit')
                );
            },
        },
    ];
    const oses = [
        {
            name: 'Windows',
            search: checkContains('win'),
            versionRegexes: [/.*?windows\ nt\ ?([0-9]+)\.([0-9]+).*/],
        },
        {
            name: 'iOS',
            search(uastring) {
                return (
                    contains(uastring, 'iphone') || contains(uastring, 'ipad')
                );
            },
            versionRegexes: [
                /.*?version\/\ ?([0-9]+)\.([0-9]+).*/,
                /.*cpu os ([0-9]+)_([0-9]+).*/,
                /.*cpu iphone os ([0-9]+)_([0-9]+).*/,
            ],
        },
        {
            name: 'Android',
            search: checkContains('android'),
            versionRegexes: [/.*?android\ ?([0-9]+)\.([0-9]+).*/],
        },
        {
            name: 'OSX',
            search: checkContains('mac os x'),
            versionRegexes: [/.*?mac\ os\ x\ ?([0-9]+)_([0-9]+).*/],
        },
        {
            name: 'Linux',
            search: checkContains('linux'),
            versionRegexes: [],
        },
        {
            name: 'Solaris',
            search: checkContains('sunos'),
            versionRegexes: [],
        },
        {
            name: 'FreeBSD',
            search: checkContains('freebsd'),
            versionRegexes: [],
        },
        {
            name: 'ChromeOS',
            search: checkContains('cros'),
            versionRegexes: [/.*?chrome\/([0-9]+)\.([0-9]+).*/],
        },
    ];
    const PlatformInfo = {
        browsers: constant(browsers),
        oses: constant(oses),
    };

    const detect$2 = function(userAgent, mediaMatch) {
        const browsers = PlatformInfo.browsers();
        const oses = PlatformInfo.oses();
        const browser = UaString.detectBrowser(browsers, userAgent).fold(
            Browser.unknown,
            Browser.nu,
        );
        const os = UaString.detectOs(oses, userAgent).fold(
            OperatingSystem.unknown,
            OperatingSystem.nu,
        );
        const deviceType = DeviceType(os, browser, userAgent, mediaMatch);
        return {
            browser,
            os,
            deviceType,
        };
    };
    const PlatformDetection = { detect: detect$2 };

    const mediaMatch = function(query) {
        return domGlobals.window.matchMedia(query).matches;
    };
    const platform = Cell(
        PlatformDetection.detect(domGlobals.navigator.userAgent, mediaMatch),
    );
    const detect$3 = function() {
        return platform.get();
    };

    const fromHtml = function(html, scope) {
        const doc = scope || domGlobals.document;
        const div = doc.createElement('div');
        div.innerHTML = html;
        if (!div.hasChildNodes() || div.childNodes.length > 1) {
            domGlobals.console.error(
                'HTML does not have a single root node',
                html,
            );
            throw new Error('HTML must have a single root node');
        }
        return fromDom(div.childNodes[0]);
    };
    const fromTag = function(tag, scope) {
        const doc = scope || domGlobals.document;
        const node = doc.createElement(tag);
        return fromDom(node);
    };
    const fromText = function(text, scope) {
        const doc = scope || domGlobals.document;
        const node = doc.createTextNode(text);
        return fromDom(node);
    };
    var fromDom = function(node) {
        if (node === null || node === undefined) {
            throw new Error('Node cannot be null or undefined');
        }
        return { dom: constant(node) };
    };
    const fromPoint = function(docElm, x, y) {
        const doc = docElm.dom();
        return Option.from(doc.elementFromPoint(x, y)).map(fromDom);
    };
    const Element = {
        fromHtml,
        fromTag,
        fromText,
        fromDom,
        fromPoint,
    };

    const ATTRIBUTE = domGlobals.Node.ATTRIBUTE_NODE;
    const CDATA_SECTION = domGlobals.Node.CDATA_SECTION_NODE;
    const COMMENT = domGlobals.Node.COMMENT_NODE;
    const DOCUMENT = domGlobals.Node.DOCUMENT_NODE;
    const DOCUMENT_TYPE = domGlobals.Node.DOCUMENT_TYPE_NODE;
    const DOCUMENT_FRAGMENT = domGlobals.Node.DOCUMENT_FRAGMENT_NODE;
    const ELEMENT = domGlobals.Node.ELEMENT_NODE;
    const TEXT = domGlobals.Node.TEXT_NODE;
    const PROCESSING_INSTRUCTION = domGlobals.Node.PROCESSING_INSTRUCTION_NODE;
    const ENTITY_REFERENCE = domGlobals.Node.ENTITY_REFERENCE_NODE;
    const ENTITY = domGlobals.Node.ENTITY_NODE;
    const NOTATION = domGlobals.Node.NOTATION_NODE;

    const ELEMENT$1 = ELEMENT;
    const is = function(element, selector) {
        const dom = element.dom();
        if (dom.nodeType !== ELEMENT$1) {
            return false;
        }
        const elem = dom;
        if (elem.matches !== undefined) {
            return elem.matches(selector);
        }
        if (elem.msMatchesSelector !== undefined) {
            return elem.msMatchesSelector(selector);
        }
        if (elem.webkitMatchesSelector !== undefined) {
            return elem.webkitMatchesSelector(selector);
        }
        if (elem.mozMatchesSelector !== undefined) {
            return elem.mozMatchesSelector(selector);
        }
        throw new Error('Browser lacks native selectors');
    };

    const regularContains = function(e1, e2) {
        const d1 = e1.dom();
        const d2 = e2.dom();
        return d1 === d2 ? false : d1.contains(d2);
    };
    const ieContains = function(e1, e2) {
        return Node.documentPositionContainedBy(e1.dom(), e2.dom());
    };
    const { browser } = detect$3();
    const contains$1 = browser.isIE() ? ieContains : regularContains;

    const Global =
        typeof domGlobals.window !== 'undefined'
            ? domGlobals.window
            : Function('return this;')();

    const child = function(scope, predicate) {
        const pred = function(node) {
            return predicate(Element.fromDom(node));
        };
        const result = find(scope.dom().childNodes, pred);
        return result.map(Element.fromDom);
    };

    const child$1 = function(scope, selector) {
        return child(scope, function(e) {
            return is(e, selector);
        });
    };

    let count = 0;
    const getFigureImg = function(elem) {
        return child$1(Element.fromDom(elem), 'img');
    };
    const isFigure = function(editor, elem) {
        return editor.dom.is(elem, 'figure');
    };
    const getEditableImage = function(editor, elem) {
        const isImage = function(imgNode) {
            return editor.dom.is(
                imgNode,
                'img:not([data-mce-object],[data-mce-placeholder])',
            );
        };
        const isEditable = function(imgNode) {
            return (
                isImage(imgNode) &&
                (isLocalImage(editor, imgNode) ||
                    isCorsImage(editor, imgNode) ||
                    editor.settings.imagetools_proxy)
            );
        };
        if (isFigure(editor, elem)) {
            const imgOpt = getFigureImg(elem);
            return imgOpt.map(function(img) {
                return isEditable(img.dom())
                    ? Option.some(img.dom())
                    : Option.none();
            });
        }
        return isEditable(elem) ? Option.some(elem) : Option.none();
    };
    const displayError = function(editor, error) {
        editor.notificationManager.open({
            text: error,
            type: 'error',
        });
    };
    const getSelectedImage = function(editor) {
        const elem = editor.selection.getNode();
        if (isFigure(editor, elem)) {
            return getFigureImg(elem);
        }
        return Option.some(Element.fromDom(elem));
    };
    const extractFilename = function(editor, url) {
        const m = url.match(/\/([^\/\?]+)?\.(?:jpeg|jpg|png|gif)(?:\?|$)/i);
        if (m) {
            return editor.dom.encode(m[1]);
        }
        return null;
    };
    const createId = function() {
        return `imagetools${count++}`;
    };
    var isLocalImage = function(editor, img) {
        const url = img.src;
        return (
            url.indexOf('data:') === 0 ||
            url.indexOf('blob:') === 0 ||
            new global$4(url).host === editor.documentBaseURI.host
        );
    };
    var isCorsImage = function(editor, img) {
        return (
            global$1.inArray(
                getCorsHosts(editor),
                new global$4(img.src).host,
            ) !== -1
        );
    };
    const isCorsWithCredentialsImage = function(editor, img) {
        return (
            global$1.inArray(
                getCredentialsHosts(editor),
                new global$4(img.src).host,
            ) !== -1
        );
    };
    const defaultFetchImage = function(editor, img) {
        let { src } = img;
        let apiKey;
        if (isCorsImage(editor, img)) {
            return getUrl(
                img.src,
                null,
                isCorsWithCredentialsImage(editor, img),
            );
        }
        if (!isLocalImage(editor, img)) {
            src = getProxyUrl(editor);
            src += `${
                src.indexOf('?') === -1 ? '?' : '&'
            }url=${encodeURIComponent(img.src)}`;
            apiKey = getApiKey(editor);
            return getUrl(src, apiKey, false);
        }
        return imageToBlob$1(img);
    };
    const imageToBlob$2 = function(editor, img) {
        return getFetchImage(editor).fold(
            function() {
                return defaultFetchImage(editor, img);
            },
            function(customFetchImage) {
                return customFetchImage(img);
            },
        );
    };
    const findBlob = function(editor, img) {
        let blobInfo;
        blobInfo = editor.editorUpload.blobCache.getByUri(img.src);
        if (blobInfo) {
            return global$3.resolve(blobInfo.blob());
        }
        return imageToBlob$2(editor, img);
    };
    const startTimedUpload = function(editor, imageUploadTimerState) {
        const imageUploadTimer = global$2.setEditorTimeout(
            editor,
            function() {
                editor.editorUpload.uploadImagesAuto();
            },
            getUploadTimeout(editor),
        );
        imageUploadTimerState.set(imageUploadTimer);
    };
    const cancelTimedUpload = function(imageUploadTimerState) {
        global$2.clearTimeout(imageUploadTimerState.get());
    };
    const updateSelectedImage = function(
        editor,
        ir,
        uploadImmediately,
        imageUploadTimerState,
        selectedImage,
        size,
    ) {
        return ir.toBlob().then(function(blob) {
            let uri;
            let name;
            let blobCache;
            let blobInfo;
            blobCache = editor.editorUpload.blobCache;
            uri = selectedImage.src;
            if (shouldReuseFilename(editor)) {
                blobInfo = blobCache.getByUri(uri);
                if (blobInfo) {
                    uri = blobInfo.uri();
                    name = blobInfo.name();
                } else {
                    name = extractFilename(editor, uri);
                }
            }
            blobInfo = blobCache.create({
                id: createId(),
                blob,
                base64: ir.toBase64(),
                uri,
                name,
            });
            blobCache.add(blobInfo);
            editor.undoManager.transact(function() {
                function imageLoadedHandler() {
                    editor.$(selectedImage).off('load', imageLoadedHandler);
                    editor.nodeChanged();
                    if (uploadImmediately) {
                        editor.editorUpload.uploadImagesAuto();
                    } else {
                        cancelTimedUpload(imageUploadTimerState);
                        startTimedUpload(editor, imageUploadTimerState);
                    }
                }
                editor.$(selectedImage).on('load', imageLoadedHandler);
                if (size) {
                    editor.$(selectedImage).attr({
                        width: size.w,
                        height: size.h,
                    });
                }
                editor
                    .$(selectedImage)
                    .attr({ src: blobInfo.blobUri() })
                    .removeAttr('data-mce-src');
            });
            return blobInfo;
        });
    };
    const selectedImageOperation = function(
        editor,
        imageUploadTimerState,
        fn,
        size,
    ) {
        return function() {
            const imgOpt = getSelectedImage(editor);
            return imgOpt.fold(
                function() {
                    displayError(editor, 'Could not find selected image');
                },
                function(img) {
                    return editor
                        ._scanForImages()
                        .then(function() {
                            return findBlob(editor, img.dom());
                        })
                        .then(blobToImageResult)
                        .then(fn)
                        .then(
                            function(imageResult) {
                                return updateSelectedImage(
                                    editor,
                                    imageResult,
                                    false,
                                    imageUploadTimerState,
                                    img.dom(),
                                    size,
                                );
                            },
                            function(error) {
                                displayError(editor, error);
                            },
                        );
                },
            );
        };
    };
    const rotate$2 = function(editor, imageUploadTimerState, angle) {
        return function() {
            const imgOpt = getSelectedImage(editor);
            const flippedSize = imgOpt.fold(
                function() {
                    return null;
                },
                function(img) {
                    const size = ImageSize.getImageSize(img.dom());
                    return size
                        ? {
                              w: size.h,
                              h: size.w,
                          }
                        : null;
                },
            );
            return selectedImageOperation(
                editor,
                imageUploadTimerState,
                function(imageResult) {
                    return rotate$1(imageResult, angle);
                },
                flippedSize,
            )();
        };
    };
    const flip$2 = function(editor, imageUploadTimerState, axis) {
        return function() {
            return selectedImageOperation(
                editor,
                imageUploadTimerState,
                function(imageResult) {
                    return flip$1(imageResult, axis);
                },
            )();
        };
    };
    const handleDialogBlob = function(
        editor,
        imageUploadTimerState,
        img,
        originalSize,
        blob,
    ) {
        return new global$3(function(resolve) {
            blobToImage$1(blob)
                .then(function(newImage) {
                    const newSize = ImageSize.getNaturalImageSize(newImage);
                    if (
                        originalSize.w !== newSize.w ||
                        originalSize.h !== newSize.h
                    ) {
                        if (ImageSize.getImageSize(img)) {
                            ImageSize.setImageSize(img, newSize);
                        }
                    }
                    domGlobals.URL.revokeObjectURL(newImage.src);
                    return blob;
                })
                .then(blobToImageResult)
                .then(
                    function(imageResult) {
                        return updateSelectedImage(
                            editor,
                            imageResult,
                            true,
                            imageUploadTimerState,
                            img,
                        );
                    },
                    function() {},
                );
        });
    };
    const Actions = {
        rotate: rotate$2,
        flip: flip$2,
        getEditableImage,
        cancelTimedUpload,
        findBlob,
        getSelectedImage,
        handleDialogBlob,
    };

    const saveState = constant('save-state');
    const disable = constant('disable');
    const enable = constant('enable');

    const createState = function(blob) {
        return {
            blob,
            url: domGlobals.URL.createObjectURL(blob),
        };
    };
    const makeOpen = function(editor, imageUploadTimerState) {
        return function() {
            const getLoadedSpec = function(currentState) {
                return {
                    title: 'Edit Image',
                    size: 'large',
                    body: {
                        type: 'panel',
                        items: [
                            {
                                type: 'imagetools',
                                name: 'imagetools',
                                label: 'Edit Image',
                                currentState,
                            },
                        ],
                    },
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
                            disabled: true,
                        },
                    ],
                    onSubmit(api) {
                        const { blob } = api.getData().imagetools;
                        originalImgOpt.each(function(originalImg) {
                            originalSizeOpt.each(function(originalSize) {
                                Actions.handleDialogBlob(
                                    editor,
                                    imageUploadTimerState,
                                    originalImg.dom(),
                                    originalSize,
                                    blob,
                                );
                            });
                        });
                        api.close();
                    },
                    onCancel() {},
                    onAction(api, details) {
                        switch (details.name) {
                            case saveState():
                                if (details.value) {
                                    api.enable('save');
                                } else {
                                    api.disable('save');
                                }
                                break;
                            case disable():
                                api.disable('save');
                                api.disable('cancel');
                                break;
                            case enable():
                                api.enable('cancel');
                                break;
                        }
                    },
                };
            };
            var originalImgOpt = Actions.getSelectedImage(editor);
            var originalSizeOpt = originalImgOpt.map(function(origImg) {
                return ImageSize.getNaturalImageSize(origImg.dom());
            });
            const imgOpt = Actions.getSelectedImage(editor);
            imgOpt.each(function(img) {
                Actions.getEditableImage(editor, img.dom()).each(function(_) {
                    Actions.findBlob(editor, img.dom()).then(function(blob) {
                        const state = createState(blob);
                        editor.windowManager.open(getLoadedSpec(state));
                    });
                });
            });
        };
    };
    const Dialog = { makeOpen };

    const register = function(editor, imageUploadTimerState) {
        global$1.each(
            {
                mceImageRotateLeft: Actions.rotate(
                    editor,
                    imageUploadTimerState,
                    -90,
                ),
                mceImageRotateRight: Actions.rotate(
                    editor,
                    imageUploadTimerState,
                    90,
                ),
                mceImageFlipVertical: Actions.flip(
                    editor,
                    imageUploadTimerState,
                    'v',
                ),
                mceImageFlipHorizontal: Actions.flip(
                    editor,
                    imageUploadTimerState,
                    'h',
                ),
                mceEditImage: Dialog.makeOpen(editor, imageUploadTimerState),
            },
            function(fn, cmd) {
                editor.addCommand(cmd, fn);
            },
        );
    };
    const Commands = { register };

    const setup = function(
        editor,
        imageUploadTimerState,
        lastSelectedImageState,
    ) {
        editor.on('NodeChange', function(e) {
            const lastSelectedImage = lastSelectedImageState.get();
            if (lastSelectedImage && lastSelectedImage.src !== e.element.src) {
                Actions.cancelTimedUpload(imageUploadTimerState);
                editor.editorUpload.uploadImagesAuto();
                lastSelectedImageState.set(null);
            }
            Actions.getEditableImage(editor, e.element).each(
                lastSelectedImageState.set,
            );
        });
    };
    const UploadSelectedImage = { setup };

    const register$1 = function(editor) {
        const cmd = function(command) {
            return function() {
                return editor.execCommand(command);
            };
        };
        editor.ui.registry.addButton('rotateleft', {
            tooltip: 'Rotate counterclockwise',
            icon: 'rotate-left',
            onAction: cmd('mceImageRotateLeft'),
        });
        editor.ui.registry.addButton('rotateright', {
            tooltip: 'Rotate clockwise',
            icon: 'rotate-right',
            onAction: cmd('mceImageRotateRight'),
        });
        editor.ui.registry.addButton('flipv', {
            tooltip: 'Flip vertically',
            icon: 'flip-vertically',
            onAction: cmd('mceImageFlipVertical'),
        });
        editor.ui.registry.addButton('fliph', {
            tooltip: 'Flip horizontally',
            icon: 'flip-horizontally',
            onAction: cmd('mceImageFlipHorizontal'),
        });
        editor.ui.registry.addButton('editimage', {
            tooltip: 'Edit image',
            icon: 'edit-image',
            onAction: cmd('mceEditImage'),
            onSetup(buttonApi) {
                const setDisabled = function() {
                    const elementOpt = Actions.getSelectedImage(editor);
                    elementOpt.each(function(element) {
                        const disabled = Actions.getEditableImage(
                            editor,
                            element.dom(),
                        ).isNone();
                        buttonApi.setDisabled(disabled);
                    });
                };
                editor.on('NodeChange', setDisabled);
                return function() {
                    editor.off('NodeChange', setDisabled);
                };
            },
        });
        editor.ui.registry.addButton('imageoptions', {
            tooltip: 'Image options',
            icon: 'image-options',
            onAction: cmd('mceImage'),
        });
        editor.ui.registry.addContextMenu('imagetools', {
            update(element) {
                return Actions.getEditableImage(editor, element).fold(
                    function() {
                        return [];
                    },
                    function(_) {
                        return [
                            {
                                text: 'Edit image',
                                icon: 'edit-image',
                                onAction: cmd('mceEditImage'),
                            },
                        ];
                    },
                );
            },
        });
    };
    const Buttons = { register: register$1 };

    const register$2 = function(editor) {
        editor.ui.registry.addContextToolbar('imagetools', {
            items: getToolbarItems(editor),
            predicate(elem) {
                return Actions.getEditableImage(editor, elem).isSome();
            },
            position: 'node',
            scope: 'node',
        });
    };
    const ContextToolbar = { register: register$2 };

    function Plugin() {
        global.add('imagetools', function(editor) {
            const imageUploadTimerState = Cell(0);
            const lastSelectedImageState = Cell(null);
            Commands.register(editor, imageUploadTimerState);
            Buttons.register(editor);
            ContextToolbar.register(editor);
            UploadSelectedImage.setup(
                editor,
                imageUploadTimerState,
                lastSelectedImageState,
            );
        });
    }

    Plugin();
})(window);
