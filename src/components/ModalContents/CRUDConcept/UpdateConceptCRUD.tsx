import { useState } from 'react';
import type { Concept } from '../../../models/concept.model';

interface UpdateConceptCRUDProps {
  conceptId: number,
  currentValue: string;
  onClose: () => void;
  onUpdate: (id: number, concept: string) => Promise<void>;
  currentConcepts: Concept[];
}

export const UpdateConceptCRUD = (props: UpdateConceptCRUDProps) => {
  const { onClose, onUpdate, conceptId, currentValue, currentConcepts } = props;

  const [name, setName] = useState(currentValue);

  const handleOnSubmit = () => {
    onUpdate(conceptId, name);
  };

  const isValidInput = () => {
    if (!name) {
      return false;
    }
    if (name === currentValue) {
      return false;
    }
    const improveName = name
      .split(' ')
      .filter(c => c !== '')
      .join(' ');
    const result = currentConcepts.find(c => c.name.toLowerCase() === improveName.toLowerCase());
    return result === undefined;
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',
        padding: '16px',
      }}
    >
      <div>
        <label htmlFor="" className="form__label">
          Nombre
        </label>
        <input
          type="text"
          className="form__input"
          name=""
          id=""
          value={name}
          onChange={e => {
            setName(e.target.value);
          }}
        />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
        }}
      >
        <button
          className="button"
          type="submit"
          disabled={!isValidInput()}
          onClick={handleOnSubmit}
        >
          Modificar
        </button>
        <button className="button button--ghost" onClick={onClose}>
          Cancelar
        </button>
      </div>
    </div>
  );
};
