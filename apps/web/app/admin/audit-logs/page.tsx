import AdminSection from '../_section';
export default function Page() {
  return <AdminSection title="Audit logs" endpoint="GET /api/admin/audit-logs" />;
}
