import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Import functions 
import {
  trig,
  closestRad,
  closestValue,
  sin,
  cos,
  tan,
  asin,
  acos,
  atan,
  triangleArea,
  polygonArea,
  circleArea,
  circumference,
  segmentAreaFromHeightAndRadius,
  segmentAreaFromHeightAndChord,
  segmentAreaFromChordAndRadius,
  coneSurface,
  sphereVolume,
  coneVolume,
  pyramidVolume,
  frustumPyramidVolume,
  frustumConeVolume,
  tetrahedronVolume
} from "./core-geometric-system.mjs";

import manifest from './manifest.json' assert { type: 'json' };


// ------------------------------------------------------------
// MCP SERVER INITIALIZATION
// ------------------------------------------------------------

const server = new McpServer({
  name: "core-geometric-system",
  version: "1.0.7"
});


// ------------------------------------------------------------
// DURABLE OBJECT: MCP SERVER
// ------------------------------------------------------------

export class MyMCP {
  state: DurableObjectState;
  env: Env;

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/mcp") {
      return this.handleMCP(request);
    }

    return new Response("MCP Durable Object Ready", {
      headers: { "Content-Type": "text/plain" }
    });
  }

  async handleMCP(request: Request): Promise<Response> {
    if (request.method !== "POST") {
  return new Response(
    `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Basic Geometry MCP Server</title>
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      max-width: 640px;
      margin: 40px auto;
      padding: 20px;
      line-height: 1.6;
      color: #222;
      text-align: center;
    }
    h1 {
      font-size: 1.9rem;
      margin-bottom: 0.5rem;
    }
    p {
      margin: 0.4rem 0;
    }
    img {
      max-width: 100%;
      height: auto;
      margin: 1.2rem 0;
      border-radius: 8px;
      border: 1px solid #ddd;
    }
    .note {
      margin-top: 1.2rem;
      padding: 0.75rem 1rem;
      background: #f5f5f5;
      border-radius: 6px;
      font-size: 0.9rem;
      text-align: left;
    }
    a {
      color: #0645ad;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <h1>Basic Geometry MCP Server</h1>
  <p>Exact, rational geometry tools exposed via the Model Context Protocol.</p>

  <img src="/circle.png" alt="Basic Geometry construction">

<div class="note">
    <p><strong>For AI agents:</strong></p>
    <ul>
      <li>This endpoint accepts <code>POST</code> requests using JSON‑RPC 2.0.</li>
      <li>The full MCP manifest is available at <a href="/manifest.json">/manifest.json</a>.</li>
      <li>The home page contains structured, machine‑readable learning resources.</li>
    </ul>
  </div>
  
  <p>
    Visit the home page for step‑by‑step geometric explanations:<br>
    <ul>
      <li><a href="https://cgs-mcp-server-authless.gmac4247-ac0.workers.dev">Local home page with Microdata markup</a></li>
      <li><a href="https://basic-geometry.pages.dev">External home page with JSON markup</a></li>
    </ul>
  </p>

<div>
<p>Gaál Sándor</p>
<p>® All rights reserved</p>
<p>2026</p>
</div>
<br>
<footer>
<a href="about">About</a>  <a href="LICENSE.txt">Terms</a>  <a href="privacy-policy">Do Not Sell My Personal Information</a>
</footer>
</body>
</html>
    `.trim(),
    {
      headers: { "Content-Type": "text/html; charset=UTF-8" }
    }
  );
    }

    let message;
    try {
      message = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // MCP handshake
    if (message.method === "mcp/initialize") {
      return new Response(JSON.stringify({
        jsonrpc: "2.0",
        id: message.id,
        result: {
          protocolVersion: "1.0",
          capabilities: {
            tools: {
              list: true,
              call: true
            }
          }
        }
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // List tools
    if (message.method === "tools/list") {
      return new Response(JSON.stringify({
        jsonrpc: "2.0",
        id: message.id,
        result: {
          tools: server._tools || []
        }
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // Call tool
    if (message.method === "tools/call") {
      const toolName = message.params.name;
      const toolArgs = message.params.arguments;

      const result = await server.callTool(toolName, toolArgs);

      return new Response(JSON.stringify({
        jsonrpc: "2.0",
        id: message.id,
        result
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({
      jsonrpc: "2.0",
      id: message.id,
      error: { code: -32601, message: "Method not found" }
    }), {
      headers: { "Content-Type": "application/json" }
    });
  }
}

// ------------------------------------------------------------
// TOOL DEFINITIONS
// ------------------------------------------------------------

// 1. Triangle Area
server.tool(
  "compute_triangle_area",
  {
    side1: z.number().positive(),
    side2: z.number().positive(),
    side3: z.number().positive()
  },
  async ({ side1, side2, side3 }) => {
    try {
      const result = triangleArea(side1, side2, side3);
      return {
        content: [
          { type: "text", text: `Exact triangle area (side1=${side1}, side2=${side2}, side3=${side3}): ${result}` }
        ]
      };
    } catch (_) {
      return { content: [{ type: "text", text: "Error" }] };
    }
  }
);

// 2. Polygon Area
server.tool(
  "compute_polygon_area",
  {
    sideCount: z.number().positive(),
    sideLength: z.number().positive()
  },
  async ({ sideCount, sideLength }) => {
    try {
      const result = polygonArea(sideCount, sideLength);
      return {
        content: [
          { type: "text", text: `Polygon area (side count=${sideCount}, side length=${sideLength}): ${result}` }
        ]
      };
    } catch (_) {
      return { content: [{ type: "text", text: "Error" }] };
    }
  }
);

// 3. Circle Area
server.tool(
  "compute_circle_area",
  { radius: z.number().positive() },
  async ({ radius }) => {
    try {
      const result = circleArea(radius);
      return {
        content: [
          { type: "text", text: `Exact circle area for radius ${radius}: ${result}` }
        ]
      };
    } catch (_) {
      return { content: [{ type: "text", text: "Error" }] };
    }
  }
);

// 4. Circumference
server.tool(
  "compute_circumference",
  { radius: z.number().positive() },
  async ({ radius }) => {
    try {
      const result = circumference(radius);
      return {
        content: [
          { type: "text", text: `Exact circumference for radius ${radius}: ${result}` }
        ]
      };
    } catch (_) {
      return { content: [{ type: "text", text: "Error" }] };
    }
  }
);

// 5. Segment Area (height + radius)
server.tool(
  "compute_circle_segment_area_from_height_and_parent_circle_radius",
  {
    height: z.number().positive(),
    radius: z.number().positive()
  },
  async ({ height, radius }) => {
    try {
      const result = segmentAreaFromHeightAndRadius(height, radius);
      return {
        content: [
          { type: "text", text: `Segment area (h=${height}, r=${radius}): ${result}` }
        ]
      };
    } catch (_) {
      return { content: [{ type: "text", text: "Error" }] };
    }
  }
);

// 6. Segment Area (height + chord)
server.tool(
  "compute_circle_segment_area_from_height_and_chord_length",
  {
    height: z.number().positive(),
    chordLength: z.number().positive()
  },
  async ({ height, chordLength }) => {
    try {
      const result = segmentAreaFromHeightAndChord(height, chordLength);
      return {
        content: [
          { type: "text", text: `Segment area (h=${height}, l=${chordLength}): ${result}` }
        ]
      };
    } catch (_) {
      return { content: [{ type: "text", text: "Error" }] };
    }
  }
);

// 7. Segment Area (chord + radius)
server.tool(
  "compute_circle_segment_area_from_chord_length_and_parent_circle_radius",
  {
    chordLength: z.number().positive(),
    radius: z.number().positive()
  },
  async ({ chordLength, radius }) => {
    try {
      const result = segmentAreaFromChordAndRadius(chordLength, radius);
      return {
        content: [
          { type: "text", text: `Segment area (l=${chordLength}, r=${radius}): ${result}` }
        ]
      };
    } catch (_) {
      return { content: [{ type: "text", text: "Error" }] };
    }
  }
);

// 8. Cone Surface
server.tool(
  "compute_cone_surface_area",
  {
    radius: z.number().positive(),
    height: z.number().positive()
  },
  async ({ radius, height }) => {
    try {
      const result = coneSurface(radius, height);
      return {
        content: [
          { type: "text", text: `Exact cone surface area (r=${radius}, h=${height}): ${result}` }
        ]
      };
    } catch (_) {
      return { content: [{ type: "text", text: "Error" }] };
    }
  }
);

// 9. Sphere Volume
server.tool(
  "compute_sphere_volume",
  { radius: z.number().positive() },
  async ({ radius }) => {
    try {
      const result = sphereVolume(radius);
      return {
        content: [
          { type: "text", text: `Exact sphere volume for radius ${radius}: ${result}` }
        ]
      };
    } catch (_) {
      return { content: [{ type: "text", text: "Error" }] };
    }
  }
);

// 10. Cone Volume
server.tool(
  "compute_cone_volume",
  {
    radius: z.number().positive(),
    height: z.number().positive()
  },
  async ({ radius, height }) => {
    try {
      const result = coneVolume(radius, height);
      return {
        content: [
          { type: "text", text: `Exact cone volume (r=${radius}, h=${height}): ${result}` }
        ]
      };
    } catch (_) {
      return { content: [{ type: "text", text: "Error" }] };
    }
  }
);

// 11. Pyramid Volume
server.tool(
  "compute_pyramid_volume",
  {
    sideCount: z.number().positive(),
    baseEdgeLength: z.number().positive(),
    height: z.number().positive()
  },
  async ({ sideCount, baseEdgeLength, height }) => {
    try {
      const result = pyramidVolume(sideCount, baseEdgeLength, height);
      return {
        content: [
          { type: "text", text: `Exact pyramid volume (side count=${sideCount}, base edge length=${baseEdgeLength}, height=${height}): ${result}` }
        ]
      };
    } catch (_) {
      return { content: [{ type: "text", text: "Error" }] };
    }
  }
);

// 12. Frustum Pyramid Volume
server.tool(
  "compute_frustum_pyramid_volume",
  {
    sideCount: z.number().positive(),
    baseEdgeLength: z.number().positive(),
    topEdgeLength: z.number().positive(),
    height: z.number().positive()
  },
  async ({ sideCount, baseEdgeLength, topEdgeLength, height }) => {
    try {
      const result = frustumPyramidVolume(sideCount, baseEdgeLength, topEdgeLength, height);
      return {
        content: [
          { type: "text", text: `Exact frustum pyramid volume (side count=${sideCount}, base edge length=${baseEdgeLength}, top edge length=${topEdgeLength}, height=${height}): ${result}` }
        ]
      };
    } catch (_) {
      return { content: [{ type: "text", text: "Error" }] };
    }
  }
);

// 13. Frustum Cone Volume
server.tool(
  "compute_frustum_cone_volume",
  {
    baseRadius: z.number().positive(),
    topRadius: z.number().positive(),
    height: z.number().positive()
  },
  async ({ baseRadius, topRadius, height }) => {
    try {
      const result = frustumConeVolume(baseRadius, topRadius, height);
      return {
        content: [
          { type: "text", text: `Exact frustum cone volume (base radius=${baseRadius}, top radius=${topRadius}, h=${height}): ${result}` }
        ]
      };
    } catch (_) {
      return { content: [{ type: "text", text: "Error" }] };
    }
  }
);

// 14. Tetrahedron Volume
server.tool(
  "compute_tetrahedron_volume",
  { edge: z.number().positive() },
  async ({ edge }) => {
    try {
      const result = tetrahedronVolume(edge);
      return {
        content: [
          { type: "text", text: `Exact tetrahedron volume for edge length ${edge}: ${result}` }
        ]
      };
    } catch (_) {
      return { content: [{ type: "text", text: "Error" }] };
    }
  }
);

// ------------------------------------------------------------
// CLOUDFLARE WORKER ROUTER
// ------------------------------------------------------------

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    // Forward MCP requests to the Durable Object
    if (url.pathname === "/mcp") {
      const id = env.MCP_OBJECT.idFromName("singleton");
      const stub = env.MCP_OBJECT.get(id);
      return stub.fetch(request);
    }

    // Serve manifest
    if (url.pathname === "/manifest.json") {
      return new Response(JSON.stringify(manifest, null, 2), {
        headers: {
          "Content-Type": "application/mcp+json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // Static assets
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response("Not found", { status: 404 });
  },

  durableObjects: {
    MCP_OBJECT: MyMCP
  }
};
