'use client'

import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { CancelPackagingDialog } from '@/components/admin/dialogs/CancelPackagingDialog'
import { MOCK_PACKAGING_REQUESTS, type PackagingRequest, type SubPackage } from '@/lib/mockData'

type Tab = 'requested' | 'started' | 'completed' | 'held'

const tabs: { id: Tab; label: string }[] = [
  { id: 'requested', label: '패키징 요청' },
  { id: 'started',   label: '패키징 시작' },
  { id: 'completed', label: '패키징 완료' },
  { id: 'held',      label: '보류' },
]

// ─── Excel helpers ──────────────────────────────────────────────────────────

function makeXls(sheetName: string, headers: string[], xmlRows: string, filename: string) {
  const headerRow = `  <Row>\n${headers.map(h => `    <Cell ss:StyleID="h"><Data ss:Type="String">${h}</Data></Cell>`).join('\n')}\n  </Row>`
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:x="urn:schemas-microsoft-com:office:excel">
 <Styles>
  <Style ss:ID="h"><Font ss:Bold="1"/></Style>
 </Styles>
 <Worksheet ss:Name="${sheetName}">
  <Table>
${headerRow}
${xmlRows}
  </Table>
 </Worksheet>
</Workbook>`
  const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}_${Date.now()}.xls`
  a.click()
  URL.revokeObjectURL(url)
}

function cell(val: string) {
  return `    <Cell><Data ss:Type="String">${val.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</Data></Cell>`
}

/** 패키징_라벨: 날짜 | 패키징번호 */
function downloadPackagingLabel(requests: PackagingRequest[]) {
  const rows = requests.flatMap(req =>
    req.packages.map(pkg =>
      `  <Row>\n${cell(req.requestedAt)}\n${cell(`${pkg.packageCode}(${pkg.packageAlias})`)}\n  </Row>`
    )
  ).join('\n')
  makeXls('패키징라벨', ['날짜', '패키징번호'], rows, '패키징_라벨')
}

/** 페기_라벨: 날짜 | 패키징번호 | 박스수량 (상품 수 만큼 행 반복, "{total}-{n}" 형식) */
function downloadWasteLabel(requests: PackagingRequest[]) {
  const rows = requests.flatMap(req =>
    req.packages.flatMap(pkg => {
      const total = pkg.productList.length || 1
      return Array.from({ length: total }, (_, i) =>
        `  <Row>\n${cell(req.requestedAt)}\n${cell(`${pkg.packageCode}(${pkg.packageAlias})`)}\n${cell(`${total}-${i + 1}`)}\n  </Row>`
      )
    })
  ).join('\n')
  makeXls('폐기라벨', ['날짜', '패키징번호', '박스수량'], rows, '페기_라벨')
}

/** 피킹_리스트: 패키지 요청 ID | 유저 ID | 패키지 번호 | 패키지 옵션 | 패키지 리스트 | 보관 위치 */
function downloadPickingList(requests: PackagingRequest[]) {
  const rows = requests.flatMap(req =>
    req.packages.map(pkg =>
      `  <Row>\n${cell(req.requestId)}\n${cell(req.userId)}\n${cell(`${pkg.packageCode}(${pkg.packageAlias})`)}\n${cell(pkg.packagingOption)}\n${cell(pkg.packageList.join(', '))}\n${cell(pkg.storageLocation)}\n  </Row>`
    )
  ).join('\n')
  makeXls('피킹리스트',
    ['패키지 요청 ID', '유저 ID', '패키지 번호', '패키지 옵션', '패키지 리스트', '보관 위치'],
    rows, '피킹_리스트',
  )
}

// ─── Option-group rowspan helper ─────────────────────────────────────────────

interface OptionGroupInfo {
  isFirstInGroup: boolean
  groupSpan: number
}

function computeOptionGroups(packages: SubPackage[]): OptionGroupInfo[] {
  const result: OptionGroupInfo[] = packages.map(() => ({ isFirstInGroup: false, groupSpan: 1 }))
  let i = 0
  while (i < packages.length) {
    let j = i + 1
    while (j < packages.length && packages[j].packagingOption === packages[i].packagingOption) j++
    result[i] = { isFirstInGroup: true, groupSpan: j - i }
    i = j
  }
  return result
}

// ─── Cell style helper ───────────────────────────────────────────────────────

const TD = 'border border-border-default px-3 py-3 text-[13px] align-top'
const TD_ROWSPAN = 'border border-border-default px-3 py-3 text-[13px] align-middle'

// ─── Constants ───────────────────────────────────────────────────────────────

const PAGE_SIZE = 10

// ─── Component ───────────────────────────────────────────────────────────────

export function PackagingListContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeTab = (searchParams.get('tab') ?? 'started') as Tab

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [cancelTarget, setCancelTarget] = useState<PackagingRequest | null>(null)
  const [cancelledIds, setCancelledIds] = useState<Set<string>>(new Set())
  const [searchOpen, setSearchOpen] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const allRequests = MOCK_PACKAGING_REQUESTS.filter(
    r => r.status === activeTab && !cancelledIds.has(r.requestId)
  )
  const totalPages = Math.max(1, Math.ceil(allRequests.length / PAGE_SIZE))
  const pagedRequests = allRequests.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function toggleAll(checked: boolean) {
    setSelectedIds(checked ? new Set(pagedRequests.map(r => r.requestId)) : new Set())
  }
  function toggleOne(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }
  function handleTabChange(tab: Tab) {
    setSelectedIds(new Set())
    setCurrentPage(1)
    router.push(`/packaging?tab=${tab}`)
  }
  function goToPage(page: number) {
    setCurrentPage(page)
    setSelectedIds(new Set())
  }
  function getPageNumbers(): (number | '...')[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | '...')[] = [1]
    if (currentPage > 3) pages.push('...')
    for (let p = Math.max(2, currentPage - 1); p <= Math.min(totalPages - 1, currentPage + 1); p++) pages.push(p)
    if (currentPage < totalPages - 2) pages.push('...')
    pages.push(totalPages)
    return pages
  }

  const allChecked = pagedRequests.length > 0 && pagedRequests.every(r => selectedIds.has(r.requestId))
  const hasSelection = selectedIds.size > 0
  const selectedRequests = allRequests.filter(r => selectedIds.has(r.requestId))

  return (
    <>
      {/* Page header */}
      <div className="border-b border-border-default bg-bg-default px-6 py-4">
        <div className="flex items-center gap-2 text-label-sm text-fg-subtle mb-1">
          <span>패키징 내역</span><span>›</span>
          <span>패키징 처리</span><span>›</span>
          <span className="text-fg-default font-medium">패키징 시작</span>
        </div>
        <h1 className="text-heading-lg text-fg-default">패키징 처리</h1>
      </div>

      {/* Tabs */}
      <div className="bg-bg-default border-b border-border-default px-6">
        <div className="flex gap-1">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => handleTabChange(tab.id)}
              className={cn(
                'px-4 py-3 text-label-bold-md border-b-2 transition-colors',
                activeTab === tab.id
                  ? 'border-fg-accent-brand1-default text-fg-accent-brand1-default'
                  : 'border-transparent text-fg-subtle hover:text-fg-default',
              )}
            >{tab.label}</button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-6 py-5 space-y-4">
        {/* Search panel */}
        <div className="bg-bg-default rounded-xl border border-border-default overflow-hidden">
          <div
            className="flex items-center justify-between px-4 py-[12px] min-h-[56px] cursor-pointer select-none border-b border-border-default"
            onClick={() => setSearchOpen(v => !v)}
          >
            <span className="text-[18px] font-bold leading-7 text-fg-default tracking-tight">검색</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              className={cn('text-fg-subtle transition-transform', searchOpen ? 'rotate-180' : '')}>
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {searchOpen && (
            <>
              <div className="flex h-[56px] items-stretch">
                <div className="flex items-center w-[120px] shrink-0 px-4 py-2 border-r border-border-default">
                  <span className="text-[14px] font-semibold text-fg-default leading-5 tracking-tight">검색어</span>
                </div>
                <div className="flex flex-1 items-center px-4 py-2">
                  <input
                    className="w-full h-[40px] px-4 rounded-lg border border-border-default text-[16px] bg-bg-subtle text-fg-default placeholder:text-fg-subtle focus:outline-none focus:border-border-inverse-subtle leading-6"
                    placeholder="판매처 주문번호, 패키지 번호 등을 입력해주세요."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 px-4 py-[12px] border-t border-border-default">
                <Button size="lg" variant="outline" color="default">검색 초기화</Button>
                <Button size="lg" variant="outline" color="default" leftIcon={
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                }>조회하기</Button>
              </div>
            </>
          )}
        </div>

        {/* Table panel */}
        <div className="bg-bg-default rounded-xl border border-border-default overflow-hidden">
          {/* Toolbar row 1 */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-default">
            <span className="text-[18px] font-bold leading-7 text-fg-default tracking-tight">
              <span className="text-fg-accent-brand1-default">{allRequests.length}</span>
              개의 {tabs.find(t => t.id === activeTab)?.label} 목록
            </span>
            <div className="flex items-center gap-3">
              <Button size="lg" variant="outline" color="red" isDisabled={!hasSelection}
                onClick={() => {
                  const first = allRequests.find(r => selectedIds.has(r.requestId))
                  if (first) setCancelTarget(first)
                }}>
                패키징 요청 취소
              </Button>
              <Button size="lg" variant="outline" color="brand1" isDisabled={!hasSelection}>패키징 보류</Button>
              <Button size="lg" color="brand1" isDisabled={!hasSelection}
                onClick={() => {
                  const first = allRequests.find(r => selectedIds.has(r.requestId))
                  if (first) router.push(`/packaging/complete/${first.requestId}`)
                }}>패키징 완료 처리</Button>
            </div>
          </div>

          {/* Toolbar row 2 */}
          <div className="flex items-center justify-end gap-2 px-4 py-3 border-b border-border-default">
            <Button size="md" variant="outline" color="default" isDisabled={!hasSelection}
              onClick={() => hasSelection && downloadPackagingLabel(selectedRequests)}>
              패키징 라벨 다운받기
            </Button>
            <Button size="md" variant="outline" color="default" isDisabled={!hasSelection}
              onClick={() => hasSelection && downloadWasteLabel(selectedRequests)}>
              폐기 라벨 다운받기
            </Button>
            <Button size="md" variant="outline" color="default" isDisabled={!hasSelection}
              onClick={() => hasSelection && downloadPickingList(selectedRequests)}>
              피킹 리스트 다운받기
            </Button>
            <Button size="md" variant="outline" color="default">패키징 지시서 다운받기</Button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-border-default">
              <thead>
                <tr className="bg-bg-subtle">
                  <th className="border border-border-default w-10 px-4 py-3 text-center">
                    <input type="checkbox" checked={allChecked} onChange={e => toggleAll(e.target.checked)}
                      className="w-4 h-4 rounded accent-pink-500" />
                  </th>
                  {[
                    '패키징 요청 ID', '유저 ID', '패키지 번호',
                    '패키징 옵션', '패키징 될 패키지 목록',
                    '패키지 내 상품 목록', '보관 장소', '관리자 기록',
                    '수량', '패키징 요청 일시', '관리자 메모',
                  ].map(h => (
                    <th key={h} className="border border-border-default px-3 py-3 text-label-bold-sm text-fg-subtle whitespace-nowrap text-center">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pagedRequests.map(req => {
                  const isSelected = selectedIds.has(req.requestId)
                  const pkgCount = req.packages.length
                  const totalQty = req.packages.reduce((s, p) => s + p.productList.reduce((ps, pr) => ps + pr.qty, 0), 0)
                  const optionGroups = computeOptionGroups(req.packages)
                  const rowBg = isSelected ? 'bg-bg-accent-brand1-subtlest' : ''

                  return req.packages.map((pkg, pkgIndex) => {
                    const isFirst = pkgIndex === 0
                    const isLast  = pkgIndex === pkgCount - 1
                    const og = optionGroups[pkgIndex]

                    return (
                      <tr key={`${req.requestId}-${pkgIndex}`}
                        className={cn('hover:bg-bg-subtle transition-colors', rowBg)}>

                        {/* ── rowspan: checkbox / requestId / userId / packageNumber ── */}
                        {isFirst && (<>
                          <td rowSpan={pkgCount}
                            className={cn(TD_ROWSPAN, 'text-center w-10')}>
                            <input type="checkbox" checked={isSelected}
                              onChange={() => toggleOne(req.requestId)}
                              className="w-4 h-4 rounded accent-pink-500" />
                          </td>
                          <td rowSpan={pkgCount} className={cn(TD_ROWSPAN, 'min-w-[128px]')}>
                            <Link href={`/packaging/${req.requestId}`}
                              className="text-fg-accent-brand1-default hover:underline font-mono text-xs">
                              {req.requestId}
                            </Link>
                          </td>
                          <td rowSpan={pkgCount} className={cn(TD_ROWSPAN, 'max-w-[140px]')}>
                            <div className="break-all text-xs text-fg-default">{req.userId}</div>
                          </td>
                          <td rowSpan={pkgCount} className={cn(TD_ROWSPAN, 'min-w-[130px]')}>
                            <div className="font-mono text-xs text-fg-default">{req.packageNumber}</div>
                            <div className="text-fg-subtle text-label-sm">({req.packageNumberAlias})</div>
                          </td>
                        </>)}

                        {/* ── 패키징 옵션 — rowspan per consecutive same option ── */}
                        {og.isFirstInGroup && (
                          <td rowSpan={og.groupSpan}
                            className={cn(TD_ROWSPAN, 'min-w-[130px]')}>
                            {/* 옵션 텍스트 — 뱃지 없이 굵은 텍스트 */}
                            <div className="text-[13px] font-bold text-fg-default leading-5">
                              {pkg.packagingOption}
                            </div>
                            {/* 병합된 경우(groupSpan > 1)엔 세부 내용 숨김; 단독 행만 표시 */}
                            {og.groupSpan === 1 && (<>
                              {pkg.packageList.map((p, i) => (
                                <div key={i} className="text-[12px] text-fg-subtle leading-4 mt-0.5">{p}</div>
                              ))}
                              {pkg.userNote && (
                                <div className="text-[12px] text-fg-accent-brand1-default leading-4 mt-0.5">
                                  - 유저 요청사항: {pkg.userNote}
                                </div>
                              )}
                            </>)}
                          </td>
                        )}

                        {/* ── 패키징 될 패키지 목록: packageCode + alias only ── */}
                        <td className={cn(TD, 'min-w-[152px]')}>
                          <div className="font-mono text-xs text-fg-default">{pkg.packageCode}</div>
                          <div className="text-fg-subtle text-label-sm">({pkg.packageAlias})</div>
                        </td>

                        {/* ── 패키지 내 상품 목록 ── */}
                        <td className={cn(TD, 'min-w-[260px]')}>
                          {pkg.productList.map((prod, i) => (
                            <div key={i} className="flex gap-1 items-baseline text-[13px] leading-5">
                              <span className={cn('flex-1 min-w-0', prod.isPob ? 'text-fg-subtle' : 'text-fg-default')}>
                                {prod.isPob ? '-' : '•'} {prod.name}
                              </span>
                              <span className="text-fg-accent-brand1-default shrink-0 whitespace-nowrap">
                                / {prod.qty}개
                              </span>
                            </div>
                          ))}
                        </td>

                        {/* ── 보관 장소 ── */}
                        <td className={cn(TD, 'whitespace-nowrap text-xs text-fg-default')}>
                          {pkg.storageLocation}
                        </td>

                        {/* ── 관리자 기록 ── */}
                        <td className={cn(TD, 'max-w-[140px] text-xs text-fg-subtle')}>
                          {pkg.adminRecord || '-'}
                        </td>

                        {/* ── 수량 / 요청일시 / 메모 — first row, rowspan ── */}
                        {isFirst && (<>
                          <td rowSpan={pkgCount} className={cn(TD_ROWSPAN, 'whitespace-nowrap')}>
                            <div className="text-label-sm text-fg-subtle">총 패키지 수</div>
                            <div className="text-fg-accent-brand1-default text-label-bold-sm">{pkgCount}개 {req.daysSince}</div>
                            <div className="text-label-sm text-fg-subtle mt-1">총 상품 수량</div>
                            <div className="text-fg-accent-brand1-default text-label-bold-sm">{totalQty}개</div>
                          </td>
                          <td rowSpan={pkgCount} className={cn(TD_ROWSPAN, 'whitespace-nowrap text-fg-default')}>{req.requestedAt}</td>
                          <td rowSpan={pkgCount} className={cn(TD_ROWSPAN, 'max-w-[140px] text-xs text-fg-subtle')}>{req.adminMemo || '-'}</td>
                        </>)}
                      </tr>
                    )
                  })
                })}

                {pagedRequests.length === 0 && (
                  <tr>
                    <td colSpan={12} className="px-4 py-12 text-center text-fg-subtle text-body-regular-md">
                      해당 상태의 패키징 항목이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 pt-3 pb-4 border-t border-border-default">
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}
              className="flex items-center gap-1 px-6 py-2 bg-white border border-[#dee2e6] rounded-[6px] text-[14px] font-semibold text-[#212529] tracking-[-0.3px] disabled:opacity-40 hover:bg-gray-50 transition-colors">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Previous
            </button>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 px-4 py-2 bg-white border border-[#dee2e6] rounded-[6px] text-[14px] text-[#212529] tracking-[-0.3px]">
                <span>10 / page</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="flex items-center gap-0.5">
                {getPageNumbers().map((p, i) =>
                  p === '...'
                    ? <span key={`e-${i}`} className="w-10 h-10 flex items-center justify-center text-[14px] text-[#868e96]">...</span>
                    : <button key={p} onClick={() => goToPage(p as number)}
                        className={cn(
                          'w-10 h-10 flex items-center justify-center rounded-full text-[14px] tracking-[-0.3px] transition-colors',
                          currentPage === p
                            ? 'bg-[rgba(0,0,0,0.12)] text-[#212529] font-semibold'
                            : 'text-[#868e96] font-normal hover:bg-[rgba(0,0,0,0.06)]',
                        )}>{p}</button>
                )}
              </div>
            </div>

            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-6 py-2 bg-white border border-[#dee2e6] rounded-[6px] text-[14px] font-semibold text-[#212529] tracking-[-0.3px] disabled:opacity-40 hover:bg-gray-50 transition-colors">
              Next
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Cancel dialog */}
      {cancelTarget && (
        <CancelPackagingDialog
          packageCode={cancelTarget.packages[0].packageCode}
          onCancel={() => setCancelTarget(null)}
          onConfirm={() => {
            setCancelledIds(prev => new Set([...prev, cancelTarget.requestId]))
            setSelectedIds(prev => { const n = new Set(prev); n.delete(cancelTarget.requestId); return n })
            setCancelTarget(null)
          }}
        />
      )}
    </>
  )
}
