import { CollectionConfig } from 'payload'

export const Offers: CollectionConfig = {
  slug: 'offers',
  labels: {
    singular: 'Offer',
    plural: 'Offers',
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
    },
    {
      name: 'currency',
      type: 'text',
      defaultValue: 'AUD',
    },
    {
      name: 'availability',
      type: 'select',
      defaultValue: 'InStock',
      options: [
        { label: 'In Stock', value: 'InStock' },
        { label: 'Sold Out', value: 'SoldOut' },
        { label: 'Preorder', value: 'PreOrder' },
      ],
    },
    {
      name: 'validFrom',
      type: 'date',
    },
    {
      name: 'url',
      type: 'text',
    },
  ],
}
