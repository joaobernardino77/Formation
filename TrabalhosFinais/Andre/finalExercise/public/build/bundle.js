
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
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
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
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
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function claim_element(nodes, name, attributes, svg) {
        for (let i = 0; i < nodes.length; i += 1) {
            const node = nodes[i];
            if (node.nodeName === name) {
                let j = 0;
                const remove = [];
                while (j < node.attributes.length) {
                    const attribute = node.attributes[j++];
                    if (!attributes[attribute.name]) {
                        remove.push(attribute.name);
                    }
                }
                for (let k = 0; k < remove.length; k++) {
                    node.removeAttribute(remove[k]);
                }
                return nodes.splice(i, 1)[0];
            }
        }
        return svg ? svg_element(name) : element(name);
    }
    function claim_text(nodes, data) {
        for (let i = 0; i < nodes.length; i += 1) {
            const node = nodes[i];
            if (node.nodeType === 3) {
                node.data = '' + data;
                return nodes.splice(i, 1)[0];
            }
        }
        return text(data);
    }
    function claim_space(nodes) {
        return claim_text(nodes, ' ');
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
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
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
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

    /* src\App.svelte generated by Svelte v3.29.7 */

    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i].Name;
    	child_ctx[8] = list[i].Day;
    	child_ctx[9] = list[i].Type;
    	child_ctx[10] = list[i].Price;
    	child_ctx[11] = list[i].img;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i].Name;
    	child_ctx[8] = list[i].Day;
    	child_ctx[9] = list[i].Type;
    	child_ctx[10] = list[i].Price;
    	child_ctx[11] = list[i].img;
    	return child_ctx;
    }

    // (202:3) {#if loggedIn === true}
    function create_if_block_4(ctx) {
    	let li;
    	let a;
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t = text("Schedule");
    			this.h();
    		},
    		l: function claim(nodes) {
    			li = claim_element(nodes, "LI", { id: true, class: true });
    			var li_nodes = children(li);
    			a = claim_element(li_nodes, "A", { href: true, class: true });
    			var a_nodes = children(a);
    			t = claim_text(a_nodes, "Schedule");
    			a_nodes.forEach(detach_dev);
    			li_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(a, "href", "#contact");
    			attr_dev(a, "class", "svelte-wpdkpp");
    			add_location(a, file, 202, 20, 4060);
    			attr_dev(li, "id", "il_top");
    			attr_dev(li, "class", "svelte-wpdkpp");
    			add_location(li, file, 202, 4, 4044);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(202:3) {#if loggedIn === true}",
    		ctx
    	});

    	return block;
    }

    // (210:1) {#if showLogin === true}
    function create_if_block_3(ctx) {
    	let h1;
    	let t0;
    	let t1;
    	let form0;
    	let input0;
    	let t2;
    	let input1;
    	let t3;
    	let input2;
    	let t4;
    	let form1;
    	let input3;
    	let t5;
    	let input4;
    	let t6;
    	let input5;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text("Login");
    			t1 = space();
    			form0 = element("form");
    			input0 = element("input");
    			t2 = space();
    			input1 = element("input");
    			t3 = space();
    			input2 = element("input");
    			t4 = space();
    			form1 = element("form");
    			input3 = element("input");
    			t5 = space();
    			input4 = element("input");
    			t6 = space();
    			input5 = element("input");
    			this.h();
    		},
    		l: function claim(nodes) {
    			h1 = claim_element(nodes, "H1", { class: true });
    			var h1_nodes = children(h1);
    			t0 = claim_text(h1_nodes, "Login");
    			h1_nodes.forEach(detach_dev);
    			t1 = claim_space(nodes);
    			form0 = claim_element(nodes, "FORM", { id: true });
    			var form0_nodes = children(form0);

    			input0 = claim_element(form0_nodes, "INPUT", {
    				id: true,
    				type: true,
    				placeholder: true,
    				value: true
    			});

    			t2 = claim_space(form0_nodes);

    			input1 = claim_element(form0_nodes, "INPUT", {
    				id: true,
    				type: true,
    				placeholder: true,
    				value: true
    			});

    			t3 = claim_space(form0_nodes);
    			input2 = claim_element(form0_nodes, "INPUT", { id: true, type: true, value: true });
    			form0_nodes.forEach(detach_dev);
    			t4 = claim_space(nodes);
    			form1 = claim_element(nodes, "FORM", { id: true });
    			var form1_nodes = children(form1);

    			input3 = claim_element(form1_nodes, "INPUT", {
    				id: true,
    				type: true,
    				placeholder: true,
    				value: true
    			});

    			t5 = claim_space(form1_nodes);

    			input4 = claim_element(form1_nodes, "INPUT", {
    				id: true,
    				type: true,
    				placeholder: true,
    				value: true
    			});

    			t6 = claim_space(form1_nodes);
    			input5 = claim_element(form1_nodes, "INPUT", { id: true, type: true, value: true });
    			form1_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(h1, "class", "svelte-wpdkpp");
    			add_location(h1, file, 210, 2, 4248);
    			attr_dev(input0, "id", "user");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "Name");
    			input0.value = "";
    			add_location(input0, file, 212, 3, 4294);
    			attr_dev(input1, "id", "pw");
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "placeholder", "Password");
    			input1.value = "";
    			add_location(input1, file, 213, 3, 4357);
    			attr_dev(input2, "id", "rgstr_btn");
    			attr_dev(input2, "type", "submit");
    			input2.value = "get Account";
    			add_location(input2, file, 214, 3, 4426);
    			attr_dev(form0, "id", "register-form");
    			add_location(form0, file, 211, 2, 4265);
    			attr_dev(input3, "id", "userName");
    			attr_dev(input3, "type", "text");
    			attr_dev(input3, "placeholder", "Enter Username");
    			input3.value = "";
    			add_location(input3, file, 222, 3, 4562);
    			attr_dev(input4, "id", "userPw");
    			attr_dev(input4, "type", "password");
    			attr_dev(input4, "placeholder", "Enter Password");
    			input4.value = "";
    			add_location(input4, file, 227, 3, 4655);
    			attr_dev(input5, "id", "login_btn");
    			attr_dev(input5, "type", "submit");
    			input5.value = "Login";
    			add_location(input5, file, 232, 3, 4750);
    			attr_dev(form1, "id", "login-form");
    			add_location(form1, file, 221, 2, 4536);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, form0, anchor);
    			append_dev(form0, input0);
    			append_dev(form0, t2);
    			append_dev(form0, input1);
    			append_dev(form0, t3);
    			append_dev(form0, input2);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, form1, anchor);
    			append_dev(form1, input3);
    			append_dev(form1, t5);
    			append_dev(form1, input4);
    			append_dev(form1, t6);
    			append_dev(form1, input5);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input2, "click", store, { once: true }, false, false),
    					listen_dev(input5, "click", /*check*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(form0);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(form1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(210:1) {#if showLogin === true}",
    		ctx
    	});

    	return block;
    }

    // (262:1) {#if showMenu === true}
    function create_if_block(ctx) {
    	let section;
    	let h10;
    	let t0;
    	let t1;
    	let hr;
    	let t2;
    	let div0;
    	let article0;
    	let h11;
    	let t3;
    	let t4;
    	let t5;
    	let div1;
    	let article1;
    	let h12;
    	let t6;
    	let t7;
    	let each_value_1 = /*plates*/ ctx[3];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*plates*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			section = element("section");
    			h10 = element("h1");
    			t0 = text("MENU");
    			t1 = space();
    			hr = element("hr");
    			t2 = space();
    			div0 = element("div");
    			article0 = element("article");
    			h11 = element("h1");
    			t3 = text("MEAT");
    			t4 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t5 = space();
    			div1 = element("div");
    			article1 = element("article");
    			h12 = element("h1");
    			t6 = text("FISH");
    			t7 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			this.h();
    		},
    		l: function claim(nodes) {
    			section = claim_element(nodes, "SECTION", { class: true });
    			var section_nodes = children(section);
    			h10 = claim_element(section_nodes, "H1", { style: true, class: true });
    			var h10_nodes = children(h10);
    			t0 = claim_text(h10_nodes, "MENU");
    			h10_nodes.forEach(detach_dev);
    			t1 = claim_space(section_nodes);
    			hr = claim_element(section_nodes, "HR", {});
    			t2 = claim_space(section_nodes);
    			div0 = claim_element(section_nodes, "DIV", { class: true, id: true });
    			var div0_nodes = children(div0);
    			article0 = claim_element(div0_nodes, "ARTICLE", { class: true });
    			var article0_nodes = children(article0);
    			h11 = claim_element(article0_nodes, "H1", { class: true });
    			var h11_nodes = children(h11);
    			t3 = claim_text(h11_nodes, "MEAT");
    			h11_nodes.forEach(detach_dev);
    			t4 = claim_space(article0_nodes);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].l(article0_nodes);
    			}

    			article0_nodes.forEach(detach_dev);
    			div0_nodes.forEach(detach_dev);
    			t5 = claim_space(section_nodes);
    			div1 = claim_element(section_nodes, "DIV", { class: true });
    			var div1_nodes = children(div1);
    			article1 = claim_element(div1_nodes, "ARTICLE", { class: true });
    			var article1_nodes = children(article1);
    			h12 = claim_element(article1_nodes, "H1", { class: true });
    			var h12_nodes = children(h12);
    			t6 = claim_text(h12_nodes, "FISH");
    			h12_nodes.forEach(detach_dev);
    			t7 = claim_space(article1_nodes);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].l(article1_nodes);
    			}

    			article1_nodes.forEach(detach_dev);
    			div1_nodes.forEach(detach_dev);
    			section_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			set_style(h10, "text-align", "center");
    			attr_dev(h10, "class", "svelte-wpdkpp");
    			add_location(h10, file, 263, 3, 5775);
    			add_location(hr, file, 264, 3, 5819);
    			attr_dev(h11, "class", "svelte-wpdkpp");
    			add_location(h11, file, 267, 5, 5882);
    			attr_dev(article0, "class", "svelte-wpdkpp");
    			add_location(article0, file, 266, 4, 5867);
    			attr_dev(div0, "class", "left-half svelte-wpdkpp");
    			attr_dev(div0, "id", "menu");
    			add_location(div0, file, 265, 3, 5829);
    			attr_dev(h12, "class", "svelte-wpdkpp");
    			add_location(h12, file, 279, 5, 6212);
    			attr_dev(article1, "class", "svelte-wpdkpp");
    			add_location(article1, file, 278, 4, 6197);
    			attr_dev(div1, "class", "right-half svelte-wpdkpp");
    			add_location(div1, file, 277, 3, 6168);
    			attr_dev(section, "class", "container svelte-wpdkpp");
    			add_location(section, file, 262, 2, 5744);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h10);
    			append_dev(h10, t0);
    			append_dev(section, t1);
    			append_dev(section, hr);
    			append_dev(section, t2);
    			append_dev(section, div0);
    			append_dev(div0, article0);
    			append_dev(article0, h11);
    			append_dev(h11, t3);
    			append_dev(article0, t4);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(article0, null);
    			}

    			append_dev(section, t5);
    			append_dev(section, div1);
    			append_dev(div1, article1);
    			append_dev(article1, h12);
    			append_dev(h12, t6);
    			append_dev(article1, t7);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(article1, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*plates*/ 8) {
    				each_value_1 = /*plates*/ ctx[3];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(article0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*plates*/ 8) {
    				each_value = /*plates*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(article1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(262:1) {#if showMenu === true}",
    		ctx
    	});

    	return block;
    }

    // (270:6) {#if Type === 'Meat'}
    function create_if_block_2(ctx) {
    	let h1;
    	let b;
    	let t0_value = /*Name*/ ctx[7] + "";
    	let t0;
    	let t1;
    	let span;
    	let t2;
    	let t3_value = /*Price*/ ctx[10] + "";
    	let t3;
    	let t4;
    	let t5;
    	let h6;
    	let t6;
    	let t7_value = /*Day*/ ctx[8] + "";
    	let t7;
    	let t8;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			b = element("b");
    			t0 = text(t0_value);
    			t1 = space();
    			span = element("span");
    			t2 = text("- ");
    			t3 = text(t3_value);
    			t4 = text(" €");
    			t5 = space();
    			h6 = element("h6");
    			t6 = text("Done at ");
    			t7 = text(t7_value);
    			t8 = space();
    			img = element("img");
    			this.h();
    		},
    		l: function claim(nodes) {
    			h1 = claim_element(nodes, "H1", { class: true });
    			var h1_nodes = children(h1);
    			b = claim_element(h1_nodes, "B", {});
    			var b_nodes = children(b);
    			t0 = claim_text(b_nodes, t0_value);
    			b_nodes.forEach(detach_dev);
    			t1 = claim_space(h1_nodes);
    			span = claim_element(h1_nodes, "SPAN", {});
    			var span_nodes = children(span);
    			t2 = claim_text(span_nodes, "- ");
    			t3 = claim_text(span_nodes, t3_value);
    			t4 = claim_text(span_nodes, " €");
    			span_nodes.forEach(detach_dev);
    			h1_nodes.forEach(detach_dev);
    			t5 = claim_space(nodes);
    			h6 = claim_element(nodes, "H6", {});
    			var h6_nodes = children(h6);
    			t6 = claim_text(h6_nodes, "Done at ");
    			t7 = claim_text(h6_nodes, t7_value);
    			h6_nodes.forEach(detach_dev);
    			t8 = claim_space(nodes);
    			img = claim_element(nodes, "IMG", { class: true, src: true, alt: true });
    			this.h();
    		},
    		h: function hydrate() {
    			add_location(b, file, 270, 11, 5990);
    			add_location(span, file, 270, 25, 6004);
    			attr_dev(h1, "class", "svelte-wpdkpp");
    			add_location(h1, file, 270, 7, 5986);
    			add_location(h6, file, 271, 7, 6042);
    			attr_dev(img, "class", "image svelte-wpdkpp");
    			if (img.src !== (img_src_value = /*img*/ ctx[11])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "food");
    			add_location(img, file, 272, 7, 6072);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, b);
    			append_dev(b, t0);
    			append_dev(h1, t1);
    			append_dev(h1, span);
    			append_dev(span, t2);
    			append_dev(span, t3);
    			append_dev(span, t4);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, h6, anchor);
    			append_dev(h6, t6);
    			append_dev(h6, t7);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(h6);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(270:6) {#if Type === 'Meat'}",
    		ctx
    	});

    	return block;
    }

    // (269:5) {#each plates as { Name, Day, Type, Price, img }}
    function create_each_block_1(ctx) {
    	let if_block_anchor;
    	let if_block = /*Type*/ ctx[9] === "Meat" && create_if_block_2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			if (if_block) if_block.l(nodes);
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*Type*/ ctx[9] === "Meat") if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(269:5) {#each plates as { Name, Day, Type, Price, img }}",
    		ctx
    	});

    	return block;
    }

    // (282:6) {#if Type === 'Fish'}
    function create_if_block_1(ctx) {
    	let h1;
    	let b;
    	let t0_value = /*Name*/ ctx[7] + "";
    	let t0;
    	let t1;
    	let span;
    	let t2;
    	let t3_value = /*Price*/ ctx[10] + "";
    	let t3;
    	let t4;
    	let t5;
    	let h6;
    	let t6;
    	let t7_value = /*Day*/ ctx[8] + "";
    	let t7;
    	let t8;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			b = element("b");
    			t0 = text(t0_value);
    			t1 = space();
    			span = element("span");
    			t2 = text("- ");
    			t3 = text(t3_value);
    			t4 = text(" €");
    			t5 = space();
    			h6 = element("h6");
    			t6 = text("Done at ");
    			t7 = text(t7_value);
    			t8 = space();
    			img = element("img");
    			this.h();
    		},
    		l: function claim(nodes) {
    			h1 = claim_element(nodes, "H1", { class: true });
    			var h1_nodes = children(h1);
    			b = claim_element(h1_nodes, "B", {});
    			var b_nodes = children(b);
    			t0 = claim_text(b_nodes, t0_value);
    			b_nodes.forEach(detach_dev);
    			t1 = claim_space(h1_nodes);
    			span = claim_element(h1_nodes, "SPAN", {});
    			var span_nodes = children(span);
    			t2 = claim_text(span_nodes, "- ");
    			t3 = claim_text(span_nodes, t3_value);
    			t4 = claim_text(span_nodes, " €");
    			span_nodes.forEach(detach_dev);
    			h1_nodes.forEach(detach_dev);
    			t5 = claim_space(nodes);
    			h6 = claim_element(nodes, "H6", {});
    			var h6_nodes = children(h6);
    			t6 = claim_text(h6_nodes, "Done at ");
    			t7 = claim_text(h6_nodes, t7_value);
    			h6_nodes.forEach(detach_dev);
    			t8 = claim_space(nodes);
    			img = claim_element(nodes, "IMG", { class: true, src: true, alt: true });
    			this.h();
    		},
    		h: function hydrate() {
    			add_location(b, file, 282, 11, 6320);
    			add_location(span, file, 282, 25, 6334);
    			attr_dev(h1, "class", "svelte-wpdkpp");
    			add_location(h1, file, 282, 7, 6316);
    			add_location(h6, file, 283, 7, 6372);
    			attr_dev(img, "class", "image svelte-wpdkpp");
    			if (img.src !== (img_src_value = /*img*/ ctx[11])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "food");
    			add_location(img, file, 284, 7, 6402);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, b);
    			append_dev(b, t0);
    			append_dev(h1, t1);
    			append_dev(h1, span);
    			append_dev(span, t2);
    			append_dev(span, t3);
    			append_dev(span, t4);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, h6, anchor);
    			append_dev(h6, t6);
    			append_dev(h6, t7);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(h6);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(282:6) {#if Type === 'Fish'}",
    		ctx
    	});

    	return block;
    }

    // (281:5) {#each plates as { Name, Day, Type, Price, img }}
    function create_each_block(ctx) {
    	let if_block_anchor;
    	let if_block = /*Type*/ ctx[9] === "Fish" && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			if (if_block) if_block.l(nodes);
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*Type*/ ctx[9] === "Fish") if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(281:5) {#each plates as { Name, Day, Type, Price, img }}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let nav;
    	let ul;
    	let li0;
    	let a0;
    	let t0;
    	let t1;
    	let li1;
    	let a1;
    	let t2;
    	let t3;
    	let t4;
    	let li2;
    	let a2;
    	let t5;
    	let t6;
    	let t7;
    	let div;
    	let section;
    	let hr0;
    	let t8;
    	let h2;
    	let t9;
    	let t10;
    	let hr1;
    	let t11;
    	let p;
    	let t12;
    	let t13;
    	let hr2;
    	let t14;
    	let mounted;
    	let dispose;
    	let if_block0 = /*loggedIn*/ ctx[2] === true && create_if_block_4(ctx);
    	let if_block1 = /*showLogin*/ ctx[1] === true && create_if_block_3(ctx);
    	let if_block2 = /*showMenu*/ ctx[0] === true && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			nav = element("nav");
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			t0 = text("About");
    			t1 = space();
    			li1 = element("li");
    			a1 = element("a");
    			t2 = text("Menu");
    			t3 = space();
    			if (if_block0) if_block0.c();
    			t4 = space();
    			li2 = element("li");
    			a2 = element("a");
    			t5 = text("LOGIN");
    			t6 = space();
    			if (if_block1) if_block1.c();
    			t7 = space();
    			div = element("div");
    			section = element("section");
    			hr0 = element("hr");
    			t8 = space();
    			h2 = element("h2");
    			t9 = text("About the restaurant");
    			t10 = space();
    			hr1 = element("hr");
    			t11 = space();
    			p = element("p");
    			t12 = text("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam\n\t\t\t\tquis risus malesuada, consequat justo in, porta est. Maecenas\n\t\t\t\tultrices imperdiet est, id pellentesque dui posuere eget. Sed\n\t\t\t\tvarius at ipsum ultricies tempor. Morbi venenatis cursus massa\n\t\t\t\tid pulvinar. Donec eleifend a metus eget suscipit. Cras\n\t\t\t\tpellentesque nisl lectus, ac cursus ipsum rutrum nec. Sed\n\t\t\t\tcondimentum tortor arcu, non luctus erat gravida non. Nulla dui\n\t\t\t\telit, molestie quis risus id, fermentum laoreet eros. Vestibulum\n\t\t\t\tquam risus, posuere a finibus quis, facilisis ut leo. Morbi\n\t\t\t\tmassa mi, faucibus ac venenatis vitae, ornare ut magna. Mauris\n\t\t\t\teget venenatis lorem, sit amet rhoncus mauris.");
    			t13 = space();
    			hr2 = element("hr");
    			t14 = space();
    			if (if_block2) if_block2.c();
    			this.h();
    		},
    		l: function claim(nodes) {
    			main = claim_element(nodes, "MAIN", {});
    			var main_nodes = children(main);
    			nav = claim_element(main_nodes, "NAV", {});
    			var nav_nodes = children(nav);
    			ul = claim_element(nav_nodes, "UL", { id: true, class: true });
    			var ul_nodes = children(ul);
    			li0 = claim_element(ul_nodes, "LI", { id: true, class: true });
    			var li0_nodes = children(li0);
    			a0 = claim_element(li0_nodes, "A", { href: true, class: true });
    			var a0_nodes = children(a0);
    			t0 = claim_text(a0_nodes, "About");
    			a0_nodes.forEach(detach_dev);
    			li0_nodes.forEach(detach_dev);
    			t1 = claim_space(ul_nodes);
    			li1 = claim_element(ul_nodes, "LI", { id: true, class: true });
    			var li1_nodes = children(li1);
    			a1 = claim_element(li1_nodes, "A", { href: true, class: true });
    			var a1_nodes = children(a1);
    			t2 = claim_text(a1_nodes, "Menu");
    			a1_nodes.forEach(detach_dev);
    			li1_nodes.forEach(detach_dev);
    			t3 = claim_space(ul_nodes);
    			if (if_block0) if_block0.l(ul_nodes);
    			t4 = claim_space(ul_nodes);
    			li2 = claim_element(ul_nodes, "LI", { id: true, style: true, class: true });
    			var li2_nodes = children(li2);
    			a2 = claim_element(li2_nodes, "A", { href: true, class: true });
    			var a2_nodes = children(a2);
    			t5 = claim_text(a2_nodes, "LOGIN");
    			a2_nodes.forEach(detach_dev);
    			li2_nodes.forEach(detach_dev);
    			ul_nodes.forEach(detach_dev);
    			nav_nodes.forEach(detach_dev);
    			t6 = claim_space(main_nodes);
    			if (if_block1) if_block1.l(main_nodes);
    			t7 = claim_space(main_nodes);
    			div = claim_element(main_nodes, "DIV", { id: true, class: true });
    			var div_nodes = children(div);
    			section = claim_element(div_nodes, "SECTION", {});
    			var section_nodes = children(section);
    			hr0 = claim_element(section_nodes, "HR", {});
    			t8 = claim_space(section_nodes);
    			h2 = claim_element(section_nodes, "H2", { style: true });
    			var h2_nodes = children(h2);
    			t9 = claim_text(h2_nodes, "About the restaurant");
    			h2_nodes.forEach(detach_dev);
    			t10 = claim_space(section_nodes);
    			hr1 = claim_element(section_nodes, "HR", {});
    			t11 = claim_space(section_nodes);
    			p = claim_element(section_nodes, "P", {});
    			var p_nodes = children(p);
    			t12 = claim_text(p_nodes, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam\n\t\t\t\tquis risus malesuada, consequat justo in, porta est. Maecenas\n\t\t\t\tultrices imperdiet est, id pellentesque dui posuere eget. Sed\n\t\t\t\tvarius at ipsum ultricies tempor. Morbi venenatis cursus massa\n\t\t\t\tid pulvinar. Donec eleifend a metus eget suscipit. Cras\n\t\t\t\tpellentesque nisl lectus, ac cursus ipsum rutrum nec. Sed\n\t\t\t\tcondimentum tortor arcu, non luctus erat gravida non. Nulla dui\n\t\t\t\telit, molestie quis risus id, fermentum laoreet eros. Vestibulum\n\t\t\t\tquam risus, posuere a finibus quis, facilisis ut leo. Morbi\n\t\t\t\tmassa mi, faucibus ac venenatis vitae, ornare ut magna. Mauris\n\t\t\t\teget venenatis lorem, sit amet rhoncus mauris.");
    			p_nodes.forEach(detach_dev);
    			t13 = claim_space(section_nodes);
    			hr2 = claim_element(section_nodes, "HR", {});
    			section_nodes.forEach(detach_dev);
    			div_nodes.forEach(detach_dev);
    			t14 = claim_space(main_nodes);
    			if (if_block2) if_block2.l(main_nodes);
    			main_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(a0, "href", "#about");
    			attr_dev(a0, "class", "svelte-wpdkpp");
    			add_location(a0, file, 199, 19, 3916);
    			attr_dev(li0, "id", "il_top");
    			attr_dev(li0, "class", "svelte-wpdkpp");
    			add_location(li0, file, 199, 3, 3900);
    			attr_dev(a1, "href", "#menu");
    			attr_dev(a1, "class", "svelte-wpdkpp");
    			add_location(a1, file, 200, 19, 3967);
    			attr_dev(li1, "id", "il_top");
    			attr_dev(li1, "class", "svelte-wpdkpp");
    			add_location(li1, file, 200, 3, 3951);
    			attr_dev(a2, "href", "#login");
    			attr_dev(a2, "class", "svelte-wpdkpp");
    			add_location(a2, file, 205, 4, 4150);
    			attr_dev(li2, "id", "il_top");
    			set_style(li2, "float", "right");
    			attr_dev(li2, "class", "svelte-wpdkpp");
    			add_location(li2, file, 204, 3, 4109);
    			attr_dev(ul, "id", "ul_top");
    			attr_dev(ul, "class", "svelte-wpdkpp");
    			add_location(ul, file, 198, 2, 3880);
    			add_location(nav, file, 197, 1, 3872);
    			add_location(hr0, file, 241, 3, 4886);
    			set_style(h2, "text-align", "center");
    			add_location(h2, file, 242, 3, 4896);
    			add_location(hr1, file, 243, 3, 4955);
    			add_location(p, file, 244, 3, 4965);
    			add_location(hr2, file, 257, 3, 5688);
    			add_location(section, file, 240, 2, 4873);
    			attr_dev(div, "id", "about");
    			attr_dev(div, "class", "svelte-wpdkpp");
    			add_location(div, file, 239, 1, 4854);
    			add_location(main, file, 196, 0, 3864);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, nav);
    			append_dev(nav, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(a0, t0);
    			append_dev(ul, t1);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(a1, t2);
    			append_dev(ul, t3);
    			if (if_block0) if_block0.m(ul, null);
    			append_dev(ul, t4);
    			append_dev(ul, li2);
    			append_dev(li2, a2);
    			append_dev(a2, t5);
    			append_dev(main, t6);
    			if (if_block1) if_block1.m(main, null);
    			append_dev(main, t7);
    			append_dev(main, div);
    			append_dev(div, section);
    			append_dev(section, hr0);
    			append_dev(section, t8);
    			append_dev(section, h2);
    			append_dev(h2, t9);
    			append_dev(section, t10);
    			append_dev(section, hr1);
    			append_dev(section, t11);
    			append_dev(section, p);
    			append_dev(p, t12);
    			append_dev(section, t13);
    			append_dev(section, hr2);
    			append_dev(main, t14);
    			if (if_block2) if_block2.m(main, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(a1, "click", /*Menu*/ ctx[4], false, false, false),
    					listen_dev(a2, "click", /*Login*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*loggedIn*/ ctx[2] === true) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_4(ctx);
    					if_block0.c();
    					if_block0.m(ul, t4);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*showLogin*/ ctx[1] === true) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_3(ctx);
    					if_block1.c();
    					if_block1.m(main, t7);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*showMenu*/ ctx[0] === true) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block(ctx);
    					if_block2.c();
    					if_block2.m(main, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			mounted = false;
    			run_all(dispose);
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

    function store() {
    	// Name and Password from the register-form
    	var name1 = document.getElementById("user").value;

    	var pw = document.getElementById("pw").value;
    	localStorage.setItem("user", name1);
    	localStorage.setItem("pw", pw);
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);

    	var plates = [
    		{
    			Name: "Salmon",
    			Day: "Monday",
    			Type: "Fish",
    			Price: 8,
    			img: "https://cdn.pixabay.com/photo/2014/11/05/15/57/salmon-518032_960_720.jpg"
    		},
    		{
    			Name: "Lasagna",
    			Day: "Monday",
    			Type: "Meat",
    			Price: 7,
    			img: "https://cdn.pixabay.com/photo/2016/12/11/22/41/lasagna-1900529_960_720.jpg"
    		},
    		{
    			Name: "Sardines",
    			Day: "Tuesday",
    			Type: "Fish",
    			Price: 6,
    			img: "https://cdn.pixabay.com/photo/2016/06/30/18/49/sardines-1489626_960_720.jpg"
    		},
    		{
    			Name: "Chicken",
    			Day: "Tuesday",
    			Type: "Meat",
    			Price: 5,
    			img: "https://cdn.pixabay.com/photo/2016/11/18/17/42/barbecue-1836053_960_720.jpg"
    		},
    		{
    			Name: "Fish And Chips",
    			Day: "Wednesday",
    			Type: "Fish",
    			Price: 5,
    			img: "https://cdn.pixabay.com/photo/2017/12/26/04/51/fish-and-chip-3039746_960_720.jpg"
    		},
    		{
    			Name: "Hamburguer",
    			Day: "Wednesday",
    			Type: "Meat",
    			Price: 4,
    			img: "https://cdn.pixabay.com/photo/2016/03/05/19/37/appetite-1238459_960_720.jpg"
    		},
    		{
    			Name: "Sushi",
    			Day: "Thursday",
    			Type: "Fish",
    			Price: 10,
    			img: "https://cdn.pixabay.com/photo/2016/11/25/16/08/sushi-1858696_960_720.jpg"
    		},
    		{
    			Name: "Spaghetti bolognese",
    			Day: "Thursday",
    			Type: "Meat",
    			Price: 7,
    			img: "https://cdn.pixabay.com/photo/2019/10/13/14/23/spaghetti-bolognese-4546233_960_720.jpg"
    		},
    		{
    			Name: "Chicken",
    			Day: "Friday",
    			Type: "Meat",
    			Price: 6,
    			img: "https://cdn.pixabay.com/photo/2016/11/18/17/42/barbecue-1836053_960_720.jpg"
    		},
    		{
    			Name: "Fish Soup",
    			Day: "Friday",
    			Type: "Fish",
    			Price: 7,
    			img: "https://cdn.pixabay.com/photo/2018/01/01/17/57/fish-soup-3054627_960_720.jpg"
    		}
    	];

    	let showMenu = false;
    	let showLogin = false;
    	let loggedIn = false;
    	const Menu = () => $$invalidate(0, showMenu = showMenu ? false : true);
    	const Login = () => $$invalidate(1, showLogin = showLogin ? false : true);

    	// check if stored data from register-form is equal to entered data in the   login-form
    	function check() {
    		// stored data from the register-form
    		var storedName = localStorage.getItem("user");

    		var storedPw = localStorage.getItem("pw");

    		// entered data from the login-form
    		var userName = document.getElementById("userName").value;

    		var userPw = document.getElementById("userPw").value;

    		// check if stored data from register-form is equal to data from login form
    		if (userName !== storedName || userPw !== storedPw) {
    			alert("ERROR");
    		} else {
    			alert("You are loged in.");
    			$$invalidate(2, loggedIn = true);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		plates,
    		showMenu,
    		showLogin,
    		loggedIn,
    		Menu,
    		Login,
    		store,
    		check
    	});

    	$$self.$inject_state = $$props => {
    		if ("plates" in $$props) $$invalidate(3, plates = $$props.plates);
    		if ("showMenu" in $$props) $$invalidate(0, showMenu = $$props.showMenu);
    		if ("showLogin" in $$props) $$invalidate(1, showLogin = $$props.showLogin);
    		if ("loggedIn" in $$props) $$invalidate(2, loggedIn = $$props.loggedIn);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [showMenu, showLogin, loggedIn, plates, Menu, Login, check];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	hydrate: true
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
