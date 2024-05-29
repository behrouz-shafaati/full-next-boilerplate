import UsersTable from '@/components/tables/user-tables/users-table';
import { BreadCrumb } from '@/components/breadcrumb';
import { auth } from '@/lib/auth';
import { Session } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';

const allowedRoles = ['admin'];
const breadcrumbItems = [{ title: 'کاربران', link: '/dashboard/users' }];
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const session = (await auth()) as Session;
  //   if (!alloweAccess(session, allowedRoles)) return <NotAllowed />;

  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <UsersTable query={query} currentPage={currentPage} />
      </div>
    </ScrollArea>
  );
}
