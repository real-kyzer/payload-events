import { CollectionConfig } from 'payload'

export const Performers: CollectionConfig = {
  slug: 'performers',
  labels: {
    singular: 'Performer',
    plural: 'Performers',
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
      name: 'type',
      type: 'select',
      defaultValue: 'Person',
      options: [
        { label: 'Person', value: 'Person' },
        { label: 'Organization', value: 'Organization' },
      ],
    },
  ],
}
