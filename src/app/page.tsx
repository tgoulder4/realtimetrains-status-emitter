
'use server'
import { redirect } from 'next/navigation'

type Props = {}

async function Page({ }: Props) {
  redirect('/find')
}

export default Page