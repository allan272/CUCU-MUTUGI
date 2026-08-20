import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';
import {
  DBTable,
  Story,
  Transaction,
  CustomerActivity,
  ChatUser,
  ChatMessage,
  ChatChannel,
  DEFAULT_PRODUCTS,
  DEFAULT_ORDERS,
  DEFAULT_FARMERS,
  DEFAULT_BLOGS,
  DEFAULT_STORIES,
  DEFAULT_VIDEOS,
  DEFAULT_SETTINGS,
  DEFAULT_TRANSACTIONS,
  DEFAULT_ACTIVITIES,
  DEFAULT_CHAT_USERS,
  DEFAULT_CHAT_CHANNELS,
  DEFAULT_CHAT_MESSAGES
} from './seeds';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'cucu_db.json');

const INITIAL_DB: DBTable = {
  products: DEFAULT_PRODUCTS,
  orders: DEFAULT_ORDERS,
  farmers: DEFAULT_FARMERS,
  blogPosts: DEFAULT_BLOGS,
  stories: DEFAULT_STORIES,
  videos: DEFAULT_VIDEOS,
  settings: DEFAULT_SETTINGS,
  transactions: DEFAULT_TRANSACTIONS,
  activities: DEFAULT_ACTIVITIES,
  chatUsers: DEFAULT_CHAT_USERS,
  chatChannels: DEFAULT_CHAT_CHANNELS,
  chatMessages: DEFAULT_CHAT_MESSAGES,
};

let memoryCache: DBTable | null = null;

export async function getStoredDB(): Promise<DBTable> {
  if (memoryCache) {
    return memoryCache;
  }

  try {
    const raw = await readFile(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    memoryCache = {
      products: parsed.products || DEFAULT_PRODUCTS,
      orders: parsed.orders || DEFAULT_ORDERS,
      farmers: parsed.farmers || DEFAULT_FARMERS,
      blogPosts: parsed.blogPosts || DEFAULT_BLOGS,
      stories: parsed.stories || DEFAULT_STORIES,
      videos: parsed.videos || DEFAULT_VIDEOS,
      settings: parsed.settings || DEFAULT_SETTINGS,
      transactions: parsed.transactions || DEFAULT_TRANSACTIONS,
      activities: parsed.activities || DEFAULT_ACTIVITIES,
      chatUsers: parsed.chatUsers || DEFAULT_CHAT_USERS,
      chatChannels: parsed.chatChannels || DEFAULT_CHAT_CHANNELS,
      chatMessages: parsed.chatMessages || DEFAULT_CHAT_MESSAGES,
    };
    return memoryCache;
  } catch (error) {
    // If file doesn't exist or is invalid, initialize it
    memoryCache = { ...INITIAL_DB };
    try {
      await mkdir(DATA_DIR, { recursive: true });
      await writeFile(DB_FILE, JSON.stringify(memoryCache, null, 2), 'utf-8');
    } catch (writeErr) {
      console.warn('Could not write initial db file to disk, using memory:', writeErr);
    }
    return memoryCache;
  }
}

export async function saveStoredDB(updates: Partial<DBTable>): Promise<DBTable> {
  const current = await getStoredDB();
  const updated: DBTable = {
    ...current,
    ...updates,
  };
  memoryCache = updated;

  try {
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(DB_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving DB to disk:', err);
  }

  return updated;
}

// ─── Stories ─────────────────────────────────────────────────────────────────
export async function getStories(): Promise<Story[]> {
  const db = await getStoredDB();
  return db.stories || [];
}

export async function addOrUpdateStory(story: Story): Promise<Story[]> {
  const db = await getStoredDB();
  const existingIndex = db.stories.findIndex(s => s.id === story.id);
  let newStories: Story[];

  if (existingIndex >= 0) {
    newStories = db.stories.map((s, idx) => (idx === existingIndex ? { ...s, ...story } : s));
  } else {
    newStories = [story, ...db.stories];
  }

  await saveStoredDB({ stories: newStories });
  return newStories;
}

export async function deleteStory(id: string): Promise<Story[]> {
  const db = await getStoredDB();
  const newStories = db.stories.filter(s => s.id !== id);
  await saveStoredDB({ stories: newStories });
  return newStories;
}

export async function likeStory(id: string): Promise<Story | null> {
  const db = await getStoredDB();
  let updatedStory: Story | null = null;
  const newStories = db.stories.map(s => {
    if (s.id === id) {
      updatedStory = { ...s, likes: (s.likes || 0) + 1 };
      return updatedStory;
    }
    return s;
  });
  await saveStoredDB({ stories: newStories });
  return updatedStory;
}

export async function viewStory(id: string): Promise<Story | null> {
  const db = await getStoredDB();
  let updatedStory: Story | null = null;
  const newStories = db.stories.map(s => {
    if (s.id === id) {
      updatedStory = { ...s, views: (s.views || 0) + 1 };
      return updatedStory;
    }
    return s;
  });
  await saveStoredDB({ stories: newStories });
  return updatedStory;
}

export async function voteStory(id: string, optionIndex: number): Promise<Story | null> {
  const db = await getStoredDB();
  let updatedStory: Story | null = null;
  const newStories = db.stories.map(s => {
    if (s.id === id && s.poll && s.poll.options && s.poll.options[optionIndex]) {
      const options = [...s.poll.options];
      options[optionIndex] = {
        ...options[optionIndex],
        votes: (options[optionIndex].votes || 0) + 1,
      };
      updatedStory = { ...s, poll: { ...s.poll, options } };
      return updatedStory;
    }
    return s;
  });
  await saveStoredDB({ stories: newStories });
  return updatedStory;
}

// ─── Transactions Ledger ──────────────────────────────────────────────────────
export async function getTransactions(): Promise<Transaction[]> {
  const db = await getStoredDB();
  return db.transactions || DEFAULT_TRANSACTIONS;
}

export async function addTransaction(tx: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction[]> {
  const db = await getStoredDB();
  const newTx: Transaction = {
    ...tx,
    id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [newTx, ...(db.transactions || [])];
  await saveStoredDB({ transactions: updated });
  return updated;
}

export async function updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction[]> {
  const db = await getStoredDB();
  const updated = (db.transactions || []).map(t => (t.id === id ? { ...t, ...updates } : t));
  await saveStoredDB({ transactions: updated });
  return updated;
}

export async function deleteTransaction(id: string): Promise<Transaction[]> {
  const db = await getStoredDB();
  const updated = (db.transactions || []).filter(t => t.id !== id);
  await saveStoredDB({ transactions: updated });
  return updated;
}

// ─── Customer Activity Telemetry ──────────────────────────────────────────────
export async function getActivities(): Promise<CustomerActivity[]> {
  const db = await getStoredDB();
  return db.activities || DEFAULT_ACTIVITIES;
}

export async function logActivity(act: Omit<CustomerActivity, 'id' | 'timestamp'>): Promise<CustomerActivity> {
  const db = await getStoredDB();
  const newActivity: CustomerActivity = {
    ...act,
    id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
  };
  // Keep the latest 200 activity logs
  const updated = [newActivity, ...(db.activities || [])].slice(0, 200);
  await saveStoredDB({ activities: updated });
  return newActivity;
}

export async function clearActivities(): Promise<void> {
  await saveStoredDB({ activities: [] });
}

// ─── Community Chat & Farmer Members ─────────────────────────────────────────
export async function getChatUsers(): Promise<ChatUser[]> {
  const db = await getStoredDB();
  return db.chatUsers || DEFAULT_CHAT_USERS;
}

export async function saveChatUser(user: ChatUser): Promise<ChatUser[]> {
  const db = await getStoredDB();
  const currentUsers = db.chatUsers || DEFAULT_CHAT_USERS;
  const existingIdx = currentUsers.findIndex(u => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
  let updated: ChatUser[];
  if (existingIdx >= 0) {
    updated = currentUsers.map((u, i) => (i === existingIdx ? { ...u, ...user } : u));
  } else {
    updated = [user, ...currentUsers];
  }
  await saveStoredDB({ chatUsers: updated });
  return updated;
}

export async function updateChatUserStatus(id: string, status: 'approved' | 'pending_approval' | 'banned'): Promise<ChatUser[]> {
  const db = await getStoredDB();
  const currentUsers = db.chatUsers || DEFAULT_CHAT_USERS;
  const updated = currentUsers.map(u => {
    if (u.id === id) {
      return {
        ...u,
        status,
        approvedAt: status === 'approved' ? new Date().toISOString() : u.approvedAt,
      };
    }
    return u;
  });
  await saveStoredDB({ chatUsers: updated });
  return updated;
}

export async function getChatChannels(): Promise<ChatChannel[]> {
  const db = await getStoredDB();
  return db.chatChannels || DEFAULT_CHAT_CHANNELS;
}

export async function getChatMessages(channelId?: string): Promise<ChatMessage[]> {
  const db = await getStoredDB();
  const allMessages = db.chatMessages || DEFAULT_CHAT_MESSAGES;
  if (!channelId) return allMessages;
  return allMessages.filter(m => m.channelId === channelId);
}

export async function sendChatMessage(msg: Omit<ChatMessage, 'id' | 'createdAt'>): Promise<ChatMessage> {
  const db = await getStoredDB();
  const allMessages = db.chatMessages || DEFAULT_CHAT_MESSAGES;
  const newMessage: ChatMessage = {
    ...msg,
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [...allMessages, newMessage];
  await saveStoredDB({ chatMessages: updated });
  return newMessage;
}

export async function reactToChatMessage(messageId: string, emoji: string, userId: string): Promise<ChatMessage | null> {
  const db = await getStoredDB();
  const allMessages = db.chatMessages || DEFAULT_CHAT_MESSAGES;
  let targetMessage: ChatMessage | null = null;

  const updated = allMessages.map(m => {
    if (m.id === messageId) {
      const reactions = { ...(m.reactions || {}) };
      const currentUsers = reactions[emoji] || [];
      if (currentUsers.includes(userId)) {
        // Toggle off
        reactions[emoji] = currentUsers.filter(u => u !== userId);
        if (reactions[emoji].length === 0) delete reactions[emoji];
      } else {
        // Toggle on
        reactions[emoji] = [...currentUsers, userId];
      }
      targetMessage = { ...m, reactions };
      return targetMessage;
    }
    return m;
  });

  await saveStoredDB({ chatMessages: updated });
  return targetMessage;
}

export async function deleteChatMessage(messageId: string): Promise<boolean> {
  const db = await getStoredDB();
  const allMessages = db.chatMessages || DEFAULT_CHAT_MESSAGES;
  const updated = allMessages.filter(m => m.id !== messageId);
  await saveStoredDB({ chatMessages: updated });
  return true;
}
