export function WaIcon({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path fill={color} d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
      <path fill={color} d="M8.6 7.3c.2-.4.4-.4.7-.4h.5c.2 0 .4 0 .6.4l.8 1.9c.1.2.1.4 0 .6l-.5.7c-.1.2-.1.4 0 .6.6 1.1 1.5 2 2.6 2.6.2.1.4.1.6 0l.7-.6c.2-.2.4-.2.6-.1l1.9.9c.2.1.3.3.3.5 0 .9-.6 1.8-1.5 2-1 .2-2.6-.1-4.6-1.9-1.7-1.5-2.6-3.3-2.8-4.4-.2-.9.1-1.5.4-1.8z" />
    </svg>
  )
}
