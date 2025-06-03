"use client"

import { useSearchParams } from "next/navigation";
import AccessDenied from "@/components/AccessDenied";

export default function AccessDeniedPage() {
    const searchParams = useSearchParams();
    const deniedPath = searchParams.get("path") || "";
    const userParam = searchParams.get("user") || "";
    let userAccessControlMetadata = null;

    try {
        userAccessControlMetadata = userParam ? userParam : null;
    } catch {
        userAccessControlMetadata = null;
    }

    return (
        <AccessDenied deniedPath={deniedPath} userAccessControlMetadata={userAccessControlMetadata} />
    );
}