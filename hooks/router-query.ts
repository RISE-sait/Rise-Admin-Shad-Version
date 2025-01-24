import { useSearchParams, useRouter } from 'next/navigation'
import { useRef } from 'react'

type QueryType = Record<string, string>

export function useRouterQuery<T extends QueryType>(defaults: T) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialRender = useRef(true)

  if (initialRender.current) {

    Object.entries(defaults).forEach(([key]) => {
      const value = searchParams.get(key)
      if (value != null) {
        // @ts-expect-error must ignore here
        defaults[key] = value
      }
    })
  }

  function replace(update: Partial<T>) {
    const newQuery = { ...defaults, ...update }
    const queryString = new URLSearchParams(newQuery).toString()
    router.replace(`?${queryString}`)
  }

  return { val: defaults, replace }
}