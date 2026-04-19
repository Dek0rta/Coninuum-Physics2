export interface QuizQuestion {
  questionRu: string;
  questionEn: string;
  options: { ru: string; en: string }[];
  correctIndex: number;
  explanationRu: string;
  explanationEn: string;
}

export interface TopicContent {
  slug: string;
  theoryRu: string;
  theoryEn: string;
  simulationType: string;
  quiz: QuizQuestion[];
}

export const TOPIC_CONTENT: Record<string, TopicContent> = {
  kinematics: {
    slug: "kinematics",
    simulationType: "projectile",
    theoryRu: `
## Кинематика

Кинематика изучает движение тел без анализа причин этого движения.

### Равноускоренное движение

$$x(t) = x_0 + v_0 t + \\frac{1}{2}at^2$$

$$v(t) = v_0 + at$$

$$v^2 = v_0^2 + 2a(x - x_0)$$

### Брошенное тело

При движении тела под углом $\\theta$ к горизонту с начальной скоростью $v_0$:

**Горизонтальная составляющая:**
$$x(t) = v_0 \\cos\\theta \\cdot t$$

**Вертикальная составляющая:**
$$y(t) = v_0 \\sin\\theta \\cdot t - \\frac{g}{2}t^2$$

**Дальность полёта:**
$$R = \\frac{v_0^2 \\sin 2\\theta}{g}$$

**Максимальная высота:**
$$H = \\frac{v_0^2 \\sin^2\\theta}{2g}$$

Максимальная дальность достигается при $\\theta = 45°$.
    `,
    theoryEn: `
## Kinematics

Kinematics studies the motion of bodies without analyzing the causes of that motion.

### Uniformly Accelerated Motion

$$x(t) = x_0 + v_0 t + \\frac{1}{2}at^2$$

$$v(t) = v_0 + at$$

$$v^2 = v_0^2 + 2a(x - x_0)$$

### Projectile Motion

For a body launched at angle $\\theta$ with initial speed $v_0$:

**Horizontal component:**
$$x(t) = v_0 \\cos\\theta \\cdot t$$

**Vertical component:**
$$y(t) = v_0 \\sin\\theta \\cdot t - \\frac{g}{2}t^2$$

**Range:**
$$R = \\frac{v_0^2 \\sin 2\\theta}{g}$$

**Maximum height:**
$$H = \\frac{v_0^2 \\sin^2\\theta}{2g}$$

Maximum range is achieved at $\\theta = 45°$.
    `,
    quiz: [
      {
        questionRu: "При каком угле броска тело летит наибольшее расстояние (при одинаковой начальной скорости)?",
        questionEn: "At what launch angle does a projectile travel the greatest distance (with the same initial speed)?",
        options: [
          { ru: "30°", en: "30°" },
          { ru: "45°", en: "45°" },
          { ru: "60°", en: "60°" },
          { ru: "90°", en: "90°" },
        ],
        correctIndex: 1,
        explanationRu: "Максимальная дальность R = v₀² sin(2θ)/g максимальна при 2θ = 90°, т.е. θ = 45°.",
        explanationEn: "Maximum range R = v₀² sin(2θ)/g is maximum when 2θ = 90°, i.e. θ = 45°.",
      },
      {
        questionRu: "Как изменится максимальная высота полёта, если начальная скорость увеличится в 2 раза?",
        questionEn: "How does the maximum height change if the initial speed doubles?",
        options: [
          { ru: "Увеличится в 2 раза", en: "Doubles" },
          { ru: "Увеличится в 4 раза", en: "Quadruples" },
          { ru: "Увеличится в 3 раза", en: "Triples" },
          { ru: "Не изменится", en: "Stays the same" },
        ],
        correctIndex: 1,
        explanationRu: "H = v₀² sin²θ / (2g). При v₀ → 2v₀: H → 4v₀² sin²θ / (2g) = 4H.",
        explanationEn: "H = v₀² sin²θ / (2g). When v₀ → 2v₀: H → 4v₀² sin²θ / (2g) = 4H.",
      },
      {
        questionRu: "Какова горизонтальная составляющая скорости брошенного тела в любой момент времени (без учёта сопротивления воздуха)?",
        questionEn: "What is the horizontal velocity component of a projectile at any moment (ignoring air resistance)?",
        options: [
          { ru: "Уменьшается", en: "Decreases" },
          { ru: "Увеличивается", en: "Increases" },
          { ru: "Остаётся постоянной", en: "Remains constant" },
          { ru: "Сначала растёт, потом убывает", en: "First increases, then decreases" },
        ],
        correctIndex: 2,
        explanationRu: "Горизонтальная составляющая vₓ = v₀ cos θ постоянна, так как горизонтального ускорения нет.",
        explanationEn: "Horizontal component vₓ = v₀ cos θ is constant because there is no horizontal acceleration.",
      },
    ],
  },
  electrostatics: {
    slug: "electrostatics",
    simulationType: "electric-field",
    theoryRu: `
## Электростатика

### Закон Кулона

Сила взаимодействия двух точечных зарядов:

$$F = k \\frac{|q_1 q_2|}{r^2}$$

где $k = 9 \\times 10^9$ Н·м²/Кл² — константа Кулона.

### Напряжённость электрического поля

$$\\vec{E} = \\frac{\\vec{F}}{q} = k \\frac{Q}{r^2} \\hat{r}$$

### Принцип суперпозиции

Напряжённость от нескольких зарядов — векторная сумма:

$$\\vec{E} = \\sum_i \\vec{E}_i$$

### Потенциал

$$\\varphi = k \\frac{Q}{r}$$

$$E = -\\frac{d\\varphi}{dx}$$

### Линии поля

Линии поля направлены от положительных зарядов к отрицательным. Густота линий пропорциональна напряжённости.
    `,
    theoryEn: `
## Electrostatics

### Coulomb's Law

The force between two point charges:

$$F = k \\frac{|q_1 q_2|}{r^2}$$

where $k = 9 \\times 10^9$ N·m²/C² is Coulomb's constant.

### Electric Field Strength

$$\\vec{E} = \\frac{\\vec{F}}{q} = k \\frac{Q}{r^2} \\hat{r}$$

### Superposition Principle

Field from multiple charges — vector sum:

$$\\vec{E} = \\sum_i \\vec{E}_i$$

### Electric Potential

$$\\varphi = k \\frac{Q}{r}$$

$$E = -\\frac{d\\varphi}{dx}$$

### Field Lines

Field lines point from positive to negative charges. Line density is proportional to field strength.
    `,
    quiz: [
      {
        questionRu: "Как изменится сила Кулона между зарядами, если расстояние между ними увеличить в 3 раза?",
        questionEn: "How does the Coulomb force change if the distance between charges triples?",
        options: [
          { ru: "Уменьшится в 3 раза", en: "Decreases 3 times" },
          { ru: "Уменьшится в 9 раз", en: "Decreases 9 times" },
          { ru: "Увеличится в 9 раз", en: "Increases 9 times" },
          { ru: "Увеличится в 3 раза", en: "Increases 3 times" },
        ],
        correctIndex: 1,
        explanationRu: "F ∝ 1/r². При r → 3r: F → F/9.",
        explanationEn: "F ∝ 1/r². When r → 3r: F → F/9.",
      },
      {
        questionRu: "Куда направлены силовые линии электрического поля?",
        questionEn: "In which direction do electric field lines point?",
        options: [
          { ru: "От отрицательных к положительным зарядам", en: "From negative to positive charges" },
          { ru: "От положительных к отрицательным зарядам", en: "From positive to negative charges" },
          { ru: "Перпендикулярно зарядам", en: "Perpendicular to charges" },
          { ru: "Зависит от знака заряда", en: "Depends on charge sign" },
        ],
        correctIndex: 1,
        explanationRu: "Силовые линии направлены от положительных зарядов к отрицательным.",
        explanationEn: "Field lines point from positive charges toward negative charges.",
      },
      {
        questionRu: "Что такое принцип суперпозиции?",
        questionEn: "What is the superposition principle?",
        options: [
          { ru: "Заряды складываются скалярно", en: "Charges add as scalars" },
          { ru: "Поля от разных зарядов складываются векторно", en: "Fields from different charges add as vectors" },
          { ru: "Сила пропорциональна квадрату расстояния", en: "Force is proportional to distance squared" },
          { ru: "Заряд сохраняется", en: "Charge is conserved" },
        ],
        correctIndex: 1,
        explanationRu: "Суперпозиция: суммарное поле = векторная сумма полей от каждого заряда.",
        explanationEn: "Superposition: total field = vector sum of fields from each charge.",
      },
    ],
  },
  "gas-laws": {
    slug: "gas-laws",
    simulationType: "gas-laws",
    theoryRu: `
## Газовые законы

### Идеальный газ

Уравнение состояния идеального газа:

$$PV = nRT$$

где:
- $P$ — давление (Па)
- $V$ — объём (м³)
- $n$ — количество молей
- $R = 8.314$ Дж/(моль·К) — универсальная газовая постоянная
- $T$ — температура (К)

### Закон Бойля-Мариотта (изотермный процесс)

При $T = const$:

$$P_1 V_1 = P_2 V_2$$

### Закон Гей-Люссака (изобарный процесс)

При $P = const$:

$$\\frac{V_1}{T_1} = \\frac{V_2}{T_2}$$

### Закон Шарля (изохорный процесс)

При $V = const$:

$$\\frac{P_1}{T_1} = \\frac{P_2}{T_2}$$

### PV-диаграмма

На PV-диаграмме работа равна площади под кривой:

$$W = \\int_{V_1}^{V_2} P \\, dV$$
    `,
    theoryEn: `
## Gas Laws

### Ideal Gas

Equation of state for an ideal gas:

$$PV = nRT$$

where:
- $P$ — pressure (Pa)
- $V$ — volume (m³)
- $n$ — number of moles
- $R = 8.314$ J/(mol·K) — universal gas constant
- $T$ — temperature (K)

### Boyle's Law (Isothermal process)

When $T = const$:

$$P_1 V_1 = P_2 V_2$$

### Gay-Lussac's Law (Isobaric process)

When $P = const$:

$$\\frac{V_1}{T_1} = \\frac{V_2}{T_2}$$

### Charles's Law (Isochoric process)

When $V = const$:

$$\\frac{P_1}{T_1} = \\frac{P_2}{T_2}$$

### PV Diagram

Work equals the area under the curve:

$$W = \\int_{V_1}^{V_2} P \\, dV$$
    `,
    quiz: [
      {
        questionRu: "Если объём газа уменьшить в 2 раза при постоянной температуре, как изменится давление?",
        questionEn: "If gas volume is halved at constant temperature, how does pressure change?",
        options: [
          { ru: "Уменьшится в 2 раза", en: "Halves" },
          { ru: "Не изменится", en: "Stays the same" },
          { ru: "Увеличится в 2 раза", en: "Doubles" },
          { ru: "Увеличится в 4 раза", en: "Quadruples" },
        ],
        correctIndex: 2,
        explanationRu: "По закону Бойля-Мариотта: PV = const. При V → V/2: P → 2P.",
        explanationEn: "By Boyle's Law: PV = const. When V → V/2: P → 2P.",
      },
      {
        questionRu: "Что такое изохорный процесс?",
        questionEn: "What is an isochoric process?",
        options: [
          { ru: "Процесс при постоянном давлении", en: "Process at constant pressure" },
          { ru: "Процесс при постоянной температуре", en: "Process at constant temperature" },
          { ru: "Процесс при постоянном объёме", en: "Process at constant volume" },
          { ru: "Процесс без теплообмена", en: "Process without heat exchange" },
        ],
        correctIndex: 2,
        explanationRu: "Изохорный — от греч. «одинаковый объём». V = const.",
        explanationEn: "Isochoric — from Greek 'same volume'. V = const.",
      },
      {
        questionRu: "Единица давления в системе СИ?",
        questionEn: "Unit of pressure in the SI system?",
        options: [
          { ru: "Джоуль", en: "Joule" },
          { ru: "Паскаль", en: "Pascal" },
          { ru: "Ньютон", en: "Newton" },
          { ru: "Ватт", en: "Watt" },
        ],
        correctIndex: 1,
        explanationRu: "Давление измеряется в Паскалях: 1 Па = 1 Н/м².",
        explanationEn: "Pressure is measured in Pascals: 1 Pa = 1 N/m².",
      },
    ],
  },
  "double-slit": {
    slug: "double-slit",
    simulationType: "double-slit",
    theoryRu: `
## Опыт с двойной щелью

### Принцип Гюйгенса-Френеля

Каждая точка волнового фронта является источником вторичных сферических волн.

### Условие максимума (конструктивная интерференция)

$$\\Delta = d \\sin\\theta = m\\lambda, \\quad m = 0, \\pm 1, \\pm 2, ...$$

### Условие минимума (деструктивная интерференция)

$$\\Delta = d \\sin\\theta = \\left(m + \\frac{1}{2}\\right)\\lambda$$

### Расстояние между максимумами на экране

$$\\Delta y = \\frac{\\lambda L}{d}$$

где:
- $d$ — расстояние между щелями
- $L$ — расстояние до экрана
- $\\lambda$ — длина волны

### Двойственность волна-частица

Даже одиночные фотоны или электроны создают интерференционную картину — это проявление квантовой природы материи.
    `,
    theoryEn: `
## Double-Slit Experiment

### Huygens-Fresnel Principle

Each point of a wave front is a source of secondary spherical waves.

### Constructive Interference Condition

$$\\Delta = d \\sin\\theta = m\\lambda, \\quad m = 0, \\pm 1, \\pm 2, ...$$

### Destructive Interference Condition

$$\\Delta = d \\sin\\theta = \\left(m + \\frac{1}{2}\\right)\\lambda$$

### Fringe Spacing on Screen

$$\\Delta y = \\frac{\\lambda L}{d}$$

where:
- $d$ — slit separation
- $L$ — distance to screen
- $\\lambda$ — wavelength

### Wave-Particle Duality

Even individual photons or electrons create an interference pattern — a manifestation of the quantum nature of matter.
    `,
    quiz: [
      {
        questionRu: "Что наблюдается на экране в опыте с двойной щелью?",
        questionEn: "What is observed on the screen in the double-slit experiment?",
        options: [
          { ru: "Два светлых пятна", en: "Two bright spots" },
          { ru: "Одно широкое пятно", en: "One wide spot" },
          { ru: "Чередующиеся светлые и тёмные полосы", en: "Alternating bright and dark fringes" },
          { ru: "Ничего", en: "Nothing" },
        ],
        correctIndex: 2,
        explanationRu: "Интерференция волн от двух щелей создаёт чередующиеся максимумы и минимумы.",
        explanationEn: "Interference of waves from two slits creates alternating maxima and minima.",
      },
      {
        questionRu: "Как изменится расстояние между полосами, если увеличить длину волны?",
        questionEn: "How does fringe spacing change if wavelength increases?",
        options: [
          { ru: "Уменьшится", en: "Decreases" },
          { ru: "Не изменится", en: "Stays the same" },
          { ru: "Увеличится", en: "Increases" },
          { ru: "Полосы исчезнут", en: "Fringes disappear" },
        ],
        correctIndex: 2,
        explanationRu: "Δy = λL/d. При увеличении λ расстояние Δy увеличивается.",
        explanationEn: "Δy = λL/d. As λ increases, spacing Δy increases.",
      },
      {
        questionRu: "Что демонстрирует опыт Юнга с двойной щелью?",
        questionEn: "What does Young's double-slit experiment demonstrate?",
        options: [
          { ru: "Только волновые свойства света", en: "Only wave properties of light" },
          { ru: "Только корпускулярные свойства", en: "Only particle properties" },
          { ru: "Волновую природу материи", en: "Wave nature of matter" },
          { ru: "Скорость света", en: "Speed of light" },
        ],
        correctIndex: 2,
        explanationRu: "Опыт демонстрирует волновую природу (интерференцию) как света, так и частиц.",
        explanationEn: "The experiment demonstrates the wave nature (interference) of both light and particles.",
      },
    ],
  },
};

// Default content for topics not yet written
export function getTopicContent(slug: string): TopicContent {
  return (
    TOPIC_CONTENT[slug] ?? {
      slug,
      simulationType: "none",
      theoryRu: "## Раздел в разработке\n\nКонтент скоро будет добавлен.",
      theoryEn: "## Section under development\n\nContent coming soon.",
      quiz: [],
    }
  );
}
