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

import aiCatalog from './ai-catalog.json' assert { type: 'json' };

// ------------------------------------------------------------
// MCP SERVER INITIALIZATION
// ------------------------------------------------------------

const server = new McpServer({
  name: "Core_Geometric_System",
  version: "1.0.9"
});

// ------------------------------------------------------------
// DURABLE OBJECT: MCP SERVER
// ------------------------------------------------------------

export class MyMCP extends McpServer{

  state: DurableObjectState;
  env: Env;

// ------------------------------------------------------------
// ELICITATION HANDLERS 
// ------------------------------------------------------------
onStart() {
	this.mcp.configureElicitationHandlers({
  form: async (request, serverId) => {
    return {
      type: "forwardToUser",
      request,
      serverId
    };
  }
});
}
	



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
      } catch (err) {
  const message = err instanceof Error ? err.message : "Error";
  return {
    content: [{ type: "text", text: `Error: ${message}` }]
  };
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
              text: `Polygon area (side count=${sideCount}, side length=${sideLength}): ${result}`
            }
          ]
        };
      } catch (err) {
  const message = err instanceof Error ? err.message : "Error";
  return {
    content: [{ type: "text", text: `Error: ${message}` }]
  };
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
      } catch (err) {
  const message = err instanceof Error ? err.message : "Error";
  return {
    content: [{ type: "text", text: `Error: ${message}` }]
  };
}
    }

			
	  if (name === "compute_circumference") {
      try {
        const { radius } = args;
        const result = circumference(radius);

        return {
          content: [
            {
              type: "text",
              text: `Circumference (radius=${radius}): ${result}`
            }
          ]
        };
      } catch (err) {
  const message = err instanceof Error ? err.message : "Error";
  return {
    content: [{ type: "text", text: `Error: ${message}` }]
  };
}
	  }


	  if (name === "compute_circle_segment_area_from_height_and_parent_circle_radius") {
      try {
        const { radius, height } = args;
        const result = segmentAreaFromHeightAndRadius(radius, height);

        return {
          content: [
            {
              type: "text",
              text: `Circle segment area (radius=${radius}, height=${height}): ${result}`
            }
          ]
        };
      } catch (err) {
  const message = err instanceof Error ? err.message : "Error";
  return {
    content: [{ type: "text", text: `Error: ${message}` }]
  };
}
	  }
	  
	  if (name === "compute_circle_segment_area_from_height_and_chord_length") {
      try {
        const { height, chordLength } = args;
        const result = segmentAreaFromHeightAndChord(height, chordLength);

        return {
          content: [
            {
              type: "text",
              text: `Circle segment area (height=${height}, chord length=${chordLength}): ${result}`
            }
          ]
        };
      } catch (err) {
  const message = err instanceof Error ? err.message : "Error";
  return {
    content: [{ type: "text", text: `Error: ${message}` }]
  };
}
	  }

	  if (name === "compute_circle_segment_area_from_chord_length_and_parent_circle_radius") {
      try {
        const { chordLength, radius } = args;
        const result = segmentAreaFromChordAndRadius(chordLength, radius);

        return {
          content: [
            {
              type: "text",
              text: `Circle segment area (chord length=${chordLength}, radius=${radius}): ${result}`
            }
          ]
        };
      } catch (err) {
  const message = err instanceof Error ? err.message : "Error";
  return {
    content: [{ type: "text", text: `Error: ${message}` }]
  };
}
	  }

	  if (name === "compute_cone_surface_area") {
      try {
        const { radius, height } = args;
        const result = coneSurface(radius, height);

        return {
          content: [
            {
              type: "text",
              text: `Cone surface area (radius=${radius}, height=${height}): ${result}`
            }
          ]
        };
      } catch (err) {
  const message = err instanceof Error ? err.message : "Error";
  return {
    content: [{ type: "text", text: `Error: ${message}` }]
  };
}
	  }

	  if (name === "compute_sphere_volume") {
      try {
        const { radius } = args;
        const result = sphereVolume(radius);

        return {
          content: [
            {
              type: "text",
              text: `Sphere volume (radius=${radius}): ${result}`
            }
          ]
        };
      } catch {
        return { content: [{ type: "text", text: "Error" }] 
		};
      }
	  }


	  if (name === "compute_cone_volume") {
      try {
        const { radius, height } = args;
        const result = coneVolume(radius, height);

        return {
          content: [
            {
              type: "text",
              text: `Cone volume (radius=${radius}, height=${height}): ${result}`
            }
          ]
        };
      } catch (err) {
  const message = err instanceof Error ? err.message : "Error";
  return {
    content: [{ type: "text", text: `Error: ${message}` }]
  };
}
	  }

		
	  if (name === "compute_pyramid_volume") {
      try {
        const { sideCount, baseEdgeLength, height } = args;
        const result = pyramidVolume(sideCount, baseEdgeLength, height);

        return {
          content: [
            {
              type: "text",
              text: `Pyramid volume (side count=${sideCount}, base edge length=${baseEdgeLength}, height=${height}): ${result}`
            }
          ]
        };
      } catch (err) {
  const message = err instanceof Error ? err.message : "Error";
  return {
    content: [{ type: "text", text: `Error: ${message}` }]
  };
}
}

		  
	  if (name === "compute_frustum_pyramid_volume") {
      try {
        const { sideCount, baseEdgeLength, topEdgeLength, height } = args;
        const result = frustumPyramidVolume(sideCount, baseEdgeLength, topEdgeLength, height);

        return {
          content: [
            {
              type: "text",
              text: `Frustum pyramid volume (side count=${sideCount}, base edge length=${baseEdgeLength}, top edge length=${topEdgeLength}, height=${height}): ${result}`
            }
          ]
        };
      } catch (err) {
  const message = err instanceof Error ? err.message : "Error";
  return {
    content: [{ type: "text", text: `Error: ${message}` }]
  };
}
	  }

	  if (name === "compute_frustum_cone_volume") {
      try {
        const { baseRadius, topRadius, height } = args;
        const result = frustumConeVolume(baseRadius, topRadius, height);

        return {
          content: [
            {
              type: "text",
              text: `Frustum cone volume (base radius=${baseRadius}, top radius=${topRadius}, height=${height}): ${result}`
            }
          ]
        };
      } catch (err) {
  const message = err instanceof Error ? err.message : "Error";
  return {
    content: [{ type: "text", text: `Error: ${message}` }]
  };
}
	  }

	  if (name === "compute_tetrahedron_volume") {
      try {
        const { edge } = args;
        const result = tetrahedronVolume(edge);

        return {
          content: [
            {
              type: "text",
              text: `Tetrahedron volume (edge=${edge}): ${result}`
            }
          ]
        };
      } catch (err) {
  const message = err instanceof Error ? err.message : "Error";
  return {
    content: [{ type: "text", text: `Error: ${message}` }]
  };
}
	  }


// Generic renderer for explain / prove / refute tools
if (
  name.startsWith("explain_") ||
  name.startsWith("prove_") ||
  name.startsWith("refute_")
) {
  const tool = context.tools.find((t: any) => t.name === name);

  if (!tool) {
    return {
      content: [
        {
          type: "text",
          text: `No tool definition found for "${name}" in CoreGeometricSystem.json.`
        }
      ]
    };
  }

  const description = tool.description ?? "";
  const disambiguatingDescription = tool.disambiguatingDescription ?? "";
  const steps: string[] = tool.steps ?? [];

  const text =
    `${description}\n\n` +
    `${disambiguatingDescription}\n\n` +
    steps.join("\n");

  return {
    content: [
      {
        type: "text",
        text
      }
    ]
  };
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

// MCP endpoint
if (url.pathname === "/mcp") {
  const id = env.MCP_OBJECT.idFromName("singleton");
  const stub = env.MCP_OBJECT.get(id);
  return stub.fetch(request);
}

// Tools endpoint (redirect to MCP)
if (url.pathname.startsWith("/tools")) {
  const id = env.MCP_OBJECT.idFromName("singleton");
  const stub = env.MCP_OBJECT.get(id);

  const mcpUrl = new URL("/mcp", request.url);
  const mcpRequest = new Request(mcpUrl.toString(), request);

  return stub.fetch(mcpRequest);
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

	// Serve structured data 
    if (url.pathname === "/CoreGeometricSystem.json") {
      return new Response(JSON.stringify(context, null, 2), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
	}


// ARD Capability Catalog
if (url.pathname === "/.well-known/ai-catalog.json") {
  return new Response(JSON.stringify(aiCatalog, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}

// MCP Standard Location
if (url.pathname === "/.well-known/mcp/manifest.json") {
  return new Response(JSON.stringify(manifest, null, 2), {   
    headers: {
      "Content-Type": "application/mcp+json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}


    // HTML fallback
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response("Not found", { status: 404 });
  },

  durableObjects: {
    MCP_OBJECT: MyMCP
  }
};
