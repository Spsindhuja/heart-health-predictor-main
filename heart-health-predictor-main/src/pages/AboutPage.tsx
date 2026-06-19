import { motion } from "framer-motion";
import { Heart, Database, Brain, Code2, Server } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <section className="gradient-primary py-10">
        <div className="container text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary-foreground">About This Project</h1>
          <p className="mt-2 text-primary-foreground/80">M.Tech Phase-1 Academic Project</p>
        </div>
      </section>

      <div className="container py-8 max-w-3xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border bg-card p-6 card-elevated space-y-4"
        >
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" /> Cardiac Clarity
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            A machine learning-based heart disease prediction system built for academic research.
            The system uses the UCI Cleveland Heart Disease dataset to train and evaluate multiple
            classification models, selecting the best performer based on F1-score and ROC-AUC.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {[
              { icon: Database, title: "Dataset", desc: "UCI Cleveland Heart Disease (303 samples, 14 attributes)" },
              { icon: Brain, title: "ML Models", desc: "Logistic Regression, Random Forest, SVM, XGBoost, KNN" },
              { icon: Code2, title: "Frontend", desc: "React + TypeScript + Tailwind CSS + Recharts" },
              { icon: Server, title: "Backend", desc: "Python FastAPI + scikit-learn + SHAP" },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                <item.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl border border-border bg-card p-6 card-elevated space-y-3"
        >
          <h3 className="text-lg font-semibold text-foreground">Architecture</h3>
          <div className="bg-muted rounded-lg p-4 font-mono text-xs text-muted-foreground space-y-1">
            <p>┌─────────────────┐     REST API     ┌──────────────────┐</p>
            <p>│  React Frontend │ ──────────────▶  │  FastAPI Backend  │</p>
            <p>│  (This UI)      │ ◀──────────────  │  ML Pipeline      │</p>
            <p>└─────────────────┘    JSON/PDF      └──────────────────┘</p>
            <p className="pt-2">Preprocessing → SMOTE → Model Training → SHAP Explainability</p>
          </div>
        </motion.div>

        <p className="text-xs text-center text-muted-foreground">
          © 2026 Cardiac Clarity · M.Tech Phase-1 Project · For academic use only
        </p>
      </div>
    </div>
  );
}
