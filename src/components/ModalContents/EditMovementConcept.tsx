import { DEFAULT_CONCEPTS } from '../../enums/Concepts';
import { formatDateToLongSpanish } from '../../utils/dateUtils';
import './EditMovementConcept.css';

interface EditMovementConceptProps {
  onCancel: () => void;
  onEdit: () => void;
  date: string;
  supplier: string;
  previusConcept: string;
  newConcept: string;
  setNewConcept: (concept: string) => void;
}

export const EditMovementConcept = (props: EditMovementConceptProps) => {
  const { onEdit, onCancel, date, supplier, previusConcept, newConcept, setNewConcept } = props;

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onEdit();
  };

  return (
    <form className="update-movement-form" onSubmit={handleOnSubmit} noValidate>
      <div className="update-movement-form__entry">
        <label className="form__label" htmlFor="date">
          Fecha
        </label>
        <textarea
          className="form__text-area"
          name="date"
          id="date"
          disabled
          value={formatDateToLongSpanish(new Date(date))}
        />
      </div>
      <div className="update-movement-form__entry">
        <label className="form__label" htmlFor="supplier">
          Proveedor
        </label>
        <textarea
          className="form__text-area"
          name="supplier"
          id="supplier"
          disabled
          value={supplier}
        />
      </div>
      <div className="update-movement-form__entry">
        <label className="form__label" htmlFor="concept">
          Concepto anterior
        </label>
        <textarea
          className="form__text-area"
          name="concept"
          id="concept"
          disabled
          value={previusConcept}
        />
      </div>
      <div className="update-movement-form__entry">
        <label className="form__label" htmlFor="new-concept">
          Concepto nuevo
        </label>
        <ul className="update-movement-form__list" id="new-concept">
          {DEFAULT_CONCEPTS.map(c => {
            return (
              <li
                onClick={() => {
                  setNewConcept(c);
                }}
                className={`update-movement-form__list-item ${newConcept === c ? 'update-movement-form__list-item--selected' : ''} `}
                key={`moda-concept-${c}`}
              >
                {c}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="update-movement-form__actions">
        <button className="button" type="submit">
          Cambiar
        </button>
        <button className="button button--ghost" type="button" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
};
