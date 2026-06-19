import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, Download, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type PredictionResult, type PatientInput } from "@/lib/ml-service";
import SHAPChart from "./SHAPChart";
import { generatePDFReport } from "@/lib/pdf-report";

interface Props {
  result: PredictionResult;
  patientData: PatientInput;
}

export default function PredictionResults({ result, patientData }: Props) {
  const isDisease = result.prediction === 1;
  const percentage = Math.round(result.probability * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Main Result Card */}
      <div
        className={`relative overflow-hidden rounded-xl border p-6 card-elevated ${
          isDisease ? "border-destructive/30 bg-destructive/5" : "border-success/30 bg-success/5"
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div
            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${
              isDisease ? "bg-destructive/15" : "bg-success/15"
            }`}
          >
            {isDisease ? (
              <ShieldAlert className="h-8 w-8 text-destructive" />
            ) : (
              <ShieldCheck className="h-8 w-8 text-success" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-foreground">
              {isDisease ? "Heart Disease Detected" : "No Heart Disease Detected"}
            </h3>
            <p className="text-muted-foreground mt-1">
              Model: <span className="font-medium text-foreground">{result.model_used}</span> · Confidence:{" "}
              <span className={`font-semibold ${isDisease ? "text-destructive" : "text-success"}`}>
                {percentage}%
              </span>
            </p>
          </div>

          {/* Risk gauge */}
          <div className="flex flex-col items-center">
            <div className="relative h-20 w-20">
              <svg viewBox="0 0 36 36" className="h-20 w-20 -rotate-90">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="hsl(var(--border))"
                  strokeWidth="3"
                />
                <motion.path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={isDisease ? "hsl(var(--risk-high))" : "hsl(var(--risk-low))"}
                  strokeWidth="3"
                  strokeDasharray={`${percentage}, 100`}
                  initial={{ strokeDasharray: "0, 100" }}
                  animate={{ strokeDasharray: `${percentage}, 100` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-foreground">
                {percentage}%
              </span>
            </div>
            <span className="text-xs text-muted-foreground mt-1">Risk Score</span>
          </div>
        </div>
      </div>

      {/* SHAP Chart */}
      <SHAPChart shapValues={result.shap_values} topFeatures={result.top_features} />

      {/* Download Report */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => generatePDFReport(result, patientData)}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Download PDF Report
        </Button>
      </div>
    </motion.div>
  );
}
