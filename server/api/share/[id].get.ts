export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    
    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Share ID is required'
      })
    }

    // Retrieve share data from storage
    const storage = useStorage('shares')
    const shareData = await storage.getItem(id)

    if (!shareData) {
      throw createError({
        statusCode: 404,
        message: 'Share not found'
      })
    }

    return shareData
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    console.error('Error retrieving share:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to retrieve share'
    })
  }
})

