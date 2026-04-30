/**
 * @fileoverview Configuración centralizada de herramientas
 * Sistema de datos para facilitar la gestión y escalabilidad del Hub
 */

export const toolsConfig = [
  {
    id: 'tempogym',
    name: 'TempoGym',
    description: 'Gestiona el tempo de cada uno de tus ejercicios',
    icon: '🏋️',
    url: 'https://tempogym.paulbase.cloud',
    category: 'fitness',
    featured: true
  },
  {
    id: 'it',
    name: 'Basic Tools',
    description: 'Herramientas útiles para desarrolladores',
    icon: '⏱️',
    url: 'https://tools.paulbase.cloud',
    category: 'it',
    featured: false
  },
  // Ejemplos de herramientas adicionales para demostrar escalabilidad
  /* {
    id: 'calculator',
    name: 'Calculator Pro',
    description: 'Calculadora avanzada con historial',
    icon: '🧮',
    url: '#',
    category: 'productivity',
    featured: false
  },
  {
    id: 'notes',
    name: 'Quick Notes',
    description: 'Toma notas rápidas y sincronízalas',
    icon: '📝',
    url: '#',
    category: 'productivity',
    featured: false
  },
  {
    id: 'timer',
    name: 'Focus Timer',
    description: 'Temporizador Pomodoro para productividad',
    icon: '⏰',
    url: '#',
    category: 'productivity',
    featured: true
  },
  {
    id: 'converter',
    name: 'Unit Converter',
    description: 'Convierte unidades de medida instantáneamente',
    icon: '🔄',
    url: '#',
    category: 'development',
    featured: false
  } */
];

export const categories = [
  { id: 'all', name: 'Todas', icon: '🌐' },
  { id: 'fitness', name: 'Fitness', icon: '💪' },
  { id: 'it', name: 'IT', icon: '💻' }
];