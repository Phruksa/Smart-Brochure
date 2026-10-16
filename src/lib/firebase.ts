import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  getDocs,
  writeBatch,
  getDocFromServer,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { ComparisonHistoryItem, CustomerProfile, PayerOrganizationType } from '../types';
import { MOCK_EXISTING_CUSTOMERS } from '../data/customers';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with specific databaseId provided in config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export const SMART_BROCHURES_COLLECTION = 'smart_brochures';
export const COMPARISONS_COLLECTION = 'comparisons';
export const CUSTOMERS_COLLECTION = 'customers';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: true,
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Validate connection to Firestore on boot
 */
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline, using offline capabilities.');
      return false;
    }
    // Any other response means we connected to the server
    return true;
  }
}

/**
 * Save or update Smart Brochure item in Firestore ('smart_brochures' collection)
 */
export async function saveSmartBrochureToFirestore(
  item: ComparisonHistoryItem,
  payerType?: PayerOrganizationType | string
): Promise<void> {
  const path = SMART_BROCHURES_COLLECTION;
  try {
    const payload = {
      ...item,
      payerType: payerType || item.payerType || 'private',
      updatedAt: new Date().toISOString(),
      collectionSource: 'Smart Brochure',
    };

    // Save to primary 'smart_brochures' collection
    const brochureRef = doc(db, SMART_BROCHURES_COLLECTION, item.id);
    await setDoc(brochureRef, payload, { merge: true });

    // Also keep legacy 'comparisons' in sync for backwards compatibility
    const compRef = doc(db, COMPARISONS_COLLECTION, item.id);
    await setDoc(compRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${item.id}`);
  }
}

/**
 * Alias for saveComparisonToFirestore pointing to Smart Brochure
 */
export async function saveComparisonToFirestore(item: ComparisonHistoryItem): Promise<void> {
  return saveSmartBrochureToFirestore(item);
}

/**
 * Toggle mark/pinned status of Smart Brochure in Firestore
 */
export async function toggleMarkSmartBrochureInFirestore(id: string, isMarked: boolean): Promise<void> {
  try {
    const brochureRef = doc(db, SMART_BROCHURES_COLLECTION, id);
    await updateDoc(brochureRef, {
      isMarked: !isMarked,
      updatedAt: new Date().toISOString(),
    }).catch(() => null);

    const compRef = doc(db, COMPARISONS_COLLECTION, id);
    await updateDoc(compRef, {
      isMarked: !isMarked,
      updatedAt: new Date().toISOString(),
    }).catch(() => null);
  } catch (error) {
    console.warn('Error toggling mark in Firestore:', error);
  }
}

export const toggleMarkComparisonInFirestore = toggleMarkSmartBrochureInFirestore;

/**
 * Delete Smart Brochure from Firestore
 */
export async function deleteSmartBrochureFromFirestore(id: string): Promise<void> {
  try {
    const brochureRef = doc(db, SMART_BROCHURES_COLLECTION, id);
    await deleteDoc(brochureRef).catch(() => null);

    const compRef = doc(db, COMPARISONS_COLLECTION, id);
    await deleteDoc(compRef).catch(() => null);
  } catch (error) {
    console.warn('Error deleting Smart Brochure from Firestore:', error);
  }
}

export const deleteComparisonFromFirestore = deleteSmartBrochureFromFirestore;

/**
 * Subscribe to real-time updates for Smart Brochures from Firestore
 */
export function subscribeToSmartBrochures(
  onUpdate: (items: ComparisonHistoryItem[]) => void,
  onError?: (err: Error) => void
): () => void {
  try {
    const colRef = collection(db, SMART_BROCHURES_COLLECTION);
    const q = query(colRef, orderBy('createdAt', 'desc'));

    return onSnapshot(
      q,
      async (snapshot) => {
        if (!snapshot.empty) {
          const items: ComparisonHistoryItem[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              createdAt: data.createdAt || new Date().toISOString(),
              formattedDate: data.formattedDate || '',
              customerName: data.customerName || '',
              isMarked: Boolean(data.isMarked),
              selectedPlanIds: Array.isArray(data.selectedPlanIds) ? data.selectedPlanIds : [],
              selectedPlanNames: Array.isArray(data.selectedPlanNames) ? data.selectedPlanNames : [],
              agentFirstName: data.agentFirstName || '',
              agentLastName: data.agentLastName || '',
              agentOfficeCode: data.agentOfficeCode || '',
              agentPhone: data.agentPhone || '',
              userAge: typeof data.userAge === 'number' ? data.userAge : null,
              payerType: data.payerType || 'private',
              existingCustomerIdCard: data.existingCustomerIdCard || null,
              notes: data.notes || '',
            };
          });
          onUpdate(items);
        } else {
          // If smart_brochures is still empty, check if legacy comparisons exist and migrate
          try {
            const legacySnap = await getDocs(query(collection(db, COMPARISONS_COLLECTION), orderBy('createdAt', 'desc')));
            if (!legacySnap.empty) {
              const legacyItems: ComparisonHistoryItem[] = legacySnap.docs.map((docSnap) => {
                const data = docSnap.data();
                return {
                  id: docSnap.id,
                  createdAt: data.createdAt || new Date().toISOString(),
                  formattedDate: data.formattedDate || '',
                  customerName: data.customerName || '',
                  isMarked: Boolean(data.isMarked),
                  selectedPlanIds: Array.isArray(data.selectedPlanIds) ? data.selectedPlanIds : [],
                  selectedPlanNames: Array.isArray(data.selectedPlanNames) ? data.selectedPlanNames : [],
                  agentFirstName: data.agentFirstName || '',
                  agentLastName: data.agentLastName || '',
                  agentOfficeCode: data.agentOfficeCode || '',
                  agentPhone: data.agentPhone || '',
                  userAge: typeof data.userAge === 'number' ? data.userAge : null,
                  payerType: data.payerType || 'private',
                  existingCustomerIdCard: data.existingCustomerIdCard || null,
                  notes: data.notes || '',
                };
              });

              // Copy over to smart_brochures
              const batch = writeBatch(db);
              legacyItems.forEach((item) => {
                batch.set(doc(db, SMART_BROCHURES_COLLECTION, item.id), item);
              });
              await batch.commit().catch(() => null);
              onUpdate(legacyItems);
            }
          } catch (e) {
            console.warn('Legacy migration check notice:', e);
          }
        }
      },
      (error) => {
        console.warn('Smart Brochure subscription error:', error);
        onError?.(error);
      }
    );
  } catch (err) {
    console.warn('Failed to start Firestore Smart Brochure listener:', err);
    onError?.(err as Error);
    return () => {};
  }
}

export const subscribeToComparisons = subscribeToSmartBrochures;

/**
 * Initialize / Seed mock customers into Firestore if empty
 */
export async function seedCustomersToFirestore(): Promise<void> {
  try {
    const colRef = collection(db, CUSTOMERS_COLLECTION);
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      const batch = writeBatch(db);
      MOCK_EXISTING_CUSTOMERS.forEach((customer) => {
        const docRef = doc(db, CUSTOMERS_COLLECTION, customer.idCard);
        batch.set(docRef, customer);
      });
      await batch.commit();
      console.log('Successfully seeded initial customers into Firestore');
    }
  } catch (error) {
    console.warn('Unable to seed customers to Firestore (using in-memory mock):', error);
  }
}

/**
 * Subscribe to customers from Firestore
 */
export function subscribeToCustomers(
  onUpdate: (customers: CustomerProfile[]) => void
): () => void {
  try {
    const colRef = collection(db, CUSTOMERS_COLLECTION);
    return onSnapshot(colRef, (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map((d) => d.data() as CustomerProfile);
        onUpdate(list);
      }
    }, (err) => {
      console.warn('Customer subscription fallback to mock:', err);
    });
  } catch (err) {
    return () => {};
  }
}
