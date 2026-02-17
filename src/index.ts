import { McpServer } from "@modelcontextprotocol/sdk/server";
import { z } from "zod";

// Import your exact-ratio geometry system (ESM .mjs file)
import {
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
        capVolume,
        coneVolume,
        pyramidVolume,
        frustumPyramidVolume,
        frustumConeVolume,
        tetrahedronVolume
} 
	from "../core-geometric-system.mjs";

// Create the MCP server instance
const server = new McpServer({
  name: "core-geometric-system",
  version: "1.0.0"
});

// --- TOOL DEFINITIONS ---

// 1. Circle Area
server.tool(
  "compute_triangle_area",
  {
    side1: z.number().positive(),
    side2: z.number().positive(),
    side3: z.number().positive()
  },
  async ({ side1, side2, side3 }) => {
    const result = triangleArea(side1, side2, side3);
    return {
      content: [
        {
          type: "text",
          text: `Exact triangle area: ${result}`
        }
      ]
    };
  }
);

// 1. Circle Area
server.tool(
  "compute_polygon_area",
  {
    sideCount: z.number().positive(),
    sideLength: z.number().positive()
  },
  async ({ sideCount, sideLength }) => {
    const result = polygonArea(sideCount, sideLength);
    return {
      content: [
        {
          type: "text",
          text: `Exact triangle area: ${result}`
        }
      ]
    };
  }
);

// 3. Circle Area
server.tool(
  "compute_circle_area",
  {
    radius: z.number().positive()
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

// 4. Circumference
server.tool(
  "compute_circumference",
  {
    radius: z.number().positive()
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

// . Sphere Volume
server.tool(
  "compute_sphere_volume",
  {
    radius: z.number().positive()
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
    radius: z.number().positive(),
    height: z.number().positive()
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
    const result = pyramidVolume(baseArea, height);
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
export default server.build();
