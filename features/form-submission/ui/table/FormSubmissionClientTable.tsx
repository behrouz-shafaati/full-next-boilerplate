'use client'

import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'
import GroupAction from './group-action'
import { FormTranslationSchema } from '@/features/form/interface'
import { QueryResponse } from '@/lib/entity/core/interface'
import { FormSubmission } from '@/features/form-submission/interface'

interface Props {
  response: QueryResponse<FormSubmission>
  formTranslation: FormTranslationSchema
}

export default function FormSubmissionClientTable({
  response,
  formTranslation,
}: Props) {
  return (
    <DataTable
      searchTitle="جستجو ..."
      columns={columns(formTranslation.fields)}
      response={response}
      groupAction={GroupAction}
    />
  )
}
