import { NextResponse } from 'next/server';
import { getChatUsers, saveChatUser } from '@/lib/serverStorage';
import { ChatUser } from '@/lib/seeds';

function isStrongPassword(password: string): boolean {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(password);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email, password, name, phone, county, farmFocus, avatar, userId, updates } = body;

    const users = await getChatUsers();

    // ─── 1. Register ─────────────────────────────────────────────────────────
    if (action === 'register') {
      if (!email || !name || !password) {
        return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
      }

      if (!isStrongPassword(password.trim())) {
        return NextResponse.json({
          error: 'Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character.',
        }, { status: 400 });
      }

      const cleanEmail = email.trim().toLowerCase();
      const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
      if (existing) {
        return NextResponse.json({ error: 'An account with this email already exists' }, { status: 400 });
      }

      const newUser: ChatUser = {
        id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: name.trim(),
        email: cleanEmail,
        password: password.trim(),
        phone: phone?.trim() || undefined,
        county: county?.trim() || 'Kenya',
        farmFocus: farmFocus?.trim() || 'Poultry Farmer',
        avatar: avatar || '',
        role: 'farmer',
        status: 'pending_approval', // Requires Admin Approval
        createdAt: new Date().toISOString(),
      };

      await saveChatUser(newUser);

      // Return sanitized user
      const { password: _, ...safeUser } = newUser;
      return NextResponse.json({
        success: true,
        user: safeUser,
        message: 'Account created! Your application is pending admin verification.',
      });
    }

    // ─── 2. Login ────────────────────────────────────────────────────────────
    if (action === 'login') {
      if (!email || !password) {
        return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
      }

      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();

      // Check admin login bypass
      if (cleanEmail === 'cucumutugipoultry@gmail.com' || cleanEmail === 'admin@cucumutugi.com') {
        const adminUser = users.find(u => u.role === 'admin') || {
          id: 'admin-cucu',
          name: 'Cucu Mutugi Admin',
          email: 'cucumutugipoultry@gmail.com',
          county: 'Embu HQ',
          role: 'admin',
          status: 'approved',
          avatar: '/logo.png',
          createdAt: new Date().toISOString(),
        };
        return NextResponse.json({ success: true, user: adminUser });
      }

      const targetUser = users.find(u => u.email.toLowerCase() === cleanEmail);
      if (!targetUser) {
        return NextResponse.json({ error: 'No account found with this email' }, { status: 404 });
      }

      if (targetUser.password && targetUser.password !== cleanPassword) {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
      }

      if (targetUser.status === 'banned') {
        return NextResponse.json({ error: 'This account has been suspended by the administrator.' }, { status: 403 });
      }

      if (targetUser.status === 'pending_approval') {
        return NextResponse.json({
          error: 'Your account is currently awaiting Admin Verification. The Cucu Mutugi admin will review and approve your membership shortly.',
          pendingApproval: true,
        }, { status: 403 });
      }

      const { password: _, ...safeUser } = targetUser;
      return NextResponse.json({ success: true, user: safeUser });
    }

    // ─── 3. Update Profile ───────────────────────────────────────────────────
    if (action === 'update_profile' && userId) {
      const targetUser = users.find(u => u.id === userId);
      if (!targetUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const updatedUser: ChatUser = {
        ...targetUser,
        name: updates?.name || targetUser.name,
        phone: updates?.phone !== undefined ? updates.phone : targetUser.phone,
        county: updates?.county !== undefined ? updates.county : targetUser.county,
        farmFocus: updates?.farmFocus !== undefined ? updates.farmFocus : targetUser.farmFocus,
        avatar: updates?.avatar !== undefined ? updates.avatar : targetUser.avatar,
      };

      await saveChatUser(updatedUser);
      const { password: _, ...safeUser } = updatedUser;
      return NextResponse.json({ success: true, user: safeUser });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Authentication error';
    console.error('Chat auth error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
