import { ComparisonHistoryItem } from '../types';
import {
  saveComparisonToFirestore,
  toggleMarkComparisonInFirestore,
  deleteComparisonFromFirestore,
} from '../lib/firebase';

const STORAGE_KEY_HISTORY = 'insurance_comparison_history_v1';
const STORAGE_KEY_AGENT = 'insurance_saved_agent_profile_v1';

export interface SavedAgentProfile {
  agentFirstName: string;
  agentLastName: string;
  agentOfficeCode: string;
  agentPhone: string;
}

const DEFAULT_AGENT_PROFILE: SavedAgentProfile = {
  agentFirstName: 'บรรจง',
  agentLastName: 'มีสุข',
  agentOfficeCode: '05741',
  agentPhone: '089-123-4567',
};

// Initial seed history
const INITIAL_HISTORY: ComparisonHistoryItem[] = [
  {
    id: 'hist-1',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    formattedDate: '20 ก.ย. 2569 14:30',
    customerName: 'คุณสมชาย มั่นคงดี',
    isMarked: true,
    selectedPlanIds: ['plan-15-i', 'plan-610-i'],
    selectedPlanNames: ['แผน 15-I (ผู้ป่วยใน)', 'แผน 610-I (ผู้ป่วยใน)'],
    agentFirstName: 'บรรจง',
    agentLastName: 'มีสุข',
    agentOfficeCode: '05741',
    agentPhone: '089-123-4567',
    userAge: 41,
    existingCustomerIdCard: '1100501234567',
    notes: 'ลูกค้าเดิมสนใจเปรียบเทียบเพิ่มสิทธิประโยชน์ค่าห้องและค่าผ่าตัดจากแผน 15-I เดิม',
  },
  {
    id: 'hist-2',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    formattedDate: '21 ก.ย. 2569 10:15',
    customerName: '', // ไม่ระบุชื่อ
    isMarked: false,
    selectedPlanIds: ['plan-15-i', 'plan-15-o'],
    selectedPlanNames: ['แผน 15-I (ผู้ป่วยใน)', 'แผน 15-O (IPD+OPD)'],
    agentFirstName: 'บรรจง',
    agentLastName: 'มีสุข',
    agentOfficeCode: '05741',
    agentPhone: '089-123-4567',
    userAge: 35,
    notes: 'เปรียบเทียบสรุปเบี้ยสำหรับลูกค้าสนใจแผนที่มีความคุ้มครอง OPD',
  },
];

export function getComparisonHistory(): ComparisonHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(INITIAL_HISTORY));
      return INITIAL_HISTORY;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read comparison history:', e);
    return INITIAL_HISTORY;
  }
}

export function saveComparisonHistoryItem(
  entry: Omit<ComparisonHistoryItem, 'id' | 'createdAt' | 'formattedDate'>
): { updatedList: ComparisonHistoryItem[]; savedItem: ComparisonHistoryItem } {
  const current = getComparisonHistory();
  const now = new Date();
  
  // Format Thai date e.g. "21 ก.ย. 2569 15:45"
  const thaiMonths = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
  ];
  const day = now.getDate();
  const month = thaiMonths[now.getMonth()];
  const year = now.getFullYear() + 543;
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const formattedDate = `${day} ${month} ${year} ${hours}:${minutes}`;

  const savedItem: ComparisonHistoryItem = {
    ...entry,
    id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: now.toISOString(),
    formattedDate,
  };

  // Add to top of list
  const updatedList = [savedItem, ...current];
  try {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updatedList));
  } catch (e) {
    console.error('Failed to save history to localStorage:', e);
  }

  // Persistent Cloud Sync to Firebase Firestore
  saveComparisonToFirestore(savedItem).catch((err) => {
    console.warn('Firebase Firestore async save failed, retained in local storage:', err);
  });

  return { updatedList, savedItem };
}

export function toggleMarkComparison(id: string): ComparisonHistoryItem[] {
  const current = getComparisonHistory();
  const target = current.find((item) => item.id === id);
  const updated = current.map((item) =>
    item.id === id ? { ...item, isMarked: !item.isMarked } : item
  );
  try {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to toggle mark in localStorage:', e);
  }

  // Persistent Cloud Sync to Firebase Firestore
  if (target) {
    toggleMarkComparisonInFirestore(id, target.isMarked).catch((err) => {
      console.warn('Firebase Firestore toggle mark failed:', err);
    });
  }

  return updated;
}

export function deleteComparisonHistoryItem(id: string): ComparisonHistoryItem[] {
  const current = getComparisonHistory();
  const updated = current.filter((item) => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete history item:', e);
  }

  // Persistent Cloud Sync to Firebase Firestore
  deleteComparisonFromFirestore(id).catch((err) => {
    console.warn('Firebase Firestore delete failed:', err);
  });

  return updated;
}

export function getSavedAgentProfile(): SavedAgentProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AGENT);
    if (!raw) {
      return DEFAULT_AGENT_PROFILE;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read agent profile:', e);
    return DEFAULT_AGENT_PROFILE;
  }
}

export function saveAgentProfile(profile: SavedAgentProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY_AGENT, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save agent profile:', e);
  }
}
