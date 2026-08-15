# MongoDB Atlas Setup Guide

This guide explains how to configure and connect your online MongoDB database (MongoDB Atlas) to your Cucu Mutugi Poultry application.

---

## 1. Create a Project & Shared Cluster (Free Tier)
1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
2. In the top-left dropdown, click **New Project** and name it `Cucu Mutugi Poultry`.
3. Click **Create Project**.
4. In the Project dashboard, click **Create Deployment** (or **Build a Database**).
5. Under the plans, select **M0 (Free)**.
6. Choose a cloud provider (e.g., AWS) and region nearest to you.
7. Under Cluster Name, you can name it `ClusterCucuMutugi`.
8. Click **Create Deployment** (or **Create Cluster**).

---

## 2. Create a Database User
Atlas will prompt you to secure your connection:
1. Choose **Username and Password** authentication.
2. Enter a **Username** (e.g., `poultry_admin`).
3. Enter a secure **Password** (or click *Autogenerate Secure Password*).
4. **Copy the password and save it**—you will need to replace `<db_password>` in your connection string with it.
5. Click **Create Database User**.

---

## 3. Configure Network Access (IP Whitelist)
You must specify which servers can connect to your database:
1. In the setup step (or by clicking **Network Access** in the left sidebar):
2. Click **Add IP Address**.
3. Since the website will run on Vercel or a hosting server with dynamic IPs, select **Allow Access from Anywhere** (adds `0.0.0.0/0`).
4. Click **Confirm** and wait about a minute for Atlas to apply the settings.

---

## 4. Get the Connection URI
1. Go back to the **Database** dashboard tab in the left sidebar.
2. Click the green **Connect** button next to your cluster `ClusterCucuMutugi`.
3. Under *Connect to your application*, click **Drivers**.
4. Select **Node.js** as the driver.
5. Copy the connection string. It will look similar to this:
   ```text
   mongodb+srv://poultry_admin:<db_password>@clustercumutugi.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=ClusterCucuMutugi
   ```

---

## 5. Add Credentials to your `.env` File
In your code editor, open the file `c:\Users\HP\Documents\CUCU MUTUGI\app\.env` (or copy `.env.example` to `.env`) and configure:

```env
# Supabase settings (optional/existing)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# MongoDB settings
MONGODB_URI=mongodb+srv://poultry_admin:YOUR_PASSWORD_HERE@clustercucumutugi.xxxxx.mongodb.net/cucu_mutugi?retryWrites=true&w=majority
MONGODB_DB=cucu_mutugi
```

> [!IMPORTANT]
> 1. Replace `YOUR_PASSWORD_HERE` with your database user password (from Step 2). Remove the `<` and `>` brackets.
> 2. Add `/cucu_mutugi` in the connection string right before the `?` to name your database.

---

## 6. Run the Application
Run the website locally:
```bash
npm run dev
```
Open [http://localhost:3000/admin](http://localhost:3000/admin). If MongoDB is empty, the website will automatically connect, create the collections, and populate them with the default seed data.
