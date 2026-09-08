<div align="center">

# 💰 Finance Dashboard

**Dashboard financiero personal con arquitectura de widgets, construido con React + .NET**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![.NET](https://img.shields.io/badge/.NET-8-512BD4?logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![SQL Server](https://img.shields.io/badge/SQL_Server-2022-CC2927?logo=microsoftsqlserver&logoColor=white)](https://www.microsoft.com/sql-server)
[![Shadcn UI](https://img.shields.io/badge/UI-shadcn%2Fui-000000?logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)
[![Status](https://img.shields.io/badge/status-completo%20%7C%20no%20desplegado-brightgreen)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()

</div>

---

> ✅ **Proyecto terminado.** La aplicación está completa y funcional; lo único pendiente es el despliegue en un entorno público (aún no está online). Puedes clonarla y correrla localmente siguiendo la guía de instalación más abajo — todo el stack (frontend + backend + base de datos) funciona de extremo a extremo en tu máquina.

## 📋 Tabla de contenidos

- [Sobre el proyecto](#-sobre-el-proyecto)
- [Características](#-características)
- [Stack tecnológico](#-stack-tecnológico)
- [Arquitectura](#-arquitectura)
- [Capturas de pantalla](#-capturas-de-pantalla)
- [Instalación y ejecución local](#-instalación-y-ejecución-local)
- [Variables de entorno](#-variables-de-entorno)
- [Roadmap](#-roadmap)
- [Autor](#-autor)

## 🚀 Sobre el proyecto

**Finance Dashboard** es una aplicación web completa para gestión de finanzas personales, con un dashboard **basado en widgets arrastrables/configurables** (grid dinámico) donde el usuario arma su propia vista financiera: seguimiento de gastos, metas de ahorro, gastos recurrentes y más.

El objetivo del proyecto es aplicar buenas prácticas de arquitectura de software en un caso real de punta a punta: frontend moderno con React, backend en .NET siguiendo **Clean Architecture**, y un sistema de autenticación robusto con **JWT + verificación en dos pasos (Google Authenticator / TOTP)**.

## ✨ Características

- 🔐 **Autenticación segura**: login con JWT (access + refresh token) y **2FA con Google Authenticator (TOTP)**.
- 🧩 **Dashboard de widgets**: grid interactivo y reordenable construido con React Flow, cada widget es un módulo independiente.
- 📊 **Widgets financieros**:
  - `TrackerWidget` — seguimiento de gastos/ingresos.
  - `SavingGoalWidget` — metas de ahorro con edición de título en línea y modal de transacciones.
  - Gastos recurrentes (`recurring_expense`).
- 🎨 **UI moderna** con [shadcn/ui](https://ui.shadcn.com/) + Tailwind CSS.
- 🏗️ **Backend en Clean Architecture** (separación en capas: Domain, Application, Infrastructure, API).
- 🗄️ **Persistencia en SQL Server** con Entity Framework Core y migraciones versionadas.

## 🛠️ Stack tecnológico

### Frontend
| Tecnología | Uso |
|---|---|
| React 18 + TypeScript | Librería principal / tipado estático |
| shadcn/ui + Tailwind CSS | Sistema de componentes y estilos |
| React Flow | Layout de grid de widgets |
| Vite | Bundler / dev server |

### Backend
| Tecnología | Uso |
|---|---|
| .NET 8 (C#) | API REST |
| Clean Architecture | Organización en capas (Domain / Application / Infrastructure / API) |
| Entity Framework Core | ORM y migraciones |
| SQL Server | Base de datos relacional |
| JWT | Autenticación basada en tokens |
| TOTP (Google Authenticator) | Autenticación en dos factores |

## 🏛️ Arquitectura

El backend sigue los principios de **Clean Architecture**, separando responsabilidades en capas independientes y desacopladas del framework:

```
src/
├── Domain/           # Entidades, enums y reglas de negocio puras
├── Application/       # Casos de uso, DTOs, interfaces (CQRS-like)
├── Infrastructure/    # EF Core, repositorios, servicios externos, JWT, TOTP
└── API/                # Controllers, middlewares, configuración de la app
```

El frontend organiza los widgets como módulos independientes que se registran en el grid del dashboard, permitiendo agregar nuevos tipos de widget sin acoplarlos al layout principal.

## 📸 Capturas de pantalla

<div align="center">
  <img src="frontend/assets/preview1.png" alt="Preview 1 - Dashboard" width="800" />
  <br /><br />
  <img src="frontend/assets/preview2.png" alt="Preview 2" width="390" />
  <img src="frontend/assets/preview3.png" alt="Preview 3" width="390" />
</div>

> Capturas tomadas en el entorno local — la app aún no está desplegada online.

## ⚙️ Instalación y ejecución local

### Requisitos previos

- [Node.js](https://nodejs.org/) 18+
- [.NET SDK 8](https://dotnet.microsoft.com/download)
- [SQL Server](https://www.microsoft.com/sql-server) (local, Docker o Azure SQL)
- Git

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/finance-dashboard.git
cd finance-dashboard
```

### 2. Backend (.NET)

```bash
cd backend

# Restaurar dependencias
dotnet restore

# Configurar la cadena de conexión en appsettings.Development.json
# "ConnectionStrings": { "DefaultConnection": "Server=localhost;Database=FinanceDashboardDb;Trusted_Connection=True;TrustServerCertificate=True;" }

# Ejecutar migraciones para crear la base de datos
dotnet ef database update

# Levantar la API
dotnet run
```

La API quedará disponible en `https://localhost:5001` (o el puerto configurado en `launchSettings.json`).

### 3. Frontend (React)

```bash
cd frontend

# Instalar dependencias
npm install

# Levantar en modo desarrollo
npm run dev
```

La app quedará disponible en `http://localhost:5173`.

### 4. Configurar 2FA (Google Authenticator)

Al registrarte, la aplicación genera un código QR para vincular tu cuenta con **Google Authenticator** (o cualquier app compatible con TOTP). Escanéalo y usa el código de 6 dígitos para completar el login.

## 🔑 Variables de entorno

Ejemplo de configuración necesaria en el backend (`appsettings.Development.json` o variables de entorno):

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=FinanceDashboardDb;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "Jwt": {
    "Key": "tu-clave-secreta",
    "Issuer": "FinanceDashboard",
    "Audience": "FinanceDashboardClient",
    "ExpiresInMinutes": 60
  }
}
```

## 🗺️ Roadmap

- [x] Sistema de autenticación JWT + 2FA (Google Authenticator)
- [x] Arquitectura de widgets en el dashboard
- [x] Widget de seguimiento de gastos (`TrackerWidget`)
- [x] Widget de metas de ahorro (`SavingGoalWidget`)
- [x] Widget de gastos recurrentes
- [ ] Despliegue en producción (Azure / Docker)

## 👤 Autor

**Juan**
Desarrollador full-stack — React / TypeScript / .NET

- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- LinkedIn: [tu-perfil](https://linkedin.com/in/tu-perfil)

---

<div align="center">

⭐️ Si te parece interesante el proyecto, ¡una estrella en el repo ayuda mucho!

</div>
