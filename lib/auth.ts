export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function verifyPassword(input: string): boolean {
  const envPassword = getMeetingPassword();
  if (!envPassword) return false;
  return input === envPassword;
}

export function getMeetingPassword() {
  const configured = process.env.NEXT_PUBLIC_MEETING_PASSWORD;
  if (configured) return configured;
  return process.env.NODE_ENV === 'production' ? '' : 'ohana2024';
}
