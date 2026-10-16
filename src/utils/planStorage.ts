import { InsurancePlan } from '../types';
import { INSURANCE_PLANS } from '../data/plans';

const STORAGE_KEY_PLANS = 'siam_smile_custom_plans_v1';
const STORAGE_KEY_COORDINATOR = 'siam_smile_coordinator_v1';

export interface CoordinatorInfo {
  name: string;
  phone: string;
}

export function loadStoredPlans(): InsurancePlan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PLANS);
    if (!raw) return INSURANCE_PLANS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load custom plans from localStorage:', e);
  }
  return INSURANCE_PLANS;
}

export function saveStoredPlans(plans: InsurancePlan[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(plans));
  } catch (e) {
    console.error('Failed to save custom plans to localStorage:', e);
  }
}

export function resetStoredPlans(): InsurancePlan[] {
  try {
    localStorage.removeItem(STORAGE_KEY_PLANS);
  } catch (e) {
    console.error('Failed to reset custom plans:', e);
  }
  return INSURANCE_PLANS;
}

export function loadCoordinatorSettings(): CoordinatorInfo {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COORDINATOR);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load coordinator info:', e);
  }
  return {
    name: '',
    phone: '',
  };
}

export function saveCoordinatorSettings(info: CoordinatorInfo): void {
  try {
    localStorage.setItem(STORAGE_KEY_COORDINATOR, JSON.stringify(info));
  } catch (e) {
    console.error('Failed to save coordinator info:', e);
  }
}
