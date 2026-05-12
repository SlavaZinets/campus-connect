import AdminHeader from '@/components/layout/AdminHeader';
import AdminFooter from '@/components/layout/AdminFooter';
import {Fraunces, Inter, JetBrains_Mono} from "next/font/google";

export default function AdminLayout({ children }) {
  return (
    <>
      <AdminHeader />
      {children}
      <AdminFooter />
    </>
  );
}
