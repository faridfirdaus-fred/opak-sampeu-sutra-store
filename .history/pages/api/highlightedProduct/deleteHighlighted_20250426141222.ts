\deleteHighlighted.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Highlighted product ID is required' });
    }
    
    // Check if highlighted product exists
    const highlightedProduct = await prisma.highlightedProduct.findUnique({
      where: { id }
    });
    
    if (!highlightedProduct) {
      return res.status(404).json({ message: 'Highlighted product not found' });
    }
    
    // Delete highlighted product
    await prisma.highlightedProduct.delete({
      where: { id }
    });
    
    return res.status(200).json({ message: 'Highlighted product deleted successfully' });
  } catch (error) {
    console.error('Error deleting highlighted product:', error);
    return res.status(500).json({ message: 'Failed to delete highlighted product' });
  }
}