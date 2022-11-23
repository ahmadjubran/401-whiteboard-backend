"use strict";

class postCommentRoutes {
  constructor(model) {
    this.model = model;
  }

  async create(obj) {
    try {
      return await this.model.create(obj);
    } catch (e) {
      console.error("Error creating data", e.message);
    }
  }

  async read(id) {
    try {
      if (id) {
        return await this.model.findOne({ where: { id: id } });
      } else {
        return await this.model.findAll();
      }
    } catch (e) {
      console.error("Error reading data", e.message);
    }
  }

  async update(id, obj) {
    try {
      const dataById = await this.model.findOne({ where: { id: id } });
      return await dataById.update(obj);
    } catch (e) {
      console.error("Error updating data", e.message);
    }
  }

  async delete(id) {
    try {
      return await this.model.destroy({ where: { id: id } });
    } catch (e) {
      console.error("Error deleting data", e.message);
    }
  }

  async getPostComments(user, comment, vote, id) {
    try {
      const exclude = ["password", "email", "role", "token"];

      if (id) {
        return await this.model.findOne({
          where: { id: id },
          include: [
            { model: user, attributes: { exclude: exclude } },
            { model: comment, include: [{ model: user, attributes: { exclude: exclude } }] },
            { model: vote, include: [{ model: user, attributes: { exclude: exclude } }] },
          ],
        });
      } else {
        const allPost = await this.model.findAll({
          include: [
            { model: user, attributes: { exclude } },
            { model: comment, include: [{ model: user, attributes: { exclude } }] },
            { model: vote, include: [{ model: user, attributes: { exclude } }] },
          ],
          order: [
            ["createdAt", "DESC"],
            [{ model: comment }, "createdAt", "DESC"],
          ],
        });

        return allPost;
      }
    } catch (e) {
      console.error("Error reading data", e.message);
    }
  }

  async getPostCommentsByUserId(id, Comment) {
    try {
      return await this.model.findAll({
        where: { userId: id },
        include: [Comment],
      });
    } catch (e) {
      console.error("Error getting post comments by user id", e.message);
    }
  }

  async createPost(obj, user, comment, vote) {
    try {
      const exclude = ["password", "email", "role", "token"];

      const newPost = await this.model.create(obj);
      const post = await this.model.findOne({
        where: { id: newPost.id },
        include: [
          { model: user, attributes: { exclude } },
          { model: comment, include: [{ model: user, attributes: { exclude } }] },
          { model: vote, include: [{ model: user, attributes: { exclude } }] },
        ],
      });

      return post;
    } catch (e) {
      console.error("Error creating post", e.message);
    }
  }

  async updatePost(id, obj, user, comment, vote) {
    try {
      const exclude = ["password", "email", "role", "token"];

      const post = await this.model.findOne({ where: { id: id } });
      const updatedPost = await post.update(obj);
      const updatedPostWithUser = await this.model.findOne({
        where: { id: updatedPost.id },
        include: [
          { model: user, attributes: { exclude } },
          { model: comment, include: [{ model: user, attributes: { exclude } }] },
          { model: vote, include: [{ model: user, attributes: { exclude } }] },
        ],
      });

      return updatedPostWithUser;
    } catch (e) {
      console.error("Error updating post", e.message);
    }
  }

  async getPostVotes(postId) {
    try {
      const postVotes = await this.model.findAll({
        where: { postId: postId },
      });
      const upVotes = postVotes.filter((vote) => vote.voteType === "up");
      const downVotes = postVotes.filter((vote) => vote.voteType === "down");
      const totalVotes = upVotes.length - downVotes.length;
      return { upVotes, downVotes, totalVotes };
    } catch (e) {
      console.error("Error getting post votes", e.message);
    }
  }
}

module.exports = postCommentRoutes;
