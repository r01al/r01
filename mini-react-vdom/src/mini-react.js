// Mini React: super tiny Virtual DOM with function components + useState.
// Public API: h(type, props, ...children), render(vnode, container), useState(init)

const TEXT = Symbol("text");

export function h(type, props, ...children) {
  props = props || {};
  // Flatten nested arrays and convert raw values to text vnodes
  const flat = [].concat(...children).flat().map(c =>
    typeof c === "object" ? c : { type: TEXT, props: { nodeValue: String(c) }, key: null }
  );
  const key = props.key ?? null;
  return { type, props: { ...props, children: flat }, key };
}

// Global rendering state for hooks (one active function component at a time)
let CURRENT = null; // { hooks: [], hookIndex: 0, parentDom, oldVNode, newVNode, anchor }

export function useState(initial) {
  if (!CURRENT) throw new Error("useState must be called inside a component");
  const i = CURRENT.hookIndex++;
  if (CURRENT.hooks.length <= i) {
    CURRENT.hooks[i] = typeof initial === "function" ? initial() : initial;
  }
  const setState = (val) => {
    const next = typeof val === "function" ? val(CURRENT.hooks[i]) : val;
    if (Object.is(next, CURRENT.hooks[i])) return;
    CURRENT.hooks[i] = next;
    rerenderComponent(CURRENT);
  };
  return [CURRENT.hooks[i], setState];
}

function isEventProp(name) { return /^on[A-Z]/.test(name); }
function setProp(dom, name, value) {
  if (name === "children" || name === "key") return;
  if (name === "className") { dom.setAttribute("class", value ?? ""); return; }
  if (name === "style" && value && typeof value === "object") {
    for (const k in value) dom.style[k] = value[k];
    return;
  }
  if (isEventProp(name)) {
    const event = name.slice(2).toLowerCase();
    dom.__listeners = dom.__listeners || {};
    if (dom.__listeners[event]) dom.removeEventListener(event, dom.__listeners[event]);
    if (value) dom.addEventListener(event, (dom.__listeners[event] = value));
    return;
  }
  if (value == null || value === false) dom.removeAttribute(name);
  else dom.setAttribute(name, value === true ? "" : value);
}

function updateProps(dom, prev = {}, next = {}) {
  // Remove old
  for (const name in prev) if (!(name in next)) setProp(dom, name, undefined);
  // Add / update new
  for (const name in next) if (prev[name] !== next[name]) setProp(dom, name, next[name]);
}

function createDom(vnode) {
  if (vnode.type === TEXT) return document.createTextNode(vnode.props.nodeValue);
  const dom = document.createElement(vnode.type);
  updateProps(dom, {}, vnode.props);
  vnode.props.children.forEach(c => dom.appendChild(createDom(c)));
  return dom;
}

function sameType(a, b) {
  if (!a || !b) return false;
  // Function components are matched by function reference and optional key
  return a.type === b.type && (a.key ?? null) === (b.key ?? null);
}

export function render(vnode, container) {
  const prev = container.__vnode || null;
  diff(container, vnode, prev);
  container.__vnode = vnode;
}

function diff(parentDom, newVNode, oldVNode, index = 0) {
  if (newVNode == null && oldVNode == null) return;

  // Function component
  if (typeof (newVNode && newVNode.type) === "function") {
    return diffFunctionComponent(parentDom, newVNode, oldVNode, index);
  }

  // Text node
  if ((newVNode && newVNode.type) === TEXT || (oldVNode && oldVNode.type) === TEXT) {
    const oldDom = parentDom.childNodes[index];
    if (!oldVNode) {
      parentDom.insertBefore(createDom(newVNode), parentDom.childNodes[index] || null);
    } else if (!newVNode) {
      parentDom.removeChild(oldDom);
    } else if (oldVNode.props.nodeValue !== newVNode.props.nodeValue) {
      oldDom.nodeValue = newVNode.props.nodeValue;
    }
    return;
  }

  // Regular DOM element
  const oldDom = parentDom.childNodes[index];
  if (!oldVNode) {
    parentDom.insertBefore(createDom(newVNode), oldDom || null);
    return;
  }
  if (!newVNode) {
    parentDom.removeChild(oldDom);
    return;
  }
  if (!sameType(newVNode, oldVNode)) {
    parentDom.replaceChild(createDom(newVNode), oldDom);
    return;
  }
  // Same element type: update props and diff children
  updateProps(oldDom, oldVNode.props, newVNode.props);
  diffChildren(oldDom, newVNode.props.children, oldVNode.props.children);
}

function keyMap(children) {
  const map = new Map();
  children.forEach((c, i) => { if (c && c.key != null) map.set(c.key, i); });
  return map;
}

function diffChildren(parent, newKids, oldKids) {
  // Simple keyed diff with fallback by index
  const oldKeyIndex = keyMap(oldKids);
  let oldUsed = new Set();
  let i = 0;
  for (let n = 0; n < newKids.length; n++) {
    const newKid = newKids[n];
    let matchIndex = -1;
    if (newKid && newKid.key != null && oldKeyIndex.has(newKid.key)) {
      matchIndex = oldKeyIndex.get(newKid.key);
    } else if (n < oldKids.length) {
      matchIndex = n; // fallback: same index
    }
    const oldKid = matchIndex >= 0 ? oldKids[matchIndex] : undefined;
    oldUsed.add(matchIndex);
    diff(parent, newKid, oldKid, i++);
  }
  // Remove leftovers
  for (let k = 0; k < oldKids.length; k++) {
    if (!oldUsed.has(k)) {
      diff(parent, null, oldKids[k], i++);
    }
  }
}

function diffFunctionComponent(parentDom, newVNode, oldVNode, index) {
  // Preserve hook state across renders
  const oldState = (oldVNode && oldVNode._component) || { hooks: [] };
  const scope = {
    hooks: oldState.hooks.slice(),
    hookIndex: 0,
    parentDom,
    oldVNode,
    newVNode,
    anchor: index,
  };
  CURRENT = scope;
  const rendered = newVNode.type({ ...(newVNode.props || {}), children: newVNode.props?.children || [] });
  CURRENT = null;
  newVNode._component = scope;

  newVNode._child = rendered;
  const oldChild = oldVNode && oldVNode._child;
  diff(parentDom, rendered, oldChild, index);
}

function rerenderComponent(scope) {
  const { parentDom, oldVNode, newVNode, anchor } = scope;
  CURRENT = scope;
  const rendered = newVNode.type({ ...(newVNode.props || {}), children: newVNode.props?.children || [] });
  CURRENT = null;
  newVNode._child = rendered;
  diff(parentDom, rendered, oldVNode && oldVNode._child, anchor);
}

export default { h, render, useState };
