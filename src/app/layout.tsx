import React, { type PropsWithChildren } from "react";
import "./layout.scss";
import "@/styles/colours.scss";


export default function RootLayout({ children }: PropsWithChildren): JSX.Element {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        {
          (process.env.NEXT_PUBLIC_UMAMI_SITE_ID) ? (
            <script defer src="https://cloud.umami.is/script.js" data-website-id={process.env.NEXT_PUBLIC_UMAMI_SITE_ID} />
          ) : null
        }
        
      </head>

      <body>
        { children }
      </body>
    </html>
  );
}
