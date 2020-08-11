export const getDisplayName = (type: any): any =>
  type.displayName ||
  type.name ||
  (type.type && getDisplayName(type.type)) ||
  (type.render && getDisplayName(type.render));
