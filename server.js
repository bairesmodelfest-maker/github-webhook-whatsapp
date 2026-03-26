const express = require('express');
const crypto = require('crypto');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
app.use(express.json());

// Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;
const recipientNumber = process.env.RECIPIENT_WHATSAPP_NUMBER;

const client = twilio(accountSid, authToken);

// GitHub webhook secret
const GITHUB_SECRET = process.env.GITHUB_WEBHOOK_SECRET;

// Verify GitHub webhook signature
function verifyGitHubSignature(req) {
  const signature = req.headers['x-hub-signature-256'];
  if (!signature) return false;

  const payload = JSON.stringify(req.body);
  const hash = crypto
    .createHmac('sha256', GITHUB_SECRET)
    .update(payload)
    .digest('hex');
  const computedSignature = `sha256=${hash}`;

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(computedSignature)
  );
}

// Webhook endpoint
app.post('/webhook', async (req, res) => {
  try {
    // Verify webhook signature
    if (!verifyGitHubSignature(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const event = req.headers['x-github-event'];
    const payload = req.body;

    let message = '';

    // Handle different GitHub events
    switch (event) {
      case 'push':
        message = `📦 Push to ${payload.repository.name}\nBranch: ${payload.ref}\nCommits: ${payload.commits.length}`;
        break;
      case 'pull_request':
        message = `🔀 Pull Request ${payload.action}\nTitle: ${payload.pull_request.title}\nRepo: ${payload.repository.name}`;
        break;
      case 'issues':
        message = `🐛 Issue ${payload.action}\nTitle: ${payload.issue.title}\nRepo: ${payload.repository.name}`;
        break;
      case 'release':
        message = `🚀 Release ${payload.action}\nTag: ${payload.release.tag_name}\nRepo: ${payload.repository.name}`;
        break;
      default:
        message = `📌 GitHub Event: ${event}\nRepo: ${payload.repository.name}`;
    }

    // Send WhatsApp message
    await client.messages.create({
      from: `whatsapp:${whatsappNumber}`,
      to: `whatsapp:${recipientNumber}`,
      body: message,
    });

    console.log(`✅ WhatsApp message sent for ${event} event`);
    res.status(200).json({ success: true, event });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Webhook endpoint is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Webhook server running on port ${PORT}`);
});
