
'use server'
import { redirect } from 'next/navigation'

type Props = {}

async function Page({ }: Props) {
  console.log('redirecting to find')
  redirect('/find')
}

export default Page