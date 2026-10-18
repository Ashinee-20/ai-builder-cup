const steps = ["Plan", "Teach", "Review", "Learn", "Adapt"];

export function WorkflowIndicator({ current }: { current: string }) {
  return <div className="workflow-indicator" aria-label={`Workflow: ${current}`}>
    {steps.map((step) => <span key={step} className={step === current ? "current" : ""}>{step}</span>)}
  </div>;
}
