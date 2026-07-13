import FocusTimer from '../components/focus/FocusTimer';
import FocusStats from '../components/focus/FocusStats';

export default function FocusPage() {
  return (
    <div className="space-y-4">
      <FocusTimer />
      <FocusStats />
    </div>
  );
}
