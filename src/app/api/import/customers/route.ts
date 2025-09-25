import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import formidable from "formidable";
import fs from "fs";
import * as XLSX from "xlsx";
import { Readable } from "stream";

export const config = {
  api: {
    bodyParser: false, // serve per formidable
  },
};

const prisma = new PrismaClient();

function webStreamToNodeReadable(webStream: ReadableStream<Uint8Array>): Readable {
    const reader = webStream.getReader();
    const nodeStream = new Readable({
        read() {}
    });

    function pump() {
        reader.read().then(({ done, value }) => {
            if (done) {
                nodeStream.push(null);
                return;
            }
            nodeStream.push(Buffer.from(value));
            pump();
        });
    }

    pump();
    return nodeStream;
}

export async function POST(req: Request) {
  const form = formidable();

  const nodeReadable = webStreamToNodeReadable(req.body!);

  const data: any = await new Promise((resolve, reject) => {
    form.parse(nodeReadable, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

  const file = data.files.file[0];
  if (!file) return NextResponse.json({ error: "File mancante" }, { status: 400 });

  // leggere Excel
  const workbook = XLSX.readFile(file.filepath);
  const sheetName = workbook.SheetNames[0]; // primo foglio
  const sheet = workbook.Sheets[sheetName];

  const jsonData = XLSX.utils.sheet_to_json(sheet);

  // esempio: jsonData è array di oggetti [{name: "Mario", email: "mario@mail"}]
  try {
    for (const row of jsonData) {
        await prisma.Customers.create({
            data: {
            customerCode: row["Customer Code"] as string,
            name: row["name"] as string,
        },
      });
    }
  } catch (err) {
    return NextResponse.json({ error: "Errore durante l'import" }, { status: 500 });
  }

  return NextResponse.json({ message: "Import completato", count: jsonData.length });
}
