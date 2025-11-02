import React, { useState } from 'react'

// Reusable Logo component with image fallback to simple text if asset fails to load
export default function Logo({ className = 'w-16 h-16 rounded-xl object-cover', alt = 'SahiPay logo' }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className={`flex items-center justify-center bg-transparent ${className}`}>
        <span className="font-semibold">SahiPay</span>
      </div>
    )
  }

  return (
    <img
      src="/logo.png"
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  )
}
