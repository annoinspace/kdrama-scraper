import "dotenv/config"
import axios from "axios"
import express from "express"
import cheerio from "cheerio"

const app = express()
const port = process.env.PORT

const url = process.env.URL_ONE
const url2 = process.env.URL_TWO

// code for scraping the first site that has pagination

// const scrapePage = async (pageNumber) => {
//   const urlToScrape = `${url}/shows/top?page=${pageNumber}`
//   try {
//     const response = await axios.get(urlToScrape)
//     const html = response.data
//     const $ = cheerio.load(html)
//     let dramas = []

//     $(".box").each(function () {
//       const titleElement = $(this).find(".text-primary.title")
//       const infoSpan = $(this).find("span.text-muted").text()

//       if (infoSpan.includes("Korean")) {
//         const title = titleElement.text().trim()
//         dramas.push(title)
//       }
//     })
//     return dramas
//     // dramas now contains titles of Korean dramas
//     // console.log(dramas)
//   } catch (error) {
//     console.error(`Error scraping page ${pageNumber}:`, error)
//   }
// }
// const main = async (total) => {
//   const totalPages = total
//   console.log("---scraping for dramas")
//   let allDramas = []
//   let currentBatch = []

//   for (let page = 1; page <= totalPages; page++) {
//     const dramasFromPage = await scrapePage(page)
//     dramasFromPage.forEach((drama) => {
//       currentBatch.push(drama)
//       if (currentBatch.length === 20) {
//         allDramas.push([...currentBatch])
//         currentBatch = []
//       }
//     })

//     // Consider adding a delay here to reduce server load
//     await new Promise((resolve) => setTimeout(resolve, 1000)) // 1 second delay
//   }

//   // Add any remaining dramas in the last batch
//   if (currentBatch.length > 0) {
//     allDramas.push([...currentBatch])
//   }

//   console.log(allDramas)
//   console.log("---scraping for dramas completed")
// }

// main(10)

const scrapePage2 = async () => {
  const urlToScrape = `${url2}`
  try {
    const response = await axios.get(urlToScrape)
    const html = response.data
    const $ = cheerio.load(html)
    let dramas = []

    $("ul li a").each(function () {
      const title = $(this).attr("title")
      // Since you are interested in the title attribute of the <a> tag
      if (title) {
        dramas.push(title)
      }
    })

    return dramas
  } catch (error) {
    console.error(`Error scraping:`, error)
  }
}

const main2 = async () => {
  console.log("---scraping for dramas")
  let allDramas = []

  try {
    const dramasFromPage = await scrapePage2() // Call scrapePage2 without a page number
    allDramas = dramasFromPage

    // Optionally, if you still need to group them in batches of 20
    let batches = []
    while (allDramas.length) {
      let batch = allDramas.splice(0, 20)
      batches.push(batch)
    }

    console.log(batches) // Each element of batches is a batch of 20 dramas
    console.log("---scraping for dramas completed")
  } catch (error) {
    console.error("Error during scraping:", error)
  }
}

main2()

app.listen(port, () => {
  console.log("server running on port ", port)
})
