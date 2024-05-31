import { auth } from '@/lib/auth';
import { Roles, Session } from '@/types';
import AccessDenied from '../access-denied';
import { haveAccess } from '@/lib/utils';
import { navItems } from '../layout/dashboard/navItems';

interface AuthorizationProps {
  children: React.ReactNode;
  routeSlug: string;
}

const Authorization: React.FC<AuthorizationProps> = async ({
  children,
  routeSlug = null,
}) => {
  if (routeSlug === null) return <>{children}</>;
  const session = (await auth()) as Session;

  const AuthorizedRoles: Roles[] =
    navItems.find((item) => item.slug === routeSlug)?.authorized || [];

  const Authorized = haveAccess(session?.user?.roles, AuthorizedRoles);

  if (!Authorized) return <AccessDenied />;

  return <>{children}</>;
};

export default Authorization;
