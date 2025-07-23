let globalVolume = 0.7 // Default volume at 70%
let audioContext: AudioContext | null | undefined = undefined
const audioElements: Map<string, HTMLAudioElement> = new Map()

// Audio file paths for MP3 files
const AUDIO_FILES = {
  work: '/audio/work.mp3',
  rest: '/audio/rest.mp3',
  finish: '/audio/finish.mp3',
} as const

type AudioType = 'countdown' | 'work' | 'rest' | 'finish'

function getAudioContext(): AudioContext | null {
  if (audioContext === undefined) {
    if (window.AudioContext) {
      audioContext = new window.AudioContext()
    } else {
      audioContext = null
      console.error('Web Audio API is not supported in this browser')
    }
  }
  return audioContext
}

function getAudioElement(type: 'work' | 'rest' | 'finish'): HTMLAudioElement {
  if (!audioElements.has(type)) {
    const audio = new Audio(AUDIO_FILES[type])
    audio.preload = 'auto'
    audio.volume = globalVolume
    audioElements.set(type, audio)
  }
  return audioElements.get(type)!
}

export function setVolume(volume: number) {
  globalVolume = Math.max(0, Math.min(1, volume)) // Clamp between 0 and 1

  // Update volume for all existing audio elements
  audioElements.forEach((audio) => {
    audio.volume = globalVolume
  })
}

export function getVolume(): number {
  return globalVolume
}

export function playSound(type: AudioType, duration?: number) {
  if (type === 'countdown') {
    // Use Web Audio API for countdown sounds
    const context = getAudioContext()
    if (!context) return

    if (context.state === 'suspended') {
      context.resume()
    }

    const oscillator = context.createOscillator()
    const gainNode = context.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(context.destination)

    // Countdown sound - A4 note
    oscillator.frequency.value = 440
    gainNode.gain.setValueAtTime(0.9 * globalVolume, context.currentTime)

    oscillator.start(context.currentTime)
    oscillator.stop(context.currentTime + (duration || 0.1))
  } else {
    // Use MP3 files for work, rest, and finish sounds
    const audio = getAudioElement(type)

    // Reset audio to beginning
    audio.currentTime = 0

    // Set volume
    audio.volume = globalVolume

    // Play the audio
    audio.play().catch((error) => {
      console.error('Failed to play audio:', error)
    })

    // If duration is specified and it's shorter than the audio file,
    // stop the audio after the specified duration
    if (duration && duration > 0) {
      setTimeout(() => {
        audio.pause()
        audio.currentTime = 0
      }, duration * 1000)
    }
  }
}

// Initialize audio by preloading MP3 files
export function initAudio() {
  // Preload all MP3 audio files
  Object.keys(AUDIO_FILES).forEach((type) => {
    getAudioElement(type as 'work' | 'rest' | 'finish')
  })
}

// Clean up audio elements (useful for testing)
export function cleanupAudio() {
  audioElements.forEach((audio) => {
    audio.pause()
    audio.src = ''
  })
  audioElements.clear()
}
