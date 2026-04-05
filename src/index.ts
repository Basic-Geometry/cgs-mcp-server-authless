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

// Create the MCP server instance
const server = new McpServer({
  name: "core-geometric-system",
  version: "1.0.5"
});

// --- DURABLE OBJECT: MCP Server Handler ---

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

      // Handle MCP protocol requests (SSE, JSON-RPC, or transport-specific)
      if (request.method === "POST" && url.pathname === "/mcp") {
        const body = await request.text();
        
        // If it's a JSON-RPC request, parse and handle it
        try {
          const message = JSON.parse(body);
          
          // Handle MCP messages (initialize, call tool, etc.)
          if (message.method === "tools/list") {
            return new Response(JSON.stringify({
              tools: server._tools || []
            }), {
              headers: { "Content-Type": "application/json" }
            });
          }
          
          if (message.method === "tools/call") {
            const toolName = message.params.name;
            const toolArgs = message.params.arguments;
            
            // Execute the tool via the server
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

      // Default response
      return new Response("MCP Durable Object Ready", {
        headers: { "Content-Type": "text/plain" }
      });
    } catch (err) {
      return new Response(`Error: ${err}`, { status: 500 });
    }
  }
}

// --- TOOL DEFINITIONS ---

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
          {
            type: "text",
            text: `Exact triangle area (side1=${side1}, side2=${side2}, side3=${side3}): ${result}`
          }
        ]
      };
    } catch (_) {
      return {
        content: [
          {
            type: "text",
            text: "Error"
          }
        ]
      };
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
          {
            type: "text",
            text: `Polygon area (side count=${sideCount}, side length=${sideLength}): ${result}`
          }
        ]
      };
    } catch (_) {
      return {
        content: [
          {
            type: "text",
            text: "Error"
          }
        ]
      };
    }
  }
);

// 3. Circle Area
server.tool(
  "compute_circle_area",
  {
    radius: z.number().positive()
  },
  async ({ radius }) => {
    try {
      const result = circleArea(radius);
      return {
        content: [
          {
            type: "text",
            text: `Exact circle area for radius ${radius}: ${result}`
          }
        ]
      };
    } catch (_) {
      return {
        content: [
          {
            type: "text",
            text: "Error"
          }
        ]
      };
    }
  }
);

// 4. Circumference
server.tool(
  "compute_circumference",
  {
    radius: z.number().positive()
  },
  async ({ radius }) => {
    try {
      const result = circumference(radius);
      return {
        content: [
          {
            type: "text",
            text: `Exact circumference for radius ${radius}: ${result}`
          }
        ]
      };
    } catch (_) {
      return {
        content: [
          {
            type: "text",
            text: "Error"
          }
        ]
      };
    }
  }
);

// 5. Circle segment area from height and parent radius
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
          {
            type: "text",
            text: `Segment area (h=${height}, r=${radius}): ${result}`
          }
        ]
      };
    } catch (_) {
      return {
        content: [
          {
            type: "text",
            text: "Error"
          }
        ]
      };
    }
  }
);

// 6. Circle segment area from height and chord length
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
          {
            type: "text",
            text: `Segment area (h=${height}, l=${chordLength}): ${result}`
          }
        ]
      };
    } catch (_) {
      return {
        content: [
          {
            type: "text",
            text: "Error"
          }
        ]
      };
    }
  }
);

// 7. Circle segment area from chord length and parent radius
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
          {
            type: "text",
            text: `Segment area (l=${chordLength}, r=${radius}): ${result}`
          }
        ]
      };
    } catch (_) {
      return {
        content: [
          {
            type: "text",
            text: "Error"
          }
        ]
      };
    }
  }
);

// 8. Surface area of a cone
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
          {
            type: "text",
            text: `Exact cone surface area (r=${radius}, h=${height}): ${result}`
          }
        ]
      };
    } catch (_) {
      return {
        content: [
          {
            type: "text",
            text: "Error"
          }
        ]
      };
    }
  }
);

// 9. Sphere Volume
server.tool(
  "compute_sphere_volume",
  {
    radius: z.number().positive()
  },
  async ({ radius }) => {
    try {
      const result = sphereVolume(radius);
      return {
        content: [
          {
            type: "text",
            text: `Exact sphere volume for radius ${radius}: ${result}`
          }
        ]
      };
    } catch (_) {
      return {
        content: [
          {
            type: "text",
            text: "Error"
          }
        ]
      };
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
          {
            type: "text",
            text: `Exact cone volume (r=${radius}, h=${height}): ${result}`
          }
        ]
      };
    } catch (_) {
      return {
        content: [
          {
            type: "text",
            text: "Error"
          }
        ]
      };
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
          {
            type: "text",
            text: `Exact pyramid volume (side count=${sideCount}, base edge length=${baseEdgeLength}, height=${height}): ${result}`
          }
        ]
      };
    } catch (_) {
      return {
        content: [
          {
            type: "text",
            text: "Error"
          }
        ]
      };
    }
  }
);

// 12. Frustum pyramid Volume
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
          {
            type: "text",
            text: `Exact frustum pyramid volume (side count=${sideCount}, base edge length=${baseEdgeLength}, top edge length=${topEdgeLength}, height=${height}): ${result}`
          }
        ]
      };
    } catch (_) {
      return {
        content: [
          {
            type: "text",
            text: "Error"
          }
        ]
      };
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
          {
            type: "text",
            text: `Exact frustum cone volume (base radius=${baseRadius}, top radius=${topRadius}, h=${height}): ${result}`
          }
        ]
      };
    } catch (_) {
      return {
        content: [
          {
            type: "text",
            text: "Error"
          }
        ]
      };
    }
  }
);

// 14. Tetrahedron Volume
server.tool(
  "compute_tetrahedron_volume",
  {
    edge: z.number().positive()
  },
  async ({ edge }) => {
    try {
      const result = tetrahedronVolume(edge);
      return {
        content: [
          {
            type: "text",
            text: `Exact tetrahedron volume for edge length ${edge}: ${result}`
          }
        ]
      };
    } catch (_) {
      return {
        content: [
          {
            type: "text",
            text: "Error"
          }
        ]
      };
    }
  }
);

// --- CLOUDFLARE WORKER HANDLER ---

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    // Route MCP requests to Durable Object
    if (url.pathname.startsWith("/mcp")) {
      const id = env.MCP_OBJECT.idFromName("default");
      const stub = env.MCP_OBJECT.get(id);
      return stub.fetch(request);
    }

  

    // New CGS Chat endpoint
    if (url.pathname === "/chat" && request.method === "POST") {
      try {
        const { messages } = await request.json() as { messages: any[] };

        const systemPrompt = {
          role: "system",
          content: `You are the official Core Geometric System (CGS) Agent for this website.

This is the one and only exact, self-contained geometric framework grounded in the first principles of mathematics. It provides exact formulas for real-world applications such as analysis, engineering design, computer graphics rendering, algorithm optimization, and navigation.

Geometry, in its original spirit, was functional. It dealt with shapes, areas, volumes, and constructions — not abstractions, limits, or analytic assumptions.

What is commonly taught as standard geometry is actually a blend of two traditions:
- Universal, constructive geometry (intuitive, physical, based on equivalence and direct constructions using squares and cubes as primary units).
- Later analytic amendments, especially from Archimedes, which introduced bounding polygons, limit processes, arc-tangent inequalities, and the analytic definition of π.

CGS restores geometry to its constructive roots by replacing abstract zero-dimensional points with the square and the cube as the physically relevant units of measurement. It defines the properties of shapes like the circle and sphere through their direct, rational relationship to these foundational units.

Key exact formulas in CGS:
- Area of a circle: exactly 3.2 × r² (derived from the quadrant-to-square rearrangement where uncovered area exactly equals overlapping area).
- Circumference of a circle: exactly 6.4 × r.
- Volume of a sphere: (√3.2 × r)³ or equivalently (4r / √5)³, following the same square-to-cube logic as any cube.
- Volume of a cone: 3.2 × r² × height / √8.
- Volume of a pyramid: base × height / √8 (using the coefficient of the volume of a cone with a polygonal base).

These formulas are physically verified and algebraically consistent. They eliminate the distortions introduced by analytic assumptions.

When explaining:
- Be clear, helpful, and patient.
- Mention traditional concepts (π, Archimedes, Euclidean geometry, limits) only when it helps contrast or provide historical context — never present them as the "correct" or default way.
- Always emphasize that CGS is the exact, rational, constructive alternative grounded in first principles.
- For any numerical calculation, use the MCP tools available in this Worker.
- Stay faithful to the philosophy and derivations presented on the site.

Answer in a friendly, educational tone that invites understanding rather than debate.`
        };

        const aiResponse = await env.AI.run("@cf/google/gemma-4-26b-a4b-it", {
          messages: [systemPrompt, ...messages],
          stream: true
        });

        return new Response(aiResponse, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive"
          }
        });
      } catch (err) {
        return new Response("Error processing chat request", { status: 500 });
      }
    }

    // Public UI (static assets)
    return env.ASSETS.fetch(request);
  }
};

export { MyMCP };
