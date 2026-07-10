import { FocoLayout } from "@/components/layout/foco-nav";
import { TimerApp } from "@/components/foco/timer-app";

export default function TimerPage() {
  return (
    <FocoLayout activeTab="foco">
      <TimerApp />
    </FocoLayout>
  );
}
