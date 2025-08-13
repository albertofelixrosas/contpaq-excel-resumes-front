import './LoadingPopUp.css';
import { AiOutlineLoading } from 'react-icons/ai';

interface LoadingPopUpProps {
  title: string;
  text: string;
  isOpen: boolean;
}

export const LoadingPopUp = (props: LoadingPopUpProps) => {
  const { title, text, isOpen } = props;

  if (!isOpen) return <></>;

  return (
    <div className="loading-pop-up">
      <div className="loading-pop-up__content">
        <div className="loading-pop-up__head">
          <h2 className="loading-pop-up__title">{title}</h2>
          <p className="loading-pop-up__text">{text}</p>
        </div>
        <div className="loading-pop-up__body">
          <AiOutlineLoading size={60} className="loading-pop-up__loading-icon" />
        </div>
      </div>
    </div>
  );
};
