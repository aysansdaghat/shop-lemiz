import { Minus, Plus } from 'lucide-react';
import { faNumber } from '../utils/format';

export default function QuantityStepper({ name, qty, max, onIncrement, onDecrement }) {
  return (
    <div className="stepper" role="group" aria-label={`تعداد ${name}`}>
      <button type="button" className="stepper__btn" onClick={onDecrement} aria-label={`کم کردن ${name}`}>
        <Minus size={18} aria-hidden="true" />
      </button>
      <span className="stepper__qty" aria-live="polite">
        {faNumber(qty)}
      </span>
      <button
        type="button"
        className="stepper__btn"
        onClick={onIncrement}
        disabled={qty >= max}
        aria-label={`اضافه کردن ${name}`}
      >
        <Plus size={18} aria-hidden="true" />
      </button>
    </div>
  );
}
