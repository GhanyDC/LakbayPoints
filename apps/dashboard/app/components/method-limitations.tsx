export function MethodLimitations() {
  return (
    <footer className="method-limitations">
      <p className="method-limitations__eyebrow">Prototype boundary</p>
      <h2>Method and limitations</h2>
      <p>
        This view uses deterministic simulated data. Any later report-status
        demonstration remains local to the browser and resets on reload. CO2e
        methodology is pending pilot calibration. No backend, live commuter
        feed, or live MMDA integration is connected.
      </p>
    </footer>
  );
}
