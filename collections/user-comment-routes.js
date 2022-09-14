"use strict";

class postCommentRoutes {
  constructor(model) {
    this.model = model;
  }

  async create(obj) {
    try {
      return await this.model.create(obj);
    } catch (e) {
      console.error("ERROR", e.message);
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
      console.error("ERROR", e.message);
    }
  }

  async update(id, obj) {
    try {
      const dataById = await this.model.findOne({ where: { id: id } });
      return await dataById.update(obj);
    } catch (e) {
      console.error("ERROR", e.message);
    }
  }

  async delete(id) {
    try {
      return await this.model.destroy({ where: { id: id } });
    } catch (e) {
      console.error("ERROR", e.message);
    }
  }

  async getPostComments(Comment) {
    try {
      return await this.model.findAll({
        include: [Comment],
      });
    } catch (e) {
      console.error("ERROR", e.message);
    }
  }
}

module.exports = postCommentRoutes;
