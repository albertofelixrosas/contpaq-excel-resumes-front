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
        <label className="form__label" htmlFor="">
          Fecha
        </label>
        <textarea className="form__text-area" name="" id="" disabled>
          {formatDateToLongSpanish(new Date(date))}
        </textarea>
      </div>
      <div className="update-movement-form__entry">
        <label className="form__label" htmlFor="">
          Proveedor
        </label>
        <textarea className="form__text-area" name="" id="" disabled>
          {supplier}
        </textarea>
      </div>
      <div className="update-movement-form__entry">
        <label className="form__label" htmlFor="">
          Concepto anterior
        </label>
        <textarea className="form__text-area" name="" id="" disabled>
          {previusConcept}
        </textarea>
      </div>
      <div className="update-movement-form__entry">
        <label className="form__label" htmlFor="">
          Concepto nuevo
        </label>
        <p className="update-movement-form__text">
          Seleccione cualquiera de las etiquetas y cambiara el concepto de forma automatica.
        </p>
        <ul className="update-movement-form__list">
          {DEFAULT_CONCEPTS.map(c => {
            return (
              <li
                onClick={() => {
                  setNewConcept(c);
                }}
                className={`update-movement-form__list-item ${newConcept === c ? 'update-movement-form__list-item--selected' : ''} `}
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
