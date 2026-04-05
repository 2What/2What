// components/Callout.jsx
// react for callout

const styles = {
  note:    { background: "#e8f4fd", border: "#3b82f6", label: "Note" },
  warning: { background: "#fef9e7", border: "#f59e0b", label: "Warning" },
  tip:     { background: "#e6f9f0", border: "#10b981", label: "Tip" },
  danger:  { background: "#fdecea", border: "#ef4444", label: "Danger" },
};

export function Callout({ type = "note", children }) {
  const { background, border, label } = styles[type] ?? styles.note;

  return (
    <div
      style={{
        background,
        borderLeft: `4px solid ${border}`,
        padding: "12px 16px",
        borderRadius: "4px",
        margin: "1.5rem 0",
      }}
    >
      <strong style={{ color: border }}>{label}: </strong>
      {children}
    </div>
  );
}
