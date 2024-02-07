import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { mainRouter } from './routes/main';
import fs from "fs/promises";
import { Document, VectorStoreIndex } from "llamaindex";

dotenv.config();

async function main() {

  // Load essay from abramov.txt in Node
  const essay = await fs.readFile(
    "./files/account.txt",
    "utf-8",
  );

  // Create Document object with essay
  const document = new Document({ text: essay });

  // Split text and create embeddings. Store them in a VectorStoreIndex
  const index = await VectorStoreIndex.fromDocuments([document]);

  // Query the index
  const queryEngine = index.asQueryEngine();
  const response = await queryEngine.query({
    query: "Briefly, what is the Object of service in ila bank?",
  });

  // Output response
  console.log(response.toString());
}

main();

const app = express();
const PORT = Number(process.env.PORT || 3000);

//initialize cookie parser
app.use(cookieParser());

//initializing body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//initializing json-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Mount Routers
app.use('/', mainRouter);

app.all('*', function (req, res) {
  res.sendStatus(404);
});

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});