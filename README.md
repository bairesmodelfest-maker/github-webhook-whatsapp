# Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/bairesmodelfest-maker/github-webhook-whatsapp.git
   cd github-webhook-whatsapp
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

# Deployment Guide

1. **Build the Application**:
   ```bash
   npm run build
   ```

2. **Start the Server**:
   ```bash
   npm start
   ```

3. **Environment Variables**:
   Make sure to set the necessary environment variables in your deployment setup.

# GitHub Webhook Configuration Steps

1. **Navigate to Your Repository** on GitHub.
2. **Click on Settings > Webhooks > Add webhook**.
3. **Payload URL**: Enter your server's URL to receive webhook events.
4. **Content type**: Choose `application/json`.
5. **Select individual events** or just select `Just the push event`.
6. **Click Add webhook** to finalize the setup.
