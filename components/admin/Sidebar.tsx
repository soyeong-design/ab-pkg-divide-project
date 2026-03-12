'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/cn'

// All nav icons as stable JSX constants (no function re-creation overhead)
const icons = {
  article: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5 6h10M5 10h10M5 14h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  card: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M3 9h14" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  cart: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 3h1.5l2 8h8l1.5-5H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="8.5" cy="14.5" r="1" fill="currentColor"/>
      <circle cx="14.5" cy="14.5" r="1" fill="currentColor"/>
    </svg>
  ),
  truck: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="2" y="7" width="11" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M13 10h3l2 3v2h-5v-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <circle cx="6" cy="16" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="15" cy="16" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  home: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 10l7-7 7 7M5 8.5V17h4v-4h2v4h4V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  send: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M17 3L3 9.5l6 1.5L11 17 17 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  ),
  coupon: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="2" y="5" width="16" height="10" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="7" cy="10" r="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M11 8h5M11 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  help: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 8c0-1.1.9-2 2-2s2 .9 2 2c0 1-1 1.5-1.5 2S10 11.5 10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="10" cy="14.5" r=".75" fill="currentColor"/>
    </svg>
  ),
}

interface NavChild { label: string; href: string }
interface NavGroup { label: string; icon: React.ReactNode; children: NavChild[] }

const navGroups: NavGroup[] = [
  {
    label: '상품 관리', icon: icons.article,
    children: [
      { label: '발주 / 입고', href: '/orders/purchase' },
      { label: '배너 / SNS 설정', href: '/orders/banner' },
      { label: '이벤트 당첨자 발표', href: '/orders/event' },
      { label: '차트 집계 관리', href: '/orders/chart' },
      { label: '아티스트 목록', href: '/orders/artists' },
      { label: '판매처 목록', href: '/orders/sellers' },
      { label: '상품 목록', href: '/orders/products' },
      { label: '상품 등록 요청처리', href: '/orders/register' },
    ],
  },
  {
    label: '주문 관리', icon: icons.card,
    children: [{ label: '상품 결제 관리', href: '/orders/payments' }],
  },
  {
    label: '발주 관리', icon: icons.cart,
    children: [
      { label: '일반 상품 발주', href: '/purchase/general' },
      { label: '번개장터 상품처리', href: '/purchase/bunjang' },
    ],
  },
  {
    label: '입고 처리', icon: icons.truck,
    children: [
      { label: '구매대행 입고관리', href: '/inbound/purchase' },
      { label: '배송대행 입고관리', href: '/inbound/shipping' },
    ],
  },
  {
    label: '패키징 내역', icon: icons.home,
    children: [{ label: '패키징 처리', href: '/packaging' }],
  },
  {
    label: '해외 배송', icon: icons.send,
    children: [
      { label: '해외 배송 결제 관리', href: '/shipping/payment' },
      { label: '물류 출고 관리', href: '/shipping/logistics' },
    ],
  },
  {
    label: '포인트 관리', icon: icons.coupon,
    children: [
      { label: '포인트 지급/차감', href: '/points/adjust' },
      { label: '포인트 내역 관리', href: '/points/history' },
    ],
  },
  {
    label: '회원 관리', icon: icons.help,
    children: [
      { label: '회원 목록', href: '/members' },
      { label: '제휴 문의', href: '/members/inquiry' },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  // Only '패키징 내역' is open by default
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(['패키징 내역']))

  function toggleGroup(label: string) {
    setOpenGroups(prev => {
      const next = new Set(prev)
      next.has(label) ? next.delete(label) : next.add(label)
      return next
    })
  }

  return (
    <aside className="w-[220px] shrink-0 bg-bg-default min-h-screen flex flex-col border-r border-border-default">
      {/* Header */}
      <div className="px-[14px] py-[16px] border-b border-border-default flex flex-col gap-2">
        <div className="flex items-center gap-1">
          <div className="w-[34px] h-[34px] bg-bg-accent-brand1-default rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white text-heading-xs font-bold">M</span>
          </div>
          <span className="text-[14px] font-bold text-fg-default px-1 leading-5 tracking-tight">앨범버디 관리시스템</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded bg-bg-subtle border border-border-default">
          <span className="flex-1 text-[12px] text-fg-subtle truncate leading-4">chocopie@makestar.com</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto">
        {navGroups.map((group) => {
          const isGroupActive = group.children.some(c => pathname === c.href || pathname.startsWith(c.href + '/'))
          const isOpen = openGroups.has(group.label)
          return (
            <div key={group.label}>
              {/* Group header */}
              <button
                onClick={() => toggleGroup(group.label)}
                className="w-full flex items-center h-[44px] p-[8px]"
              >
                <div className={cn(
                  'flex flex-1 items-center gap-2 h-full px-3 rounded-lg',
                  isGroupActive ? 'text-fg-default' : 'text-fg-subtle',
                )}>
                  <span className="shrink-0 size-6">{group.icon}</span>
                  <span className="flex-1 text-[14px] font-semibold leading-5 tracking-tight text-left">{group.label}</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                    className={cn('shrink-0 text-fg-subtle transition-transform', isOpen && 'rotate-180')}
                    aria-hidden="true">
                    <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </button>

              {isOpen && group.children.map((child) => {
                const isActive = pathname === child.href || pathname.startsWith(child.href + '/')
                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={cn(
                      'flex items-center mx-2 pl-[44px] pr-3 py-2 rounded-lg text-[14px] font-semibold leading-5 tracking-tight transition-colors',
                      isActive
                        ? 'bg-bg-accent-brand1-subtlest border border-border-accent-brand1-subtlest text-fg-accent-brand1-default'
                        : 'text-fg-subtle hover:text-fg-default hover:bg-bg-subtle',
                    )}
                  >
                    {child.label}
                  </Link>
                )
              })}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
