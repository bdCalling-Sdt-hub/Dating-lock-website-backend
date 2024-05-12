export function getRequestLimit(plan: any) {
  switch (plan) {
    case 'basic':
      return 3;
    case 'gold':
      return 10;
    case 'premium':
      return Infinity;
    default:
      return 2;
  }
}
