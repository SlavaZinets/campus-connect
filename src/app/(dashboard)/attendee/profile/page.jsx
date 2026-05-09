import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import PersonalInfo from '@/components/profile/PersonalInfo';

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return <PersonalInfo user={user} />;
}
