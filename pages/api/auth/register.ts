import type { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcrypt';
import { db } from '@/server/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const payload = req.body;
  const { username, password } = payload;
  console.log('fagag', payload, username, password);
  const user = await db.user.findFirst({
    where: {
      username: username,
    },
  });
  if (user) {
    return res.status(500).send({ message: 'User already exists' });
  }
  const hashedPassword = await hash(password, 10);
  await db.user.create({
    data: {
      username: username,
      password: hashedPassword,
    },
  });
  res.status(200).json({ message: 'User created successfully' });
}
