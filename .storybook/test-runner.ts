import type { TestRunnerConfig } from '@storybook/test-runner'

const config: TestRunnerConfig = {
  async postVisit(page, context) {
    // Take a screenshot of each story
    const elementHandler = await page.$('#storybook-root')
    const innerHTML = await elementHandler?.innerHTML()
    
    if (innerHTML) {
      await page.screenshot({
        path: `./test-results/screenshots/${context.id}.png`,
        fullPage: false,
        clip: await elementHandler?.boundingBox() || undefined,
      })
    }
  },
}

export default config