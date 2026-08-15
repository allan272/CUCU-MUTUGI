-- =============================================================================
-- SQL DATABASE SCHEMA FOR CUCU MUTUGI POULTRY
-- Compatible with SQLite, PostgreSQL, and MySQL / MariaDB
-- =============================================================================

-- 1. Table: whatsapp_click_logs
-- Tracks customer interactions when clicking the WhatsApp contact/order button
CREATE TABLE IF NOT EXISTS whatsapp_click_logs (
    id VARCHAR(100) PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    user_phone VARCHAR(50),
    product_name VARCHAR(255) DEFAULT 'General Inquiry',
    page_url VARCHAR(550),
    ip_address VARCHAR(100),
    user_agent TEXT,
    clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_email ON whatsapp_click_logs(user_email);
CREATE INDEX IF NOT EXISTS idx_whatsapp_clicked_at ON whatsapp_click_logs(clicked_at);

-- 2. Table: status_post_logs
-- Audit log of status/stories published with 24-hour rate limit checks
CREATE TABLE IF NOT EXISTS status_post_logs (
    id VARCHAR(100) PRIMARY KEY,
    story_id VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    media_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    active_24h_count INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE INDEX IF NOT EXISTS idx_status_created_at ON status_post_logs(created_at);

-- 3. Table: audit_logs
-- General system audit logs for administrative actions
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(100) PRIMARY KEY,
    action_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    performed_by VARCHAR(100) DEFAULT 'Admin',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp);
