import { auth } from '@/lib/auth';
import { Session } from '@/types';
import AccessDenied from '../access-denied';
import { haveAccess } from '@/lib/utils';

interface AuthorizationProps {
  children: React.ReactNode;
  AuthorizedRoles?: string[];
}

const Authorization: React.FC<AuthorizationProps> = async ({
  children,
  AuthorizedRoles = [],
}) => {
  const session = (await auth()) as Session;

  const Authorized = haveAccess(session?.user?.roles, AuthorizedRoles);

  const isSuperAdmin = session?.user?.roles.includes('super_admin');

  if (!Authorized && !isSuperAdmin) return <AccessDenied />;

  return <>{children}</>;
};

export default Authorization;
