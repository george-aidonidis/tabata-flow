let audioContext: AudioContext | null | undefined = undefined
let globalVolume = 0.7 // Default volume at 70%

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

export function setVolume(volume: number) {
  globalVolume = Math.max(0, Math.min(1, volume)) // Clamp between 0 and 1
}

export function getVolume(): number {
  return globalVolume
}

export function playSound(type: 'countdown' | 'work' | 'rest' | 'finish') {
  const context = getAudioContext()
  if (!context) return

  if (context.state === 'suspended') {
    context.resume()
  }

  const oscillator = context.createOscillator()
  const gainNode = context.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(context.destination)

  switch (type) {
    case 'countdown':
      oscillator.frequency.value = 440 // A4
      gainNode.gain.setValueAtTime(0.9 * globalVolume, context.currentTime)
      break
    case 'work':
      // Higher, more energetic tone for work phase
      oscillator.frequency.value = 880 // A5 - high pitch for activity
      gainNode.gain.setValueAtTime(0.9 * globalVolume, context.currentTime)
      break
    case 'rest':
      // Lower, more relaxed tone for rest phase
      oscillator.frequency.value = 330 // E4 - lower pitch for rest
      gainNode.gain.setValueAtTime(0.9 * globalVolume, context.currentTime)
      break
    case 'finish':
      oscillator.frequency.value = 220 // A3
      gainNode.gain.setValueAtTime(0.9 * globalVolume, context.currentTime)
      break
  }

  oscillator.start(context.currentTime)
  oscillator.stop(context.currentTime + 0.1)
}

// Initialize audio context on first user interaction
export function initAudio() {
  getAudioContext()
}
