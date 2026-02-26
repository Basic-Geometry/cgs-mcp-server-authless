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

But a geometric inconsistency emerges when we compare circumscribed polygons to circles.

Archimedes’ polygon‑refinement method would work only if every refined polygon remained circumscribed around the same circle.  
But the refinement process gradually shrinks the perimeter, and a shrinking perimeter cannot stay tangent to a fixed circle beyond a certain threshold, because a polygon whose perimeter is too close to the circle’s circumference cannot remain circumscribed. Tangency becomes impossible, and the polygon crosses inside the circle.

This is not a matter of interpretation; it is a geometric fact.

Archimedes’ theoretical refinement method does not construct each polygon independently.  
It starts with a circumscribed hexagon and repeatedly bisects the angles to generate new polygons, assuming that every resulting polygon remains circumscribed around the same circle.

And that is where the trouble begins.
That assumption is never proven.  
It is simply taken for granted.
And it is false.

This is the overlooked loophole:

Each bisection step reduces the perimeter.
To know whether the resulting polygon remains circumscribed, you must already know the circumference.

But the whole point of the method is to find the circumference.

This is the logical flaw at the heart of the method.

The classical explanation says:

- the refined polygons always stay outside the circle,
- their perimeters always stay above the circumference,
- and they converge downward toward the true value.

But these claims depend on the very assumption that is in question. You cannot use the method to justify the assumption that makes the method valid.

Under the actual proportions:

- area = 3.2r² 
- circumference = 6.4r

the perimeter of the bisected polygon is already very close to the true circumference at the first step, and falls below 6.4r at a small number of sides.

At that moment the construction silently crosses into an impossible configuration.

Continuing to apply the tangent formulas beyond this point no longer describes a real circumscribed polygon — it describes a figure that has already slipped inside the circle.

The apparent convergence to ≈ 3.14d is not a discovery — it is an artifact of ignoring the impossibility of the geometric construction.

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
