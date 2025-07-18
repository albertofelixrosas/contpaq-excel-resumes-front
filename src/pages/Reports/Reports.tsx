import { useEffect, useState } from 'react';
import type { MovementFilters, OptionRecord } from '../../types/reports';
import '../../styles/tables.css';
import Modal from '../../components/UI/Modal';
import { EditMovementConcept } from '../../components/ModalContents/EditMovementConcept';
import toast from 'react-hot-toast';
import './Reports.css';
import { getResource } from '../../services/api';
import type { Movement, PaginatedMovements } from '../../types/api-responses';
import Pagination from '../../components/UI/Pagination';

export const Reports = () => {
  const [companies, setCompanies] = useState<OptionRecord[]>([]);
  const [accounts, setAccounts] = useState<OptionRecord[]>([]);
  const [segments, setSegments] = useState<OptionRecord[]>([]);
  const [selectedMovement, setSelectedMovement] = useState<Movement | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<OptionRecord | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<OptionRecord | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<OptionRecord | null>(null);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [pagination, setPagination] = useState<Omit<PaginatedMovements, 'data'> | null>(null);
  const [movementsFilters, setMovementsFilters] = useState<MovementFilters>({
    page: 1,
    limit: 20,
    start_date: '',
    end_date: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [showEditConcept, setShowEditConcept] = useState(false);
  const [newConcept, setNewConcept] = useState('');

  useEffect(() => {
    setLoading(true);
    getResource('companies')
      .then(companies => {
        setCompanies(
          companies.map(c => {
            return { id: c.company_id, name: c.company_name };
          }),
        );
        setLoading(false);
      })
      .catch(error => toast.error(error));
  }, []);

  useEffect(() => {
    if (selectedCompany === null) {
      setSegments([]);
      setAccounts([]);
    } else {
      if (accounts.length === 0 || segments.length === 0) {
        setLoading(true);
        Promise.all([
          getResource('accounting-accounts', { company_id: selectedCompany.id }),
          getResource('segments', { company_id: selectedCompany.id }),
        ])
          .then(([accounts, segments]) => {
            setAccounts(
              accounts.map(a => {
                return {
                  id: a.accounting_account_id,
                  name: a.name,
                };
              }),
            );
            setSegments(
              segments.map(s => {
                return {
                  id: s.segment_id,
                  name: s.code,
                };
              }),
            );
          })
          .catch(error => {
            toast.error(error);
          })
          .finally(() => setLoading(false));
      }
    }
  }, [selectedCompany]);

  useEffect(() => {
    if (!!movementsFilters.start_date && !!movementsFilters.end_date) {
      regreshMovements();
    }
  }, [movementsFilters.page]);

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!movementsFilters.start_date) {
      toast.error('Debe ingresar una fecha de inicio');
      return;
    }
    if (!movementsFilters.end_date) {
      toast.error('Debe ingresar una fecha final');
      return;
    }

    regreshMovements();
  };

  const regreshMovements = async () => {
    try {
      setLoading(true);
      const response = await getResource('movements', movementsFilters);
      setPagination({
        ...response,
      });
      setMovements(response.data);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
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
      <form noValidate onSubmit={handleOnSubmit}>
        <div className="reports__filters">
          <div className="reports__filter">
            <label htmlFor="companies-select" className="form__label">
              Empresa <strong>*</strong>
            </label>
            <select
              className="form__select"
              name="company"
              id="companies-select"
              value={`${!selectedCompany ? '' : selectedCompany.id}`}
              onChange={e => {
                const company = companies.filter(c => c.id === parseInt(e.target.value))[0];
                if (!company) {
                  setSelectedCompany(null);
                } else {
                  setSelectedCompany(company);
                  setMovementsFilters({
                    ...movementsFilters,
                    company_id: company.id,
                  });
                }
              }}
            >
              <option value="">(Empresa sin especificar)</option>
              {companies.map(c => (
                <option key={c.id} value={String(c.id)}>
                  {c.name}
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
              disabled={!selectedCompany}
              value={`${!selectedAccount ? '' : selectedAccount.id}`}
              onChange={e => {
                const account = accounts.filter(a => a.id === parseInt(e.target.value))[0];
                if (!account) {
                  setSelectedAccount(null);
                } else {
                  setSelectedAccount(account);
                  setMovementsFilters({
                    ...movementsFilters,
                    accounting_account_id: account.id,
                  });
                }
              }}
            >
              <option value="">(Cuenta contable sin especificar)</option>
              {accounts.map(a => (
                <option key={a.id} value={String(a.id)}>
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
              disabled={!selectedCompany}
              value={`${!selectedSegment ? '' : selectedSegment.id}`}
              onChange={e => {
                const segment = segments.filter(s => s.id === parseInt(e.target.value))[0];
                if (!segment) {
                  setSelectedSegment(null);
                } else {
                  setSelectedSegment(segment);
                  setMovementsFilters({
                    ...movementsFilters,
                    segment_id: segment.id,
                  });
                }
              }}
            >
              <option value="">(Segmento sin especificar)</option>
              {segments.map(s => (
                <option key={s.id} value={String(s.id)}>
                  {s.name}
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
          <button className="button" type="submit">
            Filtrar
          </button>
        </div>
      </form>

      {companies.length === 0 && loading === false && (
        <div className="not-found not-found--padding-top">
          <div className="not-found__card">
            <p className="not-found__title">No hay datos registrados</p>
            <p className="not-found__description">
              Ingrese un excel para generar los datos necesarios para usar esta sección.
            </p>
          </div>
        </div>
      )}

      {movements.length === 0 && loading === false && (
        <div className="not-found not-found--padding-top">
          <div className="not-found__card">
            <p className="not-found__title">No hay datos segun estos parametros</p>
            <p className="not-found__description">
              Cambie los parametros de busqueda para intentar con otra información.
            </p>
          </div>
        </div>
      )}

      {movements.length > 0 && loading === false && (
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
                  <th className="table__cell table__cell--head">Concepto</th>
                  <th className="table__cell table__cell--head">Referencia</th>
                  <th className="table__cell table__cell--head">Cargo</th>
                </tr>
              </thead>
              <tbody className="table__body">
                {movements.map(movement => {
                  const {
                    movement_id,
                    company_name,
                    acount_code,
                    account_name,
                    segment_code,
                    date,
                    number,
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
                      <td className="table__cell">{concept}</td>
                      <td className="table__cell">{reference}</td>
                      <td className="table__cell">{isNaN(charge) ? '' : charge}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {!!pagination && (
            <Pagination
              page={movementsFilters.page}
              lastPage={pagination?.pages}
              total={pagination.total}
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
              previusConcept={selectedMovement.concept}
              onEdit={() => {
                // TODO actualizar concepto
                toast.success('¡Se ha actualizado el concepto con exito!');
                setShowEditConcept(false);
              }}
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
            // setSelectedVenueId(null);
          }}
        />
      )}
    </section>
  );
};
