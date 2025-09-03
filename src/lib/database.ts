import { promises as fs } from 'fs';
import path from 'path';

export interface WaitlistEntry {
  id: string;
  email: string;
  subscribedAt: string;
  isActive: boolean;
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
  try {
    await ensureDataDir();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist or is empty, return empty array
    return [];
  }
}

// Add email to waitlist
export async function addToWaitlist(email: string): Promise<{ success: boolean; message: string }> {
  try {
    await ensureDataDir();
    
    const entries = await getWaitlistEntries();
    
    // Check if email already exists
    const existingEntry = entries.find(entry => entry.email.toLowerCase() === email.toLowerCase());
    if (existingEntry) {
      if (existingEntry.isActive) {
        return { success: false, message: 'Email is already on the waitlist' };
      } else {
        // Reactivate the entry
        existingEntry.isActive = true;
        existingEntry.subscribedAt = new Date().toISOString();
      }
    } else {
      // Add new entry
      const newEntry: WaitlistEntry = {
        id: Date.now().toString(),
        email: email.toLowerCase(),
        subscribedAt: new Date().toISOString(),
        isActive: true
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
  const entries = await getWaitlistEntries();
  return entries.filter(entry => entry.isActive);
}

// Remove from waitlist (unsubscribe)
export async function removeFromWaitlist(email: string): Promise<{ success: boolean; message: string }> {
  try {
    await ensureDataDir();
    
    const entries = await getWaitlistEntries();
    const entryIndex = entries.findIndex(entry => entry.email.toLowerCase() === email.toLowerCase());
    
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
