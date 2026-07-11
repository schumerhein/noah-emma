"use client";

import { useRouter } from "next/navigation";
import { PremiumModal } from "@/components/PremiumModal";

export default function PremiumPage() {
  const router = useRouter();
  return <PremiumModal open onClose={() => router.push("/")} />;
}
