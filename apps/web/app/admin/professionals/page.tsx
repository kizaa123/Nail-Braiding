import AdminSection from '../_section';
export default function Page() {
  return <AdminSection title="Professionals" endpoint="PATCH /api/admin/professionals/:id/status" />;
}
