'use client'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
export function PHProvider({ children }) {
    if (typeof window !== 'undefined') {
        const url = window.location.href;
        console.log('url', url)
        const match = url.match(/[?&]session_id=([^&]+)/);
        console.log('match', match)
        let sessionID = match ? match[1] : null;
        if (!sessionID) {
            const _sID = localStorage.getItem('sessionID');
            if (_sID) {
                localStorage.setItem('sessionID', _sID);
                sessionID = _sID;
            }
        }
        if (sessionID) {
            console.log('bootstrapping with sessionID', sessionID)
            posthog.init('phc_OwZ5Eo5Bfah214KJbQUu71XpFlzMRXo0nozeI8sZWNN', {
                api_host: 'https://eu.i.posthog.com',
                bootstrap: {
                    sessionID
                }
            })
            return <PostHogProvider client={posthog}> {children} </PostHogProvider>
        } else {
            return children;
        }
    } else {
        return children;
    }
}