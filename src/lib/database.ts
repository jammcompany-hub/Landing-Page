import { promises as fs } from 'fs';
import path from 'path';
import { getServerFirestore } from './firebase';

export interface WaitlistEntry {
  id: string;
  email: string;
  subscribedAt: string;
  isActive: boolean;
  school: string;
}

// Use a more reliable path for Next.js
const DATA_FILE = path.join(process.cwd(), 'data', 'waitlist.json');

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.dirname(DATA_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Read waitlist data
export async function getWaitlistEntries(): Promise<WaitlistEntry[]> {
  const db = getServerFirestore();
  if (db) {
    const snapshot = await db.collection('waitlist').get();
    return snapshot.docs.map((doc) => {
      const d = doc.data() as Partial<WaitlistEntry> & Record<string, unknown>;
      return {
        id: doc.id,
        email: String(d.email ?? ''),
        subscribedAt: String(d.subscribedAt ?? new Date().toISOString()),
        isActive: Boolean(d.isActive ?? true),
        school: String(d.school ?? ''),
      } as WaitlistEntry;
    });
  }

  try {
    await ensureDataDir();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    // File doesn't exist or is empty, return empty array
    return [];
  }
}

// Add email to waitlist
export async function addToWaitlist(email: string, school: string): Promise<{ success: boolean; message: string }> {
  const normalizedEmail = email.toLowerCase();
  const normalizedSchool = school.toLowerCase();
  const db = getServerFirestore();

  try {
    if (db) {
      const docRef = db.collection('waitlist').doc(normalizedEmail);
      const docSnap = await docRef.get();
      if (docSnap.exists) {
        const data = docSnap.data() as Partial<WaitlistEntry>;
        if (data.isActive) {
          return { success: false, message: 'Email is already on the waitlist' };
        }
        await docRef.update({ isActive: true, subscribedAt: new Date().toISOString(), email: normalizedEmail, school: normalizedSchool });
      } else {
        await docRef.set({ email: normalizedEmail, school: normalizedSchool, subscribedAt: new Date().toISOString(), isActive: true });
      }
      return { success: true, message: 'Successfully added to waitlist!' };
    }

    await ensureDataDir();
    const entries = await getWaitlistEntries();
    const existingEntry = entries.find((entry) => entry.email.toLowerCase() === normalizedEmail);
    if (existingEntry) {
      if (existingEntry.isActive) {
        return { success: false, message: 'Email is already on the waitlist' };
      } else {
        existingEntry.isActive = true;
        existingEntry.subscribedAt = new Date().toISOString();
        existingEntry.school = normalizedSchool;
      }
    } else {
      const newEntry: WaitlistEntry = {
        id: Date.now().toString(),
        email: normalizedEmail,
        subscribedAt: new Date().toISOString(),
        isActive: true,
        school: normalizedSchool,
      };
      entries.push(newEntry);
    }
    await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2));
    return { success: true, message: 'Successfully added to waitlist!' };
  } catch (error) {
    console.error('Error adding to waitlist:', error);
    return { success: false, message: 'Failed to add to waitlist. Please try again.' };
  }
}

// Get active subscribers
export async function getActiveSubscribers(): Promise<WaitlistEntry[]> {
  const db = getServerFirestore();
  if (db) {
    const snapshot = await db.collection('waitlist').where('isActive', '==', true).get();
    return snapshot.docs.map((doc) => {
      const d = doc.data() as Partial<WaitlistEntry> & Record<string, unknown>;
      return {
        id: doc.id,
        email: String(d.email ?? ''),
        subscribedAt: String(d.subscribedAt ?? new Date().toISOString()),
        isActive: Boolean(d.isActive ?? true),
        school: String(d.school ?? ''),
      } as WaitlistEntry;
    });
  }

  const entries = await getWaitlistEntries();
  return entries.filter((entry) => entry.isActive);
}

// Remove from waitlist (unsubscribe)
export async function removeFromWaitlist(email: string): Promise<{ success: boolean; message: string }> {
  const normalizedEmail = email.toLowerCase();
  const db = getServerFirestore();
  try {
    if (db) {
      const docRef = db.collection('waitlist').doc(normalizedEmail);
      const docSnap = await docRef.get();
      if (!docSnap.exists) {
        return { success: false, message: 'Email not found on waitlist' };
      }
      await docRef.update({ isActive: false });
      return { success: true, message: 'Successfully unsubscribed' };
    }

    await ensureDataDir();
    const entries = await getWaitlistEntries();
    const entryIndex = entries.findIndex((entry) => entry.email.toLowerCase() === normalizedEmail);
    if (entryIndex === -1) {
      return { success: false, message: 'Email not found on waitlist' };
    }
    entries[entryIndex].isActive = false;
    await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2));
    return { success: true, message: 'Successfully unsubscribed' };
  } catch (error) {
    console.error('Error removing from waitlist:', error);
    return { success: false, message: 'Failed to unsubscribe. Please try again.' };
  }
}
