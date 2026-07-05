import { FocoLayout } from "@/components/layout/foco-nav";
import { FocoPagesProvider } from "@/components/foco/foco-pages-provider";
import { TimerApp } from "@/components/foco/timer-app";

export default function TimerPage() {
  return (
    <FocoPagesProvider>
      <FocoLayout activeTab="foco">
        <TimerApp />
      </FocoLayout>
    </FocoPagesProvider>
  );
}
