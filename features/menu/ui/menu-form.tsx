'use client';
import * as z from 'zod';
import { useActionState, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Heading as HeadingIcon, Trash } from 'lucide-react';
// import { Separator } from "@/components/ui/separator";
import { Heading } from '@/components/ui/heading';
// import FileUpload from "@/components/FileUpload";
import { useToast } from '@/components/ui/use-toast';
import roleCtrl from '@/lib/entity/role/controller';
import { createMenu, deleteMenu, updateMenu } from '../actions';
import Text from '@/components/form-fields/text';
import { SubmitButton } from '@/components/form-fields/submit-button';
import { Option } from '@/components/form-fields/combobox';
import { AlertModal } from '@/components/modal/alert-modal';
import MenuBuilder from '@/components/menu-builder';

const initialMenu = [
  {
    id: '1',
    title: 'Home',
    url: '/',
    icon: 'home',
    children: [],
  },
  {
    id: '2',
    title: 'Shop',
    url: '/shop',
    icon: 'shopping-bag',
    children: [
      {
        id: '3',
        title: 'Clothing',
        url: '/shop/clothing',
        icon: 'shirt',
        children: [],
      },
    ],
  },
];

export const IMG_MAX_LIMIT = 3;
const formSchema = z.object({
  title: z.string().min(3, { message: 'عنوان معتبر وارد کنید' }),
});

type MenuFormValues = z.infer<typeof formSchema>;

interface MenuFormProps {
  initialData: any | null;
}

export const MenuForm: React.FC<MenuFormProps> = ({ initialData: menu }) => {
  const initialState = { message: null, errors: {} };
  const actionHandler = menu
    ? updateMenu.bind(null, String(menu.id))
    : createMenu;
  const [state, dispatch] = useActionState(actionHandler as any, initialState);
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
  const title = menu ? 'ویرایش فهرست' : 'افزودن فهرست';
  const description = menu ? 'ویرایش فهرست' : 'افزودن فهرست';
  const toastMessage = menu ? 'فهرست بروزرسانی شد' : 'فهرست اضافه شد';
  const action = menu ? 'ذخیره تغییرات' : 'ذخیره';

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

  console.log('#299 menu:', menu);
  const statusDefaultValue = menu
    ? String(menu?.status) === 'active'
      ? '1'
      : '0'
    : '1';
  console.log('#299 statusDefaultValue:', statusDefaultValue);
  const onDelete = async () => {
    try {
      setLoading(true);
      DeleteMenu(menu?.id);
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
        {menu && (
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
      <form action={dispatch} className="w-full space-y-8">
        <div className="gap-8 md:grid md:grid-cols-3">
          {/* Title */}
          <Text
            title="عنوان"
            name="title"
            defaultValue={menu?.title || ''}
            placeholder="عنوان"
            state={state}
            icon={<HeadingIcon className="h-4 w-4" />}
          />
          <MenuBuilder
            initialMenu={initialMenu}
            maxDepth={1}
            className="col-span-2"
          />
        </div>
        <SubmitButton />
      </form>
    </>
  );
};

export function DeleteMenu(id: string) {
  const deleteMenuWithId = deleteMenu.bind(null, id);
  deleteMenuWithId();
}
