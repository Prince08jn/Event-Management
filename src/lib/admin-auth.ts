
export const ADMIN_EMAILS = [
  'ashmit.singh.k@gmail.com', // Primary Admin
  'lunayachprateek@gmail.com', // Primary Admin
  'admin@rkade.in',
  // Add other authorized emails here
];

export function isUserAdmin(email?: string | null) {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email);
}
