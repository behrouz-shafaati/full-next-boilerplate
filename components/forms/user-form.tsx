'use client';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  User as UserIcon,
  Mail as MailIcon,
  Smartphone as PhoneIcon,
  ShieldQuestionIcon,
  KeyRound,
  Trash,
} from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
// import { Separator } from "@/components/ui/separator";
import { Heading } from '@/components/ui/heading';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
// import FileUpload from "@/components/FileUpload";
import { useToast } from '../ui/use-toast';
import roleCtrl from '@/lib/entity/role/controller';
import { useFormState } from 'react-dom';
import { createUser } from '@/lib/entity/user/actions';
import Text from '../ui/text';
import { SubmitButton } from '../ui/submit-button';
import MultipleSelector, { Option } from '../ui/multiple-selector';
import FileUpload from '../ui/file-upload';
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
  name: z.string().min(3, { message: 'نام معتبر وارد کنید' }),
  imgUrl: z
    .array(ImgSchema)
    .max(IMG_MAX_LIMIT, { message: 'You can only add up to 3 images' })
    .min(1, { message: 'At least one image must be added.' }),
  description: z
    .string()
    .min(3, { message: 'Product description must be at least 3 characters' }),
  price: z.coerce.number(),
  category: z.string().min(1, { message: 'Please select a category' }),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData: any | null;
  categories: any;
}

export const UserForm: React.FC<ProductFormProps> = ({
  initialData: user,
  categories,
}) => {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createUser, initialState);
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
  const title = user ? 'ویرایش کاربر' : 'افزودن کاربر';
  const description = user ? 'ویرایش یک کاربر' : 'افزودن یک کاربر';
  const toastMessage = user ? 'کاربر بروزرسانی شد' : 'کاربر اضافه شد';
  const action = user ? 'ذخیره تغییرات' : 'ذخیره';

  const onDelete = async () => {
    try {
      setLoading(true);
      //   await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.refresh();
      router.push(`/${params.storeId}/products`);
    } catch (error: any) {
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  useEffect(() => {
    if (state.message !== null)
      toast({
        variant: 'destructive',
        title: '',
        description: state.message,
      });
  }, [state]);

  const triggerImgUrlValidation = () => form.trigger('imgUrl');
  return (
    <>
      {/* <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      /> */}
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {user && (
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
        <FileUpload title="عکس" name="profileImages" />
        <div className="md:grid md:grid-cols-3 gap-8">
          {/* First Name */}
          <Text
            title="نام"
            name="firstName"
            defaultValue={user?.firstName || ''}
            placeholder="نام"
            state={state}
            icon={<UserIcon className="w-4 h-4" />}
          />
          {/* Last Name */}
          <Text
            title="نام خانوادگی"
            name="lastName"
            defaultValue={user?.lastName}
            placeholder="نام خانوادگی"
            state={state}
            icon={<UserIcon className="w-4 h-4" />}
          />
          {/* Email */}
          <Text
            title="ایمیل"
            name="email"
            defaultValue={user?.email}
            placeholder="ایمیل"
            state={state}
            icon={<MailIcon className="w-4 h-4" />}
          />
          {/* Mobile */}
          <Text
            title="موبایل"
            name="mobile"
            defaultValue={user?.mobile}
            placeholder="موبایل"
            state={state}
            icon={<PhoneIcon className="w-4 h-4" />}
          />
          {/* Roles */}
          <MultipleSelector
            title="نقش"
            name="roles"
            defaultValues={user?.roles}
            placeholder="نقش های کاربر را انتخاب کنید"
            state={state}
            defaultOptions={roleOptions}
            icon={ShieldQuestionIcon}
          />
          {/* Password */}
          <Text
            title="رمز ورود"
            name="password"
            type="password"
            placeholder="رمز ورود"
            description={
              user &&
              'اگر می خواهید رمز ورود کاربر را تغییر دهید، این فیلد را پر کنید.'
            }
            state={state}
            icon={<KeyRound className="w-4 h-4" />}
          />
        </div>
        <SubmitButton />
      </form>
    </>
  );
};
