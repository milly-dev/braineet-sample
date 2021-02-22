/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 *
 * Version: 5.1.6 (2020-01-28)
 */
(function() {
    const global = tinymce.util.Tools.resolve('tinymce.PluginManager');

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
    const isArray = isType('array');
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
    const from$1 = isFunction(Array.from)
        ? Array.from
        : function(x) {
              return nativeSlice.call(x);
          };

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

    const { hasOwnProperty } = Object.prototype;
    const shallow = function(old, nu) {
        return nu;
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
    const merge = baseMerge(shallow);

    const hasOwnProperty$1 = Object.hasOwnProperty;
    const get = function(obj, key) {
        return has(obj, key) ? Option.from(obj[key]) : Option.none();
    };
    var has = function(obj, key) {
        return hasOwnProperty$1.call(obj, key);
    };

    const getScripts = function(editor) {
        return editor.getParam('media_scripts');
    };
    const getAudioTemplateCallback = function(editor) {
        return editor.getParam('audio_template_callback');
    };
    const getVideoTemplateCallback = function(editor) {
        return editor.getParam('video_template_callback');
    };
    const hasLiveEmbeds = function(editor) {
        return editor.getParam('media_live_embeds', true);
    };
    const shouldFilterHtml = function(editor) {
        return editor.getParam('media_filter_html', true);
    };
    const getUrlResolver = function(editor) {
        return editor.getParam('media_url_resolver');
    };
    const hasAltSource = function(editor) {
        return editor.getParam('media_alt_source', true);
    };
    const hasPoster = function(editor) {
        return editor.getParam('media_poster', true);
    };
    const hasDimensions = function(editor) {
        return editor.getParam('media_dimensions', true);
    };
    const Settings = {
        getScripts,
        getAudioTemplateCallback,
        getVideoTemplateCallback,
        hasLiveEmbeds,
        shouldFilterHtml,
        getUrlResolver,
        hasAltSource,
        hasPoster,
        hasDimensions,
    };

    const global$1 = tinymce.util.Tools.resolve('tinymce.util.Tools');

    const global$2 = tinymce.util.Tools.resolve('tinymce.html.SaxParser');

    const global$3 = tinymce.util.Tools.resolve('tinymce.dom.DOMUtils');

    const trimPx = function(value) {
        return value.replace(/px$/, '');
    };
    const addPx = function(value) {
        return /^[0-9.]+$/.test(value) ? `${value}px` : value;
    };
    const getSize = function(name) {
        return function(elm) {
            return elm ? trimPx(elm.style[name]) : '';
        };
    };
    const setSize = function(name) {
        return function(elm, value) {
            if (elm) {
                elm.style[name] = addPx(value);
            }
        };
    };
    const Size = {
        getMaxWidth: getSize('maxWidth'),
        getMaxHeight: getSize('maxHeight'),
        setMaxWidth: setSize('maxWidth'),
        setMaxHeight: setSize('maxHeight'),
    };

    const getVideoScriptMatch = function(prefixes, src) {
        if (prefixes) {
            for (let i = 0; i < prefixes.length; i++) {
                if (src.indexOf(prefixes[i].filter) !== -1) {
                    return prefixes[i];
                }
            }
        }
    };

    const { DOM } = global$3;
    const getEphoxEmbedIri = function(elm) {
        return DOM.getAttrib(elm, 'data-ephox-embed-iri');
    };
    const isEphoxEmbed = function(html) {
        const fragment = DOM.createFragment(html);
        return getEphoxEmbedIri(fragment.firstChild) !== '';
    };
    const htmlToDataSax = function(prefixes, html) {
        let data = {};
        global$2({
            validate: false,
            allow_conditional_comments: true,
            start(name, attrs) {
                if (!data.source1 && name === 'param') {
                    data.source1 = attrs.map.movie;
                }
                if (
                    name === 'iframe' ||
                    name === 'object' ||
                    name === 'embed' ||
                    name === 'video' ||
                    name === 'audio'
                ) {
                    if (!data.type) {
                        data.type = name;
                    }
                    data = global$1.extend(attrs.map, data);
                }
                if (name === 'script') {
                    const videoScript = getVideoScriptMatch(
                        prefixes,
                        attrs.map.src,
                    );
                    if (!videoScript) {
                        return;
                    }
                    data = {
                        type: 'script',
                        source1: attrs.map.src,
                        width: String(videoScript.width),
                        height: String(videoScript.height),
                    };
                }
                if (name === 'source') {
                    if (!data.source1) {
                        data.source1 = attrs.map.src;
                    } else if (!data.source2) {
                        data.source2 = attrs.map.src;
                    }
                }
                if (name === 'img' && !data.poster) {
                    data.poster = attrs.map.src;
                }
            },
        }).parse(html);
        data.source1 = data.source1 || data.src || data.data;
        data.source2 = data.source2 || '';
        data.poster = data.poster || '';
        return data;
    };
    const ephoxEmbedHtmlToData = function(html) {
        const fragment = DOM.createFragment(html);
        const div = fragment.firstChild;
        return {
            type: 'ephox-embed-iri',
            source1: getEphoxEmbedIri(div),
            source2: '',
            poster: '',
            width: Size.getMaxWidth(div),
            height: Size.getMaxHeight(div),
        };
    };
    const htmlToData = function(prefixes, html) {
        return isEphoxEmbed(html)
            ? ephoxEmbedHtmlToData(html)
            : htmlToDataSax(prefixes, html);
    };

    const global$4 = tinymce.util.Tools.resolve('tinymce.util.Promise');

    const guess = function(url) {
        const mimes = {
            mp3: 'audio/mpeg',
            m4a: 'audio/x-m4a',
            wav: 'audio/wav',
            mp4: 'video/mp4',
            webm: 'video/webm',
            ogg: 'video/ogg',
            swf: 'application/x-shockwave-flash',
        };
        const fileEnd = url
            .toLowerCase()
            .split('.')
            .pop();
        const mime = mimes[fileEnd];
        return mime || '';
    };
    const Mime = { guess };

    const global$5 = tinymce.util.Tools.resolve('tinymce.html.Writer');

    const global$6 = tinymce.util.Tools.resolve('tinymce.html.Schema');

    const DOM$1 = global$3.DOM;
    const setAttributes = function(attrs, updatedAttrs) {
        let name;
        let i;
        let value;
        let attr;
        for (name in updatedAttrs) {
            value = `${updatedAttrs[name]}`;
            if (attrs.map[name]) {
                i = attrs.length;
                while (i--) {
                    attr = attrs[i];
                    if (attr.name === name) {
                        if (value) {
                            attrs.map[name] = value;
                            attr.value = value;
                        } else {
                            delete attrs.map[name];
                            attrs.splice(i, 1);
                        }
                    }
                }
            } else if (value) {
                attrs.push({
                    name,
                    value,
                });
                attrs.map[name] = value;
            }
        }
    };
    const normalizeHtml = function(html) {
        const writer = global$5();
        const parser = global$2(writer);
        parser.parse(html);
        return writer.getContent();
    };
    const updateHtmlSax = function(html, data, updateAll) {
        const writer = global$5();
        let sourceCount = 0;
        let hasImage;
        global$2(
            {
                validate: false,
                allow_conditional_comments: true,
                comment(text) {
                    writer.comment(text);
                },
                cdata(text) {
                    writer.cdata(text);
                },
                text(text, raw) {
                    writer.text(text, raw);
                },
                start(name, attrs, empty) {
                    switch (name) {
                        case 'video':
                        case 'object':
                        case 'embed':
                        case 'img':
                        case 'iframe':
                            if (
                                data.height !== undefined &&
                                data.width !== undefined
                            ) {
                                setAttributes(attrs, {
                                    width: data.width,
                                    height: data.height,
                                });
                            }
                            break;
                    }
                    if (updateAll) {
                        switch (name) {
                            case 'video':
                                setAttributes(attrs, {
                                    poster: data.poster,
                                    src: '',
                                });
                                if (data.source2) {
                                    setAttributes(attrs, { src: '' });
                                }
                                break;
                            case 'iframe':
                                setAttributes(attrs, { src: data.source1 });
                                break;
                            case 'source':
                                sourceCount++;
                                if (sourceCount <= 2) {
                                    setAttributes(attrs, {
                                        src: data[`source${sourceCount}`],
                                        type: data[`source${sourceCount}mime`],
                                    });
                                    if (!data[`source${sourceCount}`]) {
                                        return;
                                    }
                                }
                                break;
                            case 'img':
                                if (!data.poster) {
                                    return;
                                }
                                hasImage = true;
                                break;
                        }
                    }
                    writer.start(name, attrs, empty);
                },
                end(name) {
                    if (name === 'video' && updateAll) {
                        for (let index = 1; index <= 2; index++) {
                            if (data[`source${index}`]) {
                                const attrs = [];
                                attrs.map = {};
                                if (sourceCount < index) {
                                    setAttributes(attrs, {
                                        src: data[`source${index}`],
                                        type: data[`source${index}mime`],
                                    });
                                    writer.start('source', attrs, true);
                                }
                            }
                        }
                    }
                    if (
                        data.poster &&
                        name === 'object' &&
                        updateAll &&
                        !hasImage
                    ) {
                        const imgAttrs = [];
                        imgAttrs.map = {};
                        setAttributes(imgAttrs, {
                            src: data.poster,
                            width: data.width,
                            height: data.height,
                        });
                        writer.start('img', imgAttrs, true);
                    }
                    writer.end(name);
                },
            },
            global$6({}),
        ).parse(html);
        return writer.getContent();
    };
    const isEphoxEmbed$1 = function(html) {
        const fragment = DOM$1.createFragment(html);
        return (
            DOM$1.getAttrib(fragment.firstChild, 'data-ephox-embed-iri') !== ''
        );
    };
    const updateEphoxEmbed = function(html, data) {
        const fragment = DOM$1.createFragment(html);
        const div = fragment.firstChild;
        Size.setMaxWidth(div, data.width);
        Size.setMaxHeight(div, data.height);
        return normalizeHtml(div.outerHTML);
    };
    const updateHtml = function(html, data, updateAll) {
        return isEphoxEmbed$1(html)
            ? updateEphoxEmbed(html, data)
            : updateHtmlSax(html, data, updateAll);
    };
    const UpdateHtml = { updateHtml };

    const urlPatterns = [
        {
            regex: /youtu\.be\/([\w\-_\?&=.]+)/i,
            type: 'iframe',
            w: 560,
            h: 314,
            url: '//www.youtube.com/embed/$1',
            allowFullscreen: true,
        },
        {
            regex: /youtube\.com(.+)v=([^&]+)(&([a-z0-9&=\-_]+))?/i,
            type: 'iframe',
            w: 560,
            h: 314,
            url: '//www.youtube.com/embed/$2?$4',
            allowFullscreen: true,
        },
        {
            regex: /youtube.com\/embed\/([a-z0-9\?&=\-_]+)/i,
            type: 'iframe',
            w: 560,
            h: 314,
            url: '//www.youtube.com/embed/$1',
            allowFullscreen: true,
        },
        {
            regex: /vimeo\.com\/([0-9]+)/,
            type: 'iframe',
            w: 425,
            h: 350,
            url:
                '//player.vimeo.com/video/$1?title=0&byline=0&portrait=0&color=8dc7dc',
            allowFullscreen: true,
        },
        {
            regex: /vimeo\.com\/(.*)\/([0-9]+)/,
            type: 'iframe',
            w: 425,
            h: 350,
            url: '//player.vimeo.com/video/$2?title=0&amp;byline=0',
            allowFullscreen: true,
        },
        {
            regex: /maps\.google\.([a-z]{2,3})\/maps\/(.+)msid=(.+)/,
            type: 'iframe',
            w: 425,
            h: 350,
            url: '//maps.google.com/maps/ms?msid=$2&output=embed"',
            allowFullscreen: false,
        },
        {
            regex: /dailymotion\.com\/video\/([^_]+)/,
            type: 'iframe',
            w: 480,
            h: 270,
            url: '//www.dailymotion.com/embed/video/$1',
            allowFullscreen: true,
        },
        {
            regex: /dai\.ly\/([^_]+)/,
            type: 'iframe',
            w: 480,
            h: 270,
            url: '//www.dailymotion.com/embed/video/$1',
            allowFullscreen: true,
        },
    ];
    const getUrl = function(pattern, url) {
        const match = pattern.regex.exec(url);
        let newUrl = pattern.url;
        const _loop_1 = function(i) {
            newUrl = newUrl.replace(`$${i}`, function() {
                return match[i] ? match[i] : '';
            });
        };
        for (let i = 0; i < match.length; i++) {
            _loop_1(i);
        }
        return newUrl.replace(/\?$/, '');
    };
    const matchPattern = function(url) {
        const pattern = urlPatterns.filter(function(pattern) {
            return pattern.regex.test(url);
        });
        if (pattern.length > 0) {
            return global$1.extend({}, pattern[0], {
                url: getUrl(pattern[0], url),
            });
        }
        return null;
    };

    const getIframeHtml = function(data) {
        const allowFullscreen = data.allowFullscreen
            ? ' allowFullscreen="1"'
            : '';
        return `<iframe src="${data.source1}" width="${data.width}" height="${data.height}"${allowFullscreen}></iframe>`;
    };
    const getFlashHtml = function(data) {
        let html = `<object data="${data.source1}" width="${data.width}" height="${data.height}" type="application/x-shockwave-flash">`;
        if (data.poster) {
            html += `<img src="${data.poster}" width="${data.width}" height="${data.height}" />`;
        }
        html += '</object>';
        return html;
    };
    const getAudioHtml = function(data, audioTemplateCallback) {
        if (audioTemplateCallback) {
            return audioTemplateCallback(data);
        }
        return `<audio controls="controls" src="${data.source1}">${
            data.source2
                ? `\n<source src="${data.source2}"${
                      data.source2mime ? ` type="${data.source2mime}"` : ''
                  } />\n`
                : ''
        }</audio>`;
    };
    const getVideoHtml = function(data, videoTemplateCallback) {
        if (videoTemplateCallback) {
            return videoTemplateCallback(data);
        }
        return (
            `<video width="${data.width}" height="${data.height}"${
                data.poster ? ` poster="${data.poster}"` : ''
            } controls="controls">\n` +
            `<source src="${data.source1}"${
                data.source1mime ? ` type="${data.source1mime}"` : ''
            } />\n${
                data.source2
                    ? `<source src="${data.source2}"${
                          data.source2mime ? ` type="${data.source2mime}"` : ''
                      } />\n`
                    : ''
            }</video>`
        );
    };
    const getScriptHtml = function(data) {
        return `<script src="${data.source1}"></script>`;
    };
    const dataToHtml = function(editor, dataIn) {
        const data = global$1.extend({}, dataIn);
        if (!data.source1) {
            global$1.extend(
                data,
                htmlToData(Settings.getScripts(editor), data.embed),
            );
            if (!data.source1) {
                return '';
            }
        }
        if (!data.source2) {
            data.source2 = '';
        }
        if (!data.poster) {
            data.poster = '';
        }
        data.source1 = editor.convertURL(data.source1, 'source');
        data.source2 = editor.convertURL(data.source2, 'source');
        data.source1mime = Mime.guess(data.source1);
        data.source2mime = Mime.guess(data.source2);
        data.poster = editor.convertURL(data.poster, 'poster');
        const pattern = matchPattern(data.source1);
        if (pattern) {
            data.source1 = pattern.url;
            data.type = pattern.type;
            data.allowFullscreen = pattern.allowFullscreen;
            data.width = data.width || String(pattern.w);
            data.height = data.height || String(pattern.h);
        }
        if (data.embed) {
            return UpdateHtml.updateHtml(data.embed, data, true);
        }
        const videoScript = getVideoScriptMatch(
            Settings.getScripts(editor),
            data.source1,
        );
        if (videoScript) {
            data.type = 'script';
            data.width = String(videoScript.width);
            data.height = String(videoScript.height);
        }
        const audioTemplateCallback = Settings.getAudioTemplateCallback(editor);
        const videoTemplateCallback = Settings.getVideoTemplateCallback(editor);
        data.width = data.width || '300';
        data.height = data.height || '150';
        global$1.each(data, function(value, key) {
            data[key] = editor.dom.encode(`${value}`);
        });
        if (data.type === 'iframe') {
            return getIframeHtml(data);
        }
        if (data.source1mime === 'application/x-shockwave-flash') {
            return getFlashHtml(data);
        }
        if (data.source1mime.indexOf('audio') !== -1) {
            return getAudioHtml(data, audioTemplateCallback);
        }
        if (data.type === 'script') {
            return getScriptHtml(data);
        }
        return getVideoHtml(data, videoTemplateCallback);
    };

    const cache = {};
    const embedPromise = function(data, dataToHtml, handler) {
        return new global$4(function(res, rej) {
            const wrappedResolve = function(response) {
                if (response.html) {
                    cache[data.source1] = response;
                }
                return res({
                    url: data.source1,
                    html: response.html ? response.html : dataToHtml(data),
                });
            };
            if (cache[data.source1]) {
                wrappedResolve(cache[data.source1]);
            } else {
                handler({ url: data.source1 }, wrappedResolve, rej);
            }
        });
    };
    const defaultPromise = function(data, dataToHtml) {
        return new global$4(function(res) {
            res({
                html: dataToHtml(data),
                url: data.source1,
            });
        });
    };
    const loadedData = function(editor) {
        return function(data) {
            return dataToHtml(editor, data);
        };
    };
    const getEmbedHtml = function(editor, data) {
        const embedHandler = Settings.getUrlResolver(editor);
        return embedHandler
            ? embedPromise(data, loadedData(editor), embedHandler)
            : defaultPromise(data, loadedData(editor));
    };
    const isCached = function(url) {
        return cache.hasOwnProperty(url);
    };
    const Service = {
        getEmbedHtml,
        isCached,
    };

    const unwrap = function(data) {
        const unwrapped = merge(data, {
            source1: data.source1.value,
            source2: get(data, 'source2')
                .bind(function(source2) {
                    return get(source2, 'value');
                })
                .getOr(''),
            poster: get(data, 'poster')
                .bind(function(poster) {
                    return get(poster, 'value');
                })
                .getOr(''),
        });
        get(data, 'dimensions').each(function(dimensions) {
            each(['width', 'height'], function(prop) {
                get(dimensions, prop).each(function(value) {
                    return (unwrapped[prop] = value);
                });
            });
        });
        return unwrapped;
    };
    const wrap = function(data) {
        const wrapped = merge(data, {
            source1: { value: get(data, 'source1').getOr('') },
            source2: { value: get(data, 'source2').getOr('') },
            poster: { value: get(data, 'poster').getOr('') },
        });
        each(['width', 'height'], function(prop) {
            get(data, prop).each(function(value) {
                const dimensions = wrapped.dimensions || {};
                dimensions[prop] = value;
                wrapped.dimensions = dimensions;
            });
        });
        return wrapped;
    };
    const handleError = function(editor) {
        return function(error) {
            const errorMessage =
                error && error.msg
                    ? `Media embed handler error: ${error.msg}`
                    : 'Media embed handler threw unknown error.';
            editor.notificationManager.open({
                type: 'error',
                text: errorMessage,
            });
        };
    };
    const snippetToData = function(editor, embedSnippet) {
        return htmlToData(Settings.getScripts(editor), embedSnippet);
    };
    const isMediaElement = function(element) {
        return (
            element.getAttribute('data-mce-object') ||
            element.getAttribute('data-ephox-embed-iri')
        );
    };
    const getEditorData = function(editor) {
        const element = editor.selection.getNode();
        const snippet = isMediaElement(element)
            ? editor.serializer.serialize(element, { selection: true })
            : '';
        return merge(
            { embed: snippet },
            htmlToData(Settings.getScripts(editor), snippet),
        );
    };
    const addEmbedHtml = function(api, editor) {
        return function(response) {
            if (isString(response.url) && response.url.trim().length > 0) {
                const { html } = response;
                const snippetData = snippetToData(editor, html);
                const nuData = {
                    ...snippetData,
                    source1: response.url,
                    embed: html,
                };
                api.setData(wrap(nuData));
            }
        };
    };
    const selectPlaceholder = function(editor, beforeObjects) {
        const afterObjects = editor.dom.select('img[data-mce-object]');
        for (let i = 0; i < beforeObjects.length; i++) {
            for (let y = afterObjects.length - 1; y >= 0; y--) {
                if (beforeObjects[i] === afterObjects[y]) {
                    afterObjects.splice(y, 1);
                }
            }
        }
        editor.selection.select(afterObjects[0]);
    };
    const handleInsert = function(editor, html) {
        const beforeObjects = editor.dom.select('img[data-mce-object]');
        editor.insertContent(html);
        selectPlaceholder(editor, beforeObjects);
        editor.nodeChanged();
    };
    const submitForm = function(prevData, newData, editor) {
        newData.embed = UpdateHtml.updateHtml(newData.embed, newData);
        if (
            newData.embed &&
            (prevData.source1 === newData.source1 ||
                Service.isCached(newData.source1))
        ) {
            handleInsert(editor, newData.embed);
        } else {
            Service.getEmbedHtml(editor, newData)
                .then(function(response) {
                    handleInsert(editor, response.html);
                })
                .catch(handleError(editor));
        }
    };
    const showDialog = function(editor) {
        const editorData = getEditorData(editor);
        const currentData = Cell(editorData);
        const initialData = wrap(editorData);
        const getSourceData = function(api) {
            return unwrap(api.getData());
        };
        const handleSource1 = function(prevData, api) {
            const serviceData = getSourceData(api);
            if (prevData.source1 !== serviceData.source1) {
                addEmbedHtml(
                    win,
                    editor,
                )({
                    url: serviceData.source1,
                    html: '',
                });
                Service.getEmbedHtml(editor, serviceData)
                    .then(addEmbedHtml(win, editor))
                    .catch(handleError(editor));
            }
        };
        const handleEmbed = function(api) {
            const data = unwrap(api.getData());
            const dataFromEmbed = snippetToData(editor, data.embed);
            api.setData(wrap(dataFromEmbed));
        };
        const handleUpdate = function(api) {
            const data = getSourceData(api);
            const embed = dataToHtml(editor, data);
            api.setData(wrap({ ...data, embed }));
        };
        const mediaInput = [
            {
                name: 'source1',
                type: 'urlinput',
                filetype: 'media',
                label: 'Source',
            },
        ];
        const sizeInput = !Settings.hasDimensions(editor)
            ? []
            : [
                  {
                      type: 'sizeinput',
                      name: 'dimensions',
                      label: 'Constrain proportions',
                      constrain: true,
                  },
              ];
        const generalTab = {
            title: 'General',
            name: 'general',
            items: flatten([mediaInput, sizeInput]),
        };
        const embedTextarea = {
            type: 'textarea',
            name: 'embed',
            label: 'Paste your embed code below:',
        };
        const embedTab = {
            title: 'Embed',
            items: [embedTextarea],
        };
        const advancedFormItems = [];
        if (Settings.hasAltSource(editor)) {
            advancedFormItems.push({
                name: 'source2',
                type: 'urlinput',
                filetype: 'media',
                label: 'Alternative source URL',
            });
        }
        if (Settings.hasPoster(editor)) {
            advancedFormItems.push({
                name: 'poster',
                type: 'urlinput',
                filetype: 'image',
                label: 'Media poster (Image URL)',
            });
        }
        const advancedTab = {
            title: 'Advanced',
            name: 'advanced',
            items: advancedFormItems,
        };
        const tabs = [generalTab, embedTab];
        if (advancedFormItems.length > 0) {
            tabs.push(advancedTab);
        }
        const body = {
            type: 'tabpanel',
            tabs,
        };
        var win = editor.windowManager.open({
            title: 'Insert/Edit Media',
            size: 'normal',
            body,
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
            onSubmit(api) {
                const serviceData = getSourceData(api);
                submitForm(currentData.get(), serviceData, editor);
                api.close();
            },
            onChange(api, detail) {
                switch (detail.name) {
                    case 'source1':
                        handleSource1(currentData.get(), api);
                        break;
                    case 'embed':
                        handleEmbed(api);
                        break;
                    case 'dimensions':
                    case 'poster':
                        handleUpdate(api);
                        break;
                    default:
                        break;
                }
                currentData.set(getSourceData(api));
            },
            initialData,
        });
    };
    const Dialog = { showDialog };

    const get$1 = function(editor) {
        const showDialog = function() {
            Dialog.showDialog(editor);
        };
        return { showDialog };
    };
    const Api = { get: get$1 };

    const register = function(editor) {
        const showDialog = function() {
            Dialog.showDialog(editor);
        };
        editor.addCommand('mceMedia', showDialog);
    };
    const Commands = { register };

    const global$7 = tinymce.util.Tools.resolve('tinymce.html.Node');

    const global$8 = tinymce.util.Tools.resolve('tinymce.Env');

    const sanitize = function(editor, html) {
        if (Settings.shouldFilterHtml(editor) === false) {
            return html;
        }
        const writer = global$5();
        let blocked;
        global$2(
            {
                validate: false,
                allow_conditional_comments: false,
                comment(text) {
                    writer.comment(text);
                },
                cdata(text) {
                    writer.cdata(text);
                },
                text(text, raw) {
                    writer.text(text, raw);
                },
                start(name, attrs, empty) {
                    blocked = true;
                    if (name === 'script' || name === 'noscript') {
                        return;
                    }
                    for (let i = 0; i < attrs.length; i++) {
                        if (attrs[i].name.indexOf('on') === 0) {
                            return;
                        }
                        if (attrs[i].name === 'style') {
                            attrs[i].value = editor.dom.serializeStyle(
                                editor.dom.parseStyle(attrs[i].value),
                                name,
                            );
                        }
                    }
                    writer.start(name, attrs, empty);
                    blocked = false;
                },
                end(name) {
                    if (blocked) {
                        return;
                    }
                    writer.end(name);
                },
            },
            global$6({}),
        ).parse(html);
        return writer.getContent();
    };
    const Sanitize = { sanitize };

    const createPlaceholderNode = function(editor, node) {
        let placeHolder;
        const { name } = node;
        placeHolder = new global$7('img', 1);
        placeHolder.shortEnded = true;
        retainAttributesAndInnerHtml(editor, node, placeHolder);
        placeHolder.attr({
            width: node.attr('width') || '300',
            height: node.attr('height') || (name === 'audio' ? '30' : '150'),
            style: node.attr('style'),
            src: global$8.transparentSrc,
            'data-mce-object': name,
            class: `mce-object mce-object-${name}`,
        });
        return placeHolder;
    };
    const createPreviewIframeNode = function(editor, node) {
        let previewWrapper;
        let previewNode;
        let shimNode;
        const { name } = node;
        previewWrapper = new global$7('span', 1);
        previewWrapper.attr({
            contentEditable: 'false',
            style: node.attr('style'),
            'data-mce-object': name,
            class: `mce-preview-object mce-object-${name}`,
        });
        retainAttributesAndInnerHtml(editor, node, previewWrapper);
        previewNode = new global$7(name, 1);
        previewNode.attr({
            src: node.attr('src'),
            allowfullscreen: node.attr('allowfullscreen'),
            style: node.attr('style'),
            class: node.attr('class'),
            width: node.attr('width'),
            height: node.attr('height'),
            frameborder: '0',
        });
        shimNode = new global$7('span', 1);
        shimNode.attr('class', 'mce-shim');
        previewWrapper.append(previewNode);
        previewWrapper.append(shimNode);
        return previewWrapper;
    };
    var retainAttributesAndInnerHtml = function(
        editor,
        sourceNode,
        targetNode,
    ) {
        let attrName;
        let attrValue;
        let attribs;
        let ai;
        let innerHtml;
        attribs = sourceNode.attributes;
        ai = attribs.length;
        while (ai--) {
            attrName = attribs[ai].name;
            attrValue = attribs[ai].value;
            if (
                attrName !== 'width' &&
                attrName !== 'height' &&
                attrName !== 'style'
            ) {
                if (attrName === 'data' || attrName === 'src') {
                    attrValue = editor.convertURL(attrValue, attrName);
                }
                targetNode.attr(`data-mce-p-${attrName}`, attrValue);
            }
        }
        innerHtml = sourceNode.firstChild && sourceNode.firstChild.value;
        if (innerHtml) {
            targetNode.attr(
                'data-mce-html',
                escape(Sanitize.sanitize(editor, innerHtml)),
            );
            targetNode.firstChild = null;
        }
    };
    const isPageEmbedWrapper = function(node) {
        const nodeClass = node.attr('class');
        return nodeClass && /\btiny-pageembed\b/.test(nodeClass);
    };
    const isWithinEmbedWrapper = function(node) {
        while ((node = node.parent)) {
            if (node.attr('data-ephox-embed-iri') || isPageEmbedWrapper(node)) {
                return true;
            }
        }
        return false;
    };
    const placeHolderConverter = function(editor) {
        return function(nodes) {
            let i = nodes.length;
            let node;
            let videoScript;
            while (i--) {
                node = nodes[i];
                if (!node.parent) {
                    continue;
                }
                if (node.parent.attr('data-mce-object')) {
                    continue;
                }
                if (node.name === 'script') {
                    videoScript = getVideoScriptMatch(
                        Settings.getScripts(editor),
                        node.attr('src'),
                    );
                    if (!videoScript) {
                        continue;
                    }
                }
                if (videoScript) {
                    if (videoScript.width) {
                        node.attr('width', videoScript.width.toString());
                    }
                    if (videoScript.height) {
                        node.attr('height', videoScript.height.toString());
                    }
                }
                if (
                    node.name === 'iframe' &&
                    Settings.hasLiveEmbeds(editor) &&
                    global$8.ceFalse
                ) {
                    if (!isWithinEmbedWrapper(node)) {
                        node.replace(createPreviewIframeNode(editor, node));
                    }
                } else if (!isWithinEmbedWrapper(node)) {
                    node.replace(createPlaceholderNode(editor, node));
                }
            }
        };
    };
    const Nodes = {
        createPreviewIframeNode,
        createPlaceholderNode,
        placeHolderConverter,
    };

    const setup = function(editor) {
        editor.on('preInit', function() {
            const specialElements = editor.schema.getSpecialElements();
            global$1.each('video audio iframe object'.split(' '), function(
                name,
            ) {
                specialElements[name] = new RegExp(`</${name}[^>]*>`, 'gi');
            });
            const boolAttrs = editor.schema.getBoolAttrs();
            global$1.each(
                'webkitallowfullscreen mozallowfullscreen allowfullscreen'.split(
                    ' ',
                ),
                function(name) {
                    boolAttrs[name] = {};
                },
            );
            editor.parser.addNodeFilter(
                'iframe,video,audio,object,embed,script',
                Nodes.placeHolderConverter(editor),
            );
            editor.serializer.addAttributeFilter('data-mce-object', function(
                nodes,
                name,
            ) {
                let i = nodes.length;
                let node;
                let realElm;
                let ai;
                let attribs;
                let innerHtml;
                let innerNode;
                let realElmName;
                let className;
                while (i--) {
                    node = nodes[i];
                    if (!node.parent) {
                        continue;
                    }
                    realElmName = node.attr(name);
                    realElm = new global$7(realElmName, 1);
                    if (realElmName !== 'audio' && realElmName !== 'script') {
                        className = node.attr('class');
                        if (
                            className &&
                            className.indexOf('mce-preview-object') !== -1
                        ) {
                            realElm.attr({
                                width: node.firstChild.attr('width'),
                                height: node.firstChild.attr('height'),
                            });
                        } else {
                            realElm.attr({
                                width: node.attr('width'),
                                height: node.attr('height'),
                            });
                        }
                    }
                    realElm.attr({ style: node.attr('style') });
                    attribs = node.attributes;
                    ai = attribs.length;
                    while (ai--) {
                        const attrName = attribs[ai].name;
                        if (attrName.indexOf('data-mce-p-') === 0) {
                            realElm.attr(
                                attrName.substr(11),
                                attribs[ai].value,
                            );
                        }
                    }
                    if (realElmName === 'script') {
                        realElm.attr('type', 'text/javascript');
                    }
                    innerHtml = node.attr('data-mce-html');
                    if (innerHtml) {
                        innerNode = new global$7('#text', 3);
                        innerNode.raw = true;
                        innerNode.value = Sanitize.sanitize(
                            editor,
                            unescape(innerHtml),
                        );
                        realElm.append(innerNode);
                    }
                    node.replace(realElm);
                }
            });
        });
        editor.on('SetContent', function() {
            editor.$('span.mce-preview-object').each(function(index, elm) {
                const $elm = editor.$(elm);
                if ($elm.find('span.mce-shim').length === 0) {
                    $elm.append('<span class="mce-shim"></span>');
                }
            });
        });
    };
    const FilterContent = { setup };

    const setup$1 = function(editor) {
        editor.on('ResolveName', function(e) {
            let name;
            if (
                e.target.nodeType === 1 &&
                (name = e.target.getAttribute('data-mce-object'))
            ) {
                e.name = name;
            }
        });
    };
    const ResolveName = { setup: setup$1 };

    const setup$2 = function(editor) {
        editor.on('click keyup touchend', function() {
            const selectedNode = editor.selection.getNode();
            if (
                selectedNode &&
                editor.dom.hasClass(selectedNode, 'mce-preview-object')
            ) {
                if (editor.dom.getAttrib(selectedNode, 'data-mce-selected')) {
                    selectedNode.setAttribute('data-mce-selected', '2');
                }
            }
        });
        editor.on('ObjectSelected', function(e) {
            const objectType = e.target.getAttribute('data-mce-object');
            if (objectType === 'audio' || objectType === 'script') {
                e.preventDefault();
            }
        });
        editor.on('ObjectResized', function(e) {
            const { target } = e;
            let html;
            if (target.getAttribute('data-mce-object')) {
                html = target.getAttribute('data-mce-html');
                if (html) {
                    html = unescape(html);
                    target.setAttribute(
                        'data-mce-html',
                        escape(
                            UpdateHtml.updateHtml(html, {
                                width: String(e.width),
                                height: String(e.height),
                            }),
                        ),
                    );
                }
            }
        });
    };
    const Selection = { setup: setup$2 };

    const stateSelectorAdapter = function(editor, selector) {
        return function(buttonApi) {
            return editor.selection.selectorChangedWithUnbind(
                selector.join(','),
                buttonApi.setActive,
            ).unbind;
        };
    };
    const register$1 = function(editor) {
        editor.ui.registry.addToggleButton('media', {
            tooltip: 'Insert/edit media',
            icon: 'embed',
            onAction() {
                editor.execCommand('mceMedia');
            },
            onSetup: stateSelectorAdapter(editor, [
                'img[data-mce-object]',
                'span[data-mce-object]',
                'div[data-ephox-embed-iri]',
            ]),
        });
        editor.ui.registry.addMenuItem('media', {
            icon: 'embed',
            text: 'Media...',
            onAction() {
                editor.execCommand('mceMedia');
            },
        });
    };
    const Buttons = { register: register$1 };

    function Plugin() {
        global.add('media', function(editor) {
            Commands.register(editor);
            Buttons.register(editor);
            ResolveName.setup(editor);
            FilterContent.setup(editor);
            Selection.setup(editor);
            return Api.get(editor);
        });
    }

    Plugin();
})();
