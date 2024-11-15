import { addCreditsDA, decrementCreditsDA, getCreditsDA } from '@/data-access/credits'
import { DepartureState } from '@/schemas/departure'
import { TrackStatusParams } from '@/schemas/trackStatus'


// Mock data structure based on the provided HTML
const trainServices = [
  {
    status: "Go",
    platform: { number: "5" },
    scheduledDepartureTime: "0531",
    destination: { code: "GLA", name: "Glasgow Central" },
    callingAt: [{ code: "BHM", name: "Birmingham New Street" }],
    provider: "VT",

  },
  // Add more mock data here...
] as DepartureState[]

export async function checkCreditsCA(userId: string): Promise<number> {
  console.log(`[checkCreditsCA] Checking credits for user: ${userId}`)
  try {
    const credits = await getCreditsDA(userId)
    if (credits === null) {
      throw new Error('User not found or credits not set')
    }
    console.log(`[checkCreditsCA] Credits for user ${userId}: ${credits}`)
    return credits
  } catch (error) {
    console.error(`[checkCreditsCA] Error checking credits for user ${userId}:`, error)
    throw new Error('Failed to check credits')
  }
}

export async function getDepartureStateCA(params: TrackStatusParams): Promise<DepartureState | null> {
  console.log(`[getDepartureStateCA] Fetching departure state for params:`, params)
  const [_, departureTime] = params.time.split('-')

  // This would typically involve querying a database or external API
  // For now, we'll use the mock data
  const service = trainServices.find(s =>
    s.destination.code === params.destination &&
    s.scheduledDepartureTime === departureTime
  )

  console.log(`[getDepartureStateCA] Found service:`, service)
  return service || null
}

export async function decrementCreditsCA(userId: string): Promise<number> {
  console.log(`[decrementCreditsCA] Decrementing credits for user: ${userId}`)
  try {
    const newCredits = await decrementCreditsDA(userId)
    if (newCredits === null) {
      throw new Error('Failed to decrement credits: User not found or insufficient credits')
    }
    console.log(`[decrementCreditsCA] New credit balance for user ${userId}: ${newCredits}`)
    return newCredits
  } catch (error) {
    console.error(`[decrementCreditsCA] Error decrementing credits for user ${userId}:`, error)
    throw new Error('Failed to decrement credits')
  }
}

export async function addCreditsCA(userId: string, amount: number): Promise<number> {
  console.log(`[addCreditsCA] Adding ${amount} credits for user: ${userId}`)

  if (amount <= 0) {
    console.error(`[addCreditsCA] Invalid credit amount: ${amount}`)
    throw new Error('Invalid credit amount')
  }

  try {
    const newCredits = await addCreditsDA(userId, amount)
    if (newCredits === null) {
      throw new Error('Failed to add credits: User not found')
    }
    console.log(`[addCreditsCA] New credit balance for user ${userId}: ${newCredits}`)
    return newCredits
  } catch (error) {
    console.error(`[addCreditsCA] Error adding credits for user ${userId}:`, error)
    throw new Error('Failed to add credits')
  }
}