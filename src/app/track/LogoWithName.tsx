import React from 'react'

type Props = {
    pageTitle: string
}

function HeaderLogoWithName({ pageTitle }: Props) {
    return (
        <div className='flex flex-col items-center gap-4 bg-primary py-4 pt-6'>
            <a href="/find">
                <svg color='white' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="opacity-70 lucide lucide-train-front" ><path d="M8 3.1V7a4 4 0 0 0 8 0V3.1" /><path d="m9 15-1-1" /><path d="m15 15 1-1" /><path d="M9 19c-2.8 0-5-2.2-5-5v-4a8 8 0 0 1 16 0v4c0 2.8-2.2 5-5 5Z" /><path d="m8 19-2 3" /><path d="m16 19 2 3" /></svg >
            </a >
            <h2 className="font-semibold text-white text-2xl">{pageTitle}</h2>
            {/* <a href={`https://buildwithtye.com/portfolio${localStorage ? localStorage.getItem("sessionID") ? "?session_id=" + localStorage.getItem("sessionID") : "" : ""}`} className='text-white opacity-20 font-medium -mt-2 w-full text-center'>© tye goulder</a> */}
        </div >
    )
}

export default HeaderLogoWithName