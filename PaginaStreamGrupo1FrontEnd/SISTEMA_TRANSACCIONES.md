# Sistema de Transacciones - Documentación

## 📋 Descripción General

Este sistema permite almacenar y gestionar el historial de transacciones de los usuarios tanto en el **backend (base de datos PostgreSQL)** como en el **frontend (localStorage/sessionStorage)**.

## 🏗️ Arquitectura

### Backend (Base de Datos)

El modelo `Transaction` en Prisma almacena todas las transacciones:

```prisma
model Transaction {
  id          String   @id @default(uuid())
  userId      String
  streamerId  String?
  giftId      String?
  tipo        TransactionType
  monto       Int
  descripcion String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  user        User      @relation(fields: [userId], references: [id])
  streamer    Streamer? @relation(fields: [streamerId], references: [id])
  gift        Gift?     @relation(fields: [giftId], references: [id])
}

enum TransactionType {
  regalo
  compra_monedas
  puntos
}
```

### Frontend (LocalStorage)

Las transacciones se almacenan en `localStorage` bajo la clave `TRANSACCIONES_USUARIO` con esta estructura:

```javascript
{
  "userId1": [
    {
      id: "local-123456789",
      userId: "userId1",
      tipo: "regalo",
      monto: 100,
      descripcion: "Regalo Corazón enviado",
      createdAt: "2025-11-30T10:30:00Z",
      gift: {
        nombre: "Corazón",
        emoji: "❤️",
        imagenUrl: "..."
      }
    }
  ],
  "userId2": [...]
}
```

## 🔄 Flujo de Trabajo

### 1. Compra de Monedas

```typescript
// Usuario compra monedas
await agregarMonedas(500);

// Se registra automáticamente:
// 1. En el backend (si hay token de autenticación)
// 2. En localStorage (siempre)
```

**Backend**: El controlador `buyCoins` crea la transacción automáticamente.

**Frontend**: La función `agregarMonedas` llama a `addTransactionToLocalStorage` para registrar localmente.

### 2. Envío de Regalos

```typescript
// Usuario envía un regalo
enviarRegalo(regalo);

// Se registra automáticamente:
// 1. En el backend (endpoint /api/gifts/send)
// 2. En localStorage
```

**Backend**: El controlador `sendGift` crea la transacción en la base de datos.

**Frontend**: 
- `VistaStream.tsx`: Al enviar regalo, llama a `addTransactionToLocalStorage`
- `Dashboard.tsx`: Similar comportamiento

### 3. Sincronización

```typescript
// Sincronizar transacciones desde el backend
import { syncTransactions } from '@/services/transactionService';

await syncTransactions();
```

Esta función:
1. Consulta el endpoint `/api/gifts/transactions`
2. Obtiene todas las transacciones del usuario desde el backend
3. Las guarda en localStorage como caché

## 📊 Componente de Historial

### Uso

```tsx
import HistorialTransacciones from '@/componentes/HistorialTransacciones/HistorialTransacciones';

// En tu componente
<HistorialTransacciones onClose={() => setShowHistorial(false)} />
```

### Características

- ✅ Muestra todas las transacciones del usuario
- ✅ Filtros por tipo (todas, regalos, compras)
- ✅ Estadísticas (total gastado, total comprado, regalos enviados)
- ✅ Diseño responsive
- ✅ Actualización en tiempo real

## 🔌 API Endpoints

### GET /api/gifts/transactions

Obtiene el historial de transacciones del usuario autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "transactions": [
    {
      "id": "uuid",
      "userId": "uuid",
      "tipo": "regalo",
      "monto": 100,
      "descripcion": "Regalo enviado",
      "createdAt": "2025-11-30T10:30:00Z",
      "streamer": {
        "displayName": "Streamer1"
      },
      "gift": {
        "nombre": "Corazón",
        "emoji": "❤️"
      }
    }
  ]
}
```

## 📦 Servicio de Transacciones

### Funciones Principales

#### `fetchTransactionHistory()`
Obtiene el historial desde el backend. Si falla, devuelve las del localStorage.

```typescript
const transactions = await fetchTransactionHistory();
```

#### `addTransactionToLocalStorage(transaction)`
Agrega una transacción al localStorage.

```typescript
addTransactionToLocalStorage({
  userId: 'user123',
  tipo: 'regalo',
  monto: 100,
  descripcion: 'Regalo enviado'
});
```

#### `syncTransactions()`
Sincroniza las transacciones del backend con localStorage.

```typescript
await syncTransactions();
```

#### `getTransactionsFromLocalStorage()`
Obtiene las transacciones del usuario actual desde localStorage.

```typescript
const localTransactions = getTransactionsFromLocalStorage();
```

#### `getTransactionStats(transactions)`
Calcula estadísticas de las transacciones.

```typescript
const stats = getTransactionStats(transactions);
// {
//   totalGastoMonedas: 500,
//   totalCompraMonedas: 1000,
//   totalRegalos: 5,
//   totalPuntos: 0
// }
```

## 🎯 Ventajas del Sistema Dual

### Base de Datos (Backend)
- ✅ Persistencia permanente
- ✅ Acceso desde cualquier dispositivo
- ✅ Respaldo y seguridad
- ✅ Análisis y reportes avanzados

### LocalStorage (Frontend)
- ✅ Acceso rápido sin conexión
- ✅ Reducción de llamadas al servidor
- ✅ Mejor experiencia de usuario
- ✅ Funciona sin autenticación (modo demo)

## 🔐 Consideraciones de Seguridad

1. **Validación Backend**: Todas las transacciones se validan en el servidor
2. **Tokens JWT**: Se requiere autenticación para las operaciones sensibles
3. **LocalStorage**: Solo se usa para caché y modo demo
4. **Sincronización**: El backend siempre es la fuente de verdad

## 🚀 Próximas Mejoras

- [ ] Exportar historial a CSV/PDF
- [ ] Gráficos de gastos por periodo
- [ ] Notificaciones de transacciones importantes
- [ ] Búsqueda y filtros avanzados
- [ ] Paginación para historial muy largo

## 📝 Ejemplo de Integración Completa

```typescript
import { 
  fetchTransactionHistory, 
  addTransactionToLocalStorage, 
  syncTransactions 
} from '@/services/transactionService';

// 1. Cargar historial al iniciar sesión
useEffect(() => {
  const loadHistory = async () => {
    const transactions = await fetchTransactionHistory();
    setTransactions(transactions);
  };
  loadHistory();
}, []);

// 2. Agregar transacción después de una compra
const handleCompra = async (cantidad: number) => {
  const success = await agregarMonedas(cantidad);
  
  if (success) {
    // La transacción se registra automáticamente
    // pero podemos sincronizar manualmente si queremos
    await syncTransactions();
  }
};

// 3. Escuchar eventos de actualización
useEffect(() => {
  const handleUpdate = (event: CustomEvent) => {
    const { transactions } = event.detail;
    setTransactions(transactions);
  };
  
  window.addEventListener('transacciones-actualizadas', handleUpdate);
  
  return () => {
    window.removeEventListener('transacciones-actualizadas', handleUpdate);
  };
}, []);
```

## 🧪 Testing

Para probar el sistema:

1. **Iniciar sesión** con una cuenta
2. **Comprar monedas** desde el modal de recarga
3. **Enviar regalos** a un streamer
4. **Abrir historial** desde el menú de usuario
5. **Verificar** que las transacciones aparecen correctamente
6. **Cerrar sesión y volver a entrar** para verificar persistencia

---

**Fecha de creación**: 30 de noviembre de 2025  
**Versión**: 1.0.0  
**Autor**: Sistema de gestión de transacciones PaginaStream
