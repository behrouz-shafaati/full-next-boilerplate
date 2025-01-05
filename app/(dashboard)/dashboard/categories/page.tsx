import { BreadCrumb } from '@/components/breadcrumb';
import CategoryTable from '@/components/tables/category';
const breadcrumbItems = [
  { title: 'دسته بندی ها', link: '/dashboard/categories' },
];

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
      <CategoryTable query={query} currentPage={currentPage} />
    </div>
  );
};

export default Page;
