import { PredictionsBoard } from "@/components/predictions/board";
import { PageHeader } from "@/components/page-header";
import { Term } from "@/components/term";
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
        description={
          <>
            Technical-analysis forecasts with <Term id="invalidation">invalidation</Term>.
            Graded right or wrong over time — never a guaranteed outcome.
          </>
        }
      />
      <PredictionsBoard file={file} />
    </div>
  );
}
