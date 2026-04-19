export interface TopicData {
  slug: string;
  category: "mechanics" | "em" | "thermo" | "quantum";
  order: number;
  titleRu: string;
  titleEn: string;
  descRu: string;
  descEn: string;
  icon: string;
}

export const TOPICS: TopicData[] = [
  // Механика
  {
    slug: "kinematics",
    category: "mechanics",
    order: 1,
    titleRu: "Кинематика",
    titleEn: "Kinematics",
    descRu: "Брошенное тело, симуляция траектории с регулируемыми параметрами",
    descEn: "Projectile motion simulation with adjustable parameters",
    icon: "🎯",
  },
  {
    slug: "dynamics",
    category: "mechanics",
    order: 2,
    titleRu: "Динамика",
    titleEn: "Dynamics",
    descRu: "Второй закон Ньютона, 2D симуляция сил и ускорений",
    descEn: "Newton's second law, 2D force and acceleration simulation",
    icon: "⚡",
  },
  {
    slug: "harmonic-motion",
    category: "mechanics",
    order: 3,
    titleRu: "Гармоническое движение",
    titleEn: "Harmonic Motion",
    descRu: "Маятник и пружина — визуализация колебаний",
    descEn: "Pendulum and spring oscillation visualizations",
    icon: "🌊",
  },
  // Электромагнетизм
  {
    slug: "electrostatics",
    category: "em",
    order: 4,
    titleRu: "Электростатика",
    titleEn: "Electrostatics",
    descRu: "Визуализация электрического поля точечных зарядов",
    descEn: "Electric field visualization of point charges",
    icon: "⚡",
  },
  {
    slug: "circuits",
    category: "em",
    order: 5,
    titleRu: "Электрические цепи",
    titleEn: "Electric Circuits",
    descRu: "Интерактивные схемы с резисторами и конденсаторами",
    descEn: "Interactive circuits with resistors and capacitors",
    icon: "🔌",
  },
  {
    slug: "magnetic-field",
    category: "em",
    order: 6,
    titleRu: "Магнитное поле",
    titleEn: "Magnetic Field",
    descRu: "Визуализация вектора B, сила Лоренца",
    descEn: "Vector B visualization, Lorentz force",
    icon: "🧲",
  },
  // Термодинамика
  {
    slug: "gas-laws",
    category: "thermo",
    order: 7,
    titleRu: "Газовые законы",
    titleEn: "Gas Laws",
    descRu: "PV-диаграмма в реальном времени, идеальный газ",
    descEn: "Real-time PV diagram, ideal gas",
    icon: "🌡️",
  },
  {
    slug: "molecular-model",
    category: "thermo",
    order: 8,
    titleRu: "Молекулярная модель",
    titleEn: "Molecular Model",
    descRu: "Симуляция молекул идеального газа",
    descEn: "Ideal gas molecular simulation",
    icon: "⚗️",
  },
  // Квантовая физика
  {
    slug: "photoelectric",
    category: "quantum",
    order: 9,
    titleRu: "Фотоэффект",
    titleEn: "Photoelectric Effect",
    descRu: "Интерактивная демонстрация фотоэффекта",
    descEn: "Interactive photoelectric effect demonstration",
    icon: "💡",
  },
  {
    slug: "double-slit",
    category: "quantum",
    order: 10,
    titleRu: "Двойная щель",
    titleEn: "Double Slit",
    descRu: "Анимация интерференции и дифракции",
    descEn: "Interference and diffraction animation",
    icon: "〰️",
  },
  {
    slug: "wave-function",
    category: "quantum",
    order: 11,
    titleRu: "Волновая функция",
    titleEn: "Wave Function",
    descRu: "Визуализация ψ² — плотность вероятности",
    descEn: "ψ² visualization — probability density",
    icon: "〜",
  },
];

export const CATEGORIES = [
  {
    id: "mechanics",
    labelRu: "Механика",
    labelEn: "Mechanics",
    icon: "⚙️",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    topics: TOPICS.filter((t) => t.category === "mechanics"),
  },
  {
    id: "em",
    labelRu: "Электромагнетизм",
    labelEn: "Electromagnetism",
    icon: "⚡",
    color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    topics: TOPICS.filter((t) => t.category === "em"),
  },
  {
    id: "thermo",
    labelRu: "Термодинамика",
    labelEn: "Thermodynamics",
    icon: "🌡️",
    color: "bg-red-500/10 text-red-600 dark:text-red-400",
    topics: TOPICS.filter((t) => t.category === "thermo"),
  },
  {
    id: "quantum",
    labelRu: "Квантовая физика",
    labelEn: "Quantum Physics",
    icon: "⚛️",
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    topics: TOPICS.filter((t) => t.category === "quantum"),
  },
];
