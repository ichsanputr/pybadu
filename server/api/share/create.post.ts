export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Validate input
    if (!body.library || !body.files || body.files.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'Invalid request: library and files are required'
      })
    }

    // Generate random 5-character ID
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let id = ''
    for (let i = 0; i < 5; i++) {
      id += characters.charAt(Math.floor(Math.random() * characters.length))
    }

    // Create share data
    const shareData = {
      id,
      library: body.library,
      files: body.files,
      createdAt: new Date().toISOString()
    }

    // In a real application, you would store this in a database
    // For now, we'll use in-memory storage (will be lost on server restart)
    // You can replace this with your preferred database solution
    const storage = useStorage('shares')
    await storage.setItem(id, shareData)

    return {
      id,
      url: `/share/${id}`
    }
  } catch (error) {
    console.error('Error creating share:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to create share'
    })
  }
})

