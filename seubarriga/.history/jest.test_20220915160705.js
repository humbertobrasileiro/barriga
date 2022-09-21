describe('Testando o jest', () => {
  
  test('Devo conhecer as principais assertivas do jest', () => {
    let num = null
    expect(num).toBeNull()
    num = 10
    expect(num).not.toBeNull()
    expect(num).toBe(10)
    expect(num).toEqual(10)
  })

})