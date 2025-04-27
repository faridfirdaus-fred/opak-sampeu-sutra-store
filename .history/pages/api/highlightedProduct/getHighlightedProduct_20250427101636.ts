import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Parse query parameters
    const { active } = req.query;
    const isActive = active === 'true' ? true : active === 'false' ? false : undefined;
    
    // Build filter conditions
    const where = {
      ...(isActive !== undefined && { isActive }),
      ...(isActive === true && {
        OR: [
          { endDate: { gt: new Date() } },
          { endDate: null }
        ]
      })
    };

    // Fetch highlighted products with their related product data
    const highlightedProducts = await prisma.highlightedProduct.findMany({
      where,
      orderBy: {
        priority: 'asc'
      },
      include: {
        product: true
      }
    });
    
   const products = highlightedProducts.map((item) => ({
     id: item.product.id,
     name: item.product.name,
     price: item.product.price,
     stock: item.product.stock,
     description: item.product.description,
     image: item.product.imageUrl || `/products/${item.product.id}.jpg`, // Gunakan URL default jika imageUrl kosong
     highlightId: item.id,
     priority: item.priority,
     isActive: item.isActive,
     endDate: item.endDate,
   }));

    return res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching highlighted products:', error);
    return res.status(500).json({ message: 'Failed to fetch highlighted products' });
  }
}