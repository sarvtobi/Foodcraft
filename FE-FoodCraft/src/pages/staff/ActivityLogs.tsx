import ActivityLogsPage from '../shared/ActivityLogsPage';

export default function StaffActivityLogs() {
  return (
    <ActivityLogsPage 
      apiPath="/api/staff/activity-logs"
      title="Riwayat Aktivitas Saya"
      subtitle="Daftar tindakan dan perubahan yang telah Anda lakukan dalam sistem"
    />
  );
}
