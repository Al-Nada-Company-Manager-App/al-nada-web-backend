# Al-Nada Contact Us Backend (NestJS)

This is a dedicated backend service built with NestJS. Its sole purpose is to receive Contact Us form submissions from the static frontend and forward them to the company's email system via SMTP.

## 📦 Installation

To install the necessary dependencies, simply run:

```bash
npm install
```

## ⚙️ Environment Variables

Before running the application, you must configure your environment variables. 
Copy `.env.example` to `.env` (or `.env.local`) and fill in the details.

```bash
cp .env.example .env
```

**Required Variables:**
- `SMTP_HOST`: The SMTP server address (e.g., smtp.gmail.com or smtp.office365.com).
- `SMTP_PORT`: The SMTP port (usually 587 for TLS, or 465 for SSL).
- `SMTP_USER`: The authentication username for the SMTP server.
- `SMTP_PASSWORD`: The password or app-specific password.
- `MAIL_FROM`: The "From" address for the outgoing emails.
- `MAIL_TO`: The destination email where contact submissions will be sent.
- `FRONTEND_ORIGIN`: The URL of the frontend allowed to make requests (e.g., `https://alnadascientific.com`).

*(Note: The actual SMTP credentials will be configured later by the administrator when the email provider is finalized.)*

## 🚀 Running Locally

To start the development server locally on port 3001:

```bash
npm run start:dev
```

The server will be accessible at `http://localhost:3001`.

## 🌐 API Endpoints

### `POST /api/contact`

Receives a JSON payload and sends an email. The endpoint automatically validates the request body using strict Data Transfer Objects (DTOs).

**Expected Payload:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Inquiry about Services",
  "message": "Hello, I would like to know more about your services."
}
```

**Responses:**
- `200 OK`: Message sent successfully.
- `400 Bad Request`: Validation failed (e.g., missing name, invalid email format).
- `500 Internal Server Error`: Failed to send the email via SMTP.

## 🧪 Testing with cURL

You can test the endpoint locally using cURL (make sure the server is running):

```bash
curl -X POST http://localhost:3001/api/contact \
-H "Content-Type: application/json" \
-H "Origin: http://localhost:3000" \
-d '{
  "name": "Test User",
  "email": "test@example.com",
  "subject": "Test cURL",
  "message": "This is a test message from cURL."
}'
```

## ☁️ Deployment (Vercel)

This project is configured to run as a serverless function on Vercel. 
The `vercel.json` and `src/main.ts` have been specifically structured to export the Express application adapter, which Vercel's `@vercel/node` builder natively supports.

1. Install the Vercel CLI or connect the repository directly in the Vercel Dashboard.
2. If using CLI, run `vercel` inside the project root.
3. Make sure to configure the **Environment Variables** (SMTP credentials and `FRONTEND_ORIGIN`) within the Vercel Dashboard under **Settings > Environment Variables** before deploying to production.
