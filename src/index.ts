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

// 1. Triangle Area
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
          text: `Exact triangle area (side 1=${side1}, side 2=${side2}, side 3=${side3}): ${result}`
        }
      ]
    };
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
    const result = polygonArea(sideCount, sideLength);
    return {
      content: [
        {
          type: "text",
          text: `Polygon area (side count=${sideCount}, side length=${sideLength}): ${result}`
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

// 5. Circle segment area from height and parent radius 
server.tool(
  "compute_circle_segment_area_from_height_and_parent_circle_radius",
  {
    height: z.number().positive(),
    radius: z.number().positive()
  },
  async ({ height, radius }) => {
    const result = segmentAreaFromHeightAndRadius(height, radius);
    return {
      content: [
        {
          type: "text",
          text: `Segment area (h=${height}, r=${radius}): ${result}`
        }
      ]
    };
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
    const result = segmentAreaFromHeightAndChord(height, chordLength);
    return {
      content: [
        {
          type: "text",
          text: `Segment area (h=${height}, l=${chordLength}): ${result}`
        }
      ]
    };
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
    const result = segmentAreaFromChordAndRadius(chordLength, radius);
    return {
      content: [
        {
          type: "text",
          text: `Segment area (l=${chordLength}, r=${radius}): ${result}`
        }
      ]
    };
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
    const result = coneSurface(radius, height);
    return {
      content: [
        {
          type: "text",
          text: `Exact cone surface area (r=${radius}, h=${height}): ${result}`
        }
      ]
    };
  }
);

// 9. Sphere Volume
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

// 10. Spherical Cap Volume
server.tool(
  "compute_spherical_cap_volume",
  {
    radius: z.number().positive(),
    height: z.number().positive()
  },
  async ({ radius, height }) => {
    const result = capVolume(radius, height);
    return {
      content: [
        {
          type: "text",
          text: `Spherical cap volume (r=${radius}, h=${height}): ${result}`
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
    sideCount: z.number().positive(),
	baseEdgeLength: z.number().positive(),
    height: z.number().positive()
  },
  async ({ sideCount, baseEdgeLength, height }) => {
    const result = pyramidVolume(sideCount, baseEdgeLength, height);
    return {
      content: [
        {
          type: "text",
          text: `Exact pyramid volume (side count=${sideCount}, base edge length=${baseEdgeLength}, h=${height}): ${result}`
        }
      ]
    };
  }
);

// Export the handler for Cloudflare
export default server.build();
