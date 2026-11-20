import { composeStories, setProjectAnnotations } from '@storybook/react'
import type { Meta, StoryFn } from '@storybook/react'
import { cleanup } from '@testing-library/react'
import previewAnnotations from '../../.storybook/preview'

/**
 * Roda todas as stories (render + play) no jsdom.
 * Stories com a tag `browser-only` (WebGL, IntersectionObserver real) só rodam no Storybook.
 */
setProjectAnnotations(previewAnnotations)

type StoryModule = { default: Meta } & Record<string, StoryFn>

const modules = import.meta.glob<StoryModule>('../components/**/*.stories.tsx', { eager: true })

describe.each(Object.entries(modules))('%s', (_, module) => {
  const stories = Object.entries(composeStories(module))
  const browserOnly = module.default.tags?.includes('browser-only')

  it.skipIf(browserOnly).each(stories)('%s', async (_name, Story) => {
    await Story.run()
    cleanup()
  })
})
