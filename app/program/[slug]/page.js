// app/program/[slug]/page.js
import { ProgramDetail } from "@/components/program-detail";

export default async function ProgramPage({ params }) {
    const { slug } = await params;   // ✅ unwarp Promise
    return <ProgramDetail slug={slug} />;
}
