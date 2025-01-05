import { BreadCrumb } from '@/components/breadcrumb';
import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';
import categoryCtrl from '@/lib/entity/category/controller';
import { notFound } from 'next/navigation';
import { CategoryForm } from '@/components/forms/category-form';

import CategoryModel from '@/lib/entity/category/schema';

type PageProps = {
  params: { id: string };
};
export default async function Page({ params }: PageProps) {
  let category = null,
    allCategories;
  let pageBreadCrumb = {
    title: 'افزودن',
    link: '/dashboard/categories/create',
  };
  if (params.id !== 'create') {
    const id = params.id;
    [category, allCategories] = await Promise.all([
      categoryCtrl.findById({ id }),
      categoryCtrl.findAll({}),
    ]);

    if (!category) {
      notFound();
    }
    pageBreadCrumb = {
      title: category.title,
      link: `/dashboard/categories/${params.id}`,
    };
  } else {
    [allCategories] = await Promise.all([categoryCtrl.findAll({})]);
  }

  const breadcrumbItems = [
    { title: 'دسته ها', link: '/dashboard/categories' },
    pageBreadCrumb,
  ];
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <CategoryForm
          initialData={category}
          allCategories={allCategories.data}
        />
      </div>
    </ScrollArea>
  );
}
