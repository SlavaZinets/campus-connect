import { CURRENT_USER } from '@/lib/mock/currentUser';
import PersonalInfo from '@/components/profile/PersonalInfo';

export default function OrganiserProfilePage() {
  return <PersonalInfo user={CURRENT_USER} />;
}
