import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '앨범버디 관리시스템',
  description: 'MakeStar 어드민 패키징 처리 시스템',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-jp.min.css"
        />
      </head>
      <body className="bg-bg-subtle text-fg-default antialiased">
        {children}
      </body>
    </html>
  )
}
