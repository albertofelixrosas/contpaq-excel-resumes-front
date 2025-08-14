import type { Concept } from '../../../models/concept.model';

interface DeleteConceptCRUDProps {
  conceptId: number;
  currentValue: string;
  onClose: () => void;
  onDelete: (id: number) => Promise<void>;
  currentConcepts: Concept[];
}

export const DeleteConceptCRUD = (props: DeleteConceptCRUDProps) => {
  const { onClose, onDelete, conceptId, currentValue } = props;

  const handleOnSubmit = () => {
    onDelete(conceptId);
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
        <input type="text" className="form__input" name="" id="" value={currentValue} disabled />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
        }}
      >
        <button className="button" type="submit" onClick={handleOnSubmit}>
          Eliminar
        </button>
        <button className="button button--ghost" onClick={onClose}>
          Cancelar
        </button>
      </div>
    </div>
  );
};
