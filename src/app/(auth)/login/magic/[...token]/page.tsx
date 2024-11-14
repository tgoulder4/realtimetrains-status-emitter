'use server'
import { LoginWithMagicLinkCA } from '@/core-actions/magic-links'
import { rateLimitByIp } from '@/lib/limiter'
import { setSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  params: {
    token: string[]
  }
}

async function MagicLogin({ params }: Props) {
  const { token } = params;
  try {
    const tk = token[0];
    console.log("calling confirmTokenCA with code ", tk)
    console.log("calling LoginWithMagicLinkCA with tk ", tk)
    const user = await LoginWithMagicLinkCA(tk);
  } catch (e) {
    console.error("ML ERROR", e)
    redirect('/404?err=' + (e as string));
  }
  redirect('/find?emailVerified=true');
}

export default MagicLogin