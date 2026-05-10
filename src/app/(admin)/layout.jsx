import AdminHeader from '@/components/layout/AdminHeader';
import AdminFooter from '@/components/layout/AdminFooter';

export default function AdminLayout({ children }) {
  return (
    <>
      <AdminHeader />
      {children}
      <AdminFooter />
    </>
  );
}
