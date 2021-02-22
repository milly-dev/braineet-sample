/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 *
 * Version: 5.1.6 (2020-01-28)
 */
(function() {
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

    const global$1 = tinymce.util.Tools.resolve('tinymce.Env');

    const global$2 = tinymce.util.Tools.resolve('tinymce.util.Delay');

    const fireResizeEditor = function(editor) {
        return editor.fire('ResizeEditor');
    };
    const Events = { fireResizeEditor };

    const getAutoResizeMinHeight = function(editor) {
        return editor.getParam(
            'min_height',
            editor.getElement().offsetHeight,
            'number',
        );
    };
    const getAutoResizeMaxHeight = function(editor) {
        return editor.getParam('max_height', 0, 'number');
    };
    const getAutoResizeOverflowPadding = function(editor) {
        return editor.getParam('autoresize_overflow_padding', 1, 'number');
    };
    const getAutoResizeBottomMargin = function(editor) {
        return editor.getParam('autoresize_bottom_margin', 50, 'number');
    };
    const shouldAutoResizeOnInit = function(editor) {
        return editor.getParam('autoresize_on_init', true, 'boolean');
    };
    const Settings = {
        getAutoResizeMinHeight,
        getAutoResizeMaxHeight,
        getAutoResizeOverflowPadding,
        getAutoResizeBottomMargin,
        shouldAutoResizeOnInit,
    };

    const isFullscreen = function(editor) {
        return (
            editor.plugins.fullscreen &&
            editor.plugins.fullscreen.isFullscreen()
        );
    };
    var wait = function(editor, oldSize, times, interval, callback) {
        global$2.setEditorTimeout(
            editor,
            function() {
                resize(editor, oldSize);
                if (times--) {
                    wait(editor, oldSize, times, interval, callback);
                } else if (callback) {
                    callback();
                }
            },
            interval,
        );
    };
    const toggleScrolling = function(editor, state) {
        const body = editor.getBody();
        if (body) {
            body.style.overflowY = state ? '' : 'hidden';
            if (!state) {
                body.scrollTop = 0;
            }
        }
    };
    const parseCssValueToInt = function(dom, elm, name, computed) {
        const value = parseInt(dom.getStyle(elm, name, computed), 10);
        return isNaN(value) ? 0 : value;
    };
    var resize = function(editor, oldSize) {
        let deltaSize;
        let resizeHeight;
        let contentHeight;
        const { dom } = editor;
        const doc = editor.getDoc();
        if (!doc) {
            return;
        }
        if (isFullscreen(editor)) {
            toggleScrolling(editor, true);
            return;
        }
        const docEle = doc.documentElement;
        const resizeBottomMargin = Settings.getAutoResizeBottomMargin(editor);
        resizeHeight = Settings.getAutoResizeMinHeight(editor);
        const marginTop = parseCssValueToInt(dom, docEle, 'margin-top', true);
        const marginBottom = parseCssValueToInt(
            dom,
            docEle,
            'margin-bottom',
            true,
        );
        contentHeight =
            docEle.offsetHeight + marginTop + marginBottom + resizeBottomMargin;
        if (contentHeight < 0) {
            contentHeight = 0;
        }
        const containerHeight = editor.getContainer().offsetHeight;
        const contentAreaHeight = editor.getContentAreaContainer().offsetHeight;
        const chromeHeight = containerHeight - contentAreaHeight;
        if (
            contentHeight + chromeHeight >
            Settings.getAutoResizeMinHeight(editor)
        ) {
            resizeHeight = contentHeight + chromeHeight;
        }
        const maxHeight = Settings.getAutoResizeMaxHeight(editor);
        if (maxHeight && resizeHeight > maxHeight) {
            resizeHeight = maxHeight;
            toggleScrolling(editor, true);
        } else {
            toggleScrolling(editor, false);
        }
        if (resizeHeight !== oldSize.get()) {
            deltaSize = resizeHeight - oldSize.get();
            dom.setStyle(editor.getContainer(), 'height', `${resizeHeight}px`);
            oldSize.set(resizeHeight);
            Events.fireResizeEditor(editor);
            if (global$1.browser.isSafari() && global$1.mac) {
                const win = editor.getWin();
                win.scrollTo(win.pageXOffset, win.pageYOffset);
            }
            if (editor.hasFocus()) {
                editor.selection.scrollIntoView(editor.selection.getNode());
            }
            if (global$1.webkit && deltaSize < 0) {
                resize(editor, oldSize);
            }
        }
    };
    const setup = function(editor, oldSize) {
        editor.on('init', function() {
            const overflowPadding = Settings.getAutoResizeOverflowPadding(
                editor,
            );
            const { dom } = editor;
            dom.setStyles(editor.getBody(), {
                paddingLeft: overflowPadding,
                paddingRight: overflowPadding,
                'min-height': 0,
            });
        });
        editor.on(
            'NodeChange SetContent keyup FullscreenStateChanged ResizeContent',
            function() {
                resize(editor, oldSize);
            },
        );
        if (Settings.shouldAutoResizeOnInit(editor)) {
            editor.on('init', function() {
                wait(editor, oldSize, 20, 100, function() {
                    wait(editor, oldSize, 5, 1000);
                });
            });
        }
    };
    const Resize = {
        setup,
        resize,
    };

    const register = function(editor, oldSize) {
        editor.addCommand('mceAutoResize', function() {
            Resize.resize(editor, oldSize);
        });
    };
    const Commands = { register };

    function Plugin() {
        global.add('autoresize', function(editor) {
            if (!editor.settings.hasOwnProperty('resize')) {
                editor.settings.resize = false;
            }
            if (!editor.inline) {
                const oldSize = Cell(0);
                Commands.register(editor, oldSize);
                Resize.setup(editor, oldSize);
            }
        });
    }

    Plugin();
})();
