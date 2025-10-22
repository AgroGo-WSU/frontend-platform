export type NotificationKind = 'success' | 'error' | 'info';

export interface Notification {
  id: string;
  kind: NotificationKind;
  title: string;
  message?: string;
  createdAt: string; 

  // Future features:
  userId?: string;        // user
  zoneId?: string;        // device/zone 
  acknowledged?: boolean; // mark-as-read 
}
