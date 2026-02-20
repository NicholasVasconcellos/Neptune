import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const payload = await req.json();
    const { user, email_data } = payload;
    const { token_hash, redirect_to, email_action_type } = email_data;

    const confirmationLink = `${SUPABASE_URL}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to || ""}`;

    let subject: string;
    let heading: string;
    let bodyText: string;
    let ctaLabel: string;

    switch (email_action_type) {
      case "signup":
        subject = "Welcome to Neptune Swim App - Confirm Your Email";
        heading = "Welcome to Neptune!";
        bodyText =
          "Thanks for signing up. Please confirm your email address to get started.";
        ctaLabel = "Confirm Email";
        break;
      case "recovery":
        subject = "Neptune Swim App - Reset Your Password";
        heading = "Reset Your Password";
        bodyText =
          "We received a request to reset your password. Click below to proceed.";
        ctaLabel = "Reset Password";
        break;
      case "email_change":
        subject = "Neptune Swim App - Confirm Email Change";
        heading = "Confirm Your New Email";
        bodyText =
          "Please confirm your new email address by clicking below.";
        ctaLabel = "Confirm Email";
        break;
      default:
        subject = "Neptune Swim App - Verify Your Email";
        heading = "Verify Your Email";
        bodyText =
          "Please verify your email address by clicking the button below.";
        ctaLabel = "Verify Email";
    }

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#0c1929;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0c1929;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#1a3a5c;border-radius:12px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0288d1,#4fc3f7);padding:32px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:700;">
                Neptune Swim App
              </h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 32px;">
              <h2 style="color:#4fc3f7;margin:0 0 16px;font-size:22px;">${heading}</h2>
              <p style="color:#ffffff;font-size:16px;line-height:1.6;margin:0 0 24px;">
                Hi${user?.email ? ` ${user.email}` : ""},
              </p>
              <p style="color:rgba(255,255,255,0.85);font-size:16px;line-height:1.6;margin:0 0 32px;">
                ${bodyText}
              </p>
              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="background-color:#4fc3f7;border-radius:8px;">
                    <a href="${confirmationLink}"
                       style="display:inline-block;padding:14px 32px;color:#0c1929;font-size:16px;font-weight:600;text-decoration:none;">
                      ${ctaLabel}
                    </a>
                  </td>
                </tr>
              </table>
              <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:32px 0 0;line-height:1.5;">
                If you didn't request this, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.1);text-align:center;">
              <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:0;">
                Neptune Swim App &copy; ${new Date().getFullYear()}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Neptune Swim App <onboarding@resend.dev>",
        to: [user.email],
        subject,
        html,
      }),
    });

    if (!resendResponse.ok) {
      const errorBody = await resendResponse.text();
      console.error("Resend error:", errorBody);
      return new Response(JSON.stringify({ error: "Failed to send email" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
