import FocusTimer from '../components/focus/FocusTimer';
import FocusStats from '../components/focus/FocusStats';
import Reveal from '../components/common/Reveal';

export default function FocusPage() {
  return (
    <div className="space-y-4 animate-fade-in">
      <FocusTimer />
      <Reveal><FocusStats /></Reveal>
    </div>
  );
}
