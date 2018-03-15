describe('Sample integration test', () => {
  const integration = global.integration

  it('should have global integration variable defined', () => {
    return expect(integration).toBeDefined()
  })
})
