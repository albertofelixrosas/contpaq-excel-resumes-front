import { useState } from 'react';
import { formatDateToLongSpanish } from '../../utils/dateUtils';
import { OptionsToSelect } from '../UI/OptionsToSelect';
import './EditMovementConcept.css';
import type { Concept } from '../../models/concept.model';

interface EditMovementConceptProps {
  onCancel: () => void;
  onEdit: (movement_id: number, newConcept: string) => void;
  date: string;
  supplier: string;
  previusConcept: string;
  newConcept: Concept | null;
  setNewConcept: (concept: Concept | null) => void;
  currentConcepts: Concept[];
  loadingConcepts: boolean;
  createNewConcept: (company_id: number, newConceptToAdd: string) => void;
  companyId: number;
  selectedMovementId: number
}

export const EditMovementConcept = (props: EditMovementConceptProps) => {
  const {
    onEdit,
    onCancel,
    date,
    supplier,
    previusConcept,
    newConcept,
    setNewConcept,
    currentConcepts,
    createNewConcept,
    companyId: company_id,
    loadingConcepts,
    selectedMovementId
  } = props;

  const [newConceptToAdd, setNewConceptToAdd] = useState('');
  const [showNewConceptInputForm, setShowNewConceptInputForm] = useState(false);

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onEdit(selectedMovementId, newConcept?.name || '');
  };

  const handleOnSubmitNewConcept = () => {
    createNewConcept(company_id, newConceptToAdd);
  };

  const isValidNewConceptInput = () => {
    if (!newConceptToAdd) {
      return false;
    }
    const result = currentConcepts.find(
      cc => cc.name.toLowerCase() === newConceptToAdd.toLowerCase(),
    );
    return result === undefined;
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
          Concepto actual
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
        <div className="reports__filter">
          <OptionsToSelect<string>
            name="new-concept-option"
            options={currentConcepts.map(c => {
              return { label: c.name, value: c.name };
            })}
            selectedOption={newConcept === null ? null : newConcept.name}
            setSelectedOption={option => {
              setNewConcept(
                option === null ? null : currentConcepts.filter(cc => cc.name === option.value)[0],
              );
            }}
            onClickNewItem={() => {
              setShowNewConceptInputForm(!showNewConceptInputForm);
            }}
          />
        </div>
      </div>
      {showNewConceptInputForm && (
        <div>
          <label htmlFor="" className="form__label">
            Introduzca el texto del nuevo concepto
          </label>
          <div className="update-movement-form__new-concept-input">
            <input
              type="text"
              className="form__input"
              name=""
              id=""
              value={newConceptToAdd}
              onChange={e => {
                setNewConceptToAdd(e.target.value);
              }}
            />
            <button
              type="button"
              className="button"
              disabled={!isValidNewConceptInput() && !loadingConcepts}
              onClick={handleOnSubmitNewConcept}
            >
              Agregar
            </button>
          </div>
        </div>
      )}
      <div className="update-movement-form__actions">
        <button className="button" type="submit" disabled={!newConcept}>
          Cambiar
        </button>
        <button className="button button--ghost" type="button" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
};
