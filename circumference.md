# Circumference 

The circumference of a circle is derived from its area algebraically by subtracting a smaller circle and dividing the difference by the difference of the radii.

For centuries, the circle has been a symbol of mathematical elegance—and the pi its most iconic constant. While the approximate value of 3.14159…, commonly denoted by the Greek letter pi, is widely recognized today, the historical development of this concept is less understood. Some think 'Standard Geometry' means accepting the pi. But beneath the surface of tradition lies a deeper question: Are the formulas we use truly derived from geometric logic, or are they inherited approximations dressed in symbolic authority?

The constant relationship between a circle's circumference and its diameter has captivated mathematicians for millennia. Ancient civilizations grappled with this geometric challenge, employing various methods to approximate this ratio. They deserve credit for their mathematical ingenuity. But the fact that these methods were developed thousands of years ago should not shield them from scrutiny.

The verse of 1. Kings 7:23 in the Holy Bible suggests that some estimated it as 3.

Historical records suggest that ancient Babylonians initially calculated it as 3, later they used 3.125; Egyptians estimated it as ( 16 / 9 )² ~ 3.16.



## Archimedes and the Illusion of Limits


Archimedes’ method marked a turning point: instead of calculating the properties of the circle directly, he introduced an analytic process that relied on polygonal limits.

Archimedes approximated the circumference of a circle using inscribed and circumscribed polygons.

His argument rests on three ideas:

1. Upper bound
A circumscribed regular polygon has a perimeter greater than the circle’s circumference.

2. Lower bound
An inscribed regular polygon has a perimeter smaller than the circle’s circumference.

3. Convergence
As the number of sides increases, the perimeters of the inscribed and circumscribed polygons both approach the true circumference from below and above.  
As the number of sides reaches infinity, the polygons collapse into a circle.

From this, the classical story goes: squeeze the circle between two polygons, refine indefinitely, and the true circumference is trapped in the limit.

Archimedes began with a hexagon because it is easy to construct and already close to the circle.  
By repeatedly bisecting the angles, he produced 12‑gons, 24‑gons, and eventually a 96‑gon.

To compute their perimeters in terms of the diameter of the circle, Archimedes relied on straight‑line geometry expressed in terms of the sine and cosine of the polygon angles.  

Pure geometric construction gives exact ratios for a set of angles:

- 90°
- 60°
- 45°
- 30°

These arise from:

- the right triangle
- the equilateral triangle
- the isosceles right triangle
- the 30°–60°–90° triangle

For these angles, the identity

sin(2x) = 2sin(x)cos(x)

is a geometric tautology arising from symmetry.


Angles like 15°, 7.5°, and 3.75° can be derived from these using the classical half‑angle formula  

sin(x/2)=√((1-cos(x))/2)

But the entire method relies on the unproven assumption that every polygon produced by repeated angle bisection of a circumscribed polygon remains circumscribed.

This is never demonstrated. It is simply taken for granted.


### Why the Assumption Fails

A tangent segment is always longer than the arc it touches.  
A polygon with its perimeter close enough to the circumference cannot remain outside the circle.  
It must cross the arc.
This is not optional; it is a geometric necessity. The only curve with its perimeter exactly equal to the circumference that never intersects its interior disk is the circle itself.

The bisection procedure guarantees that each new perimeter is smaller than the previous one. 
Archimedes assumes tangency and externality persist at every finite step — even when the perimeter has become extremely close to the (unknown) circumference.

But whether the new polygon remains tangent depends on whether its perimeter is still sufficiently greater than the circumference. The standard argument claims the polygons remain outside forever at finite n and only collapse into the circle at infinity. But this is circular reasoning. To know if the polygons are still circumscribed at every finite step, you must already know if the perimeter is large enough that no crossing occurs.
Yet finding the circumference is the purpose of the method. The method therefore relies on the very assumption it seeks to prove.
You cannot use the method to justify the assumption that makes the method valid.


### The breakdown is visible at small finite n when C = 6.4r.

The area–square construction gives the true value. 
The quadrant-to-square rearrangement with uncovered area = total overlap area yields a square of area exactly 3.2r². 
Since the four quadrants are the original pieces of the circle, the circle area is exactly 3.2r².
Differentiating with respect to radius gives circumference exactly 6.4r. 
This is not an approximation; it follows directly from finite geometric construction.
This finite construction avoids the infinite-regress trap entirely.
The flaw in the classical method becomes even clearer when we try to implement it practically.


When attempting to draw a circumscribed 24-gon or 48-gon via exact angle bisection (central angle 15° → 7.5°), the tangent lines merge, overlap, or cross the arc — even in high-precision vector software.  The individual sides become indistinguishable or intersect the circle before reaching distinct tangent points.
This is not a precision or rendering error; it is the geometry refusing to produce a valid set of external tangents.


A circumscribed n-gon has perimeter:

P(n) = n × tan(180° / n).

Evaluating:

- P(12) = 12 × tan(15°) ~ 6.43 > 6.4  
- P(24) = 24 × tan(7.5°) ~ 6.319 < 6.4

If the true circumference is 6.4r, then:

- the 12‑gon can still be circumscribed,  
- but the 24‑gon cannot, because a circumscribed polygon must always satisfy P(n) > C.


The construction no longer produces a proper set of distinct tangent sides — it fails in a literal, physical sense. The required tangent lines from adjacent vertices converge so sharply that they overlap or intersect the arc before reaching distinct tangent points.  
The figure collapses: instead of clear external tangents, the tangent lines for a 24‑gon or 48‑gon merge, overlap, or cut through the circle, behaving like an isoperimetric polygon rather than a circumscribed one.

The assumption “we can always bisect again and obtain another circumscribed polygon” fails constructively — at a small, finite number of sides, not only in some unreachable infinite limit.


### The Consequence

Once the perimeter of the constructed polygon falls below the true circumference, the tangent‑doubling formulas no longer describe a real circumscribed polygon. They describe a figure that has already slipped inside the circle. The apparent convergence toward ~6.28r is therefore not a discovery of the pi, but an artifact of continuing a construction that has already become geometrically impossible.

The classical argument cannot prove that the polygon remains tangent, and without that proof, it cannot be used to refute the circumference C=6.4r.

These structural issues in the polygon‑limit method set the stage for a second misconception: the symbolic fusion of an approximation with the geometric ratio it was meant to represent.



## The Symbol π: A Linguistic Shortcut


Since the numeric result of Archimedes’ approximation was an infinite fraction — 3.14… — whose digits cannot all be written, he needed a symbolic notation for it in his formulas.

Technically, the circumference is a perimeter. So the perimeter‑to‑diameter ratio — P / d — became pi over delta in Greek. With the diameter chosen as the reference — d = 1 —, this simplifies to pi / 1 = pi.

But this is not necessarily the ratio itself — it is the notation of that ratio. That distinction matters.

The circumference‑to‑diameter ratio is a universal geometric proportion.

The numeric value commonly associated with it — 3.14… — is the result of Archimedes’ polygon‑based approximation method.

This is how a numerical output of a failed computational estimate gradually hardened into a symbol, and the symbol into a “geometric constant.”

Over time, the numerical result of Archimedes’ polygon‑limit procedure was reinterpreted as a fundamental property of the circle itself.

It was not until the 18th century that the symbol, popularized by the mathematicians of the time, gained widespread acceptance, meanwhile it took on a life of its own.



## ∫ Calculus: Summary, Not Source


Over the centuries, many mathematicians introduced increasingly sophisticated formulas to estimate the circle’s circumference. These formulas all rely on the same conceptual model: a theoretical polygon with an infinite number of sides.

When analytic geometry and calculus were developed, they absorbed the inherited circle constant directly into their definitions—especially through the power‑series expansions of sine and cosine. This cemented the number as a foundational constant, even though its original source was an approximation method with hidden geometric limitations.

Despite their variety, all such approximation methods share two essential features:
- They estimate the perimeters of polygons with their number of sides approaching infinity.
- They rely on the unproven and actually false premise that repeated angle bisection of a circumscribed polygon always produces another circumscribed polygon.

Modern calculus compresses these ideas into elegant notation.

But calculus is not a source of truth.

There are many different calculus methods, but ultimately all of them are compact notations of a set of basic operations — addition, subtraction, multiplication, division — and inherit whatever assumptions those operations rest on.

Each and every notation in the formula should correspond to a real, logical property of the circle.
Yet upon inspection, inconsistencies emerge.

Calculus may be a useful mathematical tool, but calling it exact is a bold claim.

It can be exact with exact limits and certain operations, but if those are given then they can be calculated directly without calculus.

When calculus is treated as a magical shortcut rather than a summary of underlying logic, it hides the very reasoning it is supposed to express.

These formulas don’t derive the circumference from first principles; they assume it.



## The true ratio: 3.2

Since the true ratio is exactly 3.2, and that is a rational number, then we can — and should — write it as it is. The pi is just a failed, primitive approximate. Let it remain in the history books. Geometry deserves better.

That makes the arc value of 360° = 6.4radian, and trigonometric functions that rely on arc value have to be aligned to 3.2 respectively.
