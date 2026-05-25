import ActivityLogsPage from '../shared/ActivityLogsPage';

export default function OwnerActivityLogs() {
  return (
    <ActivityLogsPage 
      apiPath="/api/owner/activity-logs"
      title="Riwayat Operasional UMKM"
      subtitle="Pantau setiap perubahan pada pesanan, stok, dan data produk Anda"
    />
  );
}
