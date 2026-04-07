# Set Up Custom SMTP for Supabase Auth Emails

Supabase's built-in email is rate-limited (~3/hr) and unreliable. Use Resend (free tier: 3,000 emails/mo).

## Steps

### 1. Create Resend account
- Go to https://resend.com and sign up
- You'll land on the dashboard

### 2. Add your domain (or skip for dev)
- Resend → Domains → Add Domain
- Add DNS records (DKIM, SPF, DMARC) as shown
- Wait for verification (usually <5 min)
- **For dev/testing only**: you can skip this and use `onboarding@resend.dev` as sender

### 3. Get your API key
- Resend → API Keys → Create API Key
- Copy it — this is your SMTP password

### 4. Configure Supabase
- Supabase Dashboard → Project Settings → Auth → SMTP Settings → Enable custom SMTP
- Fill in:
  - **Host**: `smtp.resend.com`
  - **Port**: `465`
  - **Username**: `resend`
  - **Password**: *(your API key from step 3)*
  - **Sender email**: your verified domain address (e.g. `no-reply@yourdomain.com`) or `onboarding@resend.dev` for testing
  - **Sender name**: `Neptune Swim`
- Save

### 5. Test it
1. Open the app → Login → Forgot Password
2. Enter your email → Send Reset Link
3. Check inbox — email should arrive within seconds
4. Click the link → app should open to the reset-password screen
5. Set new password → confirm you're redirected to the tabs

### 6. (Optional) Customize email templates
- Supabase Dashboard → Auth → Email Templates
- Edit the "Reset Password" template HTML/subject if you want branded emails
