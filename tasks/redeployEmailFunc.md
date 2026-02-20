### Steps to redeploy with your own verified domain:

1. **Verify domain in Resend**: Go to resend.com > Domains > Add your domain and complete DNS verification (add the MX, SPF, and DKIM records they provide)
2. **Update the `from` address** in `supabase/functions/send-custom-email/index.ts:122` — replace `onboarding@resend.dev` with your verified domain (e.g., `noreply@yourdomain.com`)
3. **Redeploy**: `npx supabase functions deploy send-custom-email`
   - Make sure to use Node 22 via nvm: `nvm use 22` first
   - Set the access token: `SUPABASE_ACCESS_TOKEN=your_token npx supabase functions deploy send-custom-email`
