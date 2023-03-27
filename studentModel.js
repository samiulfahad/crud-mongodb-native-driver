const { ObjectId } = require("mongodb");
const { connect } = require("./dbConnection");

class Student {
  constructor(name, cls, roll, registrationNumber, avatar) {
    this.name = name;
    this.cls = cls;
    this.roll = roll;
    this.registrationNumber = registrationNumber;
    this.avatar = avatar;
  }

  async save() {
    const db = await connect();
    const result = await db.collection("students").insertOne({
      name: this.name,
      cls: this.cls,
      roll: this.roll,
      registrationNumber: this.registrationNumber,
      avatar: this.avatar,
    });
    const student = await db
      .collection("students")
      .findOne({ _id: result.insertedId });
    return student;
  }

  static async UpdateOne(student) {
    try {
      const db = await connect();
      const filter = { _id: new ObjectId(student._id) };
      const result = await db
        .collection("students")
        .updateOne(filter, { $set: student });
      if (result.modifiedCount === 0) {
        console.log("Not Updated");
        return null;
      }
      const updatedStudent = await db
        .collection("students")
        .findOne({ _id: student._id });
      return updatedStudent;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  static async findByName(name) {
    try {
      const db = await connect();
      const students = await db
        .collection("students")
        .find({ name: name })
        .toArray();
      if (students.length === 0) {
        return [];
      }
      return students;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  static async findById(id) {
    try {
      const db = await connect();
      const student = await db
        .collection("students")
        .findOne({ _id: new ObjectId(id) });
      if (!student) {
        console.log("Not Found");
        return null;
      }
      return student;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  static async findAll(skip) {
    try {
      const db = await connect();
      const students = await db
        .collection("students")
        .find({})
        .limit(3)
        .skip(skip)
        .toArray();
      if (students.length === 0) {
        return [];
      }
      return students;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  static async totalDoc() {
    try {
      const db = await connect();
      const total = await db.collection("students").countDocuments();
      return total;
    } catch (err) {
      console.log(err);
      return 0;
    }
  }

  static async deleteById(id) {
    try {
      const db = await connect();
      const student = await this.findById(id);
      if (!student) {
        console.log("No student found to delete");
        return null;
      }
      const result = await db
        .collection("students")
        .deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
        return null;
      }
      return student;
    } catch (err) {
      console.log(err);
      return 0;
    }
  }

  static async deleteAll() {
    try {
      const db = await connect();
      await db.collection("students").deleteMany({});
      return true;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}

module.exports = Student;
