import mongoose from "mongoose";
import { EventAttrs, EventModel } from "../model/events.model";

export const createEvent = async (
  attr: EventAttrs,
  session?: mongoose.mongo.ClientSession
) => {
  const event = await EventModel.build(attr);
  return await event.save({ session });
};
