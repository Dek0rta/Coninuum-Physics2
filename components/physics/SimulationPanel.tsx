"use client";

import { ProjectileSimulation } from "./ProjectileSimulation";
import { ElectricFieldSimulation } from "./ElectricFieldSimulation";
import { GasLawsSimulation } from "./GasLawsSimulation";
import { DoubleSlitSimulation } from "./DoubleSlitSimulation";

interface SimulationPanelProps {
  type: string;
  locale: string;
}

export function SimulationPanel({ type, locale }: SimulationPanelProps) {
  const components: Record<string, React.ComponentType<{ locale: string }>> = {
    projectile: ProjectileSimulation,
    "electric-field": ElectricFieldSimulation,
    "gas-laws": GasLawsSimulation,
    "double-slit": DoubleSlitSimulation,
  };

  const Component = components[type];

  if (!Component) {
    return (
      <div className="flex items-center justify-center h-64 rounded-2xl border border-dashed text-muted-foreground">
        {locale === "ru" ? "Симуляция в разработке" : "Simulation coming soon"}
      </div>
    );
  }

  return <Component locale={locale} />;
}
