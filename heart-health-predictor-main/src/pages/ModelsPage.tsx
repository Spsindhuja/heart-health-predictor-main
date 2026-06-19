import { motion } from "framer-motion";
import { MODEL_METRICS } from "@/lib/ml-service";
import { Trophy } from "lucide-react";

export default function ModelsPage() {
  const best = MODEL_METRICS.reduce((a, b) => (a.f1_score > b.f1_score ? a : b));

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <section className="gradient-primary py-10">
        <div className="container text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary-foreground">Model Comparison</h1>
          <p className="mt-2 text-primary-foreground/80">Performance of 5 ML models on the Cleveland dataset</p>
        </div>
      </section>

      <div className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-x-auto rounded-xl border border-border bg-card card-elevated"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-semibold text-foreground">Model</th>
                <th className="px-4 py-3 text-center font-semibold text-foreground">Accuracy</th>
                <th className="px-4 py-3 text-center font-semibold text-foreground">Precision</th>
                <th className="px-4 py-3 text-center font-semibold text-foreground">Recall</th>
                <th className="px-4 py-3 text-center font-semibold text-foreground">F1-Score</th>
                <th className="px-4 py-3 text-center font-semibold text-foreground">ROC-AUC</th>
              </tr>
            </thead>
            <tbody>
              {MODEL_METRICS.map((m, i) => {
                const isBest = m.model === best.model;
                return (
                  <motion.tr
                    key={m.model}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`border-b border-border last:border-0 ${
                      isBest ? "bg-primary/5" : "hover:bg-muted/30"
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-foreground flex items-center gap-2">
                      {isBest && <Trophy className="h-4 w-4 text-warning" />}
                      {m.model}
                      {isBest && (
                        <span className="text-[10px] font-semibold bg-warning/15 text-warning px-1.5 py-0.5 rounded">
                          BEST
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-muted-foreground">{(m.accuracy * 100).toFixed(1)}%</td>
                    <td className="px-4 py-3 text-center font-mono text-muted-foreground">{(m.precision * 100).toFixed(1)}%</td>
                    <td className="px-4 py-3 text-center font-mono text-muted-foreground">{(m.recall * 100).toFixed(1)}%</td>
                    <td className="px-4 py-3 text-center font-mono font-semibold text-foreground">{(m.f1_score * 100).toFixed(1)}%</td>
                    <td className="px-4 py-3 text-center font-mono text-muted-foreground">{(m.roc_auc * 100).toFixed(1)}%</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>

        <p className="text-xs text-muted-foreground mt-4 text-center">
          Models trained with SMOTE oversampling, StandardScaler preprocessing, and 5-fold stratified cross-validation.
        </p>
      </div>
    </div>
  );
}
