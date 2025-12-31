interface Props {
  quantity: number;
  max: number;
  onChange: (q: number) => void;
}

export default function QuantitySelector({ quantity, max, onChange }: Props) {
  return (
    <input
      type="number"
      min={1}
      max={max}
      value={quantity}
      onChange={e => onChange(Number(e.target.value))}
    />
  );
}
