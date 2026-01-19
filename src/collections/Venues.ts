import { CollectionConfig } from 'payload'

export const Venues: CollectionConfig = {
  slug: 'venues',
  labels: {
    singular: 'Venue',
    plural: 'Venues',
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
      name: 'address',
      type: 'group',
      fields: [
        { name: 'streetAddress', type: 'text', required: true },
        { name: 'locality', type: 'text', required: true },
        { name: 'region', type: 'text', required: true },
        { name: 'postalCode', type: 'text', required: true },
        { name: 'country', type: 'text', required: true },
      ],
    },
    {
      name: 'geo',
      type: 'group',
      fields: [
        { name: 'latitude', type: 'number' },
        { name: 'longitude', type: 'number' },
      ],
    },
  ],
}
