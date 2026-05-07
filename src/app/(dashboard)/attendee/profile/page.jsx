import { CURRENT_USER } from '@/lib/mock/currentUser';
import PersonalInfo from '@/components/profile/PersonalInfo';

export default function ProfilePage() {
  return <PersonalInfo user={CURRENT_USER} />;
}
