import { CollectionConfig } from 'payload'

export const Organizers: CollectionConfig = {
  slug: 'organizers',
  labels: {
    singular: 'Organizer',
    plural: 'Organizers',
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
      name: 'url',
      type: 'text',
    },
    {
      name: 'contact',
      type: 'group',
      fields: [
        { name: 'email', type: 'email' },
        { name: 'telephone', type: 'text' },
        { name: 'contactType', type: 'text' },
      ],
    },
  ],
}
