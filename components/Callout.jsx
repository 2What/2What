// components/Callout.jsx
// earth tone version

const styles = {
  note: {
    background: "#f5efe6",   // sand
    border: "#8b5e34",       // warm brown
    label: "Note"
  },
  warning: {
    background: "#f3e6d3",   // light tan
    border: "#c27c2c",       // ochre
    label: "Warning"
  },
  tip: {
    background: "#e8efe3",   // soft sage
    border: "#6b8e23",       // olive green
    label: "Tip"
  },
  danger: {
    background: "#f2e3dc",   // dusty clay
    border: "#a44a3f",       // muted red-brown
    label: "Danger"
  },
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
        color: "#3e2f1c", // consistent text brown
      }}
    >
      <strong style={{ color: border }}>{label}: </strong>
      {children}
    </div>
  );
}