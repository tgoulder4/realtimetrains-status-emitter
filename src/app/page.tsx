import { applicationStatus } from '@/app-config'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {}

function Page({ }: Props) {
  redirect('/find')
}

export default Page