import { useEffect, useMemo, useState } from "react"

export function useLocalStorageState<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key)
      if (!raw) return initialValue
      return JSON.parse(raw) as T
    } catch {
      return initialValue
    }
  })

  const serialized = useMemo(() => JSON.stringify(state), [state])

  useEffect(() => {
    try {
      window.localStorage.setItem(key, serialized)
    } catch {
      // ignore storage errors in restricted environments
    }
  }, [key, serialized])

  return [state, setState] as const
}

