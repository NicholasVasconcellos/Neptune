### Steps to deploy the email function:
1. **Install Supabase CLI**: `npm install -g supabase`
2. **Link project**: `npx supabase link --project-ref ucynmkqxqcmglnmnfgdr`
3. **Set up Resend**: Create an account at resend.com, verify your domain, get an API key
4. **Set secrets**: `npx supabase secrets set RESEND_API_KEY=re_your_key_here`
5. **Deploy**: `npx supabase functions deploy send-custom-email`
6. **Configure hook**: In Supabase Dashboard > Authentication > Hooks > enable "Send Email" hook > select the `send-custom-email` function
7. **Update the `from` address** in `supabase/functions/send-custom-email/index.ts:112` - replace `noreply@yourdomain.com` with your verified Resend domain
