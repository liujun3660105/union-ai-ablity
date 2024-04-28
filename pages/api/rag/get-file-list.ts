import type { NextApiRequest, NextApiResponse } from 'next';
import { withFileUpload, getConfig, FormNextApiRequest } from 'next-multiparty';
import { getServerAuthSession } from '@/server/auth';
import { db } from '@/server/db';

export const config = getConfig();

export default async function handler(req: FormNextApiRequest, res: NextApiResponse) {
  const session = await getServerAuthSession(req, res);
  console.log('🚀 ~ handler ~ session:', session);
  if (!session?.user.id) {
    res.status(404).json({ message: 'You must be logged in.' });
    return;
  }
  try {
    const fileList = await db.file.findMany({
      where: {
        userId: session.user.id,
      },
    });
    console.log('🚀 ~ handler ~ fileList:', fileList);

    res.status(200).json({ data: fileList });
  } catch (error) {
    res.status(200).json({ message: error });
  }
}
