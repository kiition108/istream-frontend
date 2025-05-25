import { useState } from 'react'

export default function DescriptionPreview({ text,wordLimit}) {
  const [expanded, setExpanded] = useState(false)

  const toggleExpanded = () => setExpanded(prev => !prev)

  const getPreview = (text) => {
    const words = text.split(' ')
    if (words.length <= wordLimit) return text
    return words.slice(0, wordLimit).join(' ') + '...'
  }

  return (
    <div className="text-gray-800">
      <p className='inline-block'>{expanded ? text : getPreview(text)}</p>
      {text.split(' ').length > wordLimit && (
        <button
          onClick={toggleExpanded}
          className="text-100 mt-2 cursor-pointer"
        >
          {expanded ? '🔺' : '🔻'}
        </button>
      )}
    </div>
  )
}
