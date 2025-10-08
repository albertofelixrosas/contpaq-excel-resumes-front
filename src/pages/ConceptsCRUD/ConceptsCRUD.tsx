import { useEffect, useState } from 'react';
import './ConceptsCRUD.css';
import toast from 'react-hot-toast';
import type { Company } from '../../models/company.model';
import type { Concept } from '../../models/concept.model';
import { IoMdRemoveCircleOutline } from 'react-icons/io';
import { FaRegEdit } from 'react-icons/fa';
import Modal from '../../components/UI/Modal';
import { CreateConceptCRUD } from '../../components/ModalContents/CRUDConcept/CreateConceptCRUD';
import { UpdateConceptCRUD } from '../../components/ModalContents/CRUDConcept/UpdateConceptCRUD';
import { DeleteConceptCRUD } from '../../components/ModalContents/CRUDConcept/DeleteConceptCRUD';
// Nuevos hooks de TanStack Query
import { useConcepts, useCreateConcept, useUpdateConcept, useDeleteConcept } from '../../hooks/concepts';
import { useCompanies } from '../../hooks/companies';

export const ConceptsCRUD = () => {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);
  const [showCreateConcept, setShowCreateConcept] = useState(false);
  const [showUpdateConcept, setShowUpdateConcept] = useState(false);
  const [showDeleteConcept, setShowDeleteConcept] = useState(false);

  // Nuevos hooks de TanStack Query
  const { data: companies, isLoading: loadingCompanies, error: companiesError } = useCompanies();
  
  const { 
    data: concepts, 
    isLoading: loadingConcepts, 
    error: conceptsError 
  } = useConcepts({ 
    company_id: selectedCompany?.company_id 
  });

  const { createConcept } = useCreateConcept();
  const { updateConcept } = useUpdateConcept();
  const { deleteConcept } = useDeleteConcept();

  // Manejo de errores
  useEffect(() => {
    if (conceptsError) {
      toast.error(conceptsError.message || 'Error al cargar conceptos');
    }
    if (companiesError) {
      toast.error(companiesError.message || 'Error al cargar empresas');
    }
  }, [conceptsError, companiesError]);

  // Cargar por defecto la primera empresa de la lista
  useEffect(() => {
    if (companies && companies.length > 0 && !selectedCompany) {
      setSelectedCompany(companies[0]);
    }
  }, [companies, selectedCompany]);

  return (
    <section className="page">
      <header className="page__header">
        <h2 className="page__title">Conceptos</h2>
        <p className="page__subtitle">
          Gestione su listado de conceptos para sus reportes / resumenes
        </p>
      </header>

      <hr className="page__separator" />
      <div className="page__header-section">
        <h3 className="page__title--gray">Administrar conceptos</h3>
      </div>
      <div>
        <div>
          <div className="data-verification__filters">
            <div className="data-verification__filter">
              <label htmlFor="companies-select" className="form__label">
                Empresa <strong>*</strong>
              </label>
              <select
                className="form__select"
                name="company"
                id="companies-select"
                value={`${!selectedCompany ? '' : selectedCompany.company_id}`}
                onChange={e => {
                  const company = companies?.filter(
                    c => c.company_id === parseInt(e.target.value),
                  )[0];
                  if (!company) {
                    setSelectedCompany(null);
                  } else {
                    setSelectedCompany(company);
                  }
                }}
                disabled={loadingCompanies}
              >
                <option value="">(Empresa sin especificar)</option>
                {companies
                  ?.sort((a, b) => a.company_name.localeCompare(b.company_name))
                  .map(c => (
                    <option key={`company_${c.company_id}`} value={String(c.company_id)}>
                      {c.company_name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="concepts__buttons">
            <button
              className="button"
              type="button"
              disabled={!selectedCompany}
              onClick={() => {
                setShowCreateConcept(true);
              }}
            >
              Agregar
            </button>
          </div>
        </div>
      </div>

      {!loadingConcepts && concepts && concepts.length > 0 && selectedCompany && (
        <>
          <div className="table-container">
            <table className="table table--venues">
              <thead className="table__head">
                <tr className="table__row--head">
                  <th className="table__cell table__cell--head">Concepto</th>
                  <th className="table__cell table__cell--head table__cell--actions-th">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="table__body">
                {concepts.map(concept => {
                  const { concept_id, name } = concept;

                  return (
                    <tr className="table__row" key={concept_id}>
                      <td className="table__cell">{name}</td>
                      <td className="table__cell">
                        <div
                          style={{
                            display: 'flex',
                            gap: '16px',
                            justifyContent: 'center',
                          }}
                        >
                          <button
                            className="table__button--orange"
                            onClick={() => {
                              setShowUpdateConcept(true);
                              setSelectedConcept(concept);
                            }}
                          >
                            <FaRegEdit color="white" size={20} />
                          </button>
                          <button
                            className="table__button--red"
                            onClick={() => {
                              setShowDeleteConcept(true);
                              setSelectedConcept(concept);
                            }}
                          >
                            <IoMdRemoveCircleOutline color="white" size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
      {selectedCompany !== null && showCreateConcept && (
        <Modal
          title="Agregar nuevo concepto"
          children={
            <CreateConceptCRUD
              onClose={() => {
                setShowCreateConcept(false);
              }}
              onCreate={async concetName => {
                createConcept(
                  { company_id: selectedCompany.company_id, name: concetName },
                  {
                    onSuccess: () => {
                      toast.success('¡Se creó el concepto con éxito!');
                      setShowCreateConcept(false);
                    },
                    onError: (error) => {
                      toast.error(error.message || 'Error al crear el concepto');
                    }
                  }
                );
              }}
              currentConcepts={concepts || []}
            />
          }
          isOpen={showCreateConcept}
          onClose={() => {
            setShowCreateConcept(false);
          }}
        />
      )}
      {selectedCompany !== null && showUpdateConcept && selectedConcept && (
        <Modal
          title="Actualizar concepto"
          children={
            <UpdateConceptCRUD
              conceptId={selectedConcept.concept_id}
              currentValue={selectedConcept.name}
              onClose={() => {}}
              onUpdate={async (id, concept) => {
                updateConcept(
                  { 
                    id, 
                    data: { company_id: selectedCompany.company_id, name: concept }
                  },
                  {
                    onSuccess: () => {
                      toast.success('¡Se actualizó el concepto con éxito!');
                      setShowUpdateConcept(false);
                    },
                    onError: (error) => {
                      toast.error(error.message || 'Error al actualizar el concepto');
                    }
                  }
                );
              }}
              currentConcepts={concepts || []}
            />
          }
          isOpen={showUpdateConcept}
          onClose={() => {
            setShowUpdateConcept(false);
          }}
        />
      )}
      {selectedCompany !== null && showDeleteConcept && selectedConcept && (
        <Modal
          title="Remover concepto"
          children={
            <DeleteConceptCRUD
              onClose={() => {
                setShowDeleteConcept(false);
              }}
              conceptId={selectedConcept.concept_id}
              currentValue={selectedConcept.name}
              onDelete={async id => {
                deleteConcept(id, {
                  onSuccess: () => {
                    toast.success('Se eliminó el concepto con éxito');
                    setShowDeleteConcept(false);
                  },
                  onError: (error) => {
                    toast.error(error.message || 'Error al eliminar el concepto');
                  }
                });
              }}
              currentConcepts={concepts || []}
            />
          }
          isOpen={showDeleteConcept}
          onClose={() => {
            setShowDeleteConcept(false);
          }}
        />
      )}
    </section>
  );
};
