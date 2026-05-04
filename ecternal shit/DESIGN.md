```markdown
# Design System Document

## 1. Overview & Creative North Star: "The Monolithic Blueprint"

This design system is a manifesto of industrial confidence. Our Creative North Star is **The Monolithic Blueprint**. It moves away from the "softness" of modern consumer web design and embraces the rigid, uncompromising authority of architectural schematics and technical infrastructure.

We reject the "template" look. We do not use cards to contain information; we use the canvas itself. By utilizing extreme typographic scales and intentional asymmetry, we create a layout that feels engineered rather than "designed." This system is built on the tension between massive, immovable headers and the delicate, precise data that supports them. It is zero-fluff, high-function, and unapologetically bold.

---

## 2. Colors: Industrial Monochrome

While the palette is strictly monochromatic, we utilize tonal depth to create functional hierarchy. The goal is "colorless intensity."

*   **Primary (#000000) & Surface (#f9f9f9):** These are your binary foundations. Use `#000000` for high-impact typography and `#f9f9f9` for the primary canvas to maintain an editorial, "fine paper" feel.
*   **The "No-Line" Rule:** Borders are forbidden for sectioning. To separate content, use background shifts. A section using `surface-container-low` (#f3f3f3) sitting against a `background` (#f9f9f9) creates a clear, architectural boundary without the clutter of a 1px line.
*   **Surface Hierarchy:** Create depth through "Inversion." For high-priority modules, invert the palette: use a `primary` (#000000) block with `on-primary` (#e2e2e2) text. This "monolith" approach signals importance better than any shadow or color ever could.
*   **Signature Textures:** For high-end CTAs, utilize a subtle gradient from `primary` (#000000) to `primary_container` (#3b3b3b). This is the only exception to the "flat" rule, intended to provide a heavy, metallic "soul" to interactive elements.

---

## 3. Typography: The Voice of Authority

Typography is our primary visual tool. We use a high-contrast scale to emphasize the "Industrial" nature of the system.

*   **Headings (Space Grotesk):** All Display and Headline levels must be **UPPERCASE** with a slight letter-spacing (tracking) of +2% to +5%. This conveys scale and permanence. 
    *   *Example:* `display-lg` (3.5rem) should feel like a physical monument on the page.
*   **Supporting Text (Inter):** Body and Label styles are "quiet." Use `body-sm` (0.75rem) for technical descriptions. The goal is a massive size differential between the "Subject" (Heading) and the "Data" (Body).
*   **Hierarchy through Weight:** Use `bold` for headers to create "visual weight" and `regular` for body text to provide "breathing room."

---

## 4. Elevation & Depth: Tonal Layering

The user has mandated **Zero Shadows.** Therefore, we achieve depth through the **Layering Principle.**

*   **Stacking Surfaces:** Instead of a floating shadow, a "raised" element is simply a container with a different tonal value. Place a `surface-container-lowest` (#ffffff) element on a `surface-dim` (#dadada) background to create a crisp, sharp lift.
*   **The Ghost Border:** If accessibility requires a boundary, use the `outline-variant` (#c6c6c6) at 10% opacity. It should be felt, not seen—a "ghost" of a line that guides the eye without breaking the industrial aesthetic.
*   **The Sharp Edge:** The `roundedness` scale is strictly **0px**. Every element—buttons, inputs, containers—must have hard, 90-degree corners. This reinforces the "Industrial" and "Infrastructure" themes.

---

## 5. Components: Functional Brutalism

### Buttons
*   **Primary:** Solid `primary` (#000000) fill with `on-primary` (#e2e2e2) uppercase text. No curves. Sizing is generous in padding but tight in letter spacing.
*   **Secondary:** `outline` token (#777777) but used only as a hover state. The default state is a simple, bold uppercase text link with a 2px underline.
*   **Motion:** Transitions must be "Slow and Deliberate" (e.g., 400ms ease-in-out). A hover state shouldn't "flash"; it should "evolve."

### Input Fields
*   **Styling:** Avoid the "box" look. Use a `surface-container-high` (#e8e8e8) background with a 2px `primary` (#000000) bottom-border only. 
*   **Focus State:** On focus, the background shifts to `primary` (#000000) and the text to `on-primary` (#e2e2e2). It is a high-confidence state change.

### Cards & Lists
*   **Structure:** Forbid divider lines. Use `spacing-8` (or larger) to let negative space act as the separator.
*   **Asymmetry:** In lists, stagger the alignment of supporting data. Let the "Large Bold Headings" lead the eye, while "Small Quiet Text" sits tucked into the negative space created by the headings.

### Industrial Status Indicators
*   Since we have "No colorful UI," status (Error/Success) must be handled via iconography and thickness. An error state uses a heavy 4px `error` (#ba1a1a) left-border on a container.

---

## 6. Do's and Don'ts

### Do:
*   **Embrace the Void:** Use 2x more negative space than you think you need. Space is a luxury; use it to frame the content.
*   **Align to a Rigid Grid:** Every element must feel snapped to a technical grid. Alignment should be flawless.
*   **Use Intentional Asymmetry:** Balance a massive left-aligned heading with a small, right-aligned data point at the bottom of the section.

### Don't:
*   **No Rounded Corners:** Never use a border-radius. Even a 2px radius destroys the industrial confidence of this system.
*   **No Shadows:** Do not use `box-shadow` to create depth. Use color-blocking.
*   **No Fluff:** If an icon or decorative element doesn't serve a functional purpose in explaining "Systems" or "Infrastructure," remove it.
*   **No Centered Layouts:** Centered text feels "marketing-heavy." Keep text left-aligned to maintain the "Technical Manual" feel.

---

**Motion Note:** All transitions (fade-ins, width transforms) should mimic the movement of heavy machinery—starting with intent, moving smoothly, and stopping with precision. Use long durations (500ms+) with a custom cubic-bezier `(0.2, 1, 0.3, 1)`.```