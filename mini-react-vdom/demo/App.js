import { h as jsx, useState as useS } from "../src/mini-react.js";

export function Counter({ initial = 0 }) {
  const [count, setCount] = useS(initial);
  return jsx("div", { style: { display: "grid", gap: "8px" } },
    jsx("div", { className: "row" }, jsx("strong", null, "Counter:"), " ", count),
    jsx("div", { className: "row" },
      jsx("button", { onClick: () => setCount(c => c - 1) }, "−1"),
      jsx("button", { onClick: () => setCount(0) }, "Reset"),
      jsx("button", { onClick: () => setCount(c => c + 1) }, "+1")
    ),
    jsx("div", { className: "muted" }, "This component uses a homemade ", jsx("code", null, "useState"), ".")
  );
}

export function ListDemo() {
  const [items, setItems] = useS([1, 2, 3]);
  const add = () => setItems(xs => [...xs, xs.length ? Math.max(...xs) + 1 : 1]);
  const remove = (id) => setItems(xs => xs.filter(x => x !== id));
  return jsx("div", { style: { display: "grid", gap: "8px" } },
    jsx("div", { className: "row" }, jsx("strong", null, "Keyed list demo")),
    jsx("div", null,
      ...items.map(id => jsx("div", { key: id, className: "row" },
        jsx("code", null, `#${id}`),
        jsx("button", { onClick: () => remove(id) }, "remove")
      ))
    ),
    jsx("div", { className: "row" }, jsx("button", { onClick: add }, "Add item"))
  );
}

export default function App() {
  return jsx("div", { style: { display: "grid", gap: "16px" } },
    jsx("div", null, jsx("strong", null, "Hello from a tiny VDOM!")),
    jsx(Counter, { initial: 3 }),
    jsx("hr"),
    jsx(ListDemo)
  );
}
