"use client";

// Server-side rendering registry for styled-jsx (Next.js App Router).
// Without this, `<style jsx>` / `<style jsx global>` blocks in client components
// are injected only AFTER hydration, so styled elements (the map, the filters
// bar) render unstyled at first paint and then reflow once the CSS lands ·
// causing a large Cumulative Layout Shift on the homepage. This collects those
// styles during SSR and inserts them into the initial HTML <head>.
// Official pattern: https://nextjs.org/docs/app/building-your-application/styling/css-in-js#styled-jsx
import { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { StyleRegistry, createStyleRegistry } from "styled-jsx";

export default function StyledJsxRegistry({ children }) {
  const [jsxStyleRegistry] = useState(() => createStyleRegistry());

  useServerInsertedHTML(() => {
    const styles = jsxStyleRegistry.styles();
    jsxStyleRegistry.flush();
    return <>{styles}</>;
  });

  return <StyleRegistry registry={jsxStyleRegistry}>{children}</StyleRegistry>;
}
