# RUGAN NGO - Production Setup Guide

This guide will help you set up the complete RUGAN NGO website with real payment processing, email services, and data storage.

## Account Ownership & Responsibilities

### Who Should Create the Accounts?

**Recommended Approach: Client creates and owns all accounts**

**Why the client should own the accounts:**

- **Data Ownership**: The NGO owns their donor data, volunteer information, and communications
- **Financial Control**: Payment processing accounts should be under the organization's control
- **Compliance**: NGO maintains direct control over sensitive operations
- **Long-term Maintenance**: Easier for the NGO to manage accounts after project completion

**Developer's Role:**

- Guide the client through account creation
- Provide detailed setup instructions
- Configure the application with provided credentials
- Assist with initial testing

**When developer creates accounts (only if client requests):**

- Use client's email/business information
- Transfer ownership immediately after setup
- Document all credentials and access details
- Ensure client has full admin access

## Cost Considerations

### Free Tiers Available:

- **MongoDB Atlas**: 512MB free tier (sufficient for most NGOs)
- **SendGrid**: 100 emails/day free
- **Google Cloud**: $300 credit + free tier for Sheets API

### Paid Services:

- **Paystack**: Transaction fees (1.5% + ₦100 per transaction)
- **SendGrid**: ~$20/month for 50,000 emails (if needed)
- **MongoDB Atlas**: ~$10/month when free tier is exceeded

### Cost Responsibility:

- Client should cover all service costs
- Developer provides cost estimates upfront
- Client maintains billing control by owning accounts

## Setup Process

### Phase 1: Account Creation (Client)

1. Client creates all required accounts using NGO's information
2. Client provides developer with necessary credentials/API keys
3. Developer configures application with provided credentials

### Phase 2: Configuration (Developer)

1. Developer sets up environment variables
2. Developer configures webhook URLs and API integrations
3. Developer tests integrations with provided credentials

### Phase 3: Testing & Deployment (Collaborative)

1. Test all features with real accounts
2. Deploy to production environment
3. Client takes ownership of all accounts and data

## 1. Database Setup (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free account
2. Create a new cluster (free tier)
3. Create a database user with read/write permissions
4. Get your connection string from "Connect" > "Connect your application"
5. Update `MONGODB_URI` in your `.env` file

## 2. Payment Processing (Paystack)

1. Sign up at [Paystack](https://paystack.com/)
2. Verify your account and get API keys
3. Go to Settings > API Keys & Webhooks
4. Copy your **Secret Key** (starts with `sk_live_` for production)
5. Set up webhook URL: `https://yourdomain.com/api/donations/webhook`
6. Update `PAYSTACK_SECRET_KEY` in your `.env` file

## 3. Email Service (SendGrid)

1. Sign up at [SendGrid](https://sendgrid.com/)
2. Verify your account and create an API key
3. Update your `.env` file:
   ```
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=your_sendgrid_api_key_here
   EMAIL_FROM=RUGAN <noreply@yourdomain.com>
   ```

## 4. Google Sheets Integration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Sheets API
4. Create a Service Account:
   - Go to IAM & Admin > Service Accounts
   - Create new service account
   - Generate JSON key and download
5. Create a Google Sheet:
   - Go to [Google Sheets](https://sheets.google.com/)
   - Create new spreadsheet
   - Share with the service account email (from JSON key)
   - Copy the spreadsheet ID from URL
6. Update your `.env` file:
   ```
   VOLUNTEER_SHEET_ID=your_spreadsheet_id_here
   GOOGLE_CREDENTIALS={"type":"service_account",...}  # Paste entire JSON
   ```

## 5. Environment Configuration

Copy `.env.example` to `.env` and fill in all values:

```bash
cp .env.example .env
# Edit .env with your actual values
```

## 6. Deployment

### Option A: Vercel (Recommended for Frontend)

1. Push your code to GitHub
2. Connect to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Option B: Traditional Hosting

1. **Server**: Deploy to services like Heroku, DigitalOcean, AWS
2. **Database**: MongoDB Atlas (already set up)
3. **Frontend**: Deploy to Netlify, Vercel, or your server

## 7. Domain & SSL

1. Buy a domain from Namecheap, GoDaddy, etc.
2. Point DNS to your hosting provider
3. Enable SSL certificate (free with most providers)

## 8. Testing Production Setup

### Test Payments

1. Go to donation page
2. Select card payment
3. Use Paystack test cards:
   - Success: `4084084084084081`
   - Failure: `4084084084084082`

### Test Emails

1. Subscribe to newsletter
2. Check if confirmation email is sent

### Test Volunteer Forms

1. Submit volunteer application
2. Check if data appears in Google Sheet

## 9. Monitoring & Maintenance

- Set up error monitoring (Sentry)
- Monitor payment webhooks
- Regular database backups
- Update dependencies regularly

## Support

If you encounter issues:

1. Check server logs
2. Verify all environment variables
3. Test API endpoints individually
4. Check service account permissions

## Security Notes

- Never commit `.env` files
- Use strong passwords
- Keep API keys secure
- Regularly rotate credentials
- Enable 2FA on all accounts
