'use client'
import { applicationStatus } from '@/app-config'
import { Button } from '@/components/ui/button'
import Cookie from 'js-cookie'
import React from 'react'

type Props = {}

function Page({ }: Props) {
  // redirect('/find')


  return (<>
    <div className='items-center w-full h-full grid place-items-center' style={{ backgroundImage: "url('backdrop.jpg')", backgroundSize: 'cover', backgroundPositionX: '50%' }} >

      <div className="flex flex-col items-center bg-white p-4">

        <h1 className='font-bold'>Get the First Class Treatment You Deserve</h1>
        <h2>Be the first to board your train departing from London Euston</h2>
        <Button onClick={() => Cookie.set('IntroPassed', 'T')} asChild className='mt-4'>

          <a href="/find">Go to app</a>
        </Button>
        <h3 className='text-gray-500 mt-4'>© Tye Goulder</h3>
      </div>
    </div>

  </>)
}

export default Page