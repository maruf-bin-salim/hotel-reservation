import AuthUI from '@/components/AuthUI/AuthUI'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

function Room({ user }) {

    const router = useRouter();
    useEffect(() => {
        if (user && user.email !== 'admin@gmail.com') {
            router.push('/');
        }
    }, [user])


    return (
        <div>
            {
                user.email
            }
        </div>
    )
}

export default function Page() {
    return (
        <AuthUI InnerComponent={Room} isAdmin={true} />
    )
}