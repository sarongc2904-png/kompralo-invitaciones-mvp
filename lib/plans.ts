import { plans } from "@/data/plans";

export function getPlanById(planId: string | null | undefined) {
  if (!planId) {
    return null;
  }

  return plans.find((plan) => plan.id === planId) ?? null;
}

export function getPlanLabel(planId: string | null | undefined) {
  return getPlanById(planId)?.name ?? planId ?? "";
}
