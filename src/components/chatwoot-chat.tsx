'use client'
import { useEffect } from 'react'

export default function ChatwootWidget(): JSX.Element | null {
  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_CHATWOOT_BASE_URL
    const token = process.env.NEXT_PUBLIC_CHATWOOT_TOKEN

    if (!baseUrl || !token) return

    const script = document.createElement('script')
    script.innerHTML = `
      (function(d,t) {
        var BASE_URL="${baseUrl}";
        var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
        g.src=BASE_URL+"/packs/js/sdk.js";
        g.defer = true;
        g.async = true;
        s.parentNode.insertBefore(g,s);
        g.onload=function(){
          window.chatwootSDK.run({
            websiteToken: '${token}',
            baseUrl: BASE_URL
          })
        }
      })(document,"script");
    `
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return null
}
