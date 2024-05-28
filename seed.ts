import fs from 'fs'
import csv from 'csv-parser'
import { Index } from "@upstash/vector"

interface Row {
      text: string
}



const index = new Index({
  url: "https://brief-sheep-90607-eu1-vector.upstash.io",
  token: "ABUFMGJyaWVmLXNoZWVwLTkwNjA3LWV1MWFkbWluTXpoak56YzBObVF0TlRBd1pTMDBOVFF6TFRrNE1EQXRZV0U1T1dJelptTXhOekpo",
})

async function parseCSV(filePath : string): Promise<Row[]>{
    return new Promise((resolve, reject) => {
        const rows: Row[] = []

        fs.createReadStream(filePath)   
          .pipe(csv({separator: ','}))
          .on('data', (row) => {
            rows.push(row)
          
        })
         .on("error ", (err) => {
             reject(err)
         })
         .on("end", () => {
            resolve(rows)
         })

   })

}

// const rows = await parseCSV('c:/Users/Abhishek/Desktop/ abhii-profanity/abhii.csv')

const STEP= 30

const seed = async () => {

    const data = await parseCSV('training_dataset.csv')
  //  console.log(data)

  for (let i=0;i<data.length;i += STEP){
    const chunk = data.slice(i, i+STEP)

    const formatted = chunk.map((row, batchIndex) => ({
        data:row.text,
        id: i+batchIndex,
        metadata: {text: row.text}
  }))

  // console.log("upsert,", formatted)

  await index.upsert(formatted)

  }
}

seed()