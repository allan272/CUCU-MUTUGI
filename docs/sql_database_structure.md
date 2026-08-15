# SQL Database Structure & Logging Reference

This document outlines the relational SQL database schema for Cucu Mutugi Poultry logging, customer email capture from WhatsApp button clicks, and 24-hour status post enforcement.

---

## 1. Table: `whatsapp_click_logs`
Stores customer leads captured when users click the WhatsApp order or chat button on the website.

| Column Name | SQL Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(100)` | `PRIMARY KEY` | Unique log entry identifier (e.g. `wa_log_1720000000`) |
| `user_email` | `VARCHAR(255)` | `NOT NULL` | Customer's email address entered during WhatsApp interaction |
| `user_phone` | `VARCHAR(50)` | `NULLABLE` | Customer's phone number if provided |
| `product_name` | `VARCHAR(255)` | `DEFAULT 'General Inquiry'` | Product name being queried or ordered |
| `page_url` | `VARCHAR(550)` | `NULLABLE` | Source page URL where WhatsApp button was clicked |
| `ip_address` | `VARCHAR(100)` | `NULLABLE` | Anonymized IP address |
| `user_agent` | `TEXT` | `NULLABLE` | Browser user agent string |
| `clicked_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Date and time when the WhatsApp button was clicked |

---

## 2. Table: `status_post_logs`
Tracks status/story updates posted in the admin panel and enforces the **3 posts per 24 hours** business limit.

| Column Name | SQL Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(100)` | `PRIMARY KEY` | Log entry ID |
| `story_id` | `VARCHAR(100)` | `NOT NULL` | Associated story primary key |
| `title` | `VARCHAR(255)` | `NOT NULL` | Status update title |
| `category` | `VARCHAR(100)` | `NOT NULL` | Category (`New Chicks`, `Vaccination`, etc.) |
| `media_url` | `TEXT` | `NOT NULL` | Media URL (Image or Video) |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Publication timestamp |
| `expires_at` | `TIMESTAMP` | `NULLABLE` | Automatic expiration time (24 hours after creation) |
| `active_24h_count` | `INT` | `DEFAULT 1` | Rolling 24-hour active post count at time of publishing |
| `status` | `VARCHAR(50)` | `DEFAULT 'ACTIVE'` | Status (`ACTIVE` or `EXPIRED`) |

---

## 3. Useful SQL Queries

### Retrieve All WhatsApp Customer Leads with Emails
```sql
SELECT user_email, user_phone, product_name, page_url, clicked_at 
FROM whatsapp_click_logs 
ORDER BY clicked_at DESC;
```

### Count Active Status Posts in the Last 24 Hours
```sql
SELECT COUNT(*) AS post_count 
FROM status_post_logs 
WHERE created_at >= NOW() - INTERVAL '24 HOURS';
```
