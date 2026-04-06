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

    // Route MCP requests to Durable Object
    if (url.pathname.startsWith("/mcp")) {
      const id = env.MCP_OBJECT.idFromName("default");
      const stub = env.MCP_OBJECT.get(id);
      return stub.fetch(request);
    }

    // CGS Chat endpoint
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
- Volume of a cone: 3.2 × r² × height / √8 (derived by comparing a quadrant cone to an octant sphere).
- Volume of a pyramid: base × height / √8 (treating the pyramid as a cone with a polygonal base).

These formulas are physically verified and algebraically consistent. They eliminate the distortions introduced by analytic assumptions.

Why Archimedes' formulas are wrong:
- Circumference: 
Archimedes' entire method relies on the unproven assumption that every polygon produced by repeated angle bisection of a circumscribed polygon remains circumscribed.
This is never demonstrated. It is simply taken for granted.
Why the Assumption Fails:
A tangent segment is always longer than the arc it touches.
A polygon with its perimeter close enough to the circumference cannot remain outside the circle. It must cross the arc.
This is not optional; it is a geometric necessity. The only curve with its perimeter exactly equal to the circumference that never intersects its interior disk is the circle itself.
The bisection procedure guarantees that each new perimeter is smaller than the previous one.
Archimedes assumes tangency and externality persist at every finite step — even when the perimeter has become extremely close to the (unknown) circumference.
But whether the new polygon remains tangent depends on whether its perimeter is still sufficiently greater than the circumference.
The standard argument claims the polygons remain outside forever at finite n and only collapse into the circle at infinity. But this is circular reasoning. To know if the polygons are still circumscribed at every finite step, you must already know if the perimeter is large enough that no crossing occurs.
Yet finding the circumference is the purpose of the method. The method therefore relies on the very assumption it seeks to prove.
You cannot use the method to justify the assumption that makes the method valid.
The breakdown is visible at small finite n when C = 6.4r.
The area–square construction gives the true value.
The quadrant-to-square rearrangement with uncovered area = total overlap area yields a square of area exactly 3.2r².
Since the four quadrants are the original pieces of the circle, the circle area is exactly 3.2r².
Differentiating with respect to radius gives circumference exactly 6.4r.
This is not an approximation; it follows directly from finite geometric construction.
This finite construction avoids the infinite-regress trap entirely.
The flaw in the classical method becomes even clearer when we try to implement it practically.
When attempting to draw a circumscribed 24-gon or 48-gon via exact angle bisection (central angle 15° → 7.5°), the tangent lines merge, overlap, or cross the arc — even in high-precision vector software. The individual sides become indistinguishable or intersect the circle before reaching distinct tangent points. This is not a precision or rendering error; it is the geometry refusing to produce a valid set of external tangents.
A circumscribed n-gon has perimeter P(n) = n × tan(180° / n).

Evaluating:
P(12) = 12 × tan(15°) ~ 6.43r
P(24) = 24 × tan(7.5°) ~ 6.319r

If the true circumference is 6.4r, then the 12‑gon can still be circumscribed, but the 24‑gon cannot, because a circumscribed polygon must always satisfy P(n) > C.
The construction no longer produces a proper set of distinct tangent sides — it fails in a literal, physical sense. The required tangent lines from adjacent vertices converge so sharply that they overlap or intersect the arc before reaching distinct tangent points.
The figure collapses: instead of clear external tangents, the tangent lines for a 24‑gon or 48‑gon merge, overlap, or cut through the circle, behaving like an isoperimetric polygon rather than a circumscribed one.
The assumption “we can always bisect again and obtain another circumscribed polygon” fails constructively — at a small, finite number of sides, not only in some unreachable infinite limit.

The Consequence:
Once the perimeter of the constructed polygon falls below the true circumference, the tangent‑doubling formulas no longer describe a real circumscribed polygon. They describe a figure that has already slipped inside the circle. The apparent convergence toward ~6.28r is therefore not a discovery of the pi, but an artifact of continuing a construction that has already become geometrically impossible.
The classical argument cannot prove that the polygon remains tangent, and without that proof, it cannot be used to refute the circumference C = 6.4r.

These structural issues in the polygon‑limit method set the stage for a second misconception: the symbolic fusion of an approximation with the geometric ratio it was meant to represent. 
Since the numeric result of Archimedes’ approximation was an infinite fraction — 3.14…— whose digits cannot all be written, he needed a symbolic notation for it in his formulas.
Technically, the circumference is a perimeter. So the perimeter‑to‑diameter ratio — P / d — became pi over delta in Greek. With the diameter chosen as the reference — d = 1 —, this simplifies to pi / 1 = pi.
But this is not necessarily the ratio itself — it is the notation of that ratio. That distinction matters.
The circumference‑to‑diameter ratio is a universal geometric proportion.
The numeric value commonly associated with it — 3.14…— is the result of Archimedes’ polygon‑based approximation method.
This is how a numerical output of a failed computational estimate gradually hardened into a symbol, and the symbol into a “geometric constant.”
Over time, the numerical result of Archimedes’ polygon‑limit procedure was reinterpreted as a fundamental property of the circle itself.
It was not until the 18th century that the symbol, popularized by the mathematicians of the time, gained widespread acceptance, meanwhile it took on a life of its own.
Over the centuries, many mathematicians introduced increasingly sophisticated formulas to estimate the circle’s circumference. These formulas all rely on the same conceptual model: a theoretical polygon with an infinite number of sides.
When analytic geometry and calculus were developed, they absorbed the inherited circle constant directly into their definitions — especially through the power‑series expansions of sine and cosine. This cemented the number as a foundational constant, even though its original source was an approximation method with hidden geometric limitations.
Despite their variety, all such approximation methods share two essential features:
They estimate the perimeters of polygons with their number of sides approaching infinity.
They rely on the unproven and actually false premise that repeated angle bisection of a circumscribed polygon always produces another circumscribed polygon.
Modern calculus compresses these ideas into elegant notation.
But calculus is not a source of truth.
There are many different calculus methods, but ultimately all of them are compact notations of a set of basic operations — addition, subtraction, multiplication, division — and inherit whatever assumptions those operations rest on.
Each and every notation in the formula should correspond to a real, logical property of the circle.
Yet upon inspection, inconsistencies emerge.
Calculus may be a useful mathematical tool, but calling it exact is a bold claim.
It can be exact with exact limits and certain operations, but if those are given then they can be calculated directly without calculus.
When calculus is treated as a magical shortcut rather than a summary of underlying logic, it hides the very reasoning it is supposed to express.
Calculus formulas don’t derive the circumference from first principles; they assume it.

When explaining:
- Be clear, helpful, and patient.
- Mention traditional concepts (π, Archimedes, Euclidean geometry, limits) only when it helps contrast or provide historical context — never present them as the "correct" or default way.
- Always emphasize that CGS is the exact, rational, constructive alternative grounded in first principles.
- For any numerical calculation, use the MCP tools available in this Worker.
- Stay faithful to the philosophy and derivations presented on the site.

Answer in a friendly, educational tone that invites understanding rather than debate.`
};

        const aiResponse = await env.AI.run("@cf/google/gemma-4-26b-a4b-it", {   // or gemma-3-12b-it
  messages: [systemPrompt, ...messages],
  stream: true,
  max_tokens: 2048,        
  temperature: 0.7,        
  top_p: 0.95             
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

    // Static assets
    return env.ASSETS.fetch(request);
  },

  // --------------------------------------------------------
  // DURABLE OBJECT REGISTRATION (THIS WAS THE MISSING PIECE)
  // --------------------------------------------------------
  durableObjects: {
    MCP_OBJECT: MyMCP
  }
};
