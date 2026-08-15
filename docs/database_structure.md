# MongoDB Database Structure (Schema Reference)

This document describes the schema and structure of the collections stored in your MongoDB Atlas database `cucu_mutugi`. 

Since MongoDB is schema-less, the fields are determined by the application's TypeScript interfaces and matching records.

---

## 1. Collection: `products`
Used to manage the list of chicks, feeds, or poultry equipment available for sale.

| Field Name | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `_id` | `String` | Primary identifier (custom string starting with `p`) | `"p1"` |
| `name` | `String` | Name of the product | `"Kuroiler Chicks"` |
| `category` | `String` | Product category (`Kienyeji`, `Broilers`, `Layers`, etc.) | `"Kienyeji"` |
| `breed` | `String` | (Optional) specific poultry breed | `"Kuroiler"` |
| `price` | `Number` | Price per unit in KES | `120` |
| `stock` | `Number` | Available stock in units | `500` |
| `image` | `String` | Base64 image data or URL path | `""` |
| `description` | `String` | Brief product details | `"Fast-growing dual-purpose breed..."` |
| `ageRange` | `String` | (Optional) Growth stage of the chicks | `"1 day – 1 month"` |
| `vaccinated` | `Boolean` | Whether the chicks are fully pre-vaccinated | `true` |
| `active` | `Boolean` | Whether the product is visible in the shop | `true` |
| `createdAt` | `String` | Creation date (format: `YYYY-MM-DD`) | `"2026-06-01"` |

---

## 2. Collection: `orders`
Stores order sheets submitted/processed by the administration panel.

| Field Name | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `_id` | `String` | Primary identifier (custom string starting with `ORD-`) | `"ORD-001"` |
| `farmer` | `String` | Full name of the purchasing farmer | `"James Mwangi"` |
| `phone` | `String` | Contact phone number | `"0712345678"` |
| `county` | `String` | Delivery county | `"Embu"` |
| `breed` | `String` | Breed ordered | `"Kuroiler"` |
| `qty` | `Number` | Order quantity | `100` |
| `totalKES` | `Number` | Total cost in KES | `12000` |
| `status` | `String` | Order status (`Pending`, `Confirmed`, `In Transit`, `Delivered`, `Cancelled`) | `"Delivered"` |
| `date` | `String` | Date of the order (format: `YYYY-MM-DD`) | `"2026-06-01"` |
| `notes` | `String` | (Optional) Special delivery instructions | `"Delivered on time"` |

---

## 3. Collection: `farmers`
Maintains a database of registered poultry farmers working with Cucu Mutugi Poultry.

| Field Name | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `_id` | `String` | Primary identifier (custom string starting with `f`) | `"f1"` |
| `name` | `String` | Full name of the farmer | `"James Mwangi"` |
| `phone` | `String` | Contact phone number | `"0712345678"` |
| `email` | `String` | (Optional) Email address | `"james@email.com"` |
| `county` | `String` | Farm county | `"Embu"` |
| `flocks` | `Number` | Count of active flocks on the farm | `3` |
| `totalOrders` | `Number` | Total count of orders placed | `5` |
| `joinedAt` | `String` | Date joined (format: `YYYY-MM-DD`) | `"2026-01-15"` |

---

## 4. Collection: `blog_posts`
Contains articles, guides, and resources written for farmers.

| Field Name | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `_id` | `String` | Primary identifier (custom string starting with `b`) | `"b1"` |
| `title` | `String` | Post title | `"How to Start Broiler Farming..."` |
| `slug` | `String` | URL slug (lower-case, hyphenated) | `"how-to-start-broiler-farming"` |
| `content` | `String` | Post body content (supports text or HTML) | `"Broiler farming is profitable..."` |
| `author` | `String` | Author name | `"Cucu Mutugi"` |
| `published` | `Boolean` | Whether the post is visible online | `true` |
| `category` | `String` | Category (`Farming Guide`, `Breeds`, etc.) | `"Farming Guide"` |
| `createdAt` | `String` | Date published (format: `YYYY-MM-DD`) | `"2026-05-20"` |

---

## 5. Collection: `settings`
Contains site-wide copy, colors, settings, and display configurations. This collection contains a single document.

| Field Name | Type | Description | Example / Default |
| :--- | :--- | :--- | :--- |
| `_id` | `String` | Constant key | `"site_settings"` |
| `heroTitle` | `String` | Main heading on the home page | `"CUCU MUTUGI POULTRY"` |
| `heroSubtitle`| `String` | Description text beneath the main title | `"Growing Farmers, Building Prosperity 🌱"` |
| `heroCoverImage`| `String` | URL of the background / logo image | `"/logo.png"` |
| `primaryColor` | `String` | Brand main color hex code | `"#1565C0"` |
| `accentColor` | `String` | Brand accent color hex code | `"#00BCD4"` |
| `logoUrl` | `String` | Navbar logo image path | `"/logo.png"` |
| `whatsappNumber`| `String` | Contact number for WhatsApp integration | `"254706972161"` |
| `email` | `String` | Primary business email address | `"cucumutugipoultry@gmail.com"` |
| `phone1` | `String` | Primary phone call line | `"0706972161"` |
| `phone2` | `String` | Secondary phone call line | `"0740662799"` |
| `marketingDays`| `String` | Days when chicks are delivered/marketed | `"Wednesday and Thursday"` |
| `footerTagline`| `String` | Text shown in the footer of all pages | `"Growing Farmers, Building Prosperity."` |
| `heroStats` | `Array` | List of stats shown on homepage hero | `[{ "val": "14+", "label": "Counties Served" }]` |
| `showWhatsappButton`| `Boolean` | Whether to show the floating WhatsApp helper | `true` |
