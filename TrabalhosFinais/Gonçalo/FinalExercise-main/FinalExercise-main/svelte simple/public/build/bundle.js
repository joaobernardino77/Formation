
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = program.b - t;
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.29.7' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var svelte = /*#__PURE__*/Object.freeze({
        __proto__: null,
        SvelteComponent: SvelteComponentDev,
        afterUpdate: afterUpdate,
        beforeUpdate: beforeUpdate,
        createEventDispatcher: createEventDispatcher,
        getContext: getContext,
        onDestroy: onDestroy,
        onMount: onMount,
        setContext: setContext,
        tick: tick
    });

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity }) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 }) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    /* src\components\Notification.svelte generated by Svelte v3.29.7 */

    const file = "src\\components\\Notification.svelte";

    function create_fragment(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*message*/ ctx[0]);
    			attr_dev(p, "class", "svelte-y1dmr9");
    			add_location(p, file, 5, 0, 76);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*message*/ 1) set_data_dev(t, /*message*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Notification", slots, []);
    	let { message } = $$props;
    	let { colorMessage } = $$props;
    	const writable_props = ["message", "colorMessage"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Notification> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("message" in $$props) $$invalidate(0, message = $$props.message);
    		if ("colorMessage" in $$props) $$invalidate(1, colorMessage = $$props.colorMessage);
    	};

    	$$self.$capture_state = () => ({ message, colorMessage });

    	$$self.$inject_state = $$props => {
    		if ("message" in $$props) $$invalidate(0, message = $$props.message);
    		if ("colorMessage" in $$props) $$invalidate(1, colorMessage = $$props.colorMessage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [message, colorMessage];
    }

    class Notification extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { message: 0, colorMessage: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Notification",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*message*/ ctx[0] === undefined && !("message" in props)) {
    			console.warn("<Notification> was created without expected prop 'message'");
    		}

    		if (/*colorMessage*/ ctx[1] === undefined && !("colorMessage" in props)) {
    			console.warn("<Notification> was created without expected prop 'colorMessage'");
    		}
    	}

    	get message() {
    		throw new Error("<Notification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set message(value) {
    		throw new Error("<Notification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get colorMessage() {
    		throw new Error("<Notification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set colorMessage(value) {
    		throw new Error("<Notification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\RegisterModal.svelte generated by Svelte v3.29.7 */
    const file$1 = "src\\components\\RegisterModal.svelte";

    function create_fragment$1(ctx) {
    	let div4;
    	let div3;
    	let div0;
    	let h2;
    	let t1;
    	let div1;
    	let form;
    	let input0;
    	let t2;
    	let br0;
    	let t3;
    	let input1;
    	let t4;
    	let br1;
    	let t5;
    	let button;
    	let t7;
    	let p;
    	let t9;
    	let div2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Register";
    			t1 = space();
    			div1 = element("div");
    			form = element("form");
    			input0 = element("input");
    			t2 = space();
    			br0 = element("br");
    			t3 = space();
    			input1 = element("input");
    			t4 = space();
    			br1 = element("br");
    			t5 = space();
    			button = element("button");
    			button.textContent = "Register";
    			t7 = space();
    			p = element("p");
    			p.textContent = "Please fill out all fields";
    			t9 = space();
    			div2 = element("div");
    			add_location(h2, file$1, 43, 10, 1451);
    			attr_dev(div0, "class", "modal-header");
    			add_location(div0, file$1, 42, 8, 1413);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "Username");
    			attr_dev(input0, "id", "registerLoginInput");
    			add_location(input0, file$1, 47, 16, 1556);
    			add_location(br0, file$1, 48, 16, 1665);
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "placeholder", "Password");
    			attr_dev(input1, "id", "registerPasswordInput");
    			add_location(input1, file$1, 49, 16, 1687);
    			add_location(br1, file$1, 50, 16, 1803);
    			attr_dev(button, "id", "confirmRegisterBtn");
    			attr_dev(button, "type", "submit");
    			button.disabled = true;
    			add_location(button, file$1, 51, 16, 1825);
    			attr_dev(p, "id", "registerPWarning");
    			add_location(p, file$1, 52, 16, 1956);
    			add_location(form, file$1, 46, 12, 1532);
    			attr_dev(div1, "class", "modal-body");
    			add_location(div1, file$1, 45, 8, 1494);
    			attr_dev(div2, "class", "modal-footer");
    			add_location(div2, file$1, 55, 8, 2058);
    			set_style(div3, "margin-top", "10%");
    			set_style(div3, "text-align", "center");
    			add_location(div3, file$1, 41, 4, 1353);
    			attr_dev(div4, "id", "myModalRegister");
    			add_location(div4, file$1, 40, 0, 1321);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div0, h2);
    			append_dev(div3, t1);
    			append_dev(div3, div1);
    			append_dev(div1, form);
    			append_dev(form, input0);
    			append_dev(form, t2);
    			append_dev(form, br0);
    			append_dev(form, t3);
    			append_dev(form, input1);
    			append_dev(form, t4);
    			append_dev(form, br1);
    			append_dev(form, t5);
    			append_dev(form, button);
    			append_dev(form, t7);
    			append_dev(form, p);
    			append_dev(div3, t9);
    			append_dev(div3, div2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*handleWarging*/ ctx[0], false, false, false),
    					listen_dev(input1, "input", /*handleWarging*/ ctx[0], false, false, false),
    					listen_dev(button, "click", prevent_default(/*handleRegister*/ ctx[1]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("RegisterModal", slots, []);
    	const { open, close } = getContext("simple-modal");
    	let opening = false;
    	let opened = false;
    	let closing = false;
    	let closed = false;

    	const showNotification = (messageColor, message) => {
    		open(Notification, { message, messageColor });
    	};

    	//////////////////////////////////////////
    	const handleWarging = () => {
    		if (registerLoginInput.value && registerPasswordInput.value) {
    			confirmRegisterBtn.disabled = false;
    			registerPWarning.style.display = "none";
    		} else {
    			confirmRegisterBtn.disabled = true;
    			registerPWarning.style.display = "";
    		}
    	};

    	const handleRegister = event => {
    		const username = registerLoginInput.value;
    		const password = registerPasswordInput.value;

    		var allRegistered = localStorage.getItem("allRegistered")
    		? JSON.parse(localStorage.getItem("allRegistered"))
    		: [];

    		localStorage.setItem("allRegistered", JSON.stringify([...allRegistered, { username, password }]));
    		showNotification("green", "Register was successfull");

    		setTimeout(
    			() => {
    				close(Notification);
    			},
    			1000
    		);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<RegisterModal> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		getContext,
    		fly,
    		open,
    		close,
    		opening,
    		opened,
    		closing,
    		closed,
    		Notification,
    		showNotification,
    		handleWarging,
    		handleRegister
    	});

    	$$self.$inject_state = $$props => {
    		if ("opening" in $$props) opening = $$props.opening;
    		if ("opened" in $$props) opened = $$props.opened;
    		if ("closing" in $$props) closing = $$props.closing;
    		if ("closed" in $$props) closed = $$props.closed;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [handleWarging, handleRegister];
    }

    class RegisterModal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RegisterModal",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\components\LoginModal.svelte generated by Svelte v3.29.7 */
    const file$2 = "src\\components\\LoginModal.svelte";

    function create_fragment$2(ctx) {
    	let div4;
    	let div3;
    	let div0;
    	let h2;
    	let t1;
    	let div1;
    	let form;
    	let input0;
    	let t2;
    	let br0;
    	let t3;
    	let input1;
    	let t4;
    	let br1;
    	let t5;
    	let button;
    	let t7;
    	let p0;
    	let t9;
    	let div2;
    	let p1;
    	let t10;
    	let a;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Login";
    			t1 = space();
    			div1 = element("div");
    			form = element("form");
    			input0 = element("input");
    			t2 = space();
    			br0 = element("br");
    			t3 = space();
    			input1 = element("input");
    			t4 = space();
    			br1 = element("br");
    			t5 = space();
    			button = element("button");
    			button.textContent = "Login";
    			t7 = space();
    			p0 = element("p");
    			p0.textContent = "Please fill out all fields";
    			t9 = space();
    			div2 = element("div");
    			p1 = element("p");
    			t10 = text("If you are not registered click ");
    			a = element("a");
    			a.textContent = "here";
    			add_location(h2, file$2, 52, 10, 1650);
    			attr_dev(div0, "class", "modal-header");
    			add_location(div0, file$2, 51, 8, 1612);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "Username");
    			attr_dev(input0, "id", "loginInput");
    			add_location(input0, file$2, 56, 16, 1752);
    			add_location(br0, file$2, 57, 16, 1853);
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "placeholder", "Password");
    			attr_dev(input1, "id", "passwordInput");
    			add_location(input1, file$2, 58, 16, 1875);
    			add_location(br1, file$2, 59, 16, 1983);
    			attr_dev(button, "id", "loginBtn");
    			attr_dev(button, "type", "submit");
    			button.disabled = true;
    			add_location(button, file$2, 60, 16, 2005);
    			attr_dev(p0, "id", "pWarning");
    			add_location(p0, file$2, 61, 16, 2105);
    			add_location(form, file$2, 55, 12, 1728);
    			attr_dev(div1, "class", "modal-body");
    			add_location(div1, file$2, 54, 8, 1690);
    			attr_dev(a, "id", "registerBtn");
    			add_location(a, file$2, 65, 45, 2272);
    			add_location(p1, file$2, 65, 10, 2237);
    			attr_dev(div2, "class", "modal-footer");
    			add_location(div2, file$2, 64, 8, 2199);
    			set_style(div3, "margin-top", "10%");
    			set_style(div3, "text-align", "center");
    			add_location(div3, file$2, 50, 4, 1552);
    			attr_dev(div4, "id", "myModal");
    			add_location(div4, file$2, 49, 0, 1528);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div0, h2);
    			append_dev(div3, t1);
    			append_dev(div3, div1);
    			append_dev(div1, form);
    			append_dev(form, input0);
    			append_dev(form, t2);
    			append_dev(form, br0);
    			append_dev(form, t3);
    			append_dev(form, input1);
    			append_dev(form, t4);
    			append_dev(form, br1);
    			append_dev(form, t5);
    			append_dev(form, button);
    			append_dev(form, t7);
    			append_dev(form, p0);
    			append_dev(div3, t9);
    			append_dev(div3, div2);
    			append_dev(div2, p1);
    			append_dev(p1, t10);
    			append_dev(p1, a);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*handleWarging*/ ctx[1], false, false, false),
    					listen_dev(input1, "input", /*handleWarging*/ ctx[1], false, false, false),
    					listen_dev(button, "click", /*handleLogin*/ ctx[2], false, false, false),
    					listen_dev(a, "click", /*showRegisterModal*/ ctx[0], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("LoginModal", slots, []);
    	const { open } = getContext("simple-modal");
    	let opening = false;
    	let opened = false;
    	let closing = false;
    	let closed = false;

    	const showRegisterModal = () => {
    		open(RegisterModal, { message: "It's a popup!" });
    	};

    	const showNotification = (messageColor, message) => {
    		open(Notification, { message, messageColor });
    	};

    	//////////////////////////////////////////
    	const handleWarging = () => {
    		if (loginInput.value && passwordInput.value) {
    			loginBtn.disabled = false;
    			pWarning.style.display = "none";
    		} else {
    			loginBtn.disabled = true;
    			pWarning.style.display = "";
    		}
    	};

    	const handleLogin = event => {
    		var allRegister = JSON.parse(localStorage.getItem("allRegistered"));

    		for (var i = 0; i < allRegister.length; i++) {
    			if (allRegister[i].username === loginInput.value && allRegister[i].password === passwordInput.value) {
    				showNotification("green", "Login was successfull");
    				localStorage.setItem("login", "true");

    				setTimeout(
    					() => {
    						window.location.reload();
    						return false;
    					},
    					3100
    				);

    				return;
    			}
    		}

    		showNotification("red", "Wrong credentials");
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<LoginModal> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		getContext,
    		fly,
    		open,
    		opening,
    		opened,
    		closing,
    		closed,
    		RegisterModal,
    		showRegisterModal,
    		Notification,
    		showNotification,
    		handleWarging,
    		handleLogin
    	});

    	$$self.$inject_state = $$props => {
    		if ("opening" in $$props) opening = $$props.opening;
    		if ("opened" in $$props) opened = $$props.opened;
    		if ("closing" in $$props) closing = $$props.closing;
    		if ("closed" in $$props) closed = $$props.closed;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [showRegisterModal, handleWarging, handleLogin];
    }

    class LoginModal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LoginModal",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    var plates = [
        {
          Name: "Salmon",
          Day: "Monday",
          Type: "Fish",
          Price: 8,
          img:
            "https://cdn.pixabay.com/photo/2014/11/05/15/57/salmon-518032_960_720.jpg",
        },
        {
          Name: "Lasagna",
          Day: "Monday",
          Type: "Meat",
          Price: 7,
          img:
            "https://cdn.pixabay.com/photo/2016/12/11/22/41/lasagna-1900529_960_720.jpg",
        },
        {
          Name: "Sardines",
          Day: "Tuesday",
          Type: "Fish",
          Price: 6,
          img:
            "https://cdn.pixabay.com/photo/2016/06/30/18/49/sardines-1489626_960_720.jpg",
        },
        {
          Name: "Chicken",
          Day: "Tuesday",
          Type: "Meat",
          Price: 5,
          img:
            "https://cdn.pixabay.com/photo/2016/11/18/17/42/barbecue-1836053_960_720.jpg",
        },
        {
          Name: "Fish And Chips",
          Day: "Wednesday",
          Type: "Fish",
          Price: 5,
          img:
            "https://cdn.pixabay.com/photo/2017/12/26/04/51/fish-and-chip-3039746_960_720.jpg",
        },
        {
          Name: "Hamburguer",
          Day: "Wednesday",
          Type: "Meat",
          Price: 4,
          img:
            "https://cdn.pixabay.com/photo/2016/03/05/19/37/appetite-1238459_960_720.jpg",
        },
        {
          Name: "Sushi",
          Day: "Thursday",
          Type: "Fish",
          Price: 10,
          img:
            "https://cdn.pixabay.com/photo/2016/11/25/16/08/sushi-1858696_960_720.jpg",
        },
        {
          Name: "Spaghetti bolognese",
          Day: "Thursday",
          Type: "Meat",
          Price: 7,
          img:
            "https://cdn.pixabay.com/photo/2019/10/13/14/23/spaghetti-bolognese-4546233_960_720.jpg",
        },
        {
          Name: "Chicken",
          Day: "Friday",
          Type: "Fish",
          Price: 6,
          img:
            "https://cdn.pixabay.com/photo/2016/11/18/17/42/barbecue-1836053_960_720.jpg",
        },
        {
          Name: "Fish Soup",
          Day: "Friday",
          Type: "Meat",
          Price: 7,
          img:
            "https://cdn.pixabay.com/photo/2018/01/01/17/57/fish-soup-3054627_960_720.jpg",
        },
      ];

    /* src\components\ScheduleModal.svelte generated by Svelte v3.29.7 */

    const { console: console_1 } = globals;
    const file$3 = "src\\components\\ScheduleModal.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[24] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[27] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[30] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[33] = list[i];
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[36] = list[i];
    	return child_ctx;
    }

    // (62:12) {#each mondayMeals as mondayPlate}
    function create_each_block_4(ctx) {
    	let option;
    	let t_value = /*mondayPlate*/ ctx[36].Name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*mondayPlate*/ ctx[36].Price;
    			option.value = option.__value;
    			add_location(option, file$3, 62, 16, 2586);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(62:12) {#each mondayMeals as mondayPlate}",
    		ctx
    	});

    	return block;
    }

    // (69:12) {#each tuesdayMeals as tuesdayPlate}
    function create_each_block_3(ctx) {
    	let option;
    	let t_value = /*tuesdayPlate*/ ctx[33].Name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*tuesdayPlate*/ ctx[33].Price;
    			option.value = option.__value;
    			add_location(option, file$3, 69, 16, 2894);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(69:12) {#each tuesdayMeals as tuesdayPlate}",
    		ctx
    	});

    	return block;
    }

    // (76:14) {#each wednesdayMeals as wednesdayPlate}
    function create_each_block_2(ctx) {
    	let option;
    	let t_value = /*wednesdayPlate*/ ctx[30].Name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*wednesdayPlate*/ ctx[30].Price;
    			option.value = option.__value;
    			add_location(option, file$3, 76, 16, 3222);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(76:14) {#each wednesdayMeals as wednesdayPlate}",
    		ctx
    	});

    	return block;
    }

    // (83:14) {#each thursdayMeals as thursdayPlate}
    function create_each_block_1(ctx) {
    	let option;
    	let t_value = /*thursdayPlate*/ ctx[27].Name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*thursdayPlate*/ ctx[27].Price;
    			option.value = option.__value;
    			add_location(option, file$3, 83, 16, 3549);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(83:14) {#each thursdayMeals as thursdayPlate}",
    		ctx
    	});

    	return block;
    }

    // (90:14) {#each fridayMeals as fridayPlate}
    function create_each_block(ctx) {
    	let option;
    	let t_value = /*fridayPlate*/ ctx[24].Name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*fridayPlate*/ ctx[24].Price;
    			option.value = option.__value;
    			add_location(option, file$3, 90, 16, 3864);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(90:14) {#each fridayMeals as fridayPlate}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div4;
    	let div3;
    	let div0;
    	let h2;
    	let t1;
    	let div1;
    	let p0;
    	let t3;
    	let select0;
    	let option0;
    	let t5;
    	let p1;
    	let t7;
    	let select1;
    	let option1;
    	let t9;
    	let p2;
    	let t11;
    	let select2;
    	let option2;
    	let t13;
    	let p3;
    	let t15;
    	let select3;
    	let option3;
    	let t17;
    	let p4;
    	let t19;
    	let select4;
    	let option4;
    	let t21;
    	let br;
    	let t22;
    	let p5;
    	let t23;
    	let t24;
    	let t25;
    	let t26;
    	let button;
    	let t28;
    	let div2;
    	let p6;
    	let mounted;
    	let dispose;
    	let each_value_4 = /*mondayMeals*/ ctx[6];
    	validate_each_argument(each_value_4);
    	let each_blocks_4 = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks_4[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
    	}

    	let each_value_3 = /*tuesdayMeals*/ ctx[7];
    	validate_each_argument(each_value_3);
    	let each_blocks_3 = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks_3[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	let each_value_2 = /*wednesdayMeals*/ ctx[8];
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value_1 = /*thursdayMeals*/ ctx[9];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*fridayMeals*/ ctx[10];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Schedule Your Meal";
    			t1 = space();
    			div1 = element("div");
    			p0 = element("p");
    			p0.textContent = "Monday";
    			t3 = space();
    			select0 = element("select");
    			option0 = element("option");
    			option0.textContent = "Select";

    			for (let i = 0; i < each_blocks_4.length; i += 1) {
    				each_blocks_4[i].c();
    			}

    			t5 = space();
    			p1 = element("p");
    			p1.textContent = "Tuesday";
    			t7 = space();
    			select1 = element("select");
    			option1 = element("option");
    			option1.textContent = "Select";

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].c();
    			}

    			t9 = space();
    			p2 = element("p");
    			p2.textContent = "Wednesday";
    			t11 = space();
    			select2 = element("select");
    			option2 = element("option");
    			option2.textContent = "Select";

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t13 = space();
    			p3 = element("p");
    			p3.textContent = "Thursday";
    			t15 = space();
    			select3 = element("select");
    			option3 = element("option");
    			option3.textContent = "Select";

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t17 = space();
    			p4 = element("p");
    			p4.textContent = "Friday";
    			t19 = space();
    			select4 = element("select");
    			option4 = element("option");
    			option4.textContent = "Select";

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t21 = space();
    			br = element("br");
    			t22 = space();
    			p5 = element("p");
    			t23 = text("Total: ");
    			t24 = text(/*totalPrice*/ ctx[5]);
    			t25 = text("€");
    			t26 = space();
    			button = element("button");
    			button.textContent = "Schedule";
    			t28 = space();
    			div2 = element("div");
    			p6 = element("p");
    			p6.textContent = "all food is made with love";
    			add_location(h2, file$3, 55, 10, 2311);
    			attr_dev(div0, "class", "modal-header");
    			add_location(div0, file$3, 54, 8, 2273);
    			add_location(p0, file$3, 58, 10, 2400);
    			option0.__value = "0";
    			option0.value = option0.__value;
    			add_location(option0, file$3, 60, 12, 2487);
    			attr_dev(select0, "id", "monday");
    			if (/*mondaySelected*/ ctx[0] === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[12].call(select0));
    			add_location(select0, file$3, 59, 10, 2425);
    			add_location(p1, file$3, 65, 10, 2701);
    			option1.__value = "0";
    			option1.value = option1.__value;
    			add_location(option1, file$3, 67, 12, 2793);
    			attr_dev(select1, "id", "tuesday");
    			if (/*tuesdaySelected*/ ctx[1] === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[13].call(select1));
    			add_location(select1, file$3, 66, 12, 2729);
    			add_location(p2, file$3, 72, 12, 3015);
    			option2.__value = "0";
    			option2.value = option2.__value;
    			add_location(option2, file$3, 74, 14, 3115);
    			attr_dev(select2, "id", "wednesday");
    			if (/*wednesdaySelected*/ ctx[2] === void 0) add_render_callback(() => /*select2_change_handler*/ ctx[14].call(select2));
    			add_location(select2, file$3, 73, 12, 3045);
    			add_location(p3, file$3, 79, 12, 3347);
    			option3.__value = "0";
    			option3.value = option3.__value;
    			add_location(option3, file$3, 81, 14, 3444);
    			attr_dev(select3, "id", "thursday");
    			if (/*thursdaySelected*/ ctx[3] === void 0) add_render_callback(() => /*select3_change_handler*/ ctx[15].call(select3));
    			add_location(select3, file$3, 80, 12, 3376);
    			add_location(p4, file$3, 86, 12, 3672);
    			option4.__value = "0";
    			option4.value = option4.__value;
    			add_location(option4, file$3, 88, 14, 3763);
    			attr_dev(select4, "id", "friday");
    			if (/*fridaySelected*/ ctx[4] === void 0) add_render_callback(() => /*select4_change_handler*/ ctx[16].call(select4));
    			add_location(select4, file$3, 87, 12, 3699);
    			add_location(br, file$3, 93, 12, 3983);
    			attr_dev(p5, "id", "totalPrice");
    			add_location(p5, file$3, 94, 12, 4002);
    			attr_dev(button, "id", "scheduleBtn");
    			add_location(button, file$3, 95, 12, 4059);
    			attr_dev(div1, "class", "modal-body");
    			add_location(div1, file$3, 57, 8, 2364);
    			add_location(p6, file$3, 98, 10, 4197);
    			attr_dev(div2, "class", "modal-footer");
    			add_location(div2, file$3, 97, 8, 4159);
    			set_style(div3, "margin-top", "10%");
    			set_style(div3, "text-align", "center");
    			add_location(div3, file$3, 53, 4, 2213);
    			attr_dev(div4, "id", "scheduleModal");
    			add_location(div4, file$3, 52, 0, 2183);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div0, h2);
    			append_dev(div3, t1);
    			append_dev(div3, div1);
    			append_dev(div1, p0);
    			append_dev(div1, t3);
    			append_dev(div1, select0);
    			append_dev(select0, option0);

    			for (let i = 0; i < each_blocks_4.length; i += 1) {
    				each_blocks_4[i].m(select0, null);
    			}

    			select_option(select0, /*mondaySelected*/ ctx[0]);
    			append_dev(div1, t5);
    			append_dev(div1, p1);
    			append_dev(div1, t7);
    			append_dev(div1, select1);
    			append_dev(select1, option1);

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].m(select1, null);
    			}

    			select_option(select1, /*tuesdaySelected*/ ctx[1]);
    			append_dev(div1, t9);
    			append_dev(div1, p2);
    			append_dev(div1, t11);
    			append_dev(div1, select2);
    			append_dev(select2, option2);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(select2, null);
    			}

    			select_option(select2, /*wednesdaySelected*/ ctx[2]);
    			append_dev(div1, t13);
    			append_dev(div1, p3);
    			append_dev(div1, t15);
    			append_dev(div1, select3);
    			append_dev(select3, option3);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(select3, null);
    			}

    			select_option(select3, /*thursdaySelected*/ ctx[3]);
    			append_dev(div1, t17);
    			append_dev(div1, p4);
    			append_dev(div1, t19);
    			append_dev(div1, select4);
    			append_dev(select4, option4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select4, null);
    			}

    			select_option(select4, /*fridaySelected*/ ctx[4]);
    			append_dev(div1, t21);
    			append_dev(div1, br);
    			append_dev(div1, t22);
    			append_dev(div1, p5);
    			append_dev(p5, t23);
    			append_dev(p5, t24);
    			append_dev(p5, t25);
    			append_dev(div1, t26);
    			append_dev(div1, button);
    			append_dev(div3, t28);
    			append_dev(div3, div2);
    			append_dev(div2, p6);

    			if (!mounted) {
    				dispose = [
    					listen_dev(select0, "change", /*select0_change_handler*/ ctx[12]),
    					listen_dev(select1, "change", /*select1_change_handler*/ ctx[13]),
    					listen_dev(select2, "change", /*select2_change_handler*/ ctx[14]),
    					listen_dev(select3, "change", /*select3_change_handler*/ ctx[15]),
    					listen_dev(select4, "change", /*select4_change_handler*/ ctx[16]),
    					listen_dev(button, "click", /*handleScheduleSubmit*/ ctx[11], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*mondayMeals*/ 64) {
    				each_value_4 = /*mondayMeals*/ ctx[6];
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4(ctx, each_value_4, i);

    					if (each_blocks_4[i]) {
    						each_blocks_4[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_4[i] = create_each_block_4(child_ctx);
    						each_blocks_4[i].c();
    						each_blocks_4[i].m(select0, null);
    					}
    				}

    				for (; i < each_blocks_4.length; i += 1) {
    					each_blocks_4[i].d(1);
    				}

    				each_blocks_4.length = each_value_4.length;
    			}

    			if (dirty[0] & /*mondaySelected, mondayMeals*/ 65) {
    				select_option(select0, /*mondaySelected*/ ctx[0]);
    			}

    			if (dirty[0] & /*tuesdayMeals*/ 128) {
    				each_value_3 = /*tuesdayMeals*/ ctx[7];
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks_3[i]) {
    						each_blocks_3[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_3[i] = create_each_block_3(child_ctx);
    						each_blocks_3[i].c();
    						each_blocks_3[i].m(select1, null);
    					}
    				}

    				for (; i < each_blocks_3.length; i += 1) {
    					each_blocks_3[i].d(1);
    				}

    				each_blocks_3.length = each_value_3.length;
    			}

    			if (dirty[0] & /*tuesdaySelected, tuesdayMeals*/ 130) {
    				select_option(select1, /*tuesdaySelected*/ ctx[1]);
    			}

    			if (dirty[0] & /*wednesdayMeals*/ 256) {
    				each_value_2 = /*wednesdayMeals*/ ctx[8];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_2(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(select2, null);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_2.length;
    			}

    			if (dirty[0] & /*wednesdaySelected, wednesdayMeals*/ 260) {
    				select_option(select2, /*wednesdaySelected*/ ctx[2]);
    			}

    			if (dirty[0] & /*thursdayMeals*/ 512) {
    				each_value_1 = /*thursdayMeals*/ ctx[9];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(select3, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty[0] & /*thursdaySelected, thursdayMeals*/ 520) {
    				select_option(select3, /*thursdaySelected*/ ctx[3]);
    			}

    			if (dirty[0] & /*fridayMeals*/ 1024) {
    				each_value = /*fridayMeals*/ ctx[10];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select4, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty[0] & /*fridaySelected, fridayMeals*/ 1040) {
    				select_option(select4, /*fridaySelected*/ ctx[4]);
    			}

    			if (dirty[0] & /*totalPrice*/ 32) set_data_dev(t24, /*totalPrice*/ ctx[5]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_each(each_blocks_4, detaching);
    			destroy_each(each_blocks_3, detaching);
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ScheduleModal", slots, []);
    	var mondayMeals = plates.filter(plate => plate.Day === "Monday");
    	var tuesdayMeals = plates.filter(plate => plate.Day === "Tuesday");
    	var wednesdayMeals = plates.filter(plate => plate.Day === "Wednesday");
    	var thursdayMeals = plates.filter(plate => plate.Day === "Thursday");
    	var fridayMeals = plates.filter(plate => plate.Day === "Friday");
    	let mondaySelected;
    	let tuesdaySelected;
    	let wednesdaySelected;
    	let thursdaySelected;
    	let fridaySelected;
    	var totalPrice;
    	const { open, close } = getContext("simple-modal");
    	let opening = false;
    	let opened = false;
    	let closing = false;
    	let closed = false;

    	const showNotification = (messageColor, message) => {
    		open(Notification, { message }, { messageColor });
    	};

    	const handleScheduleSubmit = () => {
    		var scheduleChoices = {
    			monday: monday.options[monday.selectedIndex].text === "Select"
    			? ""
    			: monday.options[monday.selectedIndex].text,
    			tuesday: tuesday.options[tuesday.selectedIndex].text === "Select"
    			? ""
    			: tuesday.options[tuesday.selectedIndex].text,
    			wednesday: wednesday.options[wednesday.selectedIndex].text === "Select"
    			? ""
    			: wednesday.options[wednesday.selectedIndex].text,
    			thursday: thursday.options[thursday.selectedIndex].text === "Select"
    			? ""
    			: thursday.options[thursday.selectedIndex].text,
    			friday: friday.options[friday.selectedIndex].text === "Select"
    			? ""
    			: friday.options[friday.selectedIndex].text
    		};

    		console.log(scheduleChoices);
    		localStorage.setItem("schedule", JSON.stringify(scheduleChoices));
    		showNotification("green", "Choices saved!");

    		setTimeout(
    			() => {
    				window.location.reload();
    				return false;
    			},
    			3100
    		);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<ScheduleModal> was created with unknown prop '${key}'`);
    	});

    	function select0_change_handler() {
    		mondaySelected = select_value(this);
    		$$invalidate(0, mondaySelected);
    		$$invalidate(6, mondayMeals);
    	}

    	function select1_change_handler() {
    		tuesdaySelected = select_value(this);
    		$$invalidate(1, tuesdaySelected);
    		$$invalidate(7, tuesdayMeals);
    	}

    	function select2_change_handler() {
    		wednesdaySelected = select_value(this);
    		$$invalidate(2, wednesdaySelected);
    		$$invalidate(8, wednesdayMeals);
    	}

    	function select3_change_handler() {
    		thursdaySelected = select_value(this);
    		$$invalidate(3, thursdaySelected);
    		$$invalidate(9, thursdayMeals);
    	}

    	function select4_change_handler() {
    		fridaySelected = select_value(this);
    		$$invalidate(4, fridaySelected);
    		$$invalidate(10, fridayMeals);
    	}

    	$$self.$capture_state = () => ({
    		plates,
    		getContext,
    		mondayMeals,
    		tuesdayMeals,
    		wednesdayMeals,
    		thursdayMeals,
    		fridayMeals,
    		mondaySelected,
    		tuesdaySelected,
    		wednesdaySelected,
    		thursdaySelected,
    		fridaySelected,
    		totalPrice,
    		open,
    		close,
    		opening,
    		opened,
    		closing,
    		closed,
    		Notification,
    		showNotification,
    		handleScheduleSubmit
    	});

    	$$self.$inject_state = $$props => {
    		if ("mondayMeals" in $$props) $$invalidate(6, mondayMeals = $$props.mondayMeals);
    		if ("tuesdayMeals" in $$props) $$invalidate(7, tuesdayMeals = $$props.tuesdayMeals);
    		if ("wednesdayMeals" in $$props) $$invalidate(8, wednesdayMeals = $$props.wednesdayMeals);
    		if ("thursdayMeals" in $$props) $$invalidate(9, thursdayMeals = $$props.thursdayMeals);
    		if ("fridayMeals" in $$props) $$invalidate(10, fridayMeals = $$props.fridayMeals);
    		if ("mondaySelected" in $$props) $$invalidate(0, mondaySelected = $$props.mondaySelected);
    		if ("tuesdaySelected" in $$props) $$invalidate(1, tuesdaySelected = $$props.tuesdaySelected);
    		if ("wednesdaySelected" in $$props) $$invalidate(2, wednesdaySelected = $$props.wednesdaySelected);
    		if ("thursdaySelected" in $$props) $$invalidate(3, thursdaySelected = $$props.thursdaySelected);
    		if ("fridaySelected" in $$props) $$invalidate(4, fridaySelected = $$props.fridaySelected);
    		if ("totalPrice" in $$props) $$invalidate(5, totalPrice = $$props.totalPrice);
    		if ("opening" in $$props) opening = $$props.opening;
    		if ("opened" in $$props) opened = $$props.opened;
    		if ("closing" in $$props) closing = $$props.closing;
    		if ("closed" in $$props) closed = $$props.closed;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*mondaySelected, tuesdaySelected, wednesdaySelected, thursdaySelected, fridaySelected*/ 31) {
    			 $$invalidate(5, totalPrice = parseInt(mondaySelected) + parseInt(tuesdaySelected) + parseInt(wednesdaySelected) + parseInt(thursdaySelected) + parseInt(fridaySelected));
    		}
    	};

    	return [
    		mondaySelected,
    		tuesdaySelected,
    		wednesdaySelected,
    		thursdaySelected,
    		fridaySelected,
    		totalPrice,
    		mondayMeals,
    		tuesdayMeals,
    		wednesdayMeals,
    		thursdayMeals,
    		fridayMeals,
    		handleScheduleSubmit,
    		select0_change_handler,
    		select1_change_handler,
    		select2_change_handler,
    		select3_change_handler,
    		select4_change_handler
    	];
    }

    class ScheduleModal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {}, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ScheduleModal",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\components\Navbar.svelte generated by Svelte v3.29.7 */
    const file$4 = "src\\components\\Navbar.svelte";

    function create_fragment$4(ctx) {
    	let header;
    	let h2;
    	let t1;
    	let nav;
    	let ul;
    	let li0;
    	let a0;
    	let t3;
    	let li1;
    	let a1;
    	let t5;
    	let li2;
    	let a2;
    	let t6;
    	let a2_style_value;
    	let t7;
    	let li3;
    	let a3;
    	let t8;
    	let a3_style_value;
    	let t9;
    	let li4;
    	let a4;
    	let t10;
    	let a4_style_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			header = element("header");
    			h2 = element("h2");
    			h2.textContent = "Beverlly's Corner";
    			t1 = space();
    			nav = element("nav");
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "Menu";
    			t3 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "About";
    			t5 = space();
    			li2 = element("li");
    			a2 = element("a");
    			t6 = text("Login");
    			t7 = space();
    			li3 = element("li");
    			a3 = element("a");
    			t8 = text("Schedule");
    			t9 = space();
    			li4 = element("li");
    			a4 = element("a");
    			t10 = text("Logout");
    			attr_dev(h2, "id", "page-header");
    			set_style(h2, "font-family", "helvetica");
    			add_location(h2, file$4, 61, 4, 1435);
    			attr_dev(a0, "href", "#menu");
    			add_location(a0, file$4, 68, 8, 1612);
    			add_location(li0, file$4, 67, 8, 1598);
    			attr_dev(a1, "href", "#about");
    			add_location(a1, file$4, 71, 8, 1693);
    			add_location(li1, file$4, 70, 8, 1679);
    			attr_dev(a2, "id", "login");
    			attr_dev(a2, "style", a2_style_value = `display: ${/*showLogin*/ ctx[0]};`);
    			add_location(a2, file$4, 74, 8, 1776);
    			add_location(li2, file$4, 73, 8, 1762);
    			attr_dev(a3, "id", "schedule");
    			attr_dev(a3, "style", a3_style_value = `display: ${/*showSchedule*/ ctx[1]};`);
    			add_location(a3, file$4, 77, 8, 1897);
    			add_location(li3, file$4, 76, 8, 1883);
    			attr_dev(a4, "id", "logout");
    			attr_dev(a4, "style", a4_style_value = `display: ${/*showLogout*/ ctx[2]};`);
    			add_location(a4, file$4, 80, 8, 2030);
    			add_location(li4, file$4, 79, 8, 2016);
    			add_location(ul, file$4, 66, 4, 1584);
    			attr_dev(nav, "id", "main-navigation");
    			add_location(nav, file$4, 65, 4, 1552);
    			add_location(header, file$4, 59, 0, 1402);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, h2);
    			append_dev(header, t1);
    			append_dev(header, nav);
    			append_dev(nav, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(ul, t3);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(ul, t5);
    			append_dev(ul, li2);
    			append_dev(li2, a2);
    			append_dev(a2, t6);
    			append_dev(ul, t7);
    			append_dev(ul, li3);
    			append_dev(li3, a3);
    			append_dev(a3, t8);
    			append_dev(ul, t9);
    			append_dev(ul, li4);
    			append_dev(li4, a4);
    			append_dev(a4, t10);

    			if (!mounted) {
    				dispose = [
    					listen_dev(a0, "click", scroll, false, false, false),
    					listen_dev(a1, "click", scroll, false, false, false),
    					listen_dev(a2, "click", /*showLoginModal*/ ctx[3], false, false, false),
    					listen_dev(a3, "click", /*showScheduleModal*/ ctx[4], false, false, false),
    					listen_dev(a4, "click", /*handleLogout*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*showLogin*/ 1 && a2_style_value !== (a2_style_value = `display: ${/*showLogin*/ ctx[0]};`)) {
    				attr_dev(a2, "style", a2_style_value);
    			}

    			if (dirty & /*showSchedule*/ 2 && a3_style_value !== (a3_style_value = `display: ${/*showSchedule*/ ctx[1]};`)) {
    				attr_dev(a3, "style", a3_style_value);
    			}

    			if (dirty & /*showLogout*/ 4 && a4_style_value !== (a4_style_value = `display: ${/*showLogout*/ ctx[2]};`)) {
    				attr_dev(a4, "style", a4_style_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function scroll(e) {
    	e.preventDefault();
    	document.querySelector(this.getAttribute("href")).scrollIntoView({ behavior: "smooth" });
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Navbar", slots, []);
    	const { open } = getContext("simple-modal");
    	let opening = false;
    	let opened = false;
    	let closing = false;
    	let closed = false;

    	const showLoginModal = () => {
    		open(LoginModal);
    	};

    	const showNotification = (messageColor, message) => {
    		open(Notification, { message, messageColor });
    	};

    	const showScheduleModal = () => {
    		open(ScheduleModal);
    	};

    	var showLogin = "";
    	var showSchedule = "none";
    	var showLogout = "none";

    	if (localStorage.getItem("login") === "true") {
    		showLogin = "none";
    		showSchedule = "";
    		showLogout = "";
    	}

    	const handleLogout = event => {
    		event.preventDefault();
    		localStorage.removeItem("login");
    		localStorage.removeItem("schedule");
    		showNotification("green", "Bye bye");

    		setTimeout(
    			() => {
    				window.location.reload();
    			},
    			1500
    		);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Navbar> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		getContext,
    		fly,
    		open,
    		opening,
    		opened,
    		closing,
    		closed,
    		LoginModal,
    		showLoginModal,
    		Notification,
    		showNotification,
    		ScheduleModal,
    		showScheduleModal,
    		showLogin,
    		showSchedule,
    		showLogout,
    		scroll,
    		handleLogout
    	});

    	$$self.$inject_state = $$props => {
    		if ("opening" in $$props) opening = $$props.opening;
    		if ("opened" in $$props) opened = $$props.opened;
    		if ("closing" in $$props) closing = $$props.closing;
    		if ("closed" in $$props) closed = $$props.closed;
    		if ("showLogin" in $$props) $$invalidate(0, showLogin = $$props.showLogin);
    		if ("showSchedule" in $$props) $$invalidate(1, showSchedule = $$props.showSchedule);
    		if ("showLogout" in $$props) $$invalidate(2, showLogout = $$props.showLogout);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		showLogin,
    		showSchedule,
    		showLogout,
    		showLoginModal,
    		showScheduleModal,
    		handleLogout
    	];
    }

    class Navbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\components\Hero.svelte generated by Svelte v3.29.7 */

    const file$5 = "src\\components\\Hero.svelte";

    function create_fragment$5(ctx) {
    	let div1;
    	let div0;
    	let h1;
    	let t1;
    	let p;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Beverlly's Corner";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Venha construir uma memória deliciosa";
    			attr_dev(h1, "class", "hero-title");
    			add_location(h1, file$5, 2, 6, 58);
    			add_location(p, file$5, 3, 6, 113);
    			attr_dev(div0, "class", "hero-content");
    			add_location(div0, file$5, 1, 4, 24);
    			attr_dev(div1, "class", "hero");
    			add_location(div1, file$5, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, h1);
    			append_dev(div0, t1);
    			append_dev(div0, p);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Hero", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Hero> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Hero extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Hero",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\components\Plate.svelte generated by Svelte v3.29.7 */

    const file$6 = "src\\components\\Plate.svelte";

    function create_fragment$6(ctx) {
    	let article;
    	let div0;
    	let img_1;
    	let img_1_src_value;
    	let t0;
    	let div1;
    	let p0;
    	let t2;
    	let p1;
    	let t4;
    	let p2;

    	const block = {
    		c: function create() {
    			article = element("article");
    			div0 = element("div");
    			img_1 = element("img");
    			t0 = space();
    			div1 = element("div");
    			p0 = element("p");
    			p0.textContent = `${/*Name*/ ctx[0]}`;
    			t2 = space();
    			p1 = element("p");
    			p1.textContent = `${/*Price*/ ctx[2]}`;
    			t4 = space();
    			p2 = element("p");
    			p2.textContent = `${/*Day*/ ctx[3]}`;
    			if (img_1.src !== (img_1_src_value = /*img*/ ctx[1])) attr_dev(img_1, "src", img_1_src_value);
    			attr_dev(img_1, "alt", /*Name*/ ctx[0]);
    			add_location(img_1, file$6, 8, 8, 155);
    			attr_dev(div0, "class", "img-container");
    			add_location(div0, file$6, 7, 4, 118);
    			attr_dev(p0, "class", "menu-title");
    			add_location(p0, file$6, 11, 8, 238);
    			attr_dev(p1, "class", "menu-price");
    			add_location(p1, file$6, 12, 8, 280);
    			attr_dev(p2, "class", "menu-day");
    			add_location(p2, file$6, 13, 8, 323);
    			attr_dev(div1, "class", "menu-footer");
    			add_location(div1, file$6, 10, 4, 203);
    			attr_dev(article, "class", "menu");
    			add_location(article, file$6, 6, 0, 90);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, div0);
    			append_dev(div0, img_1);
    			append_dev(article, t0);
    			append_dev(article, div1);
    			append_dev(div1, p0);
    			append_dev(div1, t2);
    			append_dev(div1, p1);
    			append_dev(div1, t4);
    			append_dev(div1, p2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Plate", slots, []);
    	let { plate } = $$props;
    	const { Name, img, Price, Day } = plate;
    	const writable_props = ["plate"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Plate> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("plate" in $$props) $$invalidate(4, plate = $$props.plate);
    	};

    	$$self.$capture_state = () => ({ plate, Name, img, Price, Day });

    	$$self.$inject_state = $$props => {
    		if ("plate" in $$props) $$invalidate(4, plate = $$props.plate);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [Name, img, Price, Day, plate];
    }

    class Plate extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { plate: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Plate",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*plate*/ ctx[4] === undefined && !("plate" in props)) {
    			console.warn("<Plate> was created without expected prop 'plate'");
    		}
    	}

    	get plate() {
    		throw new Error("<Plate>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set plate(value) {
    		throw new Error("<Plate>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Menu.svelte generated by Svelte v3.29.7 */
    const file$7 = "src\\components\\Menu.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[0] = list[i];
    	return child_ctx;
    }

    // (9:8) {#each plates as plate}
    function create_each_block$1(ctx) {
    	let plate;
    	let current;

    	plate = new Plate({
    			props: { plate: /*plate*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(plate.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(plate, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(plate.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(plate.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(plate, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(9:8) {#each plates as plate}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div1;
    	let h2;
    	let t1;
    	let div0;
    	let current;
    	let each_value = plates;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Menu";
    			t1 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h2, "class", "site-section-title about-title");
    			add_location(h2, file$7, 6, 4, 145);
    			attr_dev(div0, "class", "menus-center");
    			attr_dev(div0, "id", "addMenu");
    			add_location(div0, file$7, 7, 4, 203);
    			attr_dev(div1, "class", "site-section");
    			attr_dev(div1, "id", "menu");
    			add_location(div1, file$7, 5, 0, 103);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h2);
    			append_dev(div1, t1);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*plates*/ 0) {
    				each_value = plates;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Menu", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Menu> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ plates, Plate });
    	return [];
    }

    class Menu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Menu",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\components\About.svelte generated by Svelte v3.29.7 */

    const file$8 = "src\\components\\About.svelte";

    function create_fragment$8(ctx) {
    	let div;
    	let h2;
    	let t1;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			h2.textContent = "About us";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec semper\r\n      sodales enim dictum lobortis. Fusce ac egestas turpis. Suspendisse\r\n      congue vehicula sem ultrices viverra. Vivamus enim tortor, maximus non\r\n      mattis eu, pretium rhoncus tellus. Class aptent taciti sociosqu ad\r\n      litora torquent per conubia nostra, per inceptos himenaeos. Nam\r\n      bibendum at erat id dapibus. Nullam sed nunc ac nisi condimentum\r\n      vulputate. Curabitur lobortis sem et semper viverra. Donec fermentum\r\n      efficitur orci non faucibus. Aliquam ac est pellentesque, posuere\r\n      augue eget, convallis turpis. Vivamus eleifend ligula et tempor\r\n      cursus. Etiam vehicula, eros eget tincidunt egestas, mi mi pretium\r\n      velit, quis consectetur quam leo vitae nisi. Etiam nunc justo, pretium\r\n      eget vestibulum sed, tempor nec erat. Sed fringilla vitae neque a\r\n      vestibulum. Aenean at sem eu dui tempor sodales id id quam. Curabitur\r\n      semper lacinia purus, ac luctus purus blandit at. Vestibulum ex est,\r\n      consequat in volutpat vitae, porttitor at neque. Vestibulum fermentum\r\n      lectus ligula, nec suscipit elit commodo vel.";
    			attr_dev(h2, "class", "site-section-title about-title");
    			add_location(h2, file$8, 1, 4, 57);
    			attr_dev(p, "class", "about-text");
    			add_location(p, file$8, 2, 4, 119);
    			attr_dev(div, "class", "site-section section-about");
    			attr_dev(div, "id", "about");
    			add_location(div, file$8, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(div, t1);
    			append_dev(div, p);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("About", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\components\Footer.svelte generated by Svelte v3.29.7 */

    const file$9 = "src\\components\\Footer.svelte";

    function create_fragment$9(ctx) {
    	let footer;
    	let span;
    	let t0;
    	let br;
    	let t1;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			span = element("span");
    			t0 = text("Beverlly's Corner ");
    			br = element("br");
    			t1 = text("©2020");
    			add_location(br, file$9, 1, 28, 38);
    			add_location(span, file$9, 1, 4, 14);
    			add_location(footer, file$9, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, span);
    			append_dev(span, t0);
    			append_dev(span, br);
    			append_dev(span, t1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Footer", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\components\Modal.svelte generated by Svelte v3.29.7 */

    const { Object: Object_1 } = globals;
    const file$a = "src\\components\\Modal.svelte";

    // (238:0) {#if Component}
    function create_if_block(ctx) {
    	let div3;
    	let div2;
    	let div1;
    	let t;
    	let div0;
    	let switch_instance;
    	let div1_transition;
    	let div3_transition;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*state*/ ctx[0].closeButton && create_if_block_1(ctx);
    	const switch_instance_spread_levels = [/*props*/ ctx[2]];
    	var switch_value = /*Component*/ ctx[1];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			div0 = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(div0, "class", "content svelte-fnsfcv");
    			attr_dev(div0, "style", /*cssContent*/ ctx[12]);
    			add_location(div0, file$a, 265, 8, 6673);
    			attr_dev(div1, "class", "window svelte-fnsfcv");
    			attr_dev(div1, "role", "dialog");
    			attr_dev(div1, "aria-modal", "true");
    			attr_dev(div1, "style", /*cssWindow*/ ctx[11]);
    			add_location(div1, file$a, 246, 6, 6049);
    			attr_dev(div2, "class", "window-wrap svelte-fnsfcv");
    			add_location(div2, file$a, 245, 4, 5999);
    			attr_dev(div3, "class", "bg svelte-fnsfcv");
    			attr_dev(div3, "style", /*cssBg*/ ctx[10]);
    			add_location(div3, file$a, 238, 2, 5826);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div1, t);
    			append_dev(div1, div0);

    			if (switch_instance) {
    				mount_component(switch_instance, div0, null);
    			}

    			/*div1_binding*/ ctx[35](div1);
    			/*div2_binding*/ ctx[36](div2);
    			/*div3_binding*/ ctx[37](div3);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						div1,
    						"introstart",
    						function () {
    							if (is_function(/*onOpen*/ ctx[6])) /*onOpen*/ ctx[6].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div1,
    						"outrostart",
    						function () {
    							if (is_function(/*onClose*/ ctx[7])) /*onClose*/ ctx[7].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div1,
    						"introend",
    						function () {
    							if (is_function(/*onOpened*/ ctx[8])) /*onOpened*/ ctx[8].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div1,
    						"outroend",
    						function () {
    							if (is_function(/*onClosed*/ ctx[9])) /*onClosed*/ ctx[9].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(div3, "click", /*handleOuterClick*/ ctx[19], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*state*/ ctx[0].closeButton) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*state*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div1, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			const switch_instance_changes = (dirty[0] & /*props*/ 4)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[2])])
    			: {};

    			if (switch_value !== (switch_value = /*Component*/ ctx[1])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div0, null);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}

    			if (!current || dirty[0] & /*cssContent*/ 4096) {
    				attr_dev(div0, "style", /*cssContent*/ ctx[12]);
    			}

    			if (!current || dirty[0] & /*cssWindow*/ 2048) {
    				attr_dev(div1, "style", /*cssWindow*/ ctx[11]);
    			}

    			if (!current || dirty[0] & /*cssBg*/ 1024) {
    				attr_dev(div3, "style", /*cssBg*/ ctx[10]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, /*currentTransitionWindow*/ ctx[15], /*state*/ ctx[0].transitionWindowProps, true);
    				div1_transition.run(1);
    			});

    			add_render_callback(() => {
    				if (!div3_transition) div3_transition = create_bidirectional_transition(div3, /*currentTransitionBg*/ ctx[14], /*state*/ ctx[0].transitionBgProps, true);
    				div3_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			if (!div1_transition) div1_transition = create_bidirectional_transition(div1, /*currentTransitionWindow*/ ctx[15], /*state*/ ctx[0].transitionWindowProps, false);
    			div1_transition.run(0);
    			if (!div3_transition) div3_transition = create_bidirectional_transition(div3, /*currentTransitionBg*/ ctx[14], /*state*/ ctx[0].transitionBgProps, false);
    			div3_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (if_block) if_block.d();
    			if (switch_instance) destroy_component(switch_instance);
    			/*div1_binding*/ ctx[35](null);
    			if (detaching && div1_transition) div1_transition.end();
    			/*div2_binding*/ ctx[36](null);
    			/*div3_binding*/ ctx[37](null);
    			if (detaching && div3_transition) div3_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(238:0) {#if Component}",
    		ctx
    	});

    	return block;
    }

    // (259:8) {#if state.closeButton}
    function create_if_block_1(ctx) {
    	let show_if;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (dirty[0] & /*state*/ 1) show_if = !!/*isSvelteComponent*/ ctx[16](/*state*/ ctx[0].closeButton);
    		if (show_if) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx, [-1]);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx, dirty);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(259:8) {#if state.closeButton}",
    		ctx
    	});

    	return block;
    }

    // (262:5) {:else}
    function create_else_block(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "class", "close svelte-fnsfcv");
    			attr_dev(button, "style", /*cssCloseButton*/ ctx[13]);
    			add_location(button, file$a, 262, 6, 6572);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*close*/ ctx[17], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*cssCloseButton*/ 8192) {
    				attr_dev(button, "style", /*cssCloseButton*/ ctx[13]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(262:5) {:else}",
    		ctx
    	});

    	return block;
    }

    // (260:5) {#if isSvelteComponent(state.closeButton)}
    function create_if_block_2(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*state*/ ctx[0].closeButton;

    	function switch_props(ctx) {
    		return {
    			props: { onClose: /*close*/ ctx[17] },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (switch_value !== (switch_value = /*state*/ ctx[0].closeButton)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(260:5) {#if isSvelteComponent(state.closeButton)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*Component*/ ctx[1] && create_if_block(ctx);
    	const default_slot_template = /*#slots*/ ctx[34].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[33], null);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window, "keydown", /*handleKeydown*/ ctx[18], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*Component*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*Component*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t.parentNode, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (default_slot) {
    				if (default_slot.p && dirty[1] & /*$$scope*/ 4) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[33], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Modal", slots, ['default']);
    	const baseSetContext = setContext;
    	const SvelteComponent = SvelteComponentDev;
    	let { key = "simple-modal" } = $$props;
    	let { closeButton = true } = $$props;
    	let { closeOnEsc = true } = $$props;
    	let { closeOnOuterClick = true } = $$props;
    	let { styleBg = { top: 0, left: 0 } } = $$props;
    	let { styleWindow = {} } = $$props;
    	let { styleContent = {} } = $$props;
    	let { styleCloseButton = {} } = $$props;
    	let { setContext: setContext$1 = baseSetContext } = $$props;
    	let { transitionBg = fade } = $$props;
    	let { transitionBgProps = { duration: 250 } } = $$props;
    	let { transitionWindow = transitionBg } = $$props;
    	let { transitionWindowProps = transitionBgProps } = $$props;

    	const defaultState = {
    		closeButton,
    		closeOnEsc,
    		closeOnOuterClick,
    		styleBg,
    		styleWindow,
    		styleContent,
    		styleCloseButton,
    		transitionBg,
    		transitionBgProps,
    		transitionWindow,
    		transitionWindowProps
    	};

    	let state = { ...defaultState };
    	let Component = null;
    	let props = null;
    	let background;
    	let wrap;
    	let modalWindow;
    	const camelCaseToDash = str => str.replace(/([a-zA-Z])(?=[A-Z])/g, "$1-").toLowerCase();
    	const toCssString = props => Object.keys(props).reduce((str, key) => `${str}; ${camelCaseToDash(key)}: ${props[key]}`, "");
    	const isSvelteComponent = component => SvelteComponent && SvelteComponent.isPrototypeOf(component);

    	const toVoid = () => {
    		
    	};

    	let onOpen = toVoid;
    	let onClose = toVoid;
    	let onOpened = toVoid;
    	let onClosed = toVoid;

    	const open = (NewComponent, newProps = {}, options = {}, callback = {}) => {
    		$$invalidate(1, Component = NewComponent);
    		$$invalidate(2, props = newProps);
    		$$invalidate(0, state = { ...defaultState, ...options });
    		$$invalidate(6, onOpen = callback.onOpen || toVoid);
    		$$invalidate(7, onClose = callback.onClose || toVoid);
    		$$invalidate(8, onOpened = callback.onOpened || toVoid);
    		$$invalidate(9, onClosed = callback.onClosed || toVoid);
    	};

    	const close = (callback = {}) => {
    		$$invalidate(7, onClose = callback.onClose || onClose);
    		$$invalidate(9, onClosed = callback.onClosed || onClosed);
    		$$invalidate(1, Component = null);
    		$$invalidate(2, props = null);
    	};

    	const handleKeydown = event => {
    		if (state.closeOnEsc && Component && event.key === "Escape") {
    			event.preventDefault();
    			close();
    		}

    		if (Component && event.key === "Tab") {
    			// trap focus
    			const nodes = modalWindow.querySelectorAll("*");

    			const tabbable = Array.from(nodes).filter(node => node.tabIndex >= 0);
    			let index = tabbable.indexOf(document.activeElement);
    			if (index === -1 && event.shiftKey) index = 0;
    			index += tabbable.length + (event.shiftKey ? -1 : 1);
    			index %= tabbable.length;
    			tabbable[index].focus();
    			event.preventDefault();
    		}
    	};

    	const handleOuterClick = event => {
    		if (state.closeOnOuterClick && (event.target === background || event.target === wrap)) {
    			event.preventDefault();
    			close();
    		}
    	};

    	setContext$1(key, { open, close });

    	const writable_props = [
    		"key",
    		"closeButton",
    		"closeOnEsc",
    		"closeOnOuterClick",
    		"styleBg",
    		"styleWindow",
    		"styleContent",
    		"styleCloseButton",
    		"setContext",
    		"transitionBg",
    		"transitionBgProps",
    		"transitionWindow",
    		"transitionWindowProps"
    	];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			modalWindow = $$value;
    			$$invalidate(5, modalWindow);
    		});
    	}

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			wrap = $$value;
    			$$invalidate(4, wrap);
    		});
    	}

    	function div3_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			background = $$value;
    			$$invalidate(3, background);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("key" in $$props) $$invalidate(20, key = $$props.key);
    		if ("closeButton" in $$props) $$invalidate(21, closeButton = $$props.closeButton);
    		if ("closeOnEsc" in $$props) $$invalidate(22, closeOnEsc = $$props.closeOnEsc);
    		if ("closeOnOuterClick" in $$props) $$invalidate(23, closeOnOuterClick = $$props.closeOnOuterClick);
    		if ("styleBg" in $$props) $$invalidate(24, styleBg = $$props.styleBg);
    		if ("styleWindow" in $$props) $$invalidate(25, styleWindow = $$props.styleWindow);
    		if ("styleContent" in $$props) $$invalidate(26, styleContent = $$props.styleContent);
    		if ("styleCloseButton" in $$props) $$invalidate(27, styleCloseButton = $$props.styleCloseButton);
    		if ("setContext" in $$props) $$invalidate(28, setContext$1 = $$props.setContext);
    		if ("transitionBg" in $$props) $$invalidate(29, transitionBg = $$props.transitionBg);
    		if ("transitionBgProps" in $$props) $$invalidate(30, transitionBgProps = $$props.transitionBgProps);
    		if ("transitionWindow" in $$props) $$invalidate(31, transitionWindow = $$props.transitionWindow);
    		if ("transitionWindowProps" in $$props) $$invalidate(32, transitionWindowProps = $$props.transitionWindowProps);
    		if ("$$scope" in $$props) $$invalidate(33, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		svelte,
    		fade,
    		baseSetContext,
    		SvelteComponent,
    		key,
    		closeButton,
    		closeOnEsc,
    		closeOnOuterClick,
    		styleBg,
    		styleWindow,
    		styleContent,
    		styleCloseButton,
    		setContext: setContext$1,
    		transitionBg,
    		transitionBgProps,
    		transitionWindow,
    		transitionWindowProps,
    		defaultState,
    		state,
    		Component,
    		props,
    		background,
    		wrap,
    		modalWindow,
    		camelCaseToDash,
    		toCssString,
    		isSvelteComponent,
    		toVoid,
    		onOpen,
    		onClose,
    		onOpened,
    		onClosed,
    		open,
    		close,
    		handleKeydown,
    		handleOuterClick,
    		cssBg,
    		cssWindow,
    		cssContent,
    		cssCloseButton,
    		currentTransitionBg,
    		currentTransitionWindow
    	});

    	$$self.$inject_state = $$props => {
    		if ("key" in $$props) $$invalidate(20, key = $$props.key);
    		if ("closeButton" in $$props) $$invalidate(21, closeButton = $$props.closeButton);
    		if ("closeOnEsc" in $$props) $$invalidate(22, closeOnEsc = $$props.closeOnEsc);
    		if ("closeOnOuterClick" in $$props) $$invalidate(23, closeOnOuterClick = $$props.closeOnOuterClick);
    		if ("styleBg" in $$props) $$invalidate(24, styleBg = $$props.styleBg);
    		if ("styleWindow" in $$props) $$invalidate(25, styleWindow = $$props.styleWindow);
    		if ("styleContent" in $$props) $$invalidate(26, styleContent = $$props.styleContent);
    		if ("styleCloseButton" in $$props) $$invalidate(27, styleCloseButton = $$props.styleCloseButton);
    		if ("setContext" in $$props) $$invalidate(28, setContext$1 = $$props.setContext);
    		if ("transitionBg" in $$props) $$invalidate(29, transitionBg = $$props.transitionBg);
    		if ("transitionBgProps" in $$props) $$invalidate(30, transitionBgProps = $$props.transitionBgProps);
    		if ("transitionWindow" in $$props) $$invalidate(31, transitionWindow = $$props.transitionWindow);
    		if ("transitionWindowProps" in $$props) $$invalidate(32, transitionWindowProps = $$props.transitionWindowProps);
    		if ("state" in $$props) $$invalidate(0, state = $$props.state);
    		if ("Component" in $$props) $$invalidate(1, Component = $$props.Component);
    		if ("props" in $$props) $$invalidate(2, props = $$props.props);
    		if ("background" in $$props) $$invalidate(3, background = $$props.background);
    		if ("wrap" in $$props) $$invalidate(4, wrap = $$props.wrap);
    		if ("modalWindow" in $$props) $$invalidate(5, modalWindow = $$props.modalWindow);
    		if ("onOpen" in $$props) $$invalidate(6, onOpen = $$props.onOpen);
    		if ("onClose" in $$props) $$invalidate(7, onClose = $$props.onClose);
    		if ("onOpened" in $$props) $$invalidate(8, onOpened = $$props.onOpened);
    		if ("onClosed" in $$props) $$invalidate(9, onClosed = $$props.onClosed);
    		if ("cssBg" in $$props) $$invalidate(10, cssBg = $$props.cssBg);
    		if ("cssWindow" in $$props) $$invalidate(11, cssWindow = $$props.cssWindow);
    		if ("cssContent" in $$props) $$invalidate(12, cssContent = $$props.cssContent);
    		if ("cssCloseButton" in $$props) $$invalidate(13, cssCloseButton = $$props.cssCloseButton);
    		if ("currentTransitionBg" in $$props) $$invalidate(14, currentTransitionBg = $$props.currentTransitionBg);
    		if ("currentTransitionWindow" in $$props) $$invalidate(15, currentTransitionWindow = $$props.currentTransitionWindow);
    	};

    	let cssBg;
    	let cssWindow;
    	let cssContent;
    	let cssCloseButton;
    	let currentTransitionBg;
    	let currentTransitionWindow;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*state*/ 1) {
    			 $$invalidate(10, cssBg = toCssString(state.styleBg));
    		}

    		if ($$self.$$.dirty[0] & /*state*/ 1) {
    			 $$invalidate(11, cssWindow = toCssString(state.styleWindow));
    		}

    		if ($$self.$$.dirty[0] & /*state*/ 1) {
    			 $$invalidate(12, cssContent = toCssString(state.styleContent));
    		}

    		if ($$self.$$.dirty[0] & /*state*/ 1) {
    			 $$invalidate(13, cssCloseButton = toCssString(state.styleCloseButton));
    		}

    		if ($$self.$$.dirty[0] & /*state*/ 1) {
    			 $$invalidate(14, currentTransitionBg = state.transitionBg);
    		}

    		if ($$self.$$.dirty[0] & /*state*/ 1) {
    			 $$invalidate(15, currentTransitionWindow = state.transitionWindow);
    		}
    	};

    	return [
    		state,
    		Component,
    		props,
    		background,
    		wrap,
    		modalWindow,
    		onOpen,
    		onClose,
    		onOpened,
    		onClosed,
    		cssBg,
    		cssWindow,
    		cssContent,
    		cssCloseButton,
    		currentTransitionBg,
    		currentTransitionWindow,
    		isSvelteComponent,
    		close,
    		handleKeydown,
    		handleOuterClick,
    		key,
    		closeButton,
    		closeOnEsc,
    		closeOnOuterClick,
    		styleBg,
    		styleWindow,
    		styleContent,
    		styleCloseButton,
    		setContext$1,
    		transitionBg,
    		transitionBgProps,
    		transitionWindow,
    		transitionWindowProps,
    		$$scope,
    		slots,
    		div1_binding,
    		div2_binding,
    		div3_binding
    	];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$a,
    			create_fragment$a,
    			safe_not_equal,
    			{
    				key: 20,
    				closeButton: 21,
    				closeOnEsc: 22,
    				closeOnOuterClick: 23,
    				styleBg: 24,
    				styleWindow: 25,
    				styleContent: 26,
    				styleCloseButton: 27,
    				setContext: 28,
    				transitionBg: 29,
    				transitionBgProps: 30,
    				transitionWindow: 31,
    				transitionWindowProps: 32
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get key() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeButton() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeButton(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeOnEsc() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeOnEsc(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeOnOuterClick() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeOnOuterClick(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleBg() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleBg(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleWindow() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleWindow(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleContent() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleContent(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleCloseButton() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleCloseButton(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get setContext() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set setContext(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionBg() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionBg(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionBgProps() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionBgProps(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionWindow() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionWindow(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionWindowProps() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionWindowProps(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.29.7 */
    const file$b = "src\\App.svelte";

    // (11:1) <Modal>
    function create_default_slot(ctx) {
    	let navbar;
    	let current;
    	navbar = new Navbar({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(navbar.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navbar, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navbar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(11:1) <Modal>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let main;
    	let modal;
    	let t0;
    	let div;
    	let hero;
    	let t1;
    	let menu;
    	let t2;
    	let about;
    	let t3;
    	let footer;
    	let current;

    	modal = new Modal({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	hero = new Hero({ $$inline: true });
    	menu = new Menu({ $$inline: true });
    	about = new About({ $$inline: true });
    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(modal.$$.fragment);
    			t0 = space();
    			div = element("div");
    			create_component(hero.$$.fragment);
    			t1 = space();
    			create_component(menu.$$.fragment);
    			t2 = space();
    			create_component(about.$$.fragment);
    			t3 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(div, "class", "page-main");
    			add_location(div, file$b, 13, 1, 341);
    			add_location(main, file$b, 9, 0, 302);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(modal, main, null);
    			append_dev(main, t0);
    			append_dev(main, div);
    			mount_component(hero, div, null);
    			append_dev(div, t1);
    			mount_component(menu, div, null);
    			append_dev(div, t2);
    			mount_component(about, div, null);
    			append_dev(main, t3);
    			mount_component(footer, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const modal_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			transition_in(hero.$$.fragment, local);
    			transition_in(menu.$$.fragment, local);
    			transition_in(about.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			transition_out(hero.$$.fragment, local);
    			transition_out(menu.$$.fragment, local);
    			transition_out(about.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(modal);
    			destroy_component(hero);
    			destroy_component(menu);
    			destroy_component(about);
    			destroy_component(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Navbar, Hero, Menu, About, Footer, Modal });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
