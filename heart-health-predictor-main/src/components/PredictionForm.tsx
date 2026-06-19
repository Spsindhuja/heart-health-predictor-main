import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Loader2, AlertCircle, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type PatientInput } from "@/lib/ml-service";

interface Props {
  onSubmit: (data: PatientInput) => void;
  loading: boolean;
}

const FIELD_CONFIG: {
  key: keyof PatientInput;
  label: string;
  type: "number" | "select";
  options?: { value: string; label: string }[];
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
}[] = [
  { key: "age", label: "Age", type: "number", placeholder: "e.g. 55", min: 1, max: 120, hint: "Years" },
  {
    key: "sex",
    label: "Sex",
    type: "select",
    options: [
      { value: "1", label: "Male" },
      { value: "0", label: "Female" },
    ],
  },
  {
    key: "cp",
    label: "Chest Pain Type",
    type: "select",
    options: [
      { value: "0", label: "Typical Angina" },
      { value: "1", label: "Atypical Angina" },
      { value: "2", label: "Non-anginal Pain" },
      { value: "3", label: "Asymptomatic" },
    ],
  },
  { key: "trestbps", label: "Resting Blood Pressure", type: "number", placeholder: "e.g. 130", min: 80, max: 250, hint: "mm Hg" },
  { key: "chol", label: "Serum Cholesterol", type: "number", placeholder: "e.g. 250", min: 100, max: 600, hint: "mg/dl" },
  {
    key: "fbs",
    label: "Fasting Blood Sugar > 120",
    type: "select",
    options: [
      { value: "1", label: "True" },
      { value: "0", label: "False" },
    ],
  },
  {
    key: "restecg",
    label: "Resting ECG",
    type: "select",
    options: [
      { value: "0", label: "Normal" },
      { value: "1", label: "ST-T Abnormality" },
      { value: "2", label: "LV Hypertrophy" },
    ],
  },
  { key: "thalach", label: "Max Heart Rate Achieved", type: "number", placeholder: "e.g. 150", min: 60, max: 250, hint: "bpm" },
  {
    key: "exang",
    label: "Exercise Induced Angina",
    type: "select",
    options: [
      { value: "1", label: "Yes" },
      { value: "0", label: "No" },
    ],
  },
  { key: "oldpeak", label: "ST Depression (Oldpeak)", type: "number", placeholder: "e.g. 1.5", min: 0, max: 10, step: 0.1, hint: "mm" },
  {
    key: "slope",
    label: "Slope of Peak ST",
    type: "select",
    options: [
      { value: "0", label: "Upsloping" },
      { value: "1", label: "Flat" },
      { value: "2", label: "Downsloping" },
    ],
  },
  {
    key: "ca",
    label: "Major Vessels (Fluoroscopy)",
    type: "select",
    options: [
      { value: "0", label: "0" },
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "3", label: "3" },
    ],
  },
  {
    key: "thal",
    label: "Thalassemia",
    type: "select",
    options: [
      { value: "1", label: "Normal" },
      { value: "2", label: "Fixed Defect" },
      { value: "3", label: "Reversible Defect" },
    ],
  },
];

export default function PredictionForm({ onSubmit, loading }: Props) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const missing = FIELD_CONFIG.filter((f) => !values[f.key] && values[f.key] !== "0").map((f) => f.label);
    if (missing.length > 0) {
      setErrors(missing);
      return;
    }
    setErrors([]);
    const data: PatientInput = {} as PatientInput;
    FIELD_CONFIG.forEach((f) => {
      (data as any)[f.key] = f.step ? parseFloat(values[f.key]) : parseInt(values[f.key], 10);
    });
    onSubmit(data);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card p-6 card-elevated space-y-6"
    >
      <div className="flex items-center gap-3 pb-2 border-b border-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
          <Heart className="h-5 w-5 text-primary-foreground" fill="currentColor" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Patient Clinical Data</h2>
          <p className="text-sm text-muted-foreground">Enter all 13 parameters for prediction</p>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>Please fill in: {errors.join(", ")}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FIELD_CONFIG.map((field) => (
          <div key={field.key} className="space-y-1.5">
            <Label htmlFor={field.key} className="text-sm font-medium text-foreground">
              {field.label}
              {field.hint && <span className="ml-1 text-xs text-muted-foreground">({field.hint})</span>}
            </Label>
            {field.type === "select" ? (
              <Select
                value={values[field.key] ?? ""}
                onValueChange={(v) => setValues((p) => ({ ...p, [field.key]: v }))}
              >
                <SelectTrigger id={field.key} className="bg-background">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {field.options!.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id={field.key}
                type="number"
                placeholder={field.placeholder}
                min={field.min}
                max={field.max}
                step={field.step || 1}
                value={values[field.key] ?? ""}
                onChange={(e) => setValues((p) => ({ ...p, [field.key]: e.target.value }))}
                className="bg-background"
              />
            )}
          </div>
        ))}
      </div>

      <Button
        type="submit"
        disabled={loading}
        size="lg"
        className="w-full gradient-primary text-primary-foreground font-semibold text-base h-12 hover:opacity-90 transition-opacity"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Activity className="mr-2 h-5 w-5" />
            Predict Heart Disease Risk
          </>
        )}
      </Button>
    </motion.form>
  );
}

