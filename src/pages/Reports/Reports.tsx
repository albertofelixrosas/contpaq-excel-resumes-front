import { useEffect, useState } from 'react';
import { formatNumberToMoney } from '../../utils/formatStringsUtils';
import './Reports.css';
import { useCompanies } from '../../hooks/useCompanies';
import type { Company } from '../../models/company.model';
import toast from 'react-hot-toast';
import { useMovementYearResume } from '../../hooks/useMovementYearResume';
import { useMovementsYearConceptsResumeBySegments } from '../../hooks/useMovementYearResumeBySegments';

interface ReportFiltersDto {
  company_id?: number;
  year: number;
}

const getCurrentYear = () => new Date().getFullYear();

export const Reports = () => {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [reportFilters, setReportFilters] = useState<ReportFiltersDto>({
    year: getCurrentYear(),
  });
  const [showEmtpyComponent, setShowEmptyComponent] = useState(false);

  const {
    loading: loadingCompanies,
    data: companies,
    fetch: fetchCompanies,
    error: companiesError,
  } = useCompanies();

  const {
    data: reportData,
    error: reportError,
    loading: loadingReport,
    fetch: fetchReport,
  } = useMovementYearResume();

  const {
    loading: loadingReportBySegments,
    data: reportDataBySegments,
    error: reportErrorBySegments,
    fetch: fetchReportBySegments,
  } = useMovementsYearConceptsResumeBySegments();

  useEffect(() => {
    if (companiesError) {
      toast.error(companiesError);
    }
    if (reportError) {
      toast.error(reportError);
    }
    if (reportErrorBySegments) {
      toast.error(reportErrorBySegments);
    }
  }, [companiesError, reportError, reportErrorBySegments]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const areValidValuesForFilters = (): boolean => {
    const { company_id, year } = reportFilters;
    return !!company_id && !!year;
  };

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    Promise.all([fetchReport(reportFilters), fetchReportBySegments(reportFilters)]).then(() => {
      setShowEmptyComponent(true);
    });
  };

  // Cargar por defecto la primera empresa de la lista
  useEffect(() => {
    setSelectedCompany(companies[0]);
    if (companies.length > 0) {
      setReportFilters({
        company_id: companies[0].company_id,
        ...reportFilters,
      });
    }
  }, [companies]);

  const isValidPrint = () => {
    return reportData !== null;
  };

  return (
    <section className="page">
      <header className="page__header app--hidden-in-print">
        <h2 className="page__title">Reportes</h2>
        <p className="page__subtitle">Decida los reportes que necesite de sus datos de CONTPAQi</p>
      </header>

      <hr className="page__separator app--hidden-in-print" />
      <div className="reports__form-container app--hidden-in-print">
        <form className="reports__form" noValidate onSubmit={onSubmitHandler}>
          <div className="reports__form-inputs">
            <div className="reports__form-filter">
              <label className="form__label" htmlFor="company">
                Empresa
              </label>
              <select
                className="form__select"
                name="company"
                id="company"
                disabled={loadingCompanies}
                value={!selectedCompany ? '' : `${selectedCompany.company_id}`}
                onChange={e => {
                  const company = companies.filter(
                    c => c.company_id === parseInt(e.target.value),
                  )[0];
                  if (!company) {
                    setSelectedCompany(null);
                    const { company_id, ...rest } = reportFilters;
                    setReportFilters({
                      ...rest,
                    });
                    setShowEmptyComponent(false);
                  } else {
                    setSelectedCompany(company);
                    const { company_id, ...rest } = reportFilters;
                    setReportFilters({
                      ...rest,
                      company_id: company.company_id,
                    });
                  }
                }}
              >
                <option value="">(Empresa sin especificar)</option>
                {companies.map(c => (
                  <option key={`company_${c.company_id}`} value={String(c.company_id)}>
                    {c.company_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="reports__form-filter">
              <label className="form__label" htmlFor="year">
                Año
              </label>
              <input
                className="form__input"
                type="number"
                name="year"
                id="year"
                min={1970}
                max={getCurrentYear()}
                value={reportFilters.year}
                onChange={e => {
                  const { year, ...rest } = reportFilters;
                  setReportFilters({
                    ...rest,
                    year: parseInt(e.target.value),
                  });
                }}
              />
            </div>
          </div>
          <div className="reports__form-buttons">
            <button
              className="button app--hidden-in-print"
              type="submit"
              disabled={!areValidValuesForFilters()}
            >
              Generar reporte
            </button>
            <button
              className="button button--ghost app--hidden-in-print"
              type="button"
              onClick={() => window.print()}
              disabled={!isValidPrint() || selectedCompany === null}
            >
              Imprimir
            </button>
          </div>
        </form>
      </div>

      {selectedCompany && reportData && (
        <div className="reports__loading app--print-only">
          <h2 className="page__title">{selectedCompany.company_name}</h2>
          <p className="page__subtitle">Reporte de gastos generales del año {reportFilters.year}</p>
        </div>
      )}

      {reportData && reportData.data.length === 1 && selectedCompany && showEmtpyComponent && (
        <div
          style={{
            paddingTop: '16px',
          }}
          className="not-found"
        >
          <div className="not-found__card">
            <p className="not-found__title">No hay datos registrados</p>
            <p className="not-found__description">
              Para la empresa "{selectedCompany?.company_name}" no hay datos el año{' '}
              {reportFilters.year}.
            </p>
          </div>
        </div>
      )}

      {reportData && !loadingReport && (
        <div className="reports__resumes">
          {reportData.data.length > 1 && (
            <div className="table-container">
              <h2 style={{ paddingBottom: '8px' }}>Reporte de gastos generales</h2>
              <table className="table">
                <thead className="table__head">
                  <tr className="table__row--head">
                    <th className="table__th--concept">Concepto</th>
                    {reportData.months.map(m => {
                      return (
                        <th key={m.key} className="table__cell table__cell--head">
                          {m.label}
                        </th>
                      );
                    })}
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody className="table__body">
                  {reportData.data
                    .filter((_, index) => index < reportData.data.length - 1)
                    .map((row, index) => {
                      return (
                        <tr className="table__row" key={`report-resume-header-row-${index}`}>
                          <td className="table__cell">{row.concept}</td>
                          <td className="table__cell">
                            {row.ene === 0 ? '' : formatNumberToMoney(row.ene)}
                          </td>
                          <td className="table__cell">
                            {row.feb === 0 ? '' : formatNumberToMoney(row.feb)}
                          </td>
                          <td className="table__cell">
                            {row.mar === 0 ? '' : formatNumberToMoney(row.mar)}
                          </td>
                          <td className="table__cell">
                            {row.abr === 0 ? '' : formatNumberToMoney(row.abr)}
                          </td>
                          <td className="table__cell">
                            {row.may === 0 ? '' : formatNumberToMoney(row.may)}
                          </td>
                          <td className="table__cell">
                            {row.jun === 0 ? '' : formatNumberToMoney(row.jun)}
                          </td>
                          <td className="table__cell">
                            {row.jul === 0 ? '' : formatNumberToMoney(row.jul)}
                          </td>
                          <td className="table__cell">
                            {row.ago === 0 ? '' : formatNumberToMoney(row.ago)}
                          </td>
                          <td className="table__cell">
                            {row.sep === 0 ? '' : formatNumberToMoney(row.sep)}
                          </td>
                          <td className="table__cell">
                            {row.oct === 0 ? '' : formatNumberToMoney(row.oct)}
                          </td>
                          <td className="table__cell">
                            {row.nov === 0 ? '' : formatNumberToMoney(row.nov)}
                          </td>
                          <td className="table__cell">
                            {row.dic === 0 ? '' : formatNumberToMoney(row.dic)}
                          </td>
                          <td className="table__cell">
                            {row.total_general === 0 ? '' : formatNumberToMoney(row.total_general)}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
                <tfoot>
                  {reportData.data
                    .filter((_, index) => index === reportData.data.length - 1)
                    .map((row, index) => {
                      return (
                        <tr
                          style={{
                            backgroundColor: '#006db6',
                            color: 'white',
                          }}
                          key={`report-resume-row-${index}`}
                        >
                          <td className="table__cell">{row.concept}</td>
                          <td className="table__cell">
                            {row.ene === 0 ? '' : formatNumberToMoney(row.ene)}
                          </td>
                          <td className="table__cell">
                            {row.feb === 0 ? '' : formatNumberToMoney(row.feb)}
                          </td>
                          <td className="table__cell">
                            {row.mar === 0 ? '' : formatNumberToMoney(row.mar)}
                          </td>
                          <td className="table__cell">
                            {row.abr === 0 ? '' : formatNumberToMoney(row.abr)}
                          </td>
                          <td className="table__cell">
                            {row.may === 0 ? '' : formatNumberToMoney(row.may)}
                          </td>
                          <td className="table__cell">
                            {row.jun === 0 ? '' : formatNumberToMoney(row.jun)}
                          </td>
                          <td className="table__cell">
                            {row.jul === 0 ? '' : formatNumberToMoney(row.jul)}
                          </td>
                          <td className="table__cell">
                            {row.ago === 0 ? '' : formatNumberToMoney(row.ago)}
                          </td>
                          <td className="table__cell">
                            {row.sep === 0 ? '' : formatNumberToMoney(row.sep)}
                          </td>
                          <td className="table__cell">
                            {row.oct === 0 ? '' : formatNumberToMoney(row.oct)}
                          </td>
                          <td className="table__cell">
                            {row.nov === 0 ? '' : formatNumberToMoney(row.nov)}
                          </td>
                          <td className="table__cell">
                            {row.dic === 0 ? '' : formatNumberToMoney(row.dic)}
                          </td>
                          <td className="table__cell">
                            {row.total_general === 0 ? '' : formatNumberToMoney(row.total_general)}
                          </td>
                        </tr>
                      );
                    })}
                </tfoot>
              </table>
            </div>
          )}
        </div>
      )}
      {reportDataBySegments &&
        !loadingReportBySegments &&
        reportDataBySegments.map(segmentData => {
          return (
            <div className="reports__resumes" key={`report-segment-${segmentData.segment_id}`}>
              {segmentData.data.length > 1 && (
                <div className="table-container" key={`report-segment-${segmentData.segment_id}`}>
                  <h2 style={{ paddingBottom: '8px' }}>{segmentData.segment_code}</h2>
                  <table className="table">
                    <thead className="table__head">
                      <tr className="table__row--head">
                        <th className="table__th--concept">Concepto</th>
                        {segmentData.months.map(m => {
                          return (
                            <th
                              key={`segment-resume${m.key}`}
                              className="table__cell table__cell--head"
                            >
                              {m.label}
                            </th>
                          );
                        })}
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody className="table__body">
                      {segmentData.data
                        .filter((_, index) => index < segmentData.data.length - 1)
                        .map((row, index) => {
                          return (
                            <tr className="table__row" key={`report-resume-header-row-${index}`}>
                              <td className="table__cell">{row.concept}</td>
                              <td className="table__cell">
                                {row.ene === 0 ? '' : formatNumberToMoney(row.ene)}
                              </td>
                              <td className="table__cell">
                                {row.feb === 0 ? '' : formatNumberToMoney(row.feb)}
                              </td>
                              <td className="table__cell">
                                {row.mar === 0 ? '' : formatNumberToMoney(row.mar)}
                              </td>
                              <td className="table__cell">
                                {row.abr === 0 ? '' : formatNumberToMoney(row.abr)}
                              </td>
                              <td className="table__cell">
                                {row.may === 0 ? '' : formatNumberToMoney(row.may)}
                              </td>
                              <td className="table__cell">
                                {row.jun === 0 ? '' : formatNumberToMoney(row.jun)}
                              </td>
                              <td className="table__cell">
                                {row.jul === 0 ? '' : formatNumberToMoney(row.jul)}
                              </td>
                              <td className="table__cell">
                                {row.ago === 0 ? '' : formatNumberToMoney(row.ago)}
                              </td>
                              <td className="table__cell">
                                {row.sep === 0 ? '' : formatNumberToMoney(row.sep)}
                              </td>
                              <td className="table__cell">
                                {row.oct === 0 ? '' : formatNumberToMoney(row.oct)}
                              </td>
                              <td className="table__cell">
                                {row.nov === 0 ? '' : formatNumberToMoney(row.nov)}
                              </td>
                              <td className="table__cell">
                                {row.dic === 0 ? '' : formatNumberToMoney(row.dic)}
                              </td>
                              <td className="table__cell">
                                {row.total_general === 0
                                  ? ''
                                  : formatNumberToMoney(row.total_general)}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                    <tfoot>
                      {segmentData.data
                        .filter((_, index) => index === segmentData.data.length - 1)
                        .map((row, index) => {
                          return (
                            <tr
                              style={{
                                backgroundColor: '#006db6',
                                color: 'white',
                              }}
                              key={`report-resume-row-${index}`}
                            >
                              <td className="table__cell">{row.concept}</td>
                              <td className="table__cell">
                                {row.ene === 0 ? '' : formatNumberToMoney(row.ene)}
                              </td>
                              <td className="table__cell">
                                {row.feb === 0 ? '' : formatNumberToMoney(row.feb)}
                              </td>
                              <td className="table__cell">
                                {row.mar === 0 ? '' : formatNumberToMoney(row.mar)}
                              </td>
                              <td className="table__cell">
                                {row.abr === 0 ? '' : formatNumberToMoney(row.abr)}
                              </td>
                              <td className="table__cell">
                                {row.may === 0 ? '' : formatNumberToMoney(row.may)}
                              </td>
                              <td className="table__cell">
                                {row.jun === 0 ? '' : formatNumberToMoney(row.jun)}
                              </td>
                              <td className="table__cell">
                                {row.jul === 0 ? '' : formatNumberToMoney(row.jul)}
                              </td>
                              <td className="table__cell">
                                {row.ago === 0 ? '' : formatNumberToMoney(row.ago)}
                              </td>
                              <td className="table__cell">
                                {row.sep === 0 ? '' : formatNumberToMoney(row.sep)}
                              </td>
                              <td className="table__cell">
                                {row.oct === 0 ? '' : formatNumberToMoney(row.oct)}
                              </td>
                              <td className="table__cell">
                                {row.nov === 0 ? '' : formatNumberToMoney(row.nov)}
                              </td>
                              <td className="table__cell">
                                {row.dic === 0 ? '' : formatNumberToMoney(row.dic)}
                              </td>
                              <td className="table__cell">
                                {row.total_general === 0
                                  ? ''
                                  : formatNumberToMoney(row.total_general)}
                              </td>
                            </tr>
                          );
                        })}
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          );
        })}
    </section>
  );
};
