export interface SkillPosition {
  name: string
  /** Deslocamento final a partir do centro da nuvem (unidades CSS, ex.: `-15vw`). */
  x: string
  y: string
}

export const skills: SkillPosition[] = [
  { name: 'Figma', x: '0', y: '-15vw' },
  { name: 'React Native', x: '25vw', y: '5vw' },
  { name: 'Kubernetes', x: '30vw', y: '-6vw' },
  { name: 'RabbitMQ', x: '-30vw', y: '6vw' },
  { name: 'Java', x: '-25vw', y: '-5vw' },
  { name: 'Sql', x: '-25vw', y: '15vw' },
  { name: 'MongoDB', x: '-30vw', y: '-15vw' },
  { name: 'Cisco', x: '-15vw', y: '-15vw' },
  { name: 'Service Now', x: '26vw', y: '15vw' },
  { name: 'Redis', x: '-15vw', y: '10vw' },
  { name: 'Tailwind', x: '12vw', y: '-8vw' },
  { name: 'Scss', x: '-8vw', y: '20vw' },
  { name: 'Angular', x: '15vw', y: '-18vw' },
  { name: 'Vue', x: '15vw', y: '18vw' },
  { name: 'NestJS', x: '0', y: '0' },
  { name: 'React', x: '-10vw', y: '-5vw' },
  { name: 'Next', x: '5vw', y: '15vw' },
]
