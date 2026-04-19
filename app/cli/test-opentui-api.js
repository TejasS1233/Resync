#!/usr/bin/env node

import { createCliRenderer, Box, Text } from "@opentui/core";

const renderer = await createCliRenderer();

console.log("Renderer keys:", Object.keys(renderer));
console.log("Renderer.root keys:", Object.keys(renderer.root));

const root = renderer.root;

root.add(Box({ width: "100%", height: "100%" }, 
  Text({ content: "Test" })
));

console.log("After add, root children:", root.children.length);

renderer.render ? console.log("render is function") : console.log("render NOT function");
renderer.draw ? console.log("draw is function") : console.log("draw NOT function");
renderer.root.flush ? console.log("root.flush is function") : console.log("root.flush NOT function");

try { renderer.render(); } catch(e) { console.log("render error:", e.message); }