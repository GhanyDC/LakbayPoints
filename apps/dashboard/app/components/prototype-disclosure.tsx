type PrototypeDisclosureProps = {
  statement: string;
};

export function PrototypeDisclosure({ statement }: PrototypeDisclosureProps) {
  return (
    <aside
      aria-labelledby="prototype-disclosure-label"
      className="prototype-disclosure"
      role="note"
    >
      <p
        className="prototype-disclosure__label"
        id="prototype-disclosure-label"
      >
        Prototype disclosure
      </p>
      <p className="prototype-disclosure__statement">{statement}</p>
    </aside>
  );
}
