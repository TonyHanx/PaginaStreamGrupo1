# API Backend - Plataforma de Streaming

## 📋 Endpoints Disponibles

### Autenticación (`/api/auth`)

#### POST `/api/auth/register`
Registrar un nuevo usuario.
```json
{
  "username": "usuario123",
  "email": "usuario@ejemplo.com",
  "password": "password123"
}
```

#### POST `/api/auth/login`
Iniciar sesión.
```json
{
  "email": "usuario@ejemplo.com",
  "password": "password123"
}
```

#### GET `/api/auth/profile`
Obtener perfil del usuario autenticado (requiere token).

#### PUT `/api/auth/points`
Actualizar puntos del usuario (requiere token).
```json
{
  "puntos": 50
}
```

---

### Streamers y Streams (`/api`)

#### GET `/api/streamers`
Obtener todos los streamers.

#### GET `/api/streamers/:id`
Obtener streamer por ID.

#### GET `/api/streams`
Obtener todos los streams activos.

#### GET `/api/streams/category/:category`
Obtener streams por categoría.

#### POST `/api/streams`
Crear o actualizar stream (requiere token y ser streamer).
```json
{
  "title": "Mi stream épico",
  "category": "Grand Theft Auto V",
  "game": "Grand Theft Auto V",
  "thumbnail": "/thumbnails/mi-stream.png",
  "language": "Español",
  "tags": ["GTA", "RP"],
  "isMature": false
}
```

#### PUT `/api/streams/end`
Finalizar stream activo (requiere token).

---

### Regalos y Monedas (`/api/gifts`)

#### GET `/api/gifts/default`
Obtener regalos predeterminados.

#### GET `/api/gifts/streamer/:streamerId`
Obtener regalos personalizados de un streamer.

#### POST `/api/gifts/custom`
Crear regalo personalizado (requiere token y ser streamer).
```json
{
  "nombre": "Regalo Especial",
  "precio": 150,
  "imagenUrl": "https://...",
  "puntos": 150,
  "color": "#FF5733"
}
```

#### POST `/api/gifts/send`
Enviar regalo a un streamer (requiere token).
```json
{
  "giftId": "uuid-del-regalo",
  "streamerId": "uuid-del-streamer"
}
```

#### POST `/api/gifts/buy-coins`
Comprar monedas (requiere token).
```json
{
  "cantidad": 1000
}
```

#### GET `/api/gifts/balance`
Obtener balance de monedas y puntos (requiere token).

#### GET `/api/gifts/transactions`
Obtener historial de transacciones (requiere token).

---

## 🔐 Autenticación

Todas las rutas protegidas requieren un token JWT en el header:
```
Authorization: Bearer <tu-token>
```

El token se obtiene al hacer login o register.

---

## 📊 Modelos de Datos

### User
- `id` (UUID)
- `username` (String, único)
- `email` (String, único)
- `password` (String, encriptado)
- `puntos` (Integer, default: 0)
- `monedas` (Integer, default: 500)
- `isStreamer` (Boolean, default: false)
- `avatar` (String, opcional)

### Streamer
- `id` (UUID)
- `userId` (UUID, referencia a User)
- `displayName` (String)
- `description` (Text)
- `followers` (Integer)
- `verified` (Boolean)
- `isLive` (Boolean)
- `socialMedia` (JSON)

### Stream
- `id` (UUID)
- `streamerId` (UUID)
- `title` (String)
- `category` (String)
- `game` (String)
- `thumbnail` (String)
- `viewers` (Integer)
- `language` (String)
- `tags` (JSON Array)
- `isRecording` (Boolean)
- `isMature` (Boolean)
- `startedAt` (Date)
- `endedAt` (Date)
- `isActive` (Boolean)

### Gift
- `id` (UUID)
- `nombre` (String)
- `precio` (Integer)
- `emoji` (String)
- `imagenUrl` (String)
- `puntos` (Integer)
- `esPredeterminado` (Boolean)
- `streamerId` (UUID, opcional)
- `color` (String, opcional)

### Transaction
- `id` (UUID)
- `userId` (UUID)
- `streamerId` (UUID, opcional)
- `giftId` (UUID, opcional)
- `tipo` (ENUM: 'regalo', 'compra_monedas', 'puntos')
- `monto` (Integer)
- `descripcion` (String)

---

## 🚀 Respuestas de Ejemplo

### Registro exitoso:
```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": "uuid",
    "username": "usuario123",
    "email": "usuario@ejemplo.com",
    "puntos": 0,
    "monedas": 500,
    "isStreamer": false
  },
  "token": "jwt-token..."
}
```

### Lista de streams:
```json
{
  "streams": [
    {
      "id": "uuid",
      "title": "Stream épico",
      "category": "Grand Theft Auto V",
      "game": "Grand Theft Auto V",
      "viewers": 1234,
      "streamer": {
        "id": "uuid",
        "displayName": "Streamer Pro",
        "verified": true,
        "user": {
          "username": "streamerpro",
          "avatar": "..."
        }
      }
    }
  ]
}
```
