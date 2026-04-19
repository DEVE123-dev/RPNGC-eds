# ⚡ RPNGC Dispatch - 5 Minute Deploy

## 🚀 Fastest Way to Deploy

### 1. MongoDB (2 min)
1. Go to https://cloud.mongodb.com
2. Create free cluster
3. Network Access → Add `0.0.0.0/0`
4. Get connection string

### 2. Deploy on Render (2 min)
1. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Deploy"
   git remote add origin YOUR_GITHUB_URL
   git push -u origin main
   ```

2. Go to https://render.com
3. New + → Web Service
4. Connect repo
5. Add env vars:
   - `MONGO_URI`: Your MongoDB string
   - `JWT_SECRET`: Auto-generate
6. Create Web Service

### 3. Seed Database (1 min)
In Render console:
```bash
node db/seed.js
```

### 4. Test & Secure
- Visit your URL
- Login: `hq-admin` / `hqpassword123`
- **CHANGE ALL PASSWORDS IMMEDIATELY**

## ✅ Done!

Your app is live at: `https://your-app.onrender.com`

---

## Alternative: Docker (Local)

```bash
docker build -t rpngc-dispatch .
docker run -d -p 8000:8000 \
  -e MONGO_URI="your_connection_string" \
  -e JWT_SECRET="your_secret" \
  rpngc-dispatch
```

Visit: `http://localhost:8000`

---

For detailed instructions, see `DEPLOYMENT.md`
