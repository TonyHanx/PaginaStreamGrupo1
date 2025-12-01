import { API_ENDPOINTS } from '../config/api';

export interface Transaction {
  id: string;
  userId: string;
  streamerId?: string;
  giftId?: string;
  tipo: 'regalo' | 'compra_monedas' | 'puntos';
  monto: number;
  descripcion?: string;
  createdAt: string;
  updatedAt: string;
  streamer?: {
    displayName: string;
  };
  gift?: {
    nombre: string;
    emoji?: string;
    imagenUrl?: string;
  };
}

const STORAGE_KEY = 'TRANSACCIONES_USUARIO';

/**
 * Obtiene el token de autenticación
 */
function getAuthToken(): string | null {
  // Buscar primero en localStorage (donde se guarda al hacer login)
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}

/**
 * Obtiene el ID del usuario actual
 */
function getCurrentUserId(): string | null {
  const usuarioStr = sessionStorage.getItem('USUARIO');
  if (!usuarioStr) return null;
  
  try {
    const usuario = JSON.parse(usuarioStr);
    // Usar id si existe, si no usar username como fallback
    return usuario.id || usuario.userId || usuario.username || null;
  } catch {
    return null;
  }
}

/**
 * Guarda transacciones en localStorage
 */
function saveTransactionsToLocalStorage(transactions: Transaction[]): void {
  try {
    const userId = getCurrentUserId();
    if (!userId) return;

    const allTransactions = getAllTransactionsFromLocalStorage();
    allTransactions[userId] = transactions;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allTransactions));
  } catch (error) {
    console.error('Error al guardar transacciones en localStorage:', error);
  }
}

/**
 * Obtiene todas las transacciones de todos los usuarios desde localStorage
 */
function getAllTransactionsFromLocalStorage(): Record<string, Transaction[]> {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

/**
 * Obtiene las transacciones del usuario actual desde localStorage
 */
export function getTransactionsFromLocalStorage(): Transaction[] {
  try {
    const userId = getCurrentUserId();
    if (!userId) return [];

    const allTransactions = getAllTransactionsFromLocalStorage();
    return allTransactions[userId] || [];
  } catch {
    return [];
  }
}

/**
 * Agrega una transacción al localStorage
 */
export function addTransactionToLocalStorage(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): void {
  try {
    const userId = getCurrentUserId();
    console.log('🔍 [TransactionService] getCurrentUserId:', userId);
    console.log('🔍 [TransactionService] Transaction data:', transaction);
    
    if (!userId) {
      console.error('❌ [TransactionService] No se pudo obtener el userId');
      return;
    }

    const transactions = getTransactionsFromLocalStorage();
    console.log('📦 [TransactionService] Transacciones actuales:', transactions.length);
    
    // Crear transacción con datos completos
    const newTransaction: Transaction = {
      ...transaction,
      id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    transactions.unshift(newTransaction);
    saveTransactionsToLocalStorage(transactions);
    
    console.log('✅ [TransactionService] Transacción guardada:', newTransaction);
    console.log('📦 [TransactionService] Total transacciones:', transactions.length);

    // Disparar evento para notificar cambios
    window.dispatchEvent(new CustomEvent('transacciones-actualizadas', {
      detail: { transactions }
    }));
  } catch (error) {
    console.error('❌ [TransactionService] Error al agregar transacción:', error);
  }
}

/**
 * Obtiene el historial de transacciones desde el backend
 */
export async function fetchTransactionHistory(): Promise<Transaction[]> {
  try {
    const token = getAuthToken();
    if (!token) {
      // Si no hay token, devolver solo las del localStorage
      return getTransactionsFromLocalStorage();
    }

    const response = await fetch(API_ENDPOINTS.gifts.transactions, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      const transactions = data.transactions || [];
      
      // Guardar en localStorage para uso offline
      saveTransactionsToLocalStorage(transactions);
      
      return transactions;
    }
    
    // Si falla, devolver las del localStorage
    return getTransactionsFromLocalStorage();
  } catch (error) {
    console.error('Error al obtener historial de transacciones:', error);
    // Si hay error, devolver las del localStorage
    return getTransactionsFromLocalStorage();
  }
}

/**
 * Sincroniza las transacciones del backend con el localStorage
 */
export async function syncTransactions(): Promise<void> {
  try {
    await fetchTransactionHistory();
  } catch (error) {
    console.error('Error al sincronizar transacciones:', error);
  }
}

/**
 * Limpia las transacciones del localStorage del usuario actual
 */
export function clearLocalTransactions(): void {
  try {
    const userId = getCurrentUserId();
    if (!userId) return;

    const allTransactions = getAllTransactionsFromLocalStorage();
    delete allTransactions[userId];
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allTransactions));
  } catch (error) {
    console.error('Error al limpiar transacciones:', error);
  }
}

/**
 * Obtiene estadísticas de las transacciones
 */
export function getTransactionStats(transactions: Transaction[]): {
  totalGastoMonedas: number;
  totalCompraMonedas: number;
  totalRegalos: number;
  totalPuntos: number;
} {
  return transactions.reduce((stats, transaction) => {
    if (transaction.tipo === 'regalo') {
      stats.totalGastoMonedas += transaction.monto;
      stats.totalRegalos += 1;
    } else if (transaction.tipo === 'compra_monedas') {
      stats.totalCompraMonedas += transaction.monto;
    }
    return stats;
  }, {
    totalGastoMonedas: 0,
    totalCompraMonedas: 0,
    totalRegalos: 0,
    totalPuntos: 0
  });
}
