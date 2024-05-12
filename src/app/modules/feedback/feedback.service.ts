/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request } from 'express';
import QueryBuilder from '../../../builder/QueryBuilder';
import { FeedBack } from './feedback.model';
import ApiError from '../../../errors/ApiError';

const sendFeedBack = async (payload: any) => {
  const { name, email, topic } = payload;
  const defaultReply = {
    status: 'pending',
  };
  const data = {
    name,
    email,
    topic,
    reply: defaultReply,
  };
  return await FeedBack.create(data);
};
const getFeedback = async (query: Record<string, unknown>) => {
  const FeedBackQuery = new QueryBuilder(FeedBack.find({}), query)
    .search(['name', 'email'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await FeedBackQuery.modelQuery;
  const meta = await FeedBackQuery.countTotal();

  return {
    meta,
    data: result,
  };
};
const addReplyToFeedback = async (req: Request) => {
  const { id } = req.params;
  const { text } = req.body;

  const feedback = await FeedBack.findById(id);

  if (!feedback) {
    throw new ApiError(404, 'Feedback not found');
  }
  //@ts-ignore
  feedback.reply = { text, status: 'replied' };
  await feedback.save();

  return feedback;
};

export const FeedBackService = {
  sendFeedBack,
  getFeedback,
  addReplyToFeedback,
};
