export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "";

export function hasGA() {
    return typeof window !== "undefined" && typeof window.gtag === "function";
}

export function trackGAEvent(action, params = {}) {
    if (typeof window === "undefined") return;
    if (typeof window.gtag !== "function") return;
    window.gtag("event", action, params);
}

export function trackProgramView({ slug, title }) {
    trackGAEvent("view_program", {
        program_slug: slug,
        program_title: title,
    });
}

export function trackScrollDepth({ slug, depth }) {
    trackGAEvent("program_scroll_depth", {
        program_slug: slug,
        scroll_depth: depth,
    });
}