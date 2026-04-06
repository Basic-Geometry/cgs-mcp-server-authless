 import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Import your exact-ratio geometry system (ESM .mjs file)
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

      // Handle MCP protocol requests
      if (request.method === "POST" && url.pathname === "/mcp") {
        const body = await request.text();

        try {
          const message = JSON.parse(body);

          // List tools
          if (message.method === "tools/list") {
            return new Response(JSON.stringify({
              tools: server._tools || []
            }), {
              headers: { "Content-Type": "application/json" }
            });
          }

          // Call tool
          if (message.method === "tools/call") {
            const toolName = message.params.name;
            const toolArgs = message.params.arguments;

            const result = await server.callTool(toolName, toolArgs);

            return new Response(JSON.stringify(result), {
              headers: { "Content-Type": "application/json" }
            });
          }

        } catch (e) {
          return new Response(JSON.stringify({ error: "Invalid JSON" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }
      }

      // Default DO response
      return new Response("MCP Durable Object Ready", {
        headers: { "Content-Type": "text/plain" }
      });

    } catch (err) {
      return new Response(`Error: ${err}`, { status: 500 });
    }
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
// CLOUDFLARE WORKER HANDLER
// ------------------------------------------------------------


export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Debug logging
    console.log(`Request received: ${request.method} ${path}`);

    // 1. MCP routes
    if (path.startsWith("/mcp")) {
      return handleMCP(request, env, ctx);
    }

    // 2. CGS Chat route
    if (path === "/chat" && request.method === "POST") {
      console.log("Chat request received. Bindings available:", Object.keys(env || {}));

      if (!env.AI) {
        console.error("CRITICAL: env.AI is undefined at runtime!");
        return new Response("AI binding missing at runtime. Please re-add the binding in Settings and deploy again.", { status: 500 });
      }

      try {
        const body = await request.json();
        const { messages } = body as { messages: any[] };

        if (!messages || !Array.isArray(messages)) {
          return new Response("Invalid messages format", { status: 400 });
        }

        const systemPrompt = {
          role: "system",
          content: `You are the official Core Geometric System (CGS) Agent for this website.

This is the one and only exact, self-contained geometric framework grounded in first principles. 
Area of a circle is exactly 3.2 × r². Circumference is exactly 6.4 × r. 
Sphere volume is (√3.2 × r)³ following the square-to-cube logic.
Always explain using the constructive philosophy on the site. Never present traditional π-based formulas as the default.`
        };

        console.log("Calling Gemma with", messages.length, "messages");

        const aiResponse = await env.AI.run("@cf/google/gemma-3-12b-it", {
          messages: [systemPrompt, ...messages],
          stream: true,
          max_tokens: 8192,
          temperature: 0.7
        });

        console.log("Gemma call succeeded, streaming response");

        return new Response(aiResponse, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive"
          }
        });
      } catch (err: any) {
        console.error("Full exception in /chat:", err);
        console.error("Error name:", err.name);
        console.error("Error message:", err.message);
        return new Response("Sorry, the chat ran into an error. Please try again in a moment.", { status: 500 });
      }
    }

    // 3. Serve static assets (including favicon.ico, CSS, images, etc.)
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    // Fallback
    return new Response("Not found", { status: 404 });
  },

  // DURABLE OBJECT REGISTRATION — This must be at the top level, NOT inside fetch
  durableObjects: {
    MCP_OBJECT: "MyMCP"   // Make sure this matches your actual Durable Object class name
  }
};
