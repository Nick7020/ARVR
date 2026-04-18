import dns from 'dns/promises';

/* ── 1. Format check ── */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

/* ── 2. Disposable/fake domain blacklist ── */
const BLOCKED_DOMAINS = new Set([
  'test.com', 'example.com', 'mailinator.com', 'guerrillamail.com',
  'tempmail.com', 'throwaway.email', 'yopmail.com', 'sharklasers.com',
  'trashmail.com', 'fakeinbox.com', 'dispostable.com', 'maildrop.cc',
]);

/* ── 3. MX record check ── */
async function hasMxRecord(domain) {
  try {
    const records = await dns.resolveMx(domain);
    return records && records.length > 0;
  } catch {
    return false;
  }
}

/* ── Main validator ── */
export async function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, reason: 'Email is required.' };
  }

  const cleaned = email.trim().toLowerCase();

  // Format check
  if (!EMAIL_REGEX.test(cleaned)) {
    return { valid: false, reason: 'Invalid email format.' };
  }

  const domain = cleaned.split('@')[1];

  // Blocked domain check
  if (BLOCKED_DOMAINS.has(domain)) {
    return { valid: false, reason: 'Please use a real email address.' };
  }

  // MX record check
  const mxExists = await hasMxRecord(domain);
  if (!mxExists) {
    return { valid: false, reason: `Email domain "${domain}" does not exist or cannot receive emails.` };
  }

  return { valid: true };
}
