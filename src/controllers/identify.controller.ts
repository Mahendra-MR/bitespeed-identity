import { Request, Response } from 'express';
import { identifyUser } from '../services/identify.service';

export const identifyController = async (req: Request, res: Response) => {
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    return res.status(400).json({ error: 'Email or phoneNumber is required' });
  }

  try {
    const contact = await identifyUser(email, phoneNumber);
    res.status(200).json({ contact });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
