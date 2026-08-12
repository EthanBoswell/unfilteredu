"use client";

import { useState, useTransition } from "react";
import { completeOnboarding, type OnboardingInput } from "./actions";

type Role = OnboardingInput["role"];
type Stage = OnboardingInput["stage"];

const currentYear = new Date().getFullYear();
const GRAD_YEARS = Array.from({ length: 9 }, (_, i) => currentYear + i);

const optionButtonStyle = (active: boolean): React.CSSProperties => ({
  width: "100%",
  textAlign: "left",
  padding: "14px 16px",
  borderRadius: 8,
  border: `1.5px solid ${active ? "#0F0F0F" : "#e0ddd6"}`,
  background: active ? "#0F0F0F" : "#fff",
  color: active ? "#F5F4EF" : "#0F0F0F",
  fontFamily: "Inter, sans-serif",
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
});

const stepLabelStyle: React.CSSProperties = {
  fontFamily: "Inter, sans-serif",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#999",
  marginBottom: 14,
};

export default function OnboardingForm({ next }: { next?: string }) {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<Role | null>(null);
  const [stage, setStage] = useState<Stage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function chooseRole(value: Role) {
    setRole(value);
    setStep(1);
  }

  function chooseStage(value: Stage) {
    setStage(value);
    setStep(2);
  }

  function chooseGradYear(gradYear: number) {
    if (!role || !stage) return;
    setError(null);
    startTransition(async () => {
      const result = await completeOnboarding({ role, stage, gradYear, next });
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="flex flex-col gap-2">
      {error && (
        <p
          className="mb-3 rounded-md px-3 py-2.5"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 13,
            color: "#b42318",
            background: "#fef3f2",
            border: "1px solid #fecdca",
          }}
        >
          {error}
        </p>
      )}

      {step === 0 && (
        <div className="flex flex-col gap-3">
          <p style={stepLabelStyle}>Step 1 of 3</p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 15, color: "#0F0F0F", marginBottom: 4 }}>
            Are you a parent or a student?
          </p>
          <button type="button" style={optionButtonStyle(role === "parent")} onClick={() => chooseRole("parent")}>
            Parent
          </button>
          <button type="button" style={optionButtonStyle(role === "student")} onClick={() => chooseRole("student")}>
            Student
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-col gap-3">
          <p style={stepLabelStyle}>Step 2 of 3</p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 15, color: "#0F0F0F", marginBottom: 4 }}>
            High school or college?
          </p>
          <button type="button" style={optionButtonStyle(stage === "high_school")} onClick={() => chooseStage("high_school")}>
            High school
          </button>
          <button type="button" style={optionButtonStyle(stage === "college")} onClick={() => chooseStage("college")}>
            College
          </button>
          <button
            type="button"
            onClick={() => setStep(0)}
            style={{ marginTop: 4, alignSelf: "flex-start", background: "none", border: "none", color: "#999", fontFamily: "Inter, sans-serif", fontSize: 13, cursor: "pointer" }}
          >
            ← Back
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-3">
          <p style={stepLabelStyle}>Step 3 of 3</p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 15, color: "#0F0F0F", marginBottom: 4 }}>
            What graduation year?
          </p>
          <div className="flex flex-col gap-2" style={{ maxHeight: 260, overflowY: "auto" }}>
            {GRAD_YEARS.map((year) => (
              <button
                key={year}
                type="button"
                disabled={pending}
                style={optionButtonStyle(false)}
                onClick={() => chooseGradYear(year)}
              >
                {year}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setStep(1)}
            disabled={pending}
            style={{ marginTop: 4, alignSelf: "flex-start", background: "none", border: "none", color: "#999", fontFamily: "Inter, sans-serif", fontSize: 13, cursor: "pointer" }}
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}
