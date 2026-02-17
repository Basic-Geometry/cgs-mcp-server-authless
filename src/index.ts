import { McpServer } from "@modelcontextprotocol/sdk/server";
import { z } from "zod";

// Import your exact-ratio geometry system (ESM .mjs file)
import {
  circleArea,
  circumference,
  sphereVolume,
  coneVolume,
  pyramidVolume
} from "../core-geometric-system.mjs";

// Create the MCP server instance
const server = new McpServer({
  name: "core-geometric-system",
  version: "1.0.0"
});

// --- TOOL DEFINITIONS ---

// 1. Circle Area
server.tool(
  "compute_circle_area",
  {
    radius: z.number()
  },
  async ({ radius }) => {
    const result = circleArea(radius);
    return {
      content: [
        {
          type: "text",
          text: `Exact circle area for radius ${radius}: ${result}`
        }
      ]
    };
  }
);

// 2. Circumference
server.tool(
  "compute_circumference",
  {
    radius: z.number()
  },
  async ({ radius }) => {
    const result = circumference(radius);
    return {
      content: [
        {
          type: "text",
          text: `Exact circumference for radius ${radius}: ${result}`
        }
      ]
    };
  }
);

// 3. Sphere Volume
server.tool(
  "compute_sphere_volume",
  {
    radius: z.number()
  },
  async ({ radius }) => {
    const result = sphereVolume(radius);
    return {
      content: [
        {
          type: "text",
          text: `Exact sphere volume for radius ${radius}: ${result}`
        }
      ]
    };
  }
);

// 4. Cone Volume
server.tool(
  "compute_cone_volume",
  {
    radius: z.number(),
    height: z.number()
  },
  async ({ radius, height }) => {
    const result = coneVolume(radius, height);
    return {
      content: [
        {
          type: "text",
          text: `Exact cone volume (r=${radius}, h=${height}): ${result}`
        }
      ]
    };
  }
);

// 5. Pyramid Volume
server.tool(
  "compute_pyramid_volume",
  {
    baseArea: z.number(),
    height: z.number()
  },
  async ({ baseArea, height }) => {
    const result = computePyramidVolume(baseArea, height);
    return {
      content: [
        {
          type: "text",
          text: `Exact pyramid volume (base=${baseArea}, h=${height}): ${result}`
        }
      ]
    };
  }
);

// Export the handler for Cloudflare
export default server.build();						break;
					case "divide":
						if (b === 0)
							return {
								content: [
									{
										type: "text",
										text: "Error: Cannot divide by zero",
									},
								],
							};
						result = a / b;
						break;
				}
				return { content: [{ type: "text", text: String(result) }] };
			},
		);
	}
}

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		if (url.pathname === "/mcp") {
			return MyMCP.serve("/mcp").fetch(request, env, ctx);
		}

		return new Response("Not found", { status: 404 });
	},
};
