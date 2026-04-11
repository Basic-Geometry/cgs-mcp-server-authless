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
  version: "1.0.5"
});

// ------------------------------------------------------------
// DURABLE OBJECT: MCP SERVER HANDLER
// ------------------------------------------------------------

export class MyMCP {
  state: DurableObjectState;
  env: Env;

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);

    // MCP endpoint — all logic centralized
    if (url.pathname === "/mcp") {
      return this.handleMCP(request);
    }

    // Default DO response
    return new Response("MCP Durable Object Ready", {
      headers: { "Content-Type": "text/plain" }
    });

  } catch (err) {
    return new Response(`Error: ${err}`, { status: 500 });
  }
  };

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
// CLOUDFLARE WORKER HANDLER
// ------------------------------------------------------------

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);
    const path = url.pathname;

    console.log(`Request received: ${request.method} ${path}`);

    // 1. MCP routes
    if (url.pathname === "/mcp") {
      return this.handleMCP(request);
    }

    // 2. Serve the MCP manifest
    if (path === "/manifest.json") {
      return new Response(JSON.stringify(manifest, null, 2), {
        headers: {
          "Content-Type": "application/mcp+json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // 3. Serve static assets
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    // 4. Fallback
    return new Response("Not found", { status: 404 });
  },

  // Durable Object registration 
  durableObjects: {
    MCP_OBJECT: "MyMCP"
  }

  async handleMCP(request: Request): Promise<Response> {
    if (request.method !== "POST") {
      return new Response("MCP endpoint. POST JSON-RPC only.", {
        headers: { "Content-Type": "text/plain" }
      });
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
          tools: this.server._tools || []
        }
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // Call tool
    if (message.method === "tools/call") {
      const toolName = message.params.name;
      const toolArgs = message.params.arguments;

      const result = await this.server.callTool(toolName, toolArgs);

      return new Response(JSON.stringify({
        jsonrpc: "2.0",
        id: message.id,
        result
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // Unknown method
    return new Response(JSON.stringify({
      jsonrpc: "2.0",
      id: message.id,
      error: { code: -32601, message: "Method not found" }
    }), {
      headers: { "Content-Type": "application/json" }
    });
}
};
