import { Resend } from 'resend';

export async function sendPasswordResetEmail(to: string, resetLink: string): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    await resend.emails.send({
      from: 'Imagr <onboarding@resend.dev>',
      to,
      subject: 'Reset your Imagr password',
      html: buildResetEmail(resetLink),
    });
  } catch (err) {
    console.error('[Email] Resend failed:', err);
    console.log(`[Email] Password reset link (use this in dev): ${resetLink}`);
    // Do NOT rethrow — Better Auth must succeed so the token is saved and usable
  }
}

function buildResetEmail(resetLink: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Reset your Imagr password</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0a0a0a;padding:48px 24px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">

          <!-- Logo / Wordmark -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <span style="font-size:28px;font-weight:700;letter-spacing:-0.5px;color:#ffffff;">Imagr</span>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#111111;border-radius:12px;border:1px solid #1f1f1f;padding:40px 40px 36px;">

              <!-- Heading -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding-bottom:8px;">
                    <h1 style="margin:0;font-size:22px;font-weight:600;color:#ffffff;line-height:1.3;">
                      Reset your password
                    </h1>
                  </td>
                </tr>

                <!-- Subtext -->
                <tr>
                  <td style="padding-bottom:32px;">
                    <p style="margin:0;font-size:15px;line-height:1.6;color:#a1a1aa;">
                      We received a request to reset the password for your Imagr account. Click the button below to choose a new password. This link expires in&nbsp;1&nbsp;hour.
                    </p>
                  </td>
                </tr>

                <!-- CTA Button -->
                <tr>
                  <td align="center" style="padding-bottom:32px;">
                    <a href="${resetLink}"
                       target="_blank"
                       style="display:inline-block;background-color:#ffffff;color:#0a0a0a;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;padding:13px 32px;letter-spacing:0.01em;">
                      Reset password
                    </a>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding-bottom:24px;">
                    <hr style="border:none;border-top:1px solid #1f1f1f;margin:0;" />
                  </td>
                </tr>

                <!-- Fallback link -->
                <tr>
                  <td style="padding-bottom:8px;">
                    <p style="margin:0;font-size:13px;color:#71717a;line-height:1.6;">
                      If the button above doesn't work, copy and paste this link into your browser:
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:24px;">
                    <p style="margin:0;font-size:12px;color:#52525b;word-break:break-all;line-height:1.5;">
                      ${resetLink}
                    </p>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding-bottom:24px;">
                    <hr style="border:none;border-top:1px solid #1f1f1f;margin:0;" />
                  </td>
                </tr>

                <!-- Security notice -->
                <tr>
                  <td>
                    <p style="margin:0;font-size:13px;color:#71717a;line-height:1.6;">
                      If you didn't request a password reset, you can safely ignore this email. Your password will not change.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:28px;">
              <p style="margin:0;font-size:12px;color:#3f3f46;">
                &copy; ${new Date().getFullYear()} Imagr. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
