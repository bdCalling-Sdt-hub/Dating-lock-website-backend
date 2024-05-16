/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request } from 'express';
import Blog from '../blog/blog.model';
import { IReqUser } from '../user/user.interface';
import ApiError from '../../../errors/ApiError';

//* Controller function to add a like to a blog post
async function addLike(req: Request) {
  const { postId } = req.body;

  const { userId } = req.user as IReqUser;

  const blogPost = await Blog.findById(postId);

  if (!blogPost) {
    throw new ApiError(404, 'Blog post not found');
  }

  // Check if the user has already liked the post
  const alreadyLiked = blogPost.likes.some(
    //@ts-ignore
    like => like.user.toString() === userId,
  );

  if (alreadyLiked) {
    throw new ApiError(400, 'You have already liked this post');
  }

  // Add the like
  //@ts-ignore
  blogPost.likes.push({ user: userId });
  await blogPost.save();

  return blogPost;
}
//* Controller function to add a comment to a blog post
async function addComment(req: Request) {
  const { postId, content } = req.body;

  const { userId } = req.user as IReqUser;

  const blogPost = await Blog.findById(postId);

  if (!blogPost) {
    throw new ApiError(404, 'Blog post not found');
  }

  //@ts-ignore
  blogPost.comments.push({ user: userId, content });
  await blogPost.save();
  return blogPost;
}
//* Controller function to delete a comment from a blog post
async function deleteComment(req: Request) {
  const { postId, commentId } = req.params;
  const blogPost = await Blog.findById(postId);
  if (!blogPost) {
    throw new ApiError(404, 'Blog post not found');
  }
  // Find the index of the comment in the comments array
  const commentIndex = blogPost.comments.findIndex(
    //@ts-ignore
    comment => comment._id.toString() === commentId,
  );
  if (commentIndex === -1) {
    throw new ApiError(404, 'Comment not found');
  }
  // Remove the comment from the array
  blogPost.comments.splice(commentIndex, 1);
  await blogPost.save();
  return blogPost;
}
//* Controller function to delete a like from a blog post
async function removeLike(req: Request) {
  const { postId, likeId } = req.params;

  const blogPost = await Blog.findById(postId);

  if (!blogPost) {
    throw new ApiError(404, 'Blog post not found');
  }

  // Find the index of the like in the likes
  const likeIndex = blogPost.likes.findIndex(
    //@ts-ignore
    like => like._id.toString() === likeId,
  );

  if (likeIndex === -1) {
    throw new ApiError(404, 'Like not found');
  }

  // Remove the like from the array
  blogPost.likes.splice(likeIndex, 1);
  await blogPost.save();
  return blogPost;
}
export const BlogLikeCommentService = {
  addLike,
  addComment,
  deleteComment,
  removeLike,
};
