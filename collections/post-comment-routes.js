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

  async getPostComments(comment, id) {
    try {
      if (id) {
        return await this.model.findOne({
          where: { id: id },
          include: comment,
        });
      } else {
        return await this.model.findAll({
          include: comment,
        });
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
}

module.exports = postCommentRoutes;
