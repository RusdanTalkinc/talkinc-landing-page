// lib/datetime.js
export const JKT_TZ = "Asia/Jakarta";

export function fmtDate(iso) {
    if (!iso) return "-";
    try {
        const d = new Date(iso);
        return new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            day: "2-digit",
            month: "short",
            year: "numeric",
            timeZone: JKT_TZ,
        }).format(d);
    } catch {
        return iso;
    }
}
