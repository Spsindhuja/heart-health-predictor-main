import { useState } from "react";
import { motion } from "framer-motion";
import PredictionForm from "@/components/PredictionForm";
import PredictionResults from "@/components/PredictionResults";
import { predictHeartDisease, type PatientInput, type PredictionResult } from "@/lib/ml-service";

export default function Index() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [patientData, setPatientData] = useState<PatientInput | null>(null);

  const handlePredict = async (data: PatientInput) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await predictHeartDisease(data);
      setResult(res);
      setPatientData(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero */}
      <section className="gradient-primary py-12 md:py-16">
        <div className="container text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary-foreground tracking-tight"
          >
            Heart Disease Prediction
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-primary-foreground/80 text-lg max-w-2xl mx-auto"
          >
            ML-powered clinical decision support using the UCI Cleveland dataset.
            Enter patient parameters below for instant risk assessment.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <div className="container py-8 space-y-8">
        <PredictionForm onSubmit={handlePredict} loading={loading} />
        {result && patientData && <PredictionResults result={result} patientData={patientData} />}
      </div>
    </div>
  );
}
