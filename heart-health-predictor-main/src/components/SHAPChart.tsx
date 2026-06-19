import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";

interface Props {
  shapValues: { feature: string; value: number; contribution: number }[];
  topFeatures: { feature: string; importance: number }[];
}

export default function SHAPChart({ shapValues, topFeatures }: Props) {
  const chartData = shapValues.slice(0, 10).map((s) => ({
    feature: s.feature,
    contribution: parseFloat(s.contribution.toFixed(3)),
  }));

  const pieData = topFeatures.map((f) => ({
    name: f.feature,
    value: parseFloat(f.importance.toFixed(3)),
  }));

  const PIE_COLORS = [
    "hsl(205, 85%, 42%)",
    "hsl(170, 55%, 45%)",
    "hsl(38, 92%, 50%)",
    "hsl(0, 72%, 55%)",
    "hsl(260, 55%, 55%)",
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* SHAP Waterfall */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl border border-border bg-card p-5 card-elevated"
      >
        <h4 className="text-sm font-semibold text-foreground mb-4">SHAP Feature Contributions</h4>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 80, right: 20, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 25%, 90%)" />
            <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(215, 15%, 50%)" }} />
            <YAxis
              type="category"
              dataKey="feature"
              tick={{ fontSize: 11, fill: "hsl(215, 15%, 50%)" }}
              width={75}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(214, 25%, 90%)",
                borderRadius: "8px",
                fontSize: 12,
              }}
            />
            <Bar dataKey="contribution" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, idx) => (
                <Cell
                  key={idx}
                  fill={entry.contribution >= 0 ? "hsl(0, 72%, 55%)" : "hsl(205, 85%, 42%)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-2">
          Red = increases risk · Blue = decreases risk
        </p>
      </motion.div>

      {/* Top 5 Feature Importance */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-xl border border-border bg-card p-5 card-elevated"
      >
        <h4 className="text-sm font-semibold text-foreground mb-4">Top 5 Important Features</h4>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
            >
              {pieData.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(214, 25%, 90%)",
                borderRadius: "8px",
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-3 mt-2">
          {pieData.map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: PIE_COLORS[i] }}
              />
              {item.name}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
