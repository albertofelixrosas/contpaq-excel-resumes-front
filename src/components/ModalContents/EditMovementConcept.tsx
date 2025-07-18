import './EditMovementConcept.css';

interface EditMovementConceptProps {
  onCancel: () => void;
  onEdit: () => void;
  previusConcept: string;
  newConcept: string;
  setNewConcept: (concept: string) => void;
}

export const EditMovementConcept = (props: EditMovementConceptProps) => {
  const { onEdit, onCancel, previusConcept, newConcept, setNewConcept } = props;

  const handleOnSubmit = () => {
    onEdit();
  };

  return (
    <form className="update-movement-form" onSubmit={handleOnSubmit} noValidate>
      <div>
        <label className="form__label" htmlFor="">
          Concepto anterior
        </label>
        <textarea className="form__text-area" name="" id="" disabled>
          {previusConcept}
        </textarea>
      </div>
      <div>
        <label className="form__label" htmlFor="">
          Concepto nuevo
        </label>
        <textarea
          className="form__text-area"
          name=""
          id=""
          onChange={e => {
            setNewConcept(e.target.value);
          }}
        >
          {newConcept}
        </textarea>
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
