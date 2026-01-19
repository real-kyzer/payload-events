import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  labels: {
    singular: 'Event',
    plural: 'Events',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'startDate', 'venue'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      editor: lexicalEditor(),
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          required: true,
        },
        {
          name: 'endDate',
          type: 'date',
          required: true,
        },
      ],
    },
    {
      name: 'eventStatus',
      type: 'select',
      defaultValue: 'EventScheduled',
      options: [
        { label: 'Scheduled', value: 'EventScheduled' },
        { label: 'Cancelled', value: 'EventCancelled' },
        { label: 'Moved Online', value: 'EventMovedOnline' },
        { label: 'Postponed', value: 'EventPostponed' },
        { label: 'Rescheduled', value: 'EventRescheduled' },
      ],
    },
    {
      name: 'attendanceMode',
      type: 'select',
      defaultValue: 'OfflineEventAttendanceMode',
      options: [
        { label: 'Offline', value: 'OfflineEventAttendanceMode' },
        { label: 'Online', value: 'OnlineEventAttendanceMode' },
        { label: 'Mixed', value: 'MixedEventAttendanceMode' },
      ],
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'venue',
      type: 'relationship',
      relationTo: 'venues',
      required: true,
    },
    {
      name: 'organizer',
      type: 'relationship',
      relationTo: 'organizers',
      required: true,
    },
    {
      name: 'offers',
      type: 'relationship',
      relationTo: 'offers',
      hasMany: true,
    },
    {
      name: 'performers',
      type: 'relationship',
      relationTo: 'performers',
      hasMany: true,
    },
    {
      name: 'additionalInfo',
      type: 'group',
      fields: [
        {
          name: 'ageRestriction',
          type: 'text',
        },
        {
          name: 'dressCode',
          type: 'text',
        },
        {
          name: 'parking',
          type: 'text',
        },
      ],
    },
  ],
}
