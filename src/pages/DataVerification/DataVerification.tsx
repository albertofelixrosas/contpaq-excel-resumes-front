import { useEffect, useState } from 'react';
import '../../styles/tables.css';
import Modal from '../../components/UI/Modal';
import { EditMovementConcept } from '../../components/ModalContents/EditMovementConcept';
import toast from 'react-hot-toast';
import './DataVerification.css';
import Pagination from '../../components/UI/Pagination';
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
import { useMovementsConcetps } from '../../hooks/useMovementsConcepts';
import { useConcepts } from '../../hooks/useConcepts';
import type { Concept } from '../../models/concept.model';
import { FaRegEdit } from 'react-icons/fa';
import { slashAndSpanishMonthDate } from '../../utils/dateUtils';

type CompanyIdFilter = { company_id?: number };

export const DataVerification = () => {
  const { today, lastMonth } = getTodayAndLastMonth();
  const [selectedMovement, setSelectedMovement] = useState<MovementReportDto | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<AccountingAccount | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [movementsFilters, setMovementsFilters] = useState<MovementFilterDto>({
    page: 1,
    limit: 50,
    start_date: lastMonth,
    end_date: today,
  });
  const [showEditConcept, setShowEditConcept] = useState(false);
  // Concepto del modal de cambiar concepto especifico
  const [newConceptModal, setNewConceptModal] = useState<Concept | null>(null);
  const [selectedConcept, setSelectedConcept] = useState('');
  const [segmentsFilter, setSegmentsFilter] = useState<GetSegmentsQueryDto>({});
  const [accountsFilter, setAccountsFilter] = useState<GetAccountingAccountsQueryDto>({});
  const [suppliersFilter, setSuppliersFilter] = useState<CompanyIdFilter>({});
  const [movementsConcetpsFilter, setMovementsConcetpsFilter] = useState<CompanyIdFilter>({});
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'APK' | 'GG'>('ALL');

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
    data: movementConcepts,
    error: movementConceptsError,
    fetch: fetchMovementConcepts,
    loading: loadingMovementConcepts,
  } = useMovementsConcetps();

  const {
    data: currentConcepts,
    fetch: fetchConcepts,
    create: createConcept,
    error: errorConcepts,
    loading: loadingConcepts,
  } = useConcepts();

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
    if (movementConceptsError) {
      toast.error(movementConceptsError);
    }
    if (errorConcepts) {
      toast.error(errorConcepts);
    }
  }, [
    companiesError,
    movementError,
    accountsError,
    segmentsError,
    movementConceptsError,
    errorConcepts,
  ]);

  useEffect(() => {
    if (selectedCompany === null) {
      setSegmentsFilter({});
      setAccountsFilter({});
      setMovementsConcetpsFilter({});
      setSuppliersFilter({});
      setSelectedAccount(null);
      setSelectedSegment(null);
      setSelectedConcept('');
      setSelectedSupplier('');
    } else {
      setSegmentsFilter({ company_id: selectedCompany.company_id });
      setAccountsFilter({ company_id: selectedCompany.company_id });
      setSuppliersFilter({ company_id: selectedCompany.company_id });
      setMovementsConcetpsFilter({ company_id: selectedCompany.company_id });
      fetchConcepts({ company_id: selectedCompany.company_id });
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
    if (movementsConcetpsFilter.company_id) {
      fetchMovementConcepts({ company_id: movementsConcetpsFilter.company_id });
    }
  }, [movementsConcetpsFilter]);

  useEffect(() => {
    if (selectedAccount) {
      setMovementsFilters(prev => ({
        ...prev,
        accounting_account_id: selectedAccount.accounting_account_id,
      }));
    }
  }, [selectedAccount]);

  useEffect(() => {
    if (selectedSegment) {
      setMovementsFilters(prev => {
        const { segment_type, ...rest } = prev;
        return {
          ...rest,
          segment_id: selectedSegment.segment_id,
          segment_type: 'ALL', // aseguras que no se mezclen
        };
      });
      setTypeFilter('ALL'); // sincronizas también el estado del select
    } else {
      // caso "ALL" => limpiar segment_id
      setMovementsFilters(prev => {
        const { segment_id, ...rest } = prev;
        return rest;
      });
    }
  }, [selectedSegment]);

  useEffect(() => {
    if (selectedConcept) {
      setMovementsFilters(prev => ({
        ...prev,
        concept: selectedConcept,
      }));
    }
  }, [selectedConcept]);

  useEffect(() => {
    if (typeFilter === 'APK' || typeFilter === 'GG') {
      setMovementsFilters(prev => {
        const { segment_id, ...rest } = prev;
        return {
          ...rest,
          segment_type: typeFilter,
        };
      });
      setSelectedSegment(null);
    } else if (typeFilter === 'ALL') {
      // ✅ si vuelve a ALL, removemos el filtro
      setMovementsFilters(prev => {
        const { segment_type, ...rest } = prev;
        return rest;
      });
    }
  }, [typeFilter]);

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

  const handleOnEditConcept = async (movement_id: number, newConcept: string) => {
    try {
      console.log({
        movement_id,
        newConcept,
      });
      await updateMovement(movement_id, {
        concept: newConcept,
      });
      setNewConceptModal(null);
      setShowEditConcept(false);
      fetchMovements(movementsFilters);
      toast.success('¡Se ha actualizado el concepto con exito!');
    } catch (error) {
      toast.error(movementError);
    }
  };

  function getTodayAndLastMonth(): { today: string; lastMonth: string } {
    const todayDate = new Date();

    const formatDate = (date: Date): string => date.toJSON().slice(0, 10); // YYYY-MM-DD

    const lastMonthDate = new Date(todayDate);
    lastMonthDate.setMonth(todayDate.getMonth() - 1);

    return {
      today: formatDate(todayDate),
      lastMonth: formatDate(lastMonthDate),
    };
  }

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

  const convertMovementDateToFinalValue = (date: string) => {
    const dateString = date.slice(0, 10);
    const [year, month, day] = dateString.split('-');
    const dateValue = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return slashAndSpanishMonthDate(dateValue);
  };

  const removeMovementSegmentStartIndex = (segmentCode: string) => {
    return segmentCode
      .split(' ')
      .filter((_, i) => i > 0)
      .join('');
  };

  const generateMovementsToClipboardText = async () => {
    if (movements) {
      const movementsRows = movements.data.map(m => {
        const { date, number, supplier, concept, charge, segment_code } = m;
        const formatedDate = convertMovementDateToFinalValue(date);

        const finalCharge =
          charge === null ? '' : !charge ? '' : parseFloat(charge).toLocaleString('en-US');

        const isGGTypeFilterSelected = typeFilter === 'GG';

        if (isGGTypeFilterSelected) {
          const values = [formatedDate, '', number ? number : '', supplier, concept, finalCharge];
          return values.join('\t');
        }

        const finalSegment = segment_code
          .split(' ')
          .filter((_, i) => i > 0)
          .join('');

        const values = [
          formatedDate,
          '',
          number ? number : '',
          supplier,
          concept,
          finalSegment,
          finalCharge,
        ];

        return values.join('\t');
      });

      const result = movementsRows.join('\n');

      try {
        await navigator.clipboard.writeText(result);
        toast.success('¡Se han copiado los movimientos con exito!');
      } catch (error) {
        toast.success(
          error instanceof Error ? error.message : 'No se logro copiar los movimientos...',
        );
      }
    }
  };

  // Cargar por defecto la primera empresa de la lista
  useEffect(() => {
    if (companies.length > 0) {
      setSelectedCompany(companies[0]);
      setMovementsFilters({
        ...movementsFilters,
        company_id: companies[0].company_id,
      });
    }
  }, [companies]);

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
              {companies
                .sort((a, b) => a.company_name.localeCompare(b.company_name))
                .map(c => (
                  <option key={`company_${c.company_id}`} value={String(c.company_id)}>
                    {c.company_name}
                  </option>
                ))}
            </select>
          </div>
          <div className="data-verification__filter">
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
              {accounts
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(a => (
                  <option
                    key={`account_${a.accounting_account_id}`}
                    value={String(a.accounting_account_id)}
                  >
                    {a.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="data-verification__filter">
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
                const id = parseInt(e.target.value);
                const segment = segments.find(s => s.segment_id === id) || null;
                setSelectedSegment(segment); // ✅ solo actualizas el estado base
              }}
            >
              <option value="">(Segmento sin especificar)</option>
              {segments
                .map(v => {
                  return {
                    ...v,
                    code: v.code
                      .split(' ')
                      .filter((_, i) => i > 0)
                      .join(''),
                  };
                })
                .sort((a, b) => a.code.localeCompare(b.code))
                .map(s => (
                  <option key={`segment_${s.segment_id}`} value={String(s.segment_id)}>
                    {s.code}
                  </option>
                ))}
            </select>
          </div>
          <div className="data-verification__filter">
            <label htmlFor="concept-select" className="form__label">
              Concepto
            </label>
            <select
              className="form__select"
              name="concept"
              id="concept-select"
              disabled={!selectedCompany && !loadingMovementConcepts}
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
              {movementConcepts
                .sort((a, b) => a.localeCompare(b))
                .map((c, index) => (
                  <option key={`concept_${c}-${index}`} value={String(c)}>
                    {c}
                  </option>
                ))}
            </select>
          </div>
          <div className="data-verification__filter">
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
              {suppliers
                .sort((a, b) => a.localeCompare(b))
                .map((s, index) => (
                  <option key={`supplier_${index}`} value={String(s)}>
                    {s}
                  </option>
                ))}
            </select>
          </div>
          <div className="data-verification__dates">
            <div className="data-verification__filter">
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
            <div className="data-verification__filter">
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
          <div className="data-verification__filter">
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
              <option value="30">30</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="300">300</option>
            </select>
          </div>
        </div>
        <div className="data-verification__type-filter-container">
          <div className="data-verification__filter data-verification__type-filter">
            <label htmlFor="type-filter" className="form__label">
              Tipo <strong>*</strong>
            </label>
            <select
              className="form__select"
              name="type-filter"
              id="type-filter"
              value={typeFilter}
              onChange={e => {
                setTypeFilter(e.target.value as 'ALL' | 'APK' | 'GG');
              }}
            >
              <option value="ALL">(Sin especificar)</option>
              <option value="APK">Aparceria (APK)</option>
              <option value="GG">Gastos Generales (GG)</option>
            </select>
          </div>
        </div>
        <div className="data-verification__buttons">
          <button className="button" type="submit" disabled={!movementsFiltersAreValid()}>
            Filtrar
          </button>
          {movements && (
            <button
              className="button button--ghost"
              type="submit"
              disabled={movements.data.length === 0}
              onClick={generateMovementsToClipboardText}
            >
              Copiar
            </button>
          )}
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

      {!loadingMovements && (movements?.data.length || 0) > 0 && selectedCompany && (
        <>
          <div className="table-container">
            <table className="table table--venues">
              <thead className="table__head">
                <tr className="table__row--head">
                  <th className="table__cell table__cell--head">Fecha</th>
                  <th className="table__cell table__cell--head">Egreso</th>
                  <th className="table__cell table__cell--head">Numero</th>
                  {/* FOLIO */}
                  <th className="table__cell table__cell--head">Proveedor</th>
                  {/* DESCRIPCION */}
                  <th className="table__cell table__cell--head">Concepto</th>
                  {typeFilter !== 'GG' && <th className="table__cell table__cell--head">Tipo</th>}
                  <th className="table__cell table__cell--head">Cargo</th>
                  {/* IMPORTE */}
                  <th className="table__cell table__cell--head">Acciones</th>
                </tr>
              </thead>
              <tbody className="table__body">
                {movements?.data.map(movement => {
                  const { movement_id, date, number, supplier, concept, charge, segment_code } =
                    movement;
                  const formatedDate = convertMovementDateToFinalValue(date);
                  const correctSegmentCode = removeMovementSegmentStartIndex(segment_code);

                  return (
                    <tr className="table__row" key={movement_id}>
                      <td style={{ textWrap: 'nowrap' }} className="table__cell">
                        {formatedDate}
                      </td>
                      <td>{''}</td>
                      <td className="table__cell">
                        {!number ? '' : number.toLocaleString('en-US')}
                      </td>
                      <td className="table__cell">{supplier}</td>
                      <td className="table__cell">{concept}</td>
                      {typeFilter !== 'GG' && <td className="table__cell">{correctSegmentCode}</td>}
                      <td className="table__cell">
                        {charge === null
                          ? ''
                          : !charge
                            ? ''
                            : parseFloat(charge).toLocaleString('en-US')}
                      </td>
                      <td className="table__cell">
                        <button
                          className="table__button--orange"
                          type="button"
                          onClick={() => {
                            setShowEditConcept(true);
                            setSelectedMovement(movement);
                          }}
                        >
                          <FaRegEdit color="white" size={20} />
                        </button>
                      </td>
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
              newConcept={newConceptModal}
              setNewConcept={setNewConceptModal}
              currentConcepts={currentConcepts}
              companyId={selectedCompany?.company_id || 0}
              createNewConcept={async (company_id, newConceptToAdd) => {
                await createConcept({ company_id, name: newConceptToAdd });
                fetchConcepts({ company_id });
              }}
              loadingConcepts={loadingConcepts}
              selectedMovementId={selectedMovement.movement_id}
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
