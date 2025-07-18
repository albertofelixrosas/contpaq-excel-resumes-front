import { formatDateToLongSpanish } from '../../utils/dateUtils';
import './HomePage.css';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { api, getResource } from '../../services/api';
import { MovementsHeatmap } from '../../components/CalendarHeatmap/CalendarHeatmap';
import type { OptionRecord } from '../../types/reports';
import type { MovementsHeatmapEntry } from '../../types/api-responses';

export const HomePage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loadingFile, setLoadingFile] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [loadingMovements, setLoadingMovements] = useState(false);
  const [movements, setMovements] = useState<MovementsHeatmapEntry[]>([]);
  const [companies, setCompanies] = useState<OptionRecord[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<OptionRecord | null>(null);

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

    const formData = new FormData();
    formData.append('file', file); // importante que el campo se llame exactamente igual: "file"

    setLoadingFile(true);

    interface ExcelSingleSuccessResponse {
      message: string;
      filename: string;
    }

    try {
      const response = await api.post<ExcelSingleSuccessResponse>('/excel/single', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        toast.success(response.data.message);
        refreshCompanies();
        if (!!selectedCompany) {
          refreshMovementsHistory();
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error('Error al subir el archivo');
    } finally {
      setLoadingFile(false);
      setFile(null);
    }
  };

  const refreshCompanies = async () => {
    try {
      setLoadingCompanies(true);
      const companies = await getResource('companies');
      setCompanies(
        companies.map(c => {
          return { id: c.company_id, name: c.company_name };
        }),
      );
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setLoadingCompanies(false);
    }
  };

  const refreshMovementsHistory = async () => {
    try {
      setLoadingMovements(true);
      const movements = await getResource('movements/heatmap', { company_id: selectedCompany?.id });
      setMovements(movements);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setLoadingMovements(false);
    }
  };

  useEffect(() => {
    refreshCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompany === null) {
      setMovements([]);
    } else {
      refreshMovementsHistory();
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
          value={`${!selectedCompany ? '' : selectedCompany.id}`}
          onChange={e => {
            const company = companies.filter(c => c.id === parseInt(e.target.value))[0];
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
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            );
          })}
        </select>
      </form>
      {loadingMovements === false && movements.length > 0 && (
        <MovementsHeatmap
          values={movements}
          firstDatePreviusText="La primera vez que se registro un movimiento fue"
          finalDatePreviusText="La ultima vez que se registro un movimiento fue"
        />
      )}
    </section>
  );
};
