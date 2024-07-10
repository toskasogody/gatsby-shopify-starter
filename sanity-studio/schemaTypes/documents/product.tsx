import { TagIcon } from '@sanity/icons';
import pluralize from 'pluralize-esm';
import ProductHiddenInput from '../../components/inputs/ProductHidden';
import ShopifyDocumentStatus from '../../components/media/ShopifyDocumentStatus';
import { defineField, defineType } from 'sanity';
import { getPriceRange } from '../../utils/getPriceRange';
import { GROUPS } from '../../constants';

export const productType = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: TagIcon,
  groups: GROUPS,
  fields: [
    defineField({
      name: 'hidden',
      type: 'string',
      components: {
        field: ProductHiddenInput,
      },
      group: GROUPS.map((group) => group.name),
      hidden: ({ parent }) => {
        const isActive = parent?.store?.status === 'active';
        const isDeleted = parent?.store?.isDeleted;
        return !parent?.store || (isActive && !isDeleted);
      },
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 200,
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
    }),
    defineField({
      name: 'shopifyId',
      title: 'Shopify ID',
      type: 'string',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'image' }],
    }),
    defineField({
      name: 'colorTheme',
      type: 'reference',
      to: [{ type: 'colorTheme' }],
      group: 'editorial',
    }),
    defineField({
      name: 'body',
      type: 'portableText',
      group: 'editorial',
    }),
    defineField({
      name: 'store',
      type: 'shopifyProduct',
      description: 'Product data from Shopify (read-only)',
      group: 'shopifySync',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  orderings: [
    {
      name: 'titleAsc',
      title: 'Title (A-Z)',
      by: [{ field: 'title', direction: 'asc' }],
    },
    {
      name: 'titleDesc',
      title: 'Title (Z-A)',
      by: [{ field: 'title', direction: 'desc' }],
    },
    {
      name: 'priceDesc',
      title: 'Price (Highest first)',
      by: [{ field: 'price', direction: 'desc' }],
    },
    {
      name: 'priceAsc',
      title: 'Price (Lowest first)',
      by: [{ field: 'price', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      isDeleted: 'store.isDeleted',
      options: 'store.options',
      previewImageUrl: 'store.previewImageUrl',
      priceRange: 'store.priceRange',
      status: 'store.status',
      title: 'store.title',
      variants: 'store.variants',
    },
    prepare(selection) {
      const { isDeleted, options, previewImageUrl, priceRange, status, title, variants } = selection;

      const optionCount = options?.length;
      const variantCount = variants?.length;

      let description = [
        variantCount ? pluralize('variant', variantCount, true) : 'No variants',
        optionCount ? pluralize('option', optionCount, true) : 'No options',
      ];

      let subtitle = getPriceRange(priceRange);
      if (status !== 'active') {
        subtitle = '(Unavailable in Shopify)';
      }
      if (isDeleted) {
        subtitle = '(Deleted from Shopify)';
      }

      return {
        description: description.join(' / '),
        subtitle,
        title,
        media: (
          <ShopifyDocumentStatus
            isActive={status === 'active'}
            isDeleted={isDeleted}
            type="product"
            url={previewImageUrl}
            title={title}
          />
        ),
      };
    },
  },
});
