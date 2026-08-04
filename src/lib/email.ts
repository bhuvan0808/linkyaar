// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

/**
 * Thin Resend sender. Fails soft by design: email is a courtesy,
 * never a dependency — a failed send must not break any user flow.
 *
 * Until a custom domain is verified in Resend, the account is in
 * test mode: sends only deliver to the Resend account owner.
 */
const RESEND_ENDPOINT = 'https://api.resend.com/emails'

export async function sendEmail(input: {
  to: string
  subject: string
  html: string
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return false

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM ?? 'LinkYaar <onboarding@resend.dev>',
        to: input.to,
        subject: input.subject,
        html: input.html,
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

/** Minimal branded shell — inline styles only (email clients). */
export function emailTemplate(input: {
  heading: string
  body: string
  ctaLabel?: string
  ctaUrl?: string
}): string {
  const cta =
    input.ctaLabel && input.ctaUrl
      ? `<a href="${input.ctaUrl}" style="display:inline-block;margin-top:24px;background:#2E1065;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 24px;border-radius:9999px;">${input.ctaLabel}</a>`
      : ''

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#F3F3F1;font-family:-apple-system,'Segoe UI',Roboto,Arial,sans-serif;">
    <div style="max-width:520px;margin:0 auto;padding:32px 20px;">
      <p style="font-size:20px;font-weight:800;color:#2E1065;margin:0 0 20px;">LinkYaar</p>
      <div style="background:#ffffff;border-radius:20px;padding:32px 28px;">
        <h1 style="font-size:20px;color:#1a1523;margin:0 0 12px;">${input.heading}</h1>
        <div style="font-size:15px;line-height:1.6;color:#4a4458;">${input.body}</div>
        ${cta}
      </div>
      <p style="font-size:12px;color:#8a8496;margin:20px 4px 0;">
        You get these because email notifications are on in your LinkYaar settings.
        Turn them off anytime in Settings.
      </p>
    </div>
  </body>
</html>`
}
