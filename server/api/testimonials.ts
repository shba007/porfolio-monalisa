import { createAvatar } from '@dicebear/core'
import { micah } from '@dicebear/collection'
import type { Testimonial } from '~/utils/types'
import { readFile } from './locations'

function generateAvatar(name: string, gender: 'male' | 'female') {
  const avatar = createAvatar(micah, {
    seed: name,
    baseColor: ['ac6651', 'f9c9b6'],
    backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9'],
    mouth: ['laughing', 'smile', 'smirk'],
    scale: 70,
    translateY: 12,
    shirt: gender === 'female' ? ['open'] : ['collared', 'crew'],
    hair: gender === 'female' ? ['dannyPhantom', 'full', 'pixie'] : ['fonze', 'mrClean', 'turban'],
    eyebrows: gender === 'female' ? ['eyelashesDown', 'eyelashesUp'] : ['down', 'up'],
    facialHairProbability: gender === 'female' ? 0 : 100,
    earringsProbability: gender === 'female' ? 100 : 0,
  })

  return avatar.toDataUri()
}

function shortenName(name: string) {
  const [firstName, lastName] = name.split(' ')
  return `${firstName[0]}. ${lastName}`
}

const testimonials = Promise.all(
  readFile<{ name: string; gender: 'male' | 'female'; message: string }>('testimonials').map(async ({ name, gender, message }) => ({
    image: await generateAvatar(name, gender),
    name: shortenName(name),
    message,
  }))
)

export default defineEventHandler<Promise<Testimonial[]>>(async () => {
  try {
    return await testimonials
  } catch (error: any) {
    console.error('API testimonials GET', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Some Unknown Error Found',
    })
  }
})
