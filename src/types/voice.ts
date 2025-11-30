interface ResponsiveVoice {
  speak: (
    text: string,
    voice: string,
    options?: {
      onstart?: () => void
      onend?: () => void
      onerror?: (e: unknown) => void
    },
  ) => void
  cancel: () => void
  isPlaying: () => boolean
}

export interface WindowWithResponsiveVoice extends Window {
  responsiveVoice?: ResponsiveVoice
}
