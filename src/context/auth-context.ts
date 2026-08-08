import {createContext, useContext} from 'react'
import type {Session} from '@supabase/supabase-js'

export type AuthContextValue = {
    // undefined = still loading, null = signed out
    session: Session | null | undefined
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used inside an AuthContextProvider')
    }
    return context
}
