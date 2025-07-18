import { useEffect, useState } from 'react';
import '../../styles/tables.css';
import Modal from '../../components/UI/Modal';
import { EditMovementConcept } from '../../components/ModalContents/EditMovementConcept';
import toast from 'react-hot-toast';
import './Reports.css';
import Pagination from '../../components/UI/Pagination';
import { DEFAULT_CONCEPTS } from '../../enums/Concepts';
import { useMovements } from '../../hooks/useMovements';
import { useCompanies } from '../../hooks/useCompanies';
import { useAccountingAccounts } from '../../hooks/useAccountingAccounts';
import { useSegments } from '../../hooks/useSegments';
import type { MovementFilterDto, MovementReportDto } from '../../models/movement.model';
import type { GetSegmentsQueryDto, Segment } from '../../models/segment.model';
import type { Company } from '../../models/company.model';
import type {
  AccountingAccount,
  GetAccountingAccountsQueryDto,
} from '../../models/accounting-account.model';
import { useMovementsSuppliers } from '../../hooks/useMovementsSuppliers';

export const Reports = () => {
  const [selectedMovement, setSelectedMovement] = useState<MovementReportDto | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<AccountingAccount | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [movementsFilters, setMovementsFilters] = useState<MovementFilterDto>({
    page: 1,
    limit: 20,
    start_date: '',
    end_date: '',
    company_id: 0,
  });
  const [showEditConcept, setShowEditConcept] = useState(false);
  const [newConcept, setNewConcept] = useState('');
  const [selectedConcept, setSelectedConcept] = useState('');
  const [segmentsFilter, setSegmentsFilter] = useState<GetSegmentsQueryDto>({
    company_id: selectedCompany?.company_id || 0,
  });
  const [accountsFilter, setAccountsFilter] = useState<GetAccountingAccountsQueryDto>({
    company_id: selectedCompany?.company_id || 0,
  });
  const [suppliersFilter, setSuppliersFilter] = useState<{ company_id: number }>({
    company_id: selectedCompany?.company_id || 0,
  });

  const {
    loading: loadingMovements,
    fetch: fetchMovements,
    update: updateMovement,
    data: movements,
    error: movementError,
  } = useMovements(movementsFilters);

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
  } = useAccountingAccounts(accountsFilter);

  const {
    loading: loadingSegments,
    fetch: fetchSegments,
    error: segmentsError,
    data: segments,
  } = useSegments(segmentsFilter);

  const {
    data: suppliers,
    error: suppliersError,
    loading: loadingSuppliers,
    fetch: fetchSuppliers,
  } = useMovementsSuppliers(suppliersFilter);

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (companiesError) {
      toast.error(companiesError);
    }
    if (movementError) {
      toast.error(movementError);
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
  }, [companiesError, movementError, accountsError, segmentsError]);

  useEffect(() => {
    if (selectedCompany === null) {
      setSegmentsFilter({});
      setAccountsFilter({});
      setSuppliersFilter({ company_id: 0 });
    } else {
      setSegmentsFilter({ company_id: selectedCompany.company_id });
      setAccountsFilter({ company_id: selectedCompany.company_id });
      setSuppliersFilter({ company_id: selectedCompany.company_id });
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
      fetchSuppliers(suppliersFilter);
    }
  }, [suppliersFilter]);

  useEffect(() => {
    if (selectedAccount) {
      setMovementsFilters({
        ...movementsFilters,
        accounting_account_id: selectedAccount.accounting_account_id,
      });
    }
    if (selectedSegment) {
      setMovementsFilters({
        ...movementsFilters,
        segment_id: selectedSegment.segment_id,
      });
    }
    if (selectedConcept) {
      setMovementsFilters({
        ...movementsFilters,
        concept: selectedConcept,
      });
    }
  }, [selectedAccount, selectedSegment, selectedConcept]);

  useEffect(() => {
    if (!!movementsFilters.start_date && !!movementsFilters.end_date) {
      fetchMovements(movementsFilters);
    }
  }, [movementsFilters.page]);

  const handleOnFilterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedCompany) {
      toast.error('Debe seleccionar una empresa');
      return;
    }

    if (!movementsFilters.start_date) {
      toast.error('Debe ingresar una fecha de inicio');
      return;
    }
    if (!movementsFilters.end_date) {
      toast.error('Debe ingresar una fecha final');
      return;
    }

    console.log({ movementsFilters });

    fetchMovements(movementsFilters);
  };

  const handleOnEditConcept = () => {
    updateMovement(selectedMovement?.movement_id || 0, {
      concept: newConcept,
    });
    setShowEditConcept(false);
    toast.success('¡Se ha actualizado el concepto con exito!');
  };

  const movementsFiltersAreValid = (): boolean => {
    const { start_date, end_date } = movementsFilters;
    if (start_date === '') {
      return false;
    }
    if (end_date === '') {
      return false;
    }
    if (!selectedCompany) {
      return false;
    }
    return true;
  };

  return (
    <section className="page">
      <header className="page__header">
        <h2 className="page__title">Verifique sus datos</h2>
        <p className="page__subtitle">Vista para ver todos los datos de CONTPAQi</p>
      </header>

      <hr className="page__separator" />
      <div className="page__header-section">
        <h3 className="page__title--gray">Reporte de datos generales</h3>
      </div>
      <p>Si lo que desea es cambiar el concepto de algun movimiento de clic sobre el registro</p>
      <form noValidate onSubmit={handleOnFilterSubmit}>
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
                  const { company_id, ...rest } = movementsFilters;
                  setMovementsFilters({
                    ...rest,
                    company_id: 0,
                  });
                } else {
                  setSelectedCompany(company);
                  setMovementsFilters({
                    ...movementsFilters,
                    company_id: company.company_id,
                  });
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
                  const { accounting_account_id, ...rest } = movementsFilters;
                  setMovementsFilters({
                    ...rest,
                  });
                } else {
                  setSelectedAccount(account);
                  setMovementsFilters({
                    ...movementsFilters,
                    accounting_account_id: account.accounting_account_id,
                  });
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
                  const { segment_id, ...rest } = movementsFilters;
                  setMovementsFilters({
                    ...rest,
                  });
                } else {
                  setSelectedSegment(segment);
                  setMovementsFilters({
                    ...movementsFilters,
                    segment_id: segment.segment_id,
                  });
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
                if (e.target.value === '') {
                  const { concept, ...rest } = movementsFilters;
                  setMovementsFilters({
                    ...rest,
                  });
                } else {
                  setMovementsFilters({
                    ...movementsFilters,
                    concept: e.target.value,
                  });
                }
              }}
            >
              <option value="">(Concepto sin especificar)</option>
              {DEFAULT_CONCEPTS.map((c, index) => (
                <option key={`concept_${c}-${index}`} value={String(c)}>
                  {c}
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
              disabled={!selectedCompany}
              value={selectedSupplier}
              onChange={e => {
                setSelectedSupplier(e.target.value);
                if (e.target.value === '') {
                  const { supplier, ...rest } = movementsFilters;
                  setMovementsFilters({
                    ...rest,
                  });
                } else {
                  setMovementsFilters({
                    ...movementsFilters,
                    supplier: e.target.value,
                  });
                }
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
          <div className="reports__dates">
            <div className="reports__filter">
              <label htmlFor="start_date_input" className="form__label">
                Fecha de inicio <strong>*</strong>
              </label>
              <input
                className="form__input"
                type="date"
                name="start_date"
                id="start_date_input"
                value={`${movementsFilters.start_date}`}
                onChange={e => {
                  setMovementsFilters({
                    ...movementsFilters,
                    start_date: e.target.value,
                  });
                }}
              />
            </div>
            <div className="reports__filter">
              <label htmlFor="" className="form__label">
                Fecha final <strong>*</strong>
              </label>
              <input
                className="form__input"
                type="date"
                name="end_date"
                id="end_date_input"
                value={`${movementsFilters.end_date}`}
                onChange={e => {
                  setMovementsFilters({
                    ...movementsFilters,
                    end_date: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className="reports__filter">
            <label htmlFor="">
              Registros por pagina <strong>*</strong>{' '}
            </label>
            <select
              className="form__select"
              name="limit"
              id="offset"
              value={`${movementsFilters.limit}`}
              onChange={e => {
                setMovementsFilters({
                  ...movementsFilters,
                  limit: parseInt(e.target.value),
                });
              }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </div>
        </div>
        <div className="reports__buttons">
          <button className="button" type="submit" disabled={!movementsFiltersAreValid()}>
            Filtrar
          </button>
        </div>
      </form>

      {companies.length === 0 && loadingMovements === false && (
        <div className="not-found not-found--padding-top">
          <div className="not-found__card">
            <p className="not-found__title">No hay datos registrados</p>
            <p className="not-found__description">
              Ingrese un excel para generar los datos necesarios para usar esta sección.
            </p>
          </div>
        </div>
      )}

      {!loadingMovements && movements?.data.length === 0 && (
        <div className="not-found not-found--padding-top">
          <div className="not-found__card">
            <p className="not-found__title">No hay datos segun estos parametros</p>
            <p className="not-found__description">
              Cambie los parametros de busqueda para intentar con otra información.
            </p>
          </div>
        </div>
      )}

      {!loadingMovements && (movements?.data.length || 0) > 0 && (
        <>
          <div className="table-container">
            <table className="table table--venues">
              <thead className="table__head">
                <tr className="table__row--head">
                  <th className="table__cell table__cell--head">Empresa</th>
                  <th className="table__cell table__cell--head">N° C. Contable</th>
                  <th className="table__cell table__cell--head">Cuenta contable</th>
                  <th className="table__cell table__cell--head">Segmento</th>
                  <th className="table__cell table__cell--head">Fecha</th>
                  <th className="table__cell table__cell--head">Numero</th>
                  <th className="table__cell table__cell--head">Proveedor</th>
                  <th className="table__cell table__cell--head">Concepto</th>
                  <th className="table__cell table__cell--head">Referencia</th>
                  <th className="table__cell table__cell--head">Cargo</th>
                </tr>
              </thead>
              <tbody className="table__body">
                {movements?.data.map(movement => {
                  const {
                    movement_id,
                    company_name,
                    acount_code,
                    account_name,
                    segment_code,
                    date,
                    number,
                    supplier,
                    concept,
                    reference,
                    charge,
                  } = movement;

                  return (
                    <tr
                      className="table__row"
                      key={movement_id}
                      onClick={() => {
                        setShowEditConcept(true);
                        setSelectedMovement(movement);
                      }}
                    >
                      <td className="table__cell">{company_name}</td>
                      <td style={{ textWrap: 'nowrap' }} className="table__cell">
                        {acount_code.slice(0, 11)}
                      </td>
                      <td className="table__cell">{account_name}</td>
                      <td className="table__cell">{segment_code}</td>
                      <td style={{ textWrap: 'nowrap' }} className="table__cell">
                        {date.slice(0, 10)}
                      </td>
                      <td className="table__cell">{number}</td>
                      <td className="table__cell">{supplier}</td>
                      <td className="table__cell">{concept}</td>
                      <td className="table__cell">{reference}</td>
                      <td className="table__cell">{isNaN(charge) ? '' : charge}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {!!movements && (
            <Pagination
              page={movementsFilters.page}
              lastPage={movements.pages}
              total={movements.total}
              onPageChange={page => {
                setMovementsFilters({
                  ...movementsFilters,
                  page,
                });
              }}
            />
          )}
        </>
      )}
      {!!selectedMovement && (
        <Modal
          title="¿Seguro que desea cambiar el concepto?"
          children={
            <EditMovementConcept
              date={selectedMovement.date}
              previusConcept={selectedMovement.concept}
              supplier={selectedMovement.supplier}
              onEdit={handleOnEditConcept}
              onCancel={() => {
                setShowEditConcept(false);
              }}
              newConcept={newConcept}
              setNewConcept={setNewConcept}
            />
          }
          isOpen={showEditConcept}
          onClose={() => {
            setShowEditConcept(false);
          }}
        />
      )}
    </section>
  );
};
