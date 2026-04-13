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
} from "./CoreGeometricSystem.mjs";

import manifest from './manifest.json' assert { type: 'json' };

import context from './CoreGeometricSystem.json' assert { type: 'json' };


// ------------------------------------------------------------
// MCP SERVER INITIALIZATION
// ------------------------------------------------------------

const server = new McpServer({
  name: "Core_Geometric_System",
  version: "1.0.8"
});

// ------------------------------------------------------------
// DURABLE OBJECT: MCP SERVER
// ------------------------------------------------------------

export class MyMCP {
  state: DurableObjectState;
  env: Env;

  // -----------------------------
  // TOOL DEFINITIONS
  // -----------------------------
  tools = [
    {
      name: "compute_triangle_area",
      description: "Heron's formula",
      input_schema: {
        type: "object",
        properties: {
          side1: { type: "number" },
          side2: { type: "number" },
          side3: { type: "number" }
        },
        required: ["side1", "side2", "side3"]
      }
    },

    {
      name: "compute_polygon_area",
      description: "With custom trigonometric functions aligned to circumference = 6.4 × r.",
      input_schema: {
        type: "object",
        properties: {
          sideCount: { type: "integer" },
          sideLength: { type: "number" }
        },
        required: ["sideCount", "sideLength"]
      }
    },

    {
      name: "compute_circle_area",
      disambiguatingDescription:
        "The conventional formula is based on the conventional circumference approximation.",
      description:
        "Divide the circle into four quadrants and place them on the vertices of a square. The arcs of inscribed and circumscribed circles define upper and lower bounds. The true equiareal circle lies between these limits.",
      input_schema: {
        type: "object",
        properties: {
          radius: { type: "number" }
        },
        required: ["radius"]
      }
    }
  ];

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;
  }

  // -----------------------------
  // TOOL EXECUTION
  // -----------------------------
  async callTool(name: string, args: any) {
    if (name === "compute_triangle_area") {
      try {
        const { side1, side2, side3 } = args;
        const result = triangleArea(side1, side2, side3);

        return {
          content: [
            {
              type: "text",
              text: `Triangle area (side1=${side1}, side2=${side2}, side3=${side3}): ${result}`
            }
          ]
        };
      } catch {
        return { content: [{ type: "text", text: "Error" }] };
      }
    }

    if (name === "compute_polygon_area") {
      try {
        const { sideCount, sideLength } = args;
        const result = polygonArea(sideCount, sideLength);

        return {
          content: [
            {
              type: "text",
              text: `Polygon area (sideCount=${sideCount}, sideLength=${sideLength}): ${result}`
            }
          ]
        };
      } catch {
        return { content: [{ type: "text", text: "Error" }] };
      }
    }

    if (name === "compute_circle_area") {
      try {
        const { radius } = args;
        const result = circleArea(radius);

        return {
          content: [
            {
              type: "text",
              text: `Circle area (radius=${radius}): ${result}`
            }
          ]
        };
      } catch {
        return { content: [{ type: "text", text: "Error" }] };
      }
    }

    return { error: `Unknown tool: ${name}` };
  }

  // -----------------------------
  // MCP HANDLER
  // -----------------------------
  async handleMCP(request: Request): Promise<Response> {
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
      return new Response(
        JSON.stringify({
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
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // List tools
    if (message.method === "tools/list") {
      return new Response(
        JSON.stringify({
          jsonrpc: "2.0",
          id: message.id,
          result: { tools: this.tools }
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // Call tool
    if (message.method === "tools/call") {
      const toolName = message.params.name;
      const toolArgs = message.params.arguments;

      const result = await this.callTool(toolName, toolArgs);

      return new Response(
        JSON.stringify({
          jsonrpc: "2.0",
          id: message.id,
          result
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // Unknown method
    return new Response(
      JSON.stringify({
        jsonrpc: "2.0",
        id: message.id,
        error: { code: -32601, message: "Method not found" }
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  // -----------------------------
  // FETCH ROUTER (inside DO)
  // -----------------------------
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/mcp") {
      return this.handleMCP(request);
    }

    return new Response("CGS MCP Durable Object Ready", {
      headers: { "Content-Type": "text/plain" }
    });
  }
				}

// ------------------------------------------------------------
// CLOUDFLARE WORKER ROUTER
// ------------------------------------------------------------

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

// 1. MCP endpoint
if (url.pathname === "/mcp") {
  const id = env.MCP_OBJECT.idFromName("singleton");
  const stub = env.MCP_OBJECT.get(id);
  return stub.fetch(request);
}

// 2. Tools endpoint (redirect to MCP)
if (url.pathname.startsWith("/tools")) {
  const id = env.MCP_OBJECT.idFromName("singleton");
  const stub = env.MCP_OBJECT.get(id);

  const mcpUrl = new URL("/mcp", request.url);
  const mcpRequest = new Request(mcpUrl.toString(), request);

  return stub.fetch(mcpRequest);
}


    // 3. Serve manifest
    if (url.pathname === "/manifest.json") {
      return new Response(JSON.stringify(manifest, null, 2), {
        headers: {
          "Content-Type": "application/mcp+json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

	// 4. Serve manifest
    if (url.pathname === "/CoreGeometricSystem.json") {
      return new Response(JSON.stringify(context, null, 2), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
	}


    // 5. HTML fallback
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response("Not found", { status: 404 });
  },

  durableObjects: {
    MCP_OBJECT: MyMCP
  }
};
