import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerAuthSession } from '@/server/auth';
import { db } from '@/server/db';
import fs from 'fs';

interface ReqProps {
  fileId: string;
  fileParsingStatus: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerAuthSession(req, res);
  if (!session?.user.id) {
    // return new Response('UNAUTHORIZED', {
    //   status: 404,
    // });
    res.status(404).json({ message: 'You must be logged in.' });
    return;
  }

  console.log('req.body', req.body);
  const { fileId, fileParsingStatus } = req.body as ReqProps;

  await db.file.update({
    where: {
      fileId: fileId,
    },
    data: {
      fileParsingStatus: fileParsingStatus,
    },
  });

  res.status(200).json({ success: true });
}
