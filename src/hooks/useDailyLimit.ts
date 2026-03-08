import { useState, useEffect } from 'react';

interface DailyUsage {
  date: string;
  count: number;
  lastUsed: string;
}

const STORAGE_KEY = 'roulette_daily_usage';
const MAX_DAILY_USES = 3;

// Development bypass - set to true to disable daily limits for testing
const BYPASS_DAILY_LIMIT = true; // Change to false to re-enable limits

export const useDailyLimit = () => {
  const [canUse, setCanUse] = useState(true);
  const [timeUntilReset, setTimeUntilReset] = useState<string>('');
  const [usageCount, setUsageCount] = useState(0);

  const getTodayString = () => {
    return new Date().toDateString();
  };

  const getStoredUsage = (): DailyUsage => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error reading daily usage:', error);
    }
    
    return {
      date: getTodayString(),
      count: 0,
      lastUsed: ''
    };
  };

  const saveUsage = (usage: DailyUsage) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
    } catch (error) {
      console.error('Error saving daily usage:', error);
    }
  };

  const checkDailyLimit = () => {
    // Bypass daily limit for testing
    if (BYPASS_DAILY_LIMIT) {
      setUsageCount(0);
      setCanUse(true);
      setTimeUntilReset('');
      return;
    }

    const today = getTodayString();
    const usage = getStoredUsage();

    // Reset count if it's a new day
    if (usage.date !== today) {
      usage.date = today;
      usage.count = 0;
      usage.lastUsed = '';
      saveUsage(usage);
    }

    setUsageCount(usage.count);
    setCanUse(usage.count < MAX_DAILY_USES);

    // Calculate time until reset (next day at midnight)
    if (usage.count >= MAX_DAILY_USES) {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const timeLeft = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeUntilReset(`${hours}h ${minutes}m`);
    } else {
      setTimeUntilReset('');
    }
  };

  const recordUsage = () => {
    // Bypass daily limit for testing
    if (BYPASS_DAILY_LIMIT) {
      return true;
    }

    const today = getTodayString();
    const usage = getStoredUsage();

    if (usage.date !== today) {
      usage.date = today;
      usage.count = 0;
    }

    if (usage.count < MAX_DAILY_USES) {
      usage.count += 1;
      usage.lastUsed = new Date().toISOString();
      saveUsage(usage);
      checkDailyLimit();
      return true;
    }

    return false;
  };

  const resetUsage = () => {
    const usage: DailyUsage = {
      date: getTodayString(),
      count: 0,
      lastUsed: ''
    };
    saveUsage(usage);
    checkDailyLimit();
  };

  useEffect(() => {
    checkDailyLimit();
    
    // Check every minute for time updates
    const interval = setInterval(checkDailyLimit, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    canUse,
    usageCount,
    maxUses: MAX_DAILY_USES,
    timeUntilReset,
    recordUsage,
    resetUsage, // For testing purposes
    checkDailyLimit
  };
};