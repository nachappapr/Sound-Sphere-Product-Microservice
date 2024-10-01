import mongoose from "mongoose";

// properties of an event
export interface EventAttrs {
  event: string;
  topic: string;
  message: Record<string, any>;
  status: "success" | "failed";
}

// properties for an event document
export interface EventsDoc extends mongoose.Document, EventAttrs {}

// properties for an event model
export interface EventModel extends mongoose.Model<EventsDoc> {
  build(attrs: EventAttrs): EventsDoc;
}

const EventsSchema = new mongoose.Schema(
  {
    event: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    message: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

EventsSchema.statics.build = (attrs: EventAttrs) => {
  return new EventModel(attrs);
};

const EventModel = mongoose.model<EventsDoc, EventModel>("event", EventsSchema);

export { EventModel };
