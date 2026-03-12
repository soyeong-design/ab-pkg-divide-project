import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Typography token 클래스가 color 토큰과 충돌하지 않도록 커스텀 머지 설정
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        { text: [
          'display-xl', 'display-lg', 'display-md', 'display-sm', 'display-xs',
          'heading-lg', 'heading-md', 'heading-sm', 'heading-xs',
          'body-bold-xl', 'body-bold-lg', 'body-bold-md', 'body-bold-sm',
          'body-regular-xl', 'body-regular-lg', 'body-regular-md', 'body-regular-sm',
          'label-xl', 'label-lg', 'label-md', 'label-sm',
          'label-bold-lg', 'label-bold-md', 'label-bold-sm',
        ]},
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
