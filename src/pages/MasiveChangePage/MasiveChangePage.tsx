import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import type { MasiveChangeConceptDto } from '../../models/movement.model';
import type { Company } from '../../models/company.model';
import type {
  AccountingAccount,
  GetAccountingAccountsQueryDto,
} from '../../models/accounting-account.model';
import type { GetSegmentsQueryDto, Segment } from '../../models/segment.model';
import { useCompanies } from '../../hooks/useCompanies';
import { useAccountingAccounts } from '../../hooks/useAccountingAccounts';
import { useSegments } from '../../hooks/useSegments';
import { useMovementsSuppliers } from '../../hooks/useMovementsSuppliers';
import './MasiveChangePage.css';
import { OptionsToSelect } from '../../components/UI/OptionsToSelect';
import Modal from '../../components/UI/Modal';
import { CreateConcept } from '../../components/ModalContents/CreateConcept';
import { useConcepts } from '../../hooks/useConcepts';
import type { Concept } from '../../models/concept.model';
import { useMovementsConcetps } from '../../hooks/useMovementsConcepts';
import { useMasiveMovementsChange } from '../../hooks/useMasiveMovementsChange';

type OptionalCompanyId = {
  company_id?: number;
};

export const MasiveChangePage = () => {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<AccountingAccount | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [showAddConceptModal, setShowAddConceptModal] = useState(false);
  const [newConcept, setNewConcept] = useState<Concept | null>(null);
  const [selectedConcept, setSelectedConcept] = useState('');
  const [segmentsFilter, setSegmentsFilter] = useState<GetSegmentsQueryDto>({});
  const [accountsFilter, setAccountsFilter] = useState<GetAccountingAccountsQueryDto>({});
  const [suppliersFilter, setSuppliersFilter] = useState<OptionalCompanyId>({});
  const [conceptsFilter, setConceptsFilter] = useState<OptionalCompanyId>({});
  const [movementsConceptsFilter, setMovementsConceptsFilter] = useState<OptionalCompanyId>({});
  const [supplierCoincidences, setSupplierCoincidences] = useState<string[]>([]);

  const {
    loading: loadingCompanies,
    data: companies,
    fetch: fetchCompanies,
    error: companiesError,
  } = useCompanies();

  const {
    loading: loadingAccounts,
    fetch: fetchAccounts,
    data: accounts,
    error: accountsError,
  } = useAccountingAccounts();

  const {
    loading: loadingSegments,
    fetch: fetchSegments,
    error: segmentsError,
    data: segments,
  } = useSegments();

  const {
    data: suppliers,
    error: suppliersError,
    loading: loadingSuppliers,
    fetch: fetchSuppliers,
  } = useMovementsSuppliers();

  const {
    update: masiveMovementsUpdate,
    data: masiveMovementsUpdateResponse,
    error: masiveMovementsUpdateError,
    loading: masiveMovementsLoading,
  } = useMasiveMovementsChange();

  const { data: currentConcepts, fetch: fetchConcepts, error: errorConcepts } = useConcepts();

  const {
    fetch: fetchMovementsConcepts,
    error: movementConceptsError,
    data: distinctMovementConcetps,
  } = useMovementsConcetps();

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (companiesError) {
      toast.error(companiesError);
    }
    if (accountsError) {
      toast.error(accountsError);
    }
    if (segmentsError) {
      toast.error(segmentsError);
    }
    if (suppliersError) {
      toast.error(suppliersError);
    }
    if (movementConceptsError) {
      toast.error(movementConceptsError);
    }
    if (errorConcepts) {
      toast.error(errorConcepts);
    }
    if (masiveMovementsUpdateError) {
      toast.error(masiveMovementsUpdateError);
    }
  }, [
    companiesError,
    accountsError,
    segmentsError,
    movementConceptsError,
    errorConcepts,
    masiveMovementsUpdateError,
  ]);

  useEffect(() => {
    if (selectedCompany === null) {
      setSegmentsFilter({});
      setAccountsFilter({});
      setSuppliersFilter({ company_id: 0 });
      setConceptsFilter({ company_id: 0 });
      setSelectedAccount(null);
      setSelectedSegment(null);
      setSelectedConcept('');
      setSelectedSupplier('');
    } else {
      setSegmentsFilter({ company_id: selectedCompany.company_id });
      setAccountsFilter({ company_id: selectedCompany.company_id });
      setSuppliersFilter({ company_id: selectedCompany.company_id });
      setConceptsFilter({ company_id: selectedCompany.company_id });
      setMovementsConceptsFilter({ company_id: selectedCompany.company_id });
    }
  }, [selectedCompany]);

  useEffect(() => {
    if (segmentsFilter.company_id) {
      fetchSegments(segmentsFilter);
    }
  }, [segmentsFilter]);

  useEffect(() => {
    if (accountsFilter.company_id) {
      fetchAccounts(accountsFilter);
    }
  }, [accountsFilter]);

  useEffect(() => {
    if (suppliersFilter.company_id) {
      fetchSuppliers(suppliersFilter.company_id);
    }
  }, [suppliersFilter]);

  useEffect(() => {
    if (conceptsFilter.company_id) {
      fetchConcepts(conceptsFilter);
    }
  }, [conceptsFilter]);

  useEffect(() => {
    if (movementsConceptsFilter.company_id) {
      fetchMovementsConcepts({ company_id: movementsConceptsFilter.company_id });
    }
  }, [movementsConceptsFilter]);

  useEffect(() => {
    if (selectedSupplier) {
      const first3Words = selectedSupplier
        .split(' ')
        .filter((_, i) => i < 3)
        .join(' ');
      const result = suppliers.filter(s => s.startsWith(first3Words));
      setSupplierCoincidences(result);
    } else {
      setSupplierCoincidences([]);
    }
  }, [selectedSupplier]);

  useEffect(() => {
    if (movementsConceptsFilter.company_id) {
      fetchMovementsConcepts({ company_id: movementsConceptsFilter.company_id });
    }
  }, [masiveMovementsUpdateResponse]);

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (disabledChangeMasive()) {
      toast.error('Complete los fitros para poder continuar con la petición');
      return;
    }
    if (!selectedCompany || !newConcept) {
      return;
    }
    let json: MasiveChangeConceptDto = {
      company_id: selectedCompany.company_id,
      new_concept: newConcept.name,
    };
    if (selectedAccount) {
      json = {
        ...json,
        accounting_account_id: selectedAccount.accounting_account_id,
      };
    }

    if (selectedSegment) {
      json = {
        ...json,
        segment_id: selectedSegment.segment_id,
      };
    }

    if (selectedSupplier) {
      const first3Words = selectedSupplier
        .split(' ')
        .filter((_, i) => i < 3)
        .join(' ');
      json = {
        ...json,
        supplier: first3Words,
      };
    }

    if (selectedConcept) {
      json = {
        ...json,
        concept: selectedConcept,
      };
    }

    await masiveMovementsUpdate(json);
  };

  const disabledChangeMasive = (): boolean => {
    const isSelectedCompany = selectedCompany !== null;
    const isSelectedAccount = selectedAccount !== null;
    const isSelectedSegment = selectedAccount !== null;
    const isSelectedConcept = selectedConcept !== '';
    const isSelectedSupplier = selectedSupplier !== '';
    const isSelectedNewConcept = newConcept !== null;

    if (!isSelectedCompany) {
      return true;
    }

    if (!isSelectedNewConcept) {
      return true;
    }

    return !(isSelectedAccount || isSelectedSegment || isSelectedConcept || isSelectedSupplier);
  };

  return (
    <section className="page">
      <header className="page__header">
        <h2 className="page__title">Sustitución masiva</h2>
        <p className="page__subtitle">Cambie los datos de los conceptos de los movimientos</p>
      </header>

      <hr className="page__separator" />

      <p>
        Seleccione los filtros necesarios y proporcione el nuevo concepto para hacer la sustitución
        masiva
      </p>

      <br />

      <p>
        <strong>Advertencia:</strong> cuando se selecciona un provedor, para facilitar el cambio
        rápido, todos quellos que comiencen igual (con las mismas 3 palabras) serán sustituidas.
      </p>

      <br />

      <p>
        Si por ejemplo tiene <em>"DEP NOM SEM 24 del 08 ..."</em> y se selecciona como provedor,
        todos aquellos movimentos con un valor en provedor que comiencen con <em>"DEP NOM SEM"</em>{' '}
        serán sustituidos por parejo.
      </p>

      <div>
        <div className="reports__filters">
          <div className="reports__filter">
            <label htmlFor="companies-select" className="form__label">
              Empresa <strong>*</strong>
            </label>
            <select
              className="form__select"
              name="company"
              id="companies-select"
              value={`${!selectedCompany ? '' : selectedCompany.company_id}`}
              onChange={e => {
                const company = companies.filter(c => c.company_id === parseInt(e.target.value))[0];
                if (!company) {
                  setSelectedCompany(null);
                } else {
                  setSelectedCompany(company);
                }
              }}
              disabled={loadingCompanies}
            >
              <option value="">(Empresa sin especificar)</option>
              {companies.map(c => (
                <option key={`company_${c.company_id}`} value={String(c.company_id)}>
                  {c.company_name}
                </option>
              ))}
            </select>
          </div>
          <div className="reports__filter">
            <label htmlFor="accounts-select" className="form__label">
              Cuenta contable
            </label>
            <select
              className="form__select"
              name="account"
              id="accounts-select"
              disabled={!selectedCompany || loadingAccounts}
              value={`${!selectedAccount ? '' : selectedAccount.accounting_account_id}`}
              onChange={e => {
                const account = accounts.filter(
                  a => a.accounting_account_id === parseInt(e.target.value),
                )[0];
                if (!account) {
                  setSelectedAccount(null);
                } else {
                  setSelectedAccount(account);
                }
              }}
            >
              <option value="">(Cuenta contable sin especificar)</option>
              {accounts.map(a => (
                <option
                  key={`account_${a.accounting_account_id}`}
                  value={String(a.accounting_account_id)}
                >
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div className="reports__filter">
            <label htmlFor="segments-select" className="form__label">
              Segmento
            </label>
            <select
              className="form__select"
              name="segment"
              id="segments-select"
              disabled={!selectedCompany || loadingSegments}
              value={`${!selectedSegment ? '' : selectedSegment.segment_id}`}
              onChange={e => {
                const segment = segments.filter(s => s.segment_id === parseInt(e.target.value))[0];
                if (!segment) {
                  setSelectedSegment(null);
                } else {
                  setSelectedSegment(segment);
                }
              }}
            >
              <option value="">(Segmento sin especificar)</option>
              {segments.map(s => (
                <option key={`segment_${s.segment_id}`} value={String(s.segment_id)}>
                  {s.code}
                </option>
              ))}
            </select>
          </div>
          <div className="reports__filter">
            <label htmlFor="concept-select" className="form__label">
              Concepto
            </label>
            <select
              className="form__select"
              name="concept"
              id="concept-select"
              disabled={!selectedCompany}
              value={selectedConcept}
              onChange={e => {
                setSelectedConcept(e.target.value);
              }}
            >
              <option value="">(Concepto sin especificar)</option>
              {distinctMovementConcetps.map((movementConcept, index) => (
                <option key={`movement_concept_${index}`} value={String(movementConcept)}>
                  {movementConcept}
                </option>
              ))}
            </select>
          </div>
          <div className="reports__filter">
            <label htmlFor="supplier-select" className="form__label">
              Provedor
            </label>
            <select
              className="form__select"
              name="supplier"
              id="supplier-select"
              disabled={!selectedCompany || loadingSuppliers}
              value={selectedSupplier}
              onChange={e => {
                setSelectedSupplier(e.target.value);
              }}
            >
              <option value="">(Provedor sin especificar)</option>
              {suppliers.map((s, index) => (
                <option key={`supplier_${index}`} value={String(s)}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
        <form noValidate onSubmit={handleOnSubmit}>
          <div className="concepts__new-concept-container">
            <div className="reports__filter">
              <label className="form__label" htmlFor="">
                Nuevo concepto
              </label>
            </div>
            <div className="reports__filter">
              <OptionsToSelect<string>
                name="new-concept-option"
                options={
                  selectedCompany === null
                    ? []
                    : currentConcepts.map(c => {
                        return { label: c.name, value: c.name };
                      })
                }
                selectedOption={newConcept === null ? null : newConcept.name}
                setSelectedOption={option => {
                  setNewConcept(
                    option === null
                      ? null
                      : currentConcepts.filter(cc => cc.name === option.value)[0],
                  );
                }}
                onClickNewItem={() => {
                  setShowAddConceptModal(true);
                }}
              />
            </div>
          </div>
          {supplierCoincidences.length > 1 && (
            <div>
              <p>
                Ha escodigo el provedor: {selectedSupplier}, y aquellos valores que coinciden con
                como comienza son los siguientes:
              </p>
              <ul>
                {supplierCoincidences.map((s, i) => {
                  return <li key={`supplier-coincidences-${i}`}>{s}</li>;
                })}
              </ul>
            </div>
          )}
          <div className="reports__buttons">
            <button className="button" type="submit" disabled={disabledChangeMasive()}>
              Cambiar todos
            </button>
          </div>
        </form>
      </div>
      {!masiveMovementsLoading && masiveMovementsUpdateResponse && (
        <div className="not-found not-found--padding-top">
          <div className="not-found__card">
            <p className="not-found__title">
              {masiveMovementsUpdateResponse.affected > 0
                ? 'Se ha aplicado el cambio masivo a los movimientos'
                : 'Ningun movimiento ha cambiado'}
            </p>
            <p className="not-found__description">{masiveMovementsUpdateResponse.message}</p>
          </div>
        </div>
      )}
      {!!showAddConceptModal && selectedCompany && (
        <Modal
          title="Agregar un concepto nuevo"
          children={
            <CreateConcept
              onCancel={() => {
                setShowAddConceptModal(false);
              }}
              onCreate={() => {
                setShowAddConceptModal(false);
                fetchConcepts(conceptsFilter);
              }}
              company_id={selectedCompany.company_id}
            />
          }
          isOpen={showAddConceptModal}
          onClose={() => {
            setShowAddConceptModal(false);
          }}
        />
      )}
    </section>
  );
};
