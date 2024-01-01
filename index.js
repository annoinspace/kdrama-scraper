import axios from "axios"
import express from "express"
import cheerio from "cheerio"

const app = express()
const port = process.env.PORT || 8000

const url = process.env.URL_1

axios
  .get(url)
  .then((response) => {
    // Handle response
    const html = response.data
    const $ = cheerio.load(html)
    let dramas = []
    // Example: Selecting elements with a specific class
    $(".text-primary.title").each(function () {
      const title = $(this).text()
      dramas.push(title)
      console.log(title)
    })
  })
  .catch((error) => {
    // Handle error
    console.log(error)
  })

app.listen(port, () => {
  console.log("server running on port ", port)
})
