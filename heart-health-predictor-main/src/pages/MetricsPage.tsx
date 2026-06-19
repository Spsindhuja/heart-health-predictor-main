import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { MODEL_METRICS, ROC_CURVES } from "@/lib/ml-service";

const COLORS = [
  "hsl(205, 85%, 42%)",
  "hsl(170, 55%, 45%)",
  "hsl(38, 92%, 50%)",
  "hsl(0, 72%, 55%)",
  "hsl(260, 55%, 55%)",
];

export default function MetricsPage() {
  // Prepare ROC data — merge all models into unified FPR points
  const fprSet = new Set<number>();
  ROC_CURVES.forEach((c) => c.points.forEach((p) => fprSet.add(parseFloat(p.fpr.toFixed(3)))));
  const fprArr = Array.from(fprSet).sort((a, b) => a - b);

  const rocChartData = fprArr.map((fpr) => {
    const row: any = { fpr };
    ROC_CURVES.forEach((c) => {
      const closest = c.points.reduce((prev, curr) =>
        Math.abs(curr.fpr - fpr) < Math.abs(prev.fpr - fpr) ? curr : prev
      );
      row[c.model] = parseFloat(closest.tpr.toFixed(3));
    });
    return row;
  });

  // Bar chart data for F1 scores
  const f1Data = MODEL_METRICS.map((m, i) => ({
    model: m.model.replace(" (RBF)", "").replace(" (k=7)", ""),
    f1: parseFloat((m.f1_score * 100).toFixed(1)),
    color: COLORS[i],
  }));

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <section className="gradient-primary py-10">
        <div className="container text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary-foreground">Evaluation Metrics</h1>
          <p className="mt-2 text-primary-foreground/80">ROC curves, F1-scores, and detailed performance analysis</p>
        </div>
      </section>

      <div className="container py-8 space-y-8">
        {/* ROC Curve */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border bg-card p-6 card-elevated"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">ROC Curves</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={rocChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 25%, 90%)" />
              <XAxis
                dataKey="fpr"
                label={{ value: "False Positive Rate", position: "bottom", offset: -5, fontSize: 12 }}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                label={{ value: "True Positive Rate", angle: -90, position: "insideLeft", fontSize: 12 }}
                tick={{ fontSize: 11 }}
              />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: "1px solid hsl(214,25%,90%)" }} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 16 }} />
              {/* Diagonal reference line */}
              <Line
                dataKey="fpr"
                name="Random"
                stroke="hsl(215, 15%, 80%)"
                strokeDasharray="5 5"
                dot={false}
                strokeWidth={1}
              />
              {ROC_CURVES.map((curve, i) => (
                <Line
                  key={curve.model}
                  dataKey={curve.model}
                  name={`${curve.model} (AUC=${MODEL_METRICS[i].roc_auc.toFixed(3)})`}
                  stroke={COLORS[i]}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* F1 Score Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl border border-border bg-card p-6 card-elevated"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">F1-Score Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={f1Data} margin={{ bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 25%, 90%)" />
              <XAxis dataKey="model" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" />
              <YAxis domain={[75, 95]} tick={{ fontSize: 11 }} label={{ value: "F1 (%)", angle: -90, position: "insideLeft", fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="f1" radius={[6, 6, 0, 0]}>
                {f1Data.map((entry, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
