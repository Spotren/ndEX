import type { CollectionEntry } from 'astro:content'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(classes))
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trimEnd()}...`
}

export function formatBrazilianPhoneDisplay(phone: string) {
  const normalizedPhone = phone.trim()
  if (!normalizedPhone) return ''

  let digits = normalizedPhone.replace(/\D/g, '')
  if (digits.length >= 12 && digits.startsWith('55')) {
    digits = digits.slice(2)
  }

  if (digits.length === 11) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 7)}-${digits.slice(7)}`
  }

  if (digits.length === 10) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 6)}-${digits.slice(6)}`
  }

  return normalizedPhone
}

// 文章按时间排序
export function postsSort(posts: CollectionEntry<'posts'>[]) {
  return posts.slice().sort((a, b) => {
    const dateA = a.data.updatedDate ?? a.data.pubDate
    const dateB = b.data.updatedDate ?? b.data.pubDate
    return new Date(dateB).getTime() - new Date(dateA).getTime()
  })
}

// 日期格式化类型
export type DateFormat = 'default' | 'dot' | 'short' | 'iso' | 'chinese'

// 日期格式化函数
export const formatDate = (date: Date, format: DateFormat = 'default'): string => {
  switch (format) {
    case 'dot':
      // 2020.03.03 格式
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}.${month}.${day}`

    case 'short':
      // Mar 3, 2020 格式
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })

    case 'iso':
      // 2020-03-03 格式
      return date.toISOString().split('T')[0]

    case 'chinese':
      // 2020年3月3日 格式
      const chineseYear = date.getFullYear()
      const chineseMonth = date.getMonth() + 1
      const chineseDay = date.getDate()
      return `${chineseYear}年${chineseMonth}月${chineseDay}日`

    case 'default':
    default:
      // March 3, 2020 格式（默认）
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
  }
}
