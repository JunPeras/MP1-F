# Planificador de Actividades - PI Miniproyecto 1

Frontend del Miniproyecto 1 para el Proyecto Integrador. Esta aplicación permite gestionar actividades y sus respectivos planes de trabajo (subtareas).

**Estado del proyecto:** En desarrollo activo. Las interfaces y tipos están siendo definidos y actualmente se encuentran comentados como referencia para la implementación.

## Tecnologías
- **React 19**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **React Router Dom 7**
- **React Hook Form + Zod**
- **TanStack Query**
- **Axios**

## Instalación y Uso

1. **Clonar el repositorio:**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd MP1-F
   ```

2. **Instalar dependencias:**
   Entra en la carpeta del proyecto y ejecuta:
   ```bash
   cd planificador
   npm install
   ```

3. **Correr en modo desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible usualmente en `http://localhost:5173`.

4. **Construir para producción:**
   ```bash
   npm run build
   ```

## Estructura del Proyecto
- `src/components`: Componentes reutilizables de UI.
- `src/layouts`: Estructuras de diseño general reutilizable (ej. Layout para autenticacion/registro, dashboard principal, etc).
- `src/pages`: Componentes de página (Vistas principales).
- `src/routes`: Configuración de rutas (Públicas y Protegidas).
- `src/types`: Definición de interfaces y tipos (Actualmente en modo sugerencia con TODOs).

## Notas de Desarrollo
- El sistema de tipos está en proceso de revisión. Las interfaces se encuentran comentadas con etiquetas `TODO` para especificar su función antes de ser habilitadas completamente.
