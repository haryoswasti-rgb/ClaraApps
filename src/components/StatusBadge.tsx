import { RequestStatus } from '@/lib/types';

const styles: Record<RequestStatus, string> = {
  Pending: 'gradient-warning text-warning-foreground',
  Disetujui: 'gradient-success text-success-foreground',
  Ditolak: 'gradient-danger text-destructive-foreground',
};

export default function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}
