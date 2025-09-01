import { h as jsx, render as mount } from "../src/mini-react.js";
import App from "./App.js";

mount(jsx(App), document.getElementById("app"));
