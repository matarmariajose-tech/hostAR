import Roboflow from 'roboflow'

const rf = new Roboflow({
  apiKey: process.env.ROBOFLOW_API_KEY
})

interface CleaningPhoto {
  url: string
  category: 'bedroom' | 'bathroom' | 'kitchen' | 'living_room'
}

export async function verifyCleaningQuality(
  taskId: string,
  photos: CleaningPhoto[]
): Promise<{
  overallScore: number
  issues: string[]
  photoScores: { url: string; score: number; issues: string[] }[]
}> {
  const project = await rf.workspace('hostar').project('cleaning-verification')
  const model = project.version(1).model

  const results = await Promise.all(
    photos.map(async (photo) => {
      const prediction = await model.predict(photo.url)
      
      // El modelo detecta: bed_made, towels_folded, clean_surfaces, etc
      const score = calculatePhotoScore(prediction, photo.category)
      const issues = detectIssues(prediction, photo.category)
      
      return {
        url: photo.url,
        score,
        issues
      }
    })
  )

  const overallScore = results.reduce((sum, r) => sum + r.score, 0) / results.length
  const allIssues = results.flatMap(r => r.issues)

  // Actualizar en DB
  await prisma.cleaningTask.update({
    where: { id: taskId },
    data: {
      aiQualityScore: overallScore,
      aiIssuesDetected: allIssues,
      verifiedAt: new Date()
    }
  })

  return {
    overallScore,
    issues: allIssues,
    photoScores: results
  }
}

function calculatePhotoScore(prediction: any, category: string): number {
  const expectedObjects = {
    bedroom: ['bed_made', 'clean_floor', 'organized'],
    bathroom: ['clean_toilet', 'clean_sink', 'towels_folded'],
    kitchen: ['clean_counter', 'clean_sink', 'organized'],
    living_room: ['clean_floor', 'organized', 'clean_surfaces']
  }

  const detected = prediction.predictions.map((p: any) => p.class)
  const expected = expectedObjects[category] || []
  
  const matchRate = expected.filter(e => detected.includes(e)).length / expected.length
  return Math.round(matchRate * 100)
}