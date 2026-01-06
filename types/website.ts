export interface Website {
  id: string;
  websiteId: string;
  domain: string;
  timezone: string;
  enableLocalTracking: boolean;
  userId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}
