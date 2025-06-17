let audioContext: AudioContext | null | undefined = undefined

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

export function playSound(type: 'countdown' | 'start' | 'finish') {
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
      gainNode.gain.setValueAtTime(0.5, context.currentTime)
      break
    case 'start':
      oscillator.frequency.value = 880 // A5
      gainNode.gain.setValueAtTime(0.7, context.currentTime)
      break
    case 'finish':
      oscillator.frequency.value = 220 // A3
      gainNode.gain.setValueAtTime(0.6, context.currentTime)
      break
  }

  oscillator.start(context.currentTime)
  oscillator.stop(context.currentTime + 0.1)
}

// Initialize audio context on first user interaction
export function initAudio() {
  getAudioContext()
}
