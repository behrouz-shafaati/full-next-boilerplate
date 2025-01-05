'use client';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Braces as CategoryIcon,
  Mail as MailIcon,
  Smartphone as PhoneIcon,
  ShieldQuestionIcon,
  KeyRound,
  Trash,
} from 'lucide-react';
// import { Separator } from "@/components/ui/separator";
import { Heading } from '@/components/ui/heading';
// import FileUpload from "@/components/FileUpload";
import { useToast } from '../ui/use-toast';
import roleCtrl from '@/lib/entity/role/controller';
import { useFormState } from 'react-dom';
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from '@/lib/entity/category/actions';
import Text from '../form-fields/text';
import { SubmitButton } from '../form-fields/submit-button';
import { Option } from '../form-fields/combobox';
import { AlertModal } from '../modal/alert-modal';
import ProfileUpload from '../form-fields/profile-upload';
import Combobox from '../form-fields/combobox';
import { Category } from '@/lib/entity/category/interface';
import { createCatrgoryBreadcrumb } from '@/lib/utils';
import FileUpload from '../form-fields/file-upload';
import Select from '../form-fields/select';
// import FileUpload from "../file-upload";
const ImgSchema = z.object({
  fileName: z.string(),
  name: z.string(),
  fileSize: z.number(),
  size: z.number(),
  fileKey: z.string(),
  key: z.string(),
  fileUrl: z.string(),
  url: z.string(),
});
export const IMG_MAX_LIMIT = 3;
const formSchema = z.object({
  title: z.string().min(3, { message: 'عنوان معتبر وارد کنید' }),
  parentId: z.string({}).nullable(),
  description: z.string({}),
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  initialData: any | null;
  allCategories: Category[];
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData: category,
  allCategories,
}) => {
  const initialState = { message: null, errors: {} };
  const actionHandler = category
    ? updateCategory.bind(null, String(category.id))
    : createCategory;
  const [state, dispatch] = useFormState(actionHandler as any, initialState);
  const roleOptions: Option[] = roleCtrl.getRoles().map((role) => ({
    label: role.title,
    value: role.slug,
  }));

  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const title = category ? 'ویرایش دسته بندی' : 'افزودن دسته بندی';
  const description = category ? 'ویرایش دسته بندی' : 'افزودن دسته بندی';
  const toastMessage = category
    ? 'دسته بندی بروزرسانی شد'
    : 'دسته بندی اضافه شد';
  const action = category ? 'ذخیره تغییرات' : 'ذخیره';

  const parentOptions: Option[] = allCategories.map((category: Category) => {
    return {
      value: String(category.id),
      label: createCatrgoryBreadcrumb(category, category.title),
    };
  });

  const statusOptions = [
    {
      label: 'فعال',
      value: '1',
    },
    {
      label: 'غیر فعال',
      value: '0',
    },
  ];

  console.log('#299 category:', category);
  const statusDefaultValue = category
    ? String(category?.status) === 'active'
      ? '1'
      : '0'
    : '1';
  console.log('#299 statusDefaultValue:', statusDefaultValue);
  const onDelete = async () => {
    try {
      setLoading(true);
      DeleteCategory(category?.id);
    } catch (error: any) {}
  };

  useEffect(() => {
    if (state.message && state.message !== null)
      toast({
        variant: 'destructive',
        title: '',
        description: state.message,
      });
  }, [state]);

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {category && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      {/* <Separator /> */}
      <form action={dispatch} className="space-y-8 w-full">
        {/* Product Media image */}
        <section className="mt-2 rounded-md  p-4 md:mt-0 md:p-6">
          <FileUpload
            title="تصویر شاخص دسته بندی"
            name="image"
            state={state}
            maxFiles={1}
            allowedFileTypes={{ 'image/*': [] }}
          />
        </section>
        <div className="md:grid md:grid-cols-3 gap-8">
          {/* Title */}
          <Text
            title="عنوان"
            name="title"
            defaultValue={category?.title || ''}
            placeholder="عنوان"
            state={state}
            icon={<CategoryIcon className="w-4 h-4" />}
          />
          {/* Parent */}
          <Combobox
            title="دسته والد"
            name="parent"
            defaultValue={category?.parent?.id}
            options={parentOptions}
            placeholder="دسته والد"
            state={state}
            icon={<CategoryIcon className="w-4 h-4" />}
          />
          {/* description */}
          <Text
            title="توضیحات"
            name="description"
            defaultValue={category?.description}
            placeholder="توضیحات"
            state={state}
            icon={<MailIcon className="w-4 h-4" />}
          />
          {/* status */}
          <Select
            title="وضعیت"
            name="status"
            defaultValue={statusDefaultValue}
            options={statusOptions}
            placeholder="وضعیت"
            state={state}
            icon={<MailIcon className="w-4 h-4" />}
          />
        </div>
        <SubmitButton />
      </form>
    </>
  );
};

export function DeleteCategory(id: string) {
  const deleteCategoryWithId = deleteCategory.bind(null, id);
  deleteCategoryWithId();
}
