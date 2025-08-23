import { VerificationStatus } from '@/data/mockData';

interface VerificationBadgeProps {
  status: VerificationStatus;
  className?: string;
}

const statusLabels: Record<VerificationStatus, string> = {
  true: 'Verdadeiro',
  false: 'Falso',
  partial: 'Parcial',
  manipulated: 'Manipulado'
};

const VerificationBadge = ({ status, className = '' }: VerificationBadgeProps) => {
  return (
    <span className={`verification-badge ${status} ${className}`}>
      {statusLabels[status]}
    </span>
  );
};

export default VerificationBadge;