import './OptionsToSelect.css';
import { IoMdAdd } from 'react-icons/io';

type Option<T> = { value: T; label: string };

interface OptionsToSelectProps<T> {
  name: string;
  selectedOption: T | null;
  setSelectedOption: (option: Option<T> | null) => void;
  options: Option<T>[];
  onClickNewItem: () => void;
}

export function OptionsToSelect<T>(props: OptionsToSelectProps<T>) {
  const { name, selectedOption, setSelectedOption, options, onClickNewItem } = props;

  const getItemClasses = (o: Option<T>) => {
    let classes = 'options-to-select__list-item';
    if (selectedOption === o.value) {
      classes += ' options-to-select__list-item--selected';
    }
    return classes;
  };

  return (
    <ul className="options-to-select__list">
      {options.map((o, index) => (
        <li key={`${name}-${index}`}>
          <button
            type="button"
            className={getItemClasses(o)}
            onClick={() => {
              if (selectedOption === o.value) {
                setSelectedOption(null); // des-selecciona si ya estaba seleccionado
              } else {
                setSelectedOption(o);
              }
            }}
          >
            {o.label}
          </button>
        </li>
      ))}
      <li>
        <button
          type="button"
          className="options-to-select__list-item options-to-select__list-item--new"
          onClick={onClickNewItem}
        >
          Nuevo <IoMdAdd size={18} />
        </button>
      </li>
    </ul>
  );
}
