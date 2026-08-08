import {useEffect, useState} from 'react'
import type {ReactNode} from 'react'
import type {Session} from '@supabase/supabase-js'
import supabase from '../supabase-client'
import {AuthContext} from './auth-context'

export const AuthContextProvider = ({children}: {children: ReactNode}) => {
    // Session state (user info, sign-in status)
    const [session, setSession] = useState<Session | null | undefined>(undefined)

    useEffect(() => {
        // Check on 1st render for a session
        async function getInitialSession(){
            try {
                const {data, error} = await supabase
                    .auth.getSession()
                if(error){
                    throw error
                }
                console.log(data.session)
                setSession(data.session)
            } catch (error) {
                console.error('Error getting session: ', error)
            }
        }
        getInitialSession()

        // Listen for changes in auth state (.onAuthStateChange)
        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            console.log('Session change: ', session);
        })
    }, [])

    // Auth functions (signin, signup, logout)

    return (
        <AuthContext.Provider value={{session}}>
            {children}
        </AuthContext.Provider>
    )
}