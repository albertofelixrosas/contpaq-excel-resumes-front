import { formatDateToLongSpanish } from '../../utils/dateUtils';
import './HomePage.css';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { MovementsHeatmap } from '../../components/CalendarHeatmap/CalendarHeatmap';
import { useCompanies } from '../../hooks/useCompanies';
import { useMovementsHeatmap } from '../../hooks/useMovementsHeatmap';
import type { Company } from '../../models/company.model';
import { useExcelSingleFileUpload } from '../../hooks/useExcelSingleFileUpload';

export const HomePage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const {
    loading: loadingCompanies,
    data: companies,
    fetch: fetchCompanies,
    error: companiesError,
  } = useCompanies();

  const {
    data: movementsHeatmapData,
    loading: loadingMovementsHeatmap,
    error: movementsHeatmapError,
    fetch: fetchMovementsHeatmap,
  } = useMovementsHeatmap();

  const {
    loading: loadingFile,
    data: fileUploadData,
    error: fileUploadError,
    create: uploadFile,
  } = useExcelSingleFileUpload();

  useEffect(() => {
    if (fileUploadData) {
      toast.success(fileUploadData.message);
      setFile(null);
    }
  }, [fileUploadData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else if (e.target.files?.length === 0) {
      setFile(null);
    }
  };

  const handleSubmitUploadFile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      toast.error('Por favor selecciona un archivo.');
      return;
    }

    await uploadFile({ file });
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (companiesError) {
      toast.error(companiesError);
    }
    if (movementsHeatmapError) {
      toast.error(movementsHeatmapError);
    }
    if (fileUploadError) {
      toast.error(fileUploadError);
    }
  }, [companiesError, movementsHeatmapError, fileUploadError]);

  useEffect(() => {
    if (selectedCompany !== null) {
      fetchMovementsHeatmap({ company_id: selectedCompany.company_id });
    }
  }, [selectedCompany]);

  return (
    <section className="page">
      <header className="page__header">
        <h2 className="page__title">Ingrese su excel con sus datos</h2>
        <p className="page__subtitle">
          Panel de Administración del Sistema CONTPAQi | {formatDateToLongSpanish(new Date())}
        </p>
      </header>

      <hr className="page__separator" />

      <div className="page__header-section"></div>
      <form className="home-form" onSubmit={handleSubmitUploadFile}>
        <input
          type="file"
          name="single"
          id="file"
          className="form__input-file"
          onChange={handleFileChange}
        />
        <button
          type="submit"
          className="button button--ghost"
          disabled={loadingFile || file === null}
        >
          Enviar datos
        </button>
      </form>
      <form className="home-form" noValidate>
        <label className="form__label" htmlFor="company-id">
          Empresa <strong>*</strong>
        </label>
        <select
          className="form__select"
          name="company_id"
          id="company-id"
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
          <option value="">Seleccione una empresa</option>
          {companies.map(c => {
            return (
              <option key={c.company_id} value={c.company_id}>
                {c.company_name}
              </option>
            );
          })}
        </select>
      </form>
      {loadingMovementsHeatmap === false && movementsHeatmapData.length > 0 && (
        <MovementsHeatmap
          values={movementsHeatmapData}
          firstDatePreviusText="La primera vez que se registro un movimiento fue"
          finalDatePreviusText="La ultima vez que se registro un movimiento fue"
        />
      )}
    </section>
  );
};
