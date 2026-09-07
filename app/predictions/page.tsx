import { PredictionsBoard } from "@/components/predictions/board";
import { PageHeader } from "@/components/page-header";
import { loadPredictions } from "@/lib/load";

export const metadata = {
  title: "Predictions",
};

export default function PredictionsPage() {
  const file = loadPredictions();

  return (
    <div>
      <PageHeader
        kicker="Calls scorecard"
        title="Predictions"
        description="Technical-analysis forecasts with invalidation. Graded right or wrong over time — never a guaranteed outcome."
      />
      <PredictionsBoard file={file} />
    </div>
  );
}
