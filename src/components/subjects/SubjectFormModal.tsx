import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import Modal from '../common/Modal';
import Input, { Label, Select } from '../common/Input';
import Button from '../common/Button';
import type { Difficulty, Subject, Topic } from '../../types';
import { useApp } from '../../context/AppContext';

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#0ea5e9', '#a855f7', '#ec4899'];

export default function SubjectFormModal({
  open,
  onClose,
  subject,
}: {
  open: boolean;
  onClose: () => void;
  subject: Subject | null;
}) {
  const { addSubject, updateSubject } = useApp();
  const [name, setName] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('med');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [newTopic, setNewTopic] = useState('');

  useEffect(() => {
    if (open) {
      setName(subject?.name ?? '');
      setDifficulty(subject?.difficulty ?? 'med');
      setTopics(subject?.topics ?? []);
      setNewTopic('');
    }
  }, [open, subject]);

  const progress = topics.length > 0 ? Math.round((topics.filter((t) => t.covered).length / topics.length) * 100) : 0;

  const addTopic = () => {
    const trimmed = newTopic.trim();
    if (!trimmed) return;
    setTopics((t) => [...t, { name: trimmed, covered: false }]);
    setNewTopic('');
  };

  const toggleTopic = (idx: number) => {
    setTopics((t) => t.map((topic, i) => (i === idx ? { ...topic, covered: !topic.covered } : topic)));
  };

  const removeTopic = (idx: number) => {
    setTopics((t) => t.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;
    const payload = { name: name.trim(), difficulty, progress, topics };
    if (subject) {
      await updateSubject(subject.id, payload);
    } else {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      await addSubject({ ...payload, color });
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={subject ? 'Edit Subject' : 'Add Subject'}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="subject-name">Subject name</Label>
          <Input
            id="subject-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Database Systems"
          />
        </div>
        <div>
          <Label htmlFor="subject-difficulty">Difficulty</Label>
          <Select
            id="subject-difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
          >
            <option value="low">Low</option>
            <option value="med">Medium</option>
            <option value="high">High</option>
          </Select>
        </div>
        <div>
          <Label>Topics ({progress}% covered)</Label>
          <div className="max-h-40 space-y-1 overflow-y-auto rounded-lg border border-border p-2">
            {topics.length === 0 && <p className="px-1 text-xs text-text-secondary">No topics yet</p>}
            {topics.map((topic, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 rounded-md px-1 py-1 text-sm transition-colors duration-200 hover:bg-surface"
              >
                <input
                  type="checkbox"
                  checked={topic.covered}
                  onChange={() => toggleTopic(idx)}
                  className="size-4 accent-primary"
                />
                <span className={`flex-1 text-text-primary ${topic.covered ? 'text-text-secondary line-through' : ''}`}>
                  {topic.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeTopic(idx)}
                  aria-label="Remove topic"
                  className="rounded-md p-1 text-text-secondary transition-colors duration-200 hover:bg-danger/10 hover:text-danger"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <Input
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTopic())}
              placeholder="Add a topic and press Enter"
            />
            <Button variant="secondary" onClick={addTopic}>
              Add
            </Button>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>{subject ? 'Save Changes' : 'Add Subject'}</Button>
        </div>
      </div>
    </Modal>
  );
}
