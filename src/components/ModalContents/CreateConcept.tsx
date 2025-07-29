import { useEffect, useState } from 'react';
import './EditMovementConcept.css';
import { useConcepts } from '../../hooks/useConcepts';
import toast from 'react-hot-toast';

interface CreateConceptProps {
  company_id: number;
  onCancel: () => void;
  onCreate: (message: string) => void;
}

export const CreateConcept = (props: CreateConceptProps) => {
  const { onCreate, onCancel, company_id } = props;
  const [newConcept, setNewConcept] = useState('');
  const [alreadyExist, setAlreadyExist] = useState(true);

  const { loading, error, fetch, data: currentConcepts, create } = useConcepts();

  useEffect(() => {
    fetch({ company_id });
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    const someConceptIsEqualsToNewConcept =
      currentConcepts
        .map(c => c.name.toLowerCase().trim())
        .filter(c => c === newConcept.toLowerCase().trim()).length > 0;
    setAlreadyExist(someConceptIsEqualsToNewConcept);
  }, [newConcept]);

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await create({ name: newConcept, company_id });
      onCreate(`¡Se ha agregado el nuevo concepto "${newConcept}" con exito!`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al crear el concepto');
    }
  };

  return (
    <form className="update-movement-form" onSubmit={handleOnSubmit} noValidate>
      <div className="update-movement-form__entry">
        <label className="form__label" htmlFor="supplier">
          Concepto
        </label>
        <textarea
          className="form__text-area"
          name="supplier"
          id="supplier"
          value={newConcept}
          onChange={e => {
            setNewConcept(e.target.value);
          }}
        />
      </div>
      {alreadyExist && <p>{`El concepto con el nombre "${newConcept}" ya existe`}</p>}

      <p>Los conceptos que ya existen son: </p>
      <ul>
        {currentConcepts.map(c => {
          return <li key={`create-concept-item-${c.concept_id}`}>{c.name}</li>;
        })}
      </ul>

      <div className="update-movement-form__actions">
        <button className="button" type="submit" disabled={alreadyExist}>
          Crear
        </button>
        <button
          className="button button--ghost"
          type="button"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};
