export const PLAN_LIMITS = {
  Hobby: { websites: 1, views: 3000 },
  PRO: { websites: 10, views: 100000 },
  Business: { websites: Infinity, views: Infinity },
} as const;

export type PlanName = keyof typeof PLAN_LIMITS;

export const getPlanLimits = (planParams: string) => {
    const plan = (planParams || "Hobby") as PlanName;
    return PLAN_LIMITS[plan] || PLAN_LIMITS["Hobby"];
};
