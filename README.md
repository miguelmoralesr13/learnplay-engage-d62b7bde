
# English Learning App

## Descripción general

Esta aplicación está diseñada para ayudar a los usuarios a aprender inglés a través de juegos interactivos. La plataforma ofrece una experiencia de aprendizaje gamificada que hace que el proceso sea entretenido y efectivo.

## Características principales

### Juegos de aprendizaje
- **Categorías diversas**: Vocabulario, gramática, escucha, lectura y habla
- **Múltiples niveles de dificultad**: Principiante, intermedio y avanzado
- **Configuración personalizable**: Opciones de temporizador y sonido
- **Retroalimentación detallada**: Resultados y estadísticas al finalizar cada juego

### Sistema de progreso
- **Seguimiento de experiencia**: Gana XP al completar juegos
- **Sistema de niveles**: Avanza de nivel al acumular suficiente experiencia
- **Estadísticas personales**: Visualiza tu rendimiento y mejora con el tiempo
- **Historial de actividad**: Registro de todos los juegos completados

### Interfaz de usuario
- **Diseño moderno**: Interfaz limpia y atractiva con elementos de vidrio (glass design)
- **Experiencia responsiva**: Funciona en dispositivos móviles y de escritorio
- **Navegación intuitiva**: Fácil acceso a todas las secciones de la aplicación
- **Filtros y búsqueda**: Encuentra rápidamente los juegos que te interesan

## Tecnologías utilizadas

- **React**: Biblioteca para construir interfaces de usuario
- **Vite**: Herramienta de compilación rápida para desarrollo
- **TypeScript**: Superset de JavaScript con tipado estático
- **Tailwind CSS**: Framework de CSS para diseño rápido y consistente
- **React Router**: Navegación entre páginas
- **Zustand**: Gestión de estado global
- **Framer Motion**: Animaciones fluidas
- **Lucide Icons**: Iconos modernos y limpios
- **Tanstack Query**: Gestión de datos y estado del servidor
- **Shadcn/UI**: Componentes de UI reutilizables

## Estructura de la aplicación

### Páginas principales
- **Inicio**: Introducción a la aplicación
- **Juegos**: Catálogo de juegos disponibles con filtros
- **Progreso**: Visualización del avance del usuario

### Componentes reutilizables
- **GameConfig**: Configuración previa al inicio de un juego
- **GameFeedback**: Resultados y estadísticas posteriores al juego
- **GameCard**: Tarjetas para mostrar los juegos disponibles

### Gestión de estado
- **gameStore**: Almacena información sobre juegos, progreso del usuario y configuraciones

## Flujo de usuario

1. El usuario navega al catálogo de juegos
2. Selecciona un juego según su interés
3. Configura los parámetros del juego (dificultad, temporizador, etc.)
4. Juega la partida
5. Recibe retroalimentación sobre su desempeño
6. Gana experiencia y sube de nivel
7. Visualiza su progreso en la sección correspondiente

## Cómo añadir nuevos juegos

Para añadir un nuevo juego a la aplicación:

1. Crear una nueva página para el juego en `src/pages/games/`
2. Utilizar los componentes reutilizables `GameConfig` y `GameFeedback`
3. Añadir la información del juego al arreglo `games` en `src/store/gameStore.ts`
4. Agregar la ruta del juego en `src/App.tsx`

## Próximas mejoras

- Implementación de más juegos educativos
- Sistema de logros y recompensas
- Modo multijugador para competir con amigos
- Integración con APIs para contenido dinámico
- Personalización del perfil de usuario
