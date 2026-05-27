import { AlertCircle } from "lucide-react";
import styles from "./error-message.module.css";

type ErrorMessageProps = {
  message: string;
  onRetry: () => void;
};

export const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  return (
    <div className={styles.errorContainer}>
      <AlertCircle size={48} className={styles.icon} />
      <h2 className={styles.title}>Oops, algo salió mal</h2>
      <p className={styles.message}>{message}</p>
      <button className={styles.retryButton} onClick={onRetry}>
        Reintentar
      </button>
    </div>
  );
};
