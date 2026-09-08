# 🚀 Host Your AKPS Website for Free

You can host both the frontend and backend of **AKPS** completely for free using **Render.com**. Follow this simple guide to deploy it, share the link with your customers, and receive email notifications directly to your inbox whenever a new order or bulk request is placed.

---

## 📧 Step 1: Set Up Your Notification Email (Gmail)

To get emails when orders are placed, the backend uses **Nodemailer**. The easiest way is using a Gmail account:

1. **Enable 2-Step Verification** on your Gmail account (if not already enabled).
2. Go to your **Google Account settings** → Search for **"App Passwords"**.
3. Create a new App Password (e.g., name it "AKPS E-Commerce").
4. Copy the generated **16-character password** (e.g., `xxxx xxxx xxxx xxxx`).
5. Save this password, your Gmail address, and your target personal email address. You will enter these as environment variables on Render.

---

## 💻 Step 2: Push Your Code to GitHub

Render builds your site directly from a GitHub repository:

1. Open your terminal in the project root directory.
2. Initialize git and commit your files:
   ```bash
   git init
   git add .
   git commit -m "Initial deployment setup"
   ```
3. Go to [github.com](https://github.com), create a new **private** or public repository named `akps-store`.
4. Run the commands shown on GitHub to link your local code and push it:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/akps-store.git
   git branch -M main
   git push -u origin main
   ```

---

## 🖥️ Step 3: Deploy the Backend on Render (Free)

1. Sign up/log in at [Render.com](https://render.com).
2. Click **New +** → **Web Service**.
3. Select your GitHub repository.
4. Set the following details:
   * **Name:** `akps-backend`
   * **Language:** `Node`
   * **Root Directory:** `backend`
   * **Build Command:** `npm install`
   * **Start Command:** `npm start`
   * **Instance Type:** `Free`
5. Scroll down to **Environment Variables** and add:
   * `PORT` = `5001`
   * `OWNER_EMAIL` = `your-personal-email@gmail.com` (Where order notifications will go)
   * `SMTP_USER` = `your-gmail-sender-address@gmail.com` (The Gmail account sending the emails)
   * `SMTP_PASS` = `your-16-char-app-password` (The App Password generated in Step 1)
   * `SMTP_HOST` = `smtp.gmail.com`
   * `SMTP_PORT` = `465`
6. Click **Deploy Web Service**.
7. Once deployed, copy the **live URL** (e.g. `https://akps-backend.onrender.com`).

---

## 🎨 Step 4: Deploy the Frontend on Render (Free)

1. On the Render Dashboard, click **New +** → **Static Site**.
2. Select your GitHub repository.
3. Set the following details:
   * **Name:** `akps-store`
   * **Root Directory:** `frontend`
   * **Build Command:** `npm install && npm run build`
   * **Publish Directory:** `dist`
4. Add an **Environment Variable**:
   * `VITE_API_URL` = `https://akps-backend.onrender.com` (Paste your backend live URL here, make sure it has *no* trailing slash)
5. Click **Create Static Site**.

---

## ⚠️ Important Note on Free Tier File Storage
Since Render's Free Tier has **ephemeral storage**, the simple local file database (`db.json`) will reset whenever the backend restarts (e.g., when it goes to sleep after 15 minutes of inactivity).
* **For Testing & Demonstration:** The free tier is perfect, and emails will send instantly.
* **For a Production Store:** You can connect to a free external database like **MongoDB Atlas** or **Supabase**, or upgrade the backend to a paid Render service with a **Persistent Disk** (starts at $7/month).
