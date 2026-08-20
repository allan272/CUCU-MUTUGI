#!/usr/bin/env python3
"""
CUCU MUTUGI POULTRY - 24H Status Updates Manager
Easily post, view, or delete 24-hour status updates directly via Python or CLI.
"""

import os
import sys
import json
import time
import shutil
import argparse
from datetime import datetime, timedelta

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(ROOT_DIR, 'data')
DB_FILE = os.path.join(DATA_DIR, 'cucu_db.json')
UPLOADS_DIR = os.path.join(ROOT_DIR, 'public', 'uploads')


def ensure_dirs():
    os.makedirs(DATA_DIR, exist_ok=True)
    os.makedirs(UPLOADS_DIR, exist_ok=True)


def load_db():
    ensure_dirs()
    if os.path.exists(DB_FILE):
        try:
            with open(DB_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"[!] Warning reading DB file: {e}")
    
    return {
        "products": [],
        "orders": [],
        "farmers": [],
        "blogPosts": [],
        "stories": [],
        "videos": [],
        "settings": {}
    }


def save_db(db):
    ensure_dirs()
    with open(DB_FILE, 'w', encoding='utf-8') as f:
        json.dump(db, f, indent=2, ensure_ascii=False)
    print(f"[✓] Database updated successfully in {DB_FILE}")


def upload_local_media(media_path):
    """If media_path is a local file, copies it into public/uploads and returns web URL."""
    if not media_path:
        return "/media/gallery/WhatsApp%20Image%202026-01-20%20at%208.38.20%20PM.jpeg"
    
    if media_path.startswith("http://") or media_path.startswith("https://") or media_path.startswith("/"):
        return media_path
    
    if os.path.exists(media_path):
        filename = f"{int(time.time() * 1000)}-{os.path.basename(media_path)}"
        dest = os.path.join(UPLOADS_DIR, filename)
        shutil.copy2(media_path, dest)
        print(f"[✓] Copied {media_path} -> public/uploads/{filename}")
        return f"/uploads/{filename}"
    
    print(f"[!] Warning: File {media_path} not found, using as raw string.")
    return media_path


def add_story(title, media_url="", media_type="image", category="General", description="", action_text="Order Now", action_url="/products", featured=False, poll_question="", poll_options=None):
    db = load_db()
    stories = db.get("stories", [])

    final_media_url = upload_local_media(media_url)
    
    # Auto-detect media type
    if any(final_media_url.lower().endswith(ext) for ext in ['.mp4', '.mov', '.webm', '.mkv']):
        media_type = "video"
    
    now = datetime.utcnow()
    expires_at = (now + timedelta(hours=24)).isoformat() + "Z"
    
    story_id = f"s{int(time.time() * 1000)}"
    
    poll_obj = None
    if poll_question and poll_options:
        poll_obj = {
            "question": poll_question,
            "options": [{"text": opt.strip(), "votes": 0} for opt in poll_options if opt.strip()]
        }
    
    new_story = {
        "id": story_id,
        "title": title,
        "category": category,
        "mediaType": media_type,
        "mediaUrl": final_media_url,
        "description": description or None,
        "actionText": action_text or None,
        "actionUrl": action_url or None,
        "likes": 0,
        "views": 0,
        "featured": bool(featured),
        "createdAt": now.isoformat() + "Z",
        "expiresAt": expires_at
    }
    
    if poll_obj:
        new_story["poll"] = poll_obj
    
    stories.insert(0, new_story)
    db["stories"] = stories
    save_db(db)
    
    print("\n" + "="*50)
    print(f"🎉 24H STATUS UPDATE POSTED SUCCESSFULLY!")
    print(f"ID: {story_id}")
    print(f"Title: {title}")
    print(f"Media: {final_media_url} ({media_type})")
    print(f"Category: {category}")
    print(f"Expires: {expires_at}")
    print("="*50 + "\n")
    return new_story


def list_stories():
    db = load_db()
    stories = db.get("stories", [])
    print(f"\n--- Total 24h Updates: {len(stories)} ---")
    for idx, s in enumerate(stories, 1):
        poll_info = f" | Poll: {s['poll']['question']}" if s.get('poll') else ""
        print(f"[{idx}] ID: {s.get('id')} | Title: {s.get('title')} | Category: {s.get('category')} | Views: {s.get('views', 0)} | Likes: {s.get('likes', 0)}{poll_info}")
    print("---------------------------------------\n")


def delete_story_by_id(story_id):
    db = load_db()
    stories = db.get("stories", [])
    initial_count = len(stories)
    stories = [s for s in stories if s.get('id') != story_id]
    if len(stories) < initial_count:
        db["stories"] = stories
        save_db(db)
        print(f"[✓] Deleted story {story_id}")
    else:
        print(f"[!] Story {story_id} not found.")


def interactive_menu():
    print("="*55)
    print("  🐔 CUCU MUTUGI POULTRY - 24H STATUS UPDATES POSTER  ")
    print("="*55)
    while True:
        print("\n1. Post a new 24h Status Update")
        print("2. List all Status Updates")
        print("3. Delete a Status Update")
        print("4. Exit")
        choice = input("\nSelect option (1-4): ").strip()
        
        if choice == "1":
            title = input("Enter Status Title (e.g. 🐣 New Batch of Kuroiler Chicks): ").strip()
            if not title:
                print("Title cannot be empty.")
                continue
            
            media = input("Enter image/video file path or URL (press Enter to skip): ").strip()
            category = input("Enter category (e.g. New Chicks / Delivery / Farm Tour) [New Chicks]: ").strip() or "New Chicks"
            desc = input("Enter description/announcement text: ").strip()
            action_text = input("Button Text (e.g. Order Now) [Order Now]: ").strip() or "Order Now"
            action_url = input("Button Link (e.g. /products or /contact) [/products]: ").strip() or "/products"
            featured_input = input("Keep visible permanently? (y/N): ").strip().lower()
            featured = featured_input == 'y'
            
            poll_q = input("Optional Poll Question (press Enter to skip): ").strip()
            poll_opts = None
            if poll_q:
                opts_str = input("Poll options separated by commas (e.g. Yes, No, Maybe): ").strip()
                poll_opts = [o.strip() for o in opts_str.split(",") if o.strip()]
            
            add_story(
                title=title,
                media_url=media,
                category=category,
                description=desc,
                action_text=action_text,
                action_url=action_url,
                featured=featured,
                poll_question=poll_q,
                poll_options=poll_opts
            )
        elif choice == "2":
            list_stories()
        elif choice == "3":
            list_stories()
            story_id = input("Enter the Story ID to delete: ").strip()
            if story_id:
                delete_story_by_id(story_id)
        elif choice == "4":
            print("Exiting. Have a great day!")
            break
        else:
            print("Invalid choice. Try again.")


def main():
    parser = argparse.ArgumentParser(description="Manage Cucu Mutugi 24h Status Updates")
    parser.add_argument("--add", action="store_true", help="Add a new status update")
    parser.add_argument("--title", type=str, help="Status update title")
    parser.add_argument("--media", type=str, default="", help="Path to local media file or URL")
    parser.add_argument("--category", type=str, default="New Chicks", help="Category")
    parser.add_argument("--description", type=str, default="", help="Description")
    parser.add_argument("--action-text", type=str, default="Order Now", help="CTA button text")
    parser.add_argument("--action-url", type=str, default="/products", help="CTA button link")
    parser.add_argument("--featured", action="store_true", help="Pin as permanent highlight")
    parser.add_argument("--poll-question", type=str, default="", help="Poll question")
    parser.add_argument("--poll-options", type=str, default="", help="Comma separated poll options")
    parser.add_argument("--list", action="store_true", help="List all updates")
    parser.add_argument("--delete", type=str, help="Delete update by ID")

    args = parser.parse_args()

    if args.add and args.title:
        poll_opts = [o.strip() for o in args.poll_options.split(",") if o.strip()] if args.poll_options else None
        add_story(
            title=args.title,
            media_url=args.media,
            category=args.category,
            description=args.description,
            action_text=args.action_text,
            action_url=args.action_url,
            featured=args.featured,
            poll_question=args.poll_question,
            poll_options=poll_opts
        )
    elif args.list:
        list_stories()
    elif args.delete:
        delete_story_by_id(args.delete)
    else:
        interactive_menu()


if __name__ == "__main__":
    main()
