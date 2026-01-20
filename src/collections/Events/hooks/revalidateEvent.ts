import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from "payload";

import { revalidatePath, revalidateTag } from "next/cache";

import type { Event } from "../../../payload-types";

export const revalidateEvent: CollectionAfterChangeHook<Event> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  const path = `/events/${doc.id}`;

  payload.logger.info(`Revalidating event at path: ${path}`);

  revalidatePath(path);
  revalidateTag("events-sitemap");

  return doc;
};
