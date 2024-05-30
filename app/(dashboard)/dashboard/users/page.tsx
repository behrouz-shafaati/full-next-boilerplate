import UsersTable from '@/components/tables/user-tables/users-table';
import { BreadCrumb } from '@/components/breadcrumb';
const breadcrumbItems = [{ title: 'کاربران', link: '/dashboard/users' }];

interface PageProps {
  searchParams?: {
    query?: string;
    page?: string;
  };
}

const Page: React.FC<PageProps> = ({ searchParams }) => {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <UsersTable query={query} currentPage={currentPage} />
    </div>
  );
};

export default Page;
