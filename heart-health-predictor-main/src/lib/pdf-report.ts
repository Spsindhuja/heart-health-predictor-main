import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { type PredictionResult, type PatientInput, getFeatureLabel } from "./ml-service";

export function generatePDFReport(result: PredictionResult, patient: PatientInput) {
  const doc = new jsPDF();
  const isDisease = result.prediction === 1;
  const pct = Math.round(result.probability * 100);

  // Title
  doc.setFontSize(20);
  doc.setTextColor(30, 58, 95);
  doc.text("Cardiac Clarity — Prediction Report", 14, 22);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
  doc.text(`Model: ${result.model_used}`, 14, 36);

  // Result
  doc.setFontSize(14);
  doc.setTextColor(isDisease ? 200 : 40, isDisease ? 50 : 140, isDisease ? 50 : 80);
  doc.text(`Result: ${isDisease ? "Heart Disease Detected" : "No Heart Disease"} (${pct}% risk)`, 14, 48);

  // Patient Data Table
  doc.setFontSize(12);
  doc.setTextColor(30, 58, 95);
  doc.text("Patient Clinical Data", 14, 60);

  const patientRows = (Object.keys(patient) as (keyof PatientInput)[]).map((k) => [
    getFeatureLabel(k),
    String(patient[k]),
  ]);

  autoTable(doc, {
    startY: 64,
    head: [["Parameter", "Value"]],
    body: patientRows,
    theme: "striped",
    headStyles: { fillColor: [30, 120, 190] },
    styles: { fontSize: 9 },
  });

  // SHAP values
  const shapY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.setTextColor(30, 58, 95);
  doc.text("Feature Contributions (SHAP)", 14, shapY);

  autoTable(doc, {
    startY: shapY + 4,
    head: [["Feature", "Contribution"]],
    body: result.shap_values.map((s) => [s.feature, s.contribution.toFixed(4)]),
    theme: "striped",
    headStyles: { fillColor: [30, 120, 190] },
    styles: { fontSize: 9 },
  });

  // Disclaimer
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text("Disclaimer: This is a machine learning prediction and should not replace professional medical advice.", 14, finalY);

  doc.save("cardiac-clarity-report.pdf");
}
