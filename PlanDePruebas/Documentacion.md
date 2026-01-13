# Plan de Pruebas - VideoConf-Manager

## 2. OBJETIVOS DE LAS PRUEBAS
El objetivo principal de este plan es definir el alcance, enfoque, recursos y cronograma de las actividades de prueba para el sistema **VideoConf-Manager**. Buscamos asegurar que el sistema cumpla con los requerimientos funcionales y no funcionales, garantizando una gestión eficiente de videoconferencias, técnicos y ubicaciones.

**Objetivos Específicos:**
- Validar la **integridad de datos** en la gestión de Técnicos, Ubicaciones y Videoconferencias.
- Verificar el correcto funcionamiento de las relaciones entre entidades (e.g., asignación de técnicos a conferencias, conferencias en ubicaciones).
- Asegurar que las reglas de negocio (capacidad de ubicaciones, disponibilidad de técnicos) se cumplan.
- Garantizar que la API responde correctamente a las peticiones del Frontend.
- Validar la experiencia de usuario en la interfaz desarrollada con React/Vite.

## 3. ALCANCE DE LAS CARACTERÍSTICAS
Las siguientes funcionalidades serán objeto de prueba, basadas en la arquitectura actual del sistema (Node.js/Prisma Backend + React Frontend):

### 3.1 Módulos Funcionales
*   **Gestión de Usuarios (Auth):**
    *   Registro e inicio de sesión.
    *   Manejo de tokens y seguridad básica.
*   **Gestión de Técnicos:**
    *   Creación, lectura, actualización y eliminación (CRUD) de perfiles de técnicos.
    *   Validación de datos (email único, teléfono).
*   **Gestión de Ubicaciones (Sedes/Salas):**
    *   CRUD de ubicaciones.
    *   Verificación de capacidad y equipamiento (flag `hasVideoEquipment`).
*   **Gestión de Videoconferencias:**
    *   Programación de conferencias (Fecha, Hora inicio/fin).
    *   Asignación de ubicación (validando capacidad vs `participantCount`).
    *   Gestión de estados (`scheduled`, `completed`, etc.).
*   **Asignación de Recursos:**
    *   Asignación de múltiples técnicos a una conferencia.
    *   Prevención de conflictos (opcional, si implementado).

### 3.2 Interfaces
*   **API REST (Backend):** Endpoints para todas las entidades definidos en `src/routes`.
*   **Interfaz de Usuario (Frontend):** Formularios, tablas y vistas en React.

## 4. ESTRATEGIA DE PRUEBAS

### 4.1 Niveles de Prueba
*   **Pruebas Unitarias (Backend):**
    *   Verificar lógica de servicios (e.g., cálculos, transformaciones de datos) en aislamiento.
    *   Herramienta sugerida: Jest / Vitest.
*   **Pruebas de Integración (API):**
    *   Verificar la comunicación entre controladores, servicios y la base de datos (Prisma).
    *   Validar flujos de éxito y error en los endpoints.
*   **Pruebas de Sistema / End-to-End (Frontend + Backend):**
    *   Validar flujos completos desde la UI (e.g., "Crear una conferencia y asignar un técnico").
    *   Herramienta sugerida: Cypress o Playwright.

### 4.2 Tipos de Prueba
*   **Funcionales:** Validación estricta de requisitos.
*   **No Funcionales:**
    *   **Usabilidad:** Facilidad de uso de los formularios.
    *   **Rendimiento:** Tiempos de respuesta de la API.

## 5. ALCANCE Y EXCLUSIONES

### 5.1 En Alcance
*   Todas las funcionalidades CRUD descritas en la sección 3.
*   Interacción entre Frontend y Backend en entorno local.
*   Base de datos PostgreSQL mediante Prisma.

### 5.2 Fuera de Alcance
*   Pruebas de carga masiva (Stress Testing) para esta iteración.
*   Integraciones con sistemas de calendario de terceros (Google Calendar, Outlook) si no están implementados.
*   Aplicaciones móviles nativas.

## 6. CRITERIOS DE PRUEBA

### 6.1 Criterios de Inicio
*   Entorno de desarrollo configurado (`npm install` ejecutado en ambas carpetas).
*   Base de datos migrada y con datos semilla (`prisma db seed` funcionando).
*   Servidor Backend y Cliente Frontend ejecutándose sin errores.

### 6.2 Criterios de Suspensión
*   Fallo crítico en la base de datos que impida guardar registros.
*   API respondiendo con errores 500 generalizados.
*   Bloqueo en el inicio de sesión que impida acceder al sistema.

### 6.3 Criterios de Finalización
*   100% de los casos de prueba críticos ("Happy Path") ejecutados y aprobados.
*   Cero defectos de severidad Crítica o Alta abiertos.

## 9. CALENDARIO Y CRONOGRAMA

| Fase | Actividad | Duración Estimada |
| :--- | :--- | :--- |
| **Planificación** | Definición de casos de prueba y preparación de datos. | Semana 1 (Días 1-2) |
| **Diseño** | Escritura de scripts de prueba (Unitarios/Integración). | Semana 1 (Días 3-5) |
| **Ejecución** | Ejecución de pruebas manuales y automatizadas. Reporte de bugs. | Semana 2 (Días 1-3) |
| **Cierre** | Retest de correcciones y generación del informe final. | Semana 2 (Días 4-5) |

## 10. DELIVERABLES (ENTREGABLES)

### 10.1 Pre-Pruebas
*   **Documento de Plan de Pruebas:** (Este documento).
*   **Set de Datos de Prueba:** Scripts de `seed` actualizados.

### 10.2 Durante Pruebas
*   **Reporte de Defectos:** Log de issues encontrados (recomendado usar GitHub Issues).
*   **Resultados de Automatización:** Logs de ejecución de tests (Jest/Cypress).

### 10.3 Post-Pruebas
*   **Informe Final de Pruebas:** Resumen ejecutivo de la calidad del release.
