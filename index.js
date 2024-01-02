import "dotenv/config"
import axios from "axios"
import express from "express"
import cheerio from "cheerio"

const app = express()
const port = process.env.PORT

const url = process.env.URL_ONE

// axios
//   .get(url)
//   .then((response) => {
//     // Handle response
//     const html = response.data
//     const $ = cheerio.load(html)
//     let dramas = []
//     // Example: Selecting elements with a specific class
//     $(".text-primary.title").each(function () {
//       const title = $(this).text()
//       dramas.push(title)
//       console.log(title)
//     })
//   })
//   .catch((error) => {
//     // Handle error
//     console.log(error)
//   })

const scrapePage = async (pageNumber) => {
  const urlToScrape = `${url}/shows/top?page=${pageNumber}`
  try {
    const response = await axios.get(urlToScrape)
    const html = response.data
    const $ = cheerio.load(html)
    let dramas = []

    $(".box").each(function () {
      const titleElement = $(this).find(".text-primary.title")
      const infoSpan = $(this).find("span.text-muted").text()

      if (infoSpan.includes("Korean")) {
        const title = titleElement.text().trim()
        dramas.push(title)
      }
    })
    return dramas
    // dramas now contains titles of Korean dramas
    // console.log(dramas)
  } catch (error) {
    console.error(`Error scraping page ${pageNumber}:`, error)
  }
}
const main = async (total) => {
  const totalPages = total
  console.log("---scraping for dramas")
  let allDramas = []
  let currentBatch = []

  for (let page = 1; page <= totalPages; page++) {
    const dramasFromPage = await scrapePage(page)
    dramasFromPage.forEach((drama) => {
      currentBatch.push(drama)
      if (currentBatch.length === 20) {
        allDramas.push([...currentBatch])
        currentBatch = []
      }
    })

    // Consider adding a delay here to reduce server load
    await new Promise((resolve) => setTimeout(resolve, 1000)) // 1 second delay
  }

  // Add any remaining dramas in the last batch
  if (currentBatch.length > 0) {
    allDramas.push([...currentBatch])
  }

  console.log(allDramas)
  console.log("---scraping for dramas completed")
}

main(10)

app.listen(port, () => {
  console.log("server running on port ", port)
})
