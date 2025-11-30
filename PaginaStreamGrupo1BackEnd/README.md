# Backend - Plataforma de Streaming

Backend del proyecto de streaming del Grupo 1.

## 🚀 Instalación

```bash
npm install
```

## 💾 Base de Datos

Este proyecto utiliza PostgreSQL. Asegúrate de tener PostgreSQL instalado y configurado.

### Crear la base de datos
```sql
CREATE DATABASE streaming_db;
```

## 💻 Uso

### Modo desarrollo
```bash
npm run dev
```

### Modo producción
```bash
npm start
```

## 📁 Estructura del proyecto

```
src/
├── index.js          # Punto de entrada
├── config/           # Configuraciones
│   └── database.js   # Configuración de PostgreSQL
├── controllers/      # Controladores
├── models/           # Modelos de Sequelize
├── routes/           # Rutas de la API
├── middlewares/      # Middlewares personalizados
└── utils/            # Utilidades
```

## 🔧 Configuración

Configurar las variables de entorno en el archivo `.env`:

- `PORT`: Puerto del servidor (default: 3000)
- `DB_HOST`: Host de PostgreSQL (default: localhost)
- `DB_PORT`: Puerto de PostgreSQL (default: 5432)
- `DB_NAME`: Nombre de la base de datos
- `DB_USER`: Usuario de PostgreSQL
- `DB_PASSWORD`: Contraseña de PostgreSQL
- `NODE_ENV`: Ambiente de ejecución

## 📡 Endpoints

- `GET /` - Información básica del API
- `GET /api/health` - Estado del servidor
