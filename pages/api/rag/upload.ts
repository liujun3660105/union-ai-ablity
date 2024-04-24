import type { NextApiRequest, NextApiResponse } from 'next';
import { withFileUpload, getConfig, FormNextApiRequest } from 'next-multiparty';
import { getServerAuthSession } from '@/server/auth';
import { MinIODb, db } from '@/server/db';
import formidable from 'formidable';
import multiparty from 'multiparty';
import { z } from 'zod';
import fs from 'fs';

// export const config = {
//   api: {
//     bodyParser: {
//       sizeLimit: '20mb', // Set desired value here
//     },
//     // bodyParser: false,
//   },
// };

export const config = getConfig();

async function handler(req: FormNextApiRequest, res: NextApiResponse) {
  const session = await getServerAuthSession(req, res);
  if (!session?.user.id) {
    return new Response('UNAUTHORIZED', {
      status: 404,
    });
  }

  console.log('req.body', req.file, req.fields);
  const { file, fields } = req;
  const { fileId, fileFormat } = fields;

  const fileStream = fs.createReadStream(file.filepath);
  const fileName = file.originalFilename as string;
  const fileUrl = await saveFileToMinIO(fileStream, fileName);
  const shortFileUrl = fileUrl.split('?')[0];
  await db.file.create({
    data: {
      userId: session.user.id,
      fileId,
      fileFormat,
      fileName,
      fileUrl: shortFileUrl,
      fileParsingStatus: false,
    },
  });

  res.status(200).json({ url: shortFileUrl });
}

// async function saveFileToMinIO(file: File, fileName: string) {
//   //   const fileBuffer = await file.arrayBuffer();
//   //   const buffer = Buffer.from(file);
//   await MinIODb.putObject('documents', fileName, file);
//   //   const url = await MinIODb.presignedGetObject('documents', fileName, 24 * 60 * 60, {
//   //     'response-content-type': 'application/pdf',
//   //   });
//   const url = await MinIODb.presignedPutObject('documents', fileName, 24 * 60 * 60);
//   return url;
// }

async function saveFileToMinIO(file: File, fileName: string) {
  // const fileBuffer = await file.arrayBuffer();
  // const buffer = Buffer.from(fileBuffer);
  await MinIODb.putObject('documents', fileName, file);
  const url = await MinIODb.presignedGetObject('documents', fileName);
  return url;
}

export default withFileUpload(handler);
