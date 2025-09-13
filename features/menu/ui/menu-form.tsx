'use client'
import { useActionState, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Heading as HeadingIcon, Trash } from 'lucide-react'
import { Heading } from '@/components/ui/heading'
import { useToast } from '@/components/ui/use-toast'
import { createMenu, deleteMenu, updateMenu } from '../actions'
import Text from '@/components/form-fields/text'
import { SubmitButton } from '@/components/form-fields/submit-button'
import { AlertModal } from '@/components/modal/alert-modal'
import MenuBuilder from '@/components/menu-builder'

interface MenuFormProps {
  initialData: any | null
}

export const MenuForm: React.FC<MenuFormProps> = ({ initialData: menu }) => {
  const locale = 'fa'
  const translation: any =
    menu?.translations?.find((t: any) => t.lang === locale) ||
    menu?.translations[0] ||
    {}
  const initialState = {
    message: null,
    errors: {},
    values: { ...menu, translation },
  }

  const isUpdate = menu ? true : false
  const actionHandler = isUpdate
    ? updateMenu.bind(null, String(menu.id))
    : createMenu
  const [state, dispatch] = useActionState(actionHandler as any, initialState)
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const title = isUpdate ? 'ویرایش فهرست' : 'افزودن فهرست'
  const description = isUpdate ? 'ویرایش فهرست' : 'افزودن فهرست'

  const onDelete = async () => {
    try {
      setLoading(true)
      DeleteMenu(menu?.id)
    } catch (error: any) {}
  }

  useEffect(() => {
    if (state.message && state.message !== null)
      toast({
        variant: 'destructive',
        title: '',
        description: state.message,
      })

    console.log('#s665 state: ', state)
  }, [state, toast])

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
        {isUpdate && (
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
          <input
            type="text"
            name="lang"
            className="hidden"
            value="fa"
            readOnly
          />
          {/* Title */}
          <Text
            title="عنوان"
            name="title"
            defaultValue={state?.values?.translation?.title || ''}
            placeholder="عنوان"
            state={state}
            icon={<HeadingIcon className="h-4 w-4" />}
          />
          <MenuBuilder
            name="itemsJson"
            initialMenu={state?.values?.translation?.items || []}
            maxDepth={1}
            className="col-span-2"
          />
        </div>
        <SubmitButton />
      </form>
    </>
  )
}

export function DeleteMenu(id: string) {
  const deleteMenuWithId = deleteMenu.bind(null, id)
  deleteMenuWithId()
}
