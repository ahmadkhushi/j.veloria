import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { normalizeImageUrl } from '@/lib/image-helper';

function purgeStorefrontCache() {
  try {
    revalidatePath('/');
    revalidatePath('/clothes');
    revalidatePath('/shoes');
    revalidatePath('/product/[slug]', 'page');
  } catch (e) {
    console.error('Cache purge error:', e);
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { id: 'desc' },
    });
    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching admin products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      slug,
      description,
      price,
      salePrice,
      imageUrl,
      videoUrl,
      brand,
      department,
      categoryId,
      categoryName,
      subCategory,
      availableSizes,
      stock,
      isFeatured,
      isNewArrival,
    } = body;

    if (!name || !price || !department) {
      return NextResponse.json(
        { error: 'Name, price, and department are required' },
        { status: 400 }
      );
    }

    const generatedSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') +
        '-' +
        Math.floor(Math.random() * 10000);

    let cleanImageUrl = normalizeImageUrl(imageUrl);

    // Resolve Category ID from categoryName/subCategory if needed
    let finalCategoryId = categoryId ? parseInt(categoryId) : null;
    const targetCatName = categoryName || subCategory;
    if (targetCatName && typeof targetCatName === 'string') {
      const cleanCatName = targetCatName.trim();
      const catSlug = cleanCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      let cat = await prisma.category.findFirst({
        where: {
          OR: [
            { slug: catSlug },
            { name: { equals: cleanCatName } }
          ]
        }
      });
      if (!cat) {
        cat = await prisma.category.create({
          data: {
            name: cleanCatName,
            slug: catSlug,
            department: department || 'CLOTHES',
          }
        });
      }
      finalCategoryId = cat.id;
    }

    // If cleanImageUrl still looks like a web page link (e.g. HTML product page link), try to resolve to direct image
    if (cleanImageUrl && cleanImageUrl.startsWith('http')) {
      const isDirectImage = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.svg'].some((ext) =>
        cleanImageUrl.toLowerCase().includes(ext)
      ) || cleanImageUrl.includes('images.unsplash.com') || cleanImageUrl.includes('lh3.googleusercontent.com') || cleanImageUrl.includes('cdn.shopify.com');

      if (!isDirectImage) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000);
          const resPage = await fetch(cleanImageUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9',
            },
            signal: controller.signal,
          });
          clearTimeout(timeoutId);
          if (resPage.ok) {
            const htmlText = await resPage.text();
            const ogMatch =
              htmlText.match(/<meta[^>]*property=["']og:image:secure_url["'][^>]*content=["']([^"']+)["']/i) ||
              htmlText.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
              htmlText.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i);
            if (ogMatch && ogMatch[1]) {
              let extracted = ogMatch[1];
              if (extracted.startsWith('//')) extracted = `https:${extracted}`;
              else if (!extracted.startsWith('http')) extracted = new URL(extracted, cleanImageUrl).href;
              cleanImageUrl = normalizeImageUrl(extracted);
            }
          }
        } catch (e) {
          // ignore extraction timeout and fallback to normalized URL
        }
      }
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug: generatedSlug,
        description,
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        imageUrl: cleanImageUrl || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop',
        videoUrl,
        brand: brand || 'J. VELORIA',
        department: department || 'CLOTHES',
        categoryId: finalCategoryId,
        availableSizes: availableSizes || [],
        stock: parseInt(stock || '50'),
        isFeatured: isFeatured ?? false,
        isNewArrival: isNewArrival ?? true,
      },
    });

    purgeStorefrontCache();
    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      name,
      slug,
      description,
      price,
      salePrice,
      imageUrl,
      videoUrl,
      brand,
      department,
      categoryId,
      categoryName,
      subCategory,
      availableSizes,
      stock,
      isFeatured,
      isNewArrival,
      isActive,
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required for update' }, { status: 400 });
    }

    let cleanImageUrl = normalizeImageUrl(imageUrl);

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined && slug.trim()) updateData.slug = slug.trim();
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (salePrice !== undefined) updateData.salePrice = salePrice ? parseFloat(salePrice) : null;
    if (cleanImageUrl !== undefined) updateData.imageUrl = cleanImageUrl;
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl;
    if (brand !== undefined) updateData.brand = brand;
    if (department !== undefined) updateData.department = department;

    const targetCatName = categoryName || subCategory;
    if (targetCatName && typeof targetCatName === 'string') {
      const cleanCatName = targetCatName.trim();
      const catSlug = cleanCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      let cat = await prisma.category.findFirst({
        where: {
          OR: [
            { slug: catSlug },
            { name: { equals: cleanCatName } }
          ]
        }
      });
      if (!cat) {
        cat = await prisma.category.create({
          data: {
            name: cleanCatName,
            slug: catSlug,
            department: department || updateData.department || 'CLOTHES',
          }
        });
      }
      updateData.categoryId = cat.id;
    } else if (categoryId !== undefined) {
      updateData.categoryId = categoryId ? parseInt(categoryId) : null;
    }

    if (availableSizes !== undefined) updateData.availableSizes = availableSizes;
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (isFeatured !== undefined) updateData.isFeatured = Boolean(isFeatured);
    if (isNewArrival !== undefined) updateData.isNewArrival = Boolean(isNewArrival);
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    purgeStorefrontCache();
    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    purgeStorefrontCache();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
