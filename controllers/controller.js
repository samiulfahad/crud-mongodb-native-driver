const { validationResult } = require("express-validator");
const fs = require("fs");
const Student = require("../studentModel");
const { capitalize } = require("../usefulfunctions");

exports.getIndex = (req, res) => {
  res.render("index", {
    errors: [],
    studentData: {},
    action: "add",
    button: "Add Student",
  });
};

exports.getAdd = async (req, res) => {
  res.render("add", {
    errors: [],
    action: "add",
    button: "Add Student",
    studentData: {},
  });
};

exports.postAdd = async (req, res) => {
  const name = capitalize(req.body.name);
  const roll = req.body.roll;
  const cls = req.body.cls;
  const registrationNumber = req.body.registrationNumber;
  let avatar = "";
  if (req.file) {
    avatar = req.file.path;
  }
  const studentData = { name, roll, cls, registrationNumber };
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    fs.unlink(avatar, (err) => {
     if(err){
      console.log(err);
     }
    });
    return res.render("add", {
      action: "add",
      button: "Add Student",
      studentData,
      errors: errors.array(),
    });
  }
  if (req.fileUploadError) {
    const msg = req.fileUploadError;
    req.fileUploadError = "";
    return res.render("add", {
      action: "add",
      button: "Add Student",
      studentData,
      errors: [{ param: "avatar", msg: msg }],
    });
  }
  const std = new Student(name, cls, roll, registrationNumber, avatar);
  try {
    const student = await std.save();
    res.render("success", {
      student: student,
      action: "created",
      msg: "added to Database",
    });
  } catch (err) {
    return res.render("error");
  }
};

exports.getEdit = async (req, res) => {
  const id = req.query.studentId;
  try {
    const student = await Student.findById(id);
    if (student === null) {
      return res.render("edit", {
        student: null,
        isNull: true,
      });
    }
    res.render("edit", {
      studentData: student,
      isNull: false,
      action: "edit",
      button: "Modify Student",
      errors: [],
    });
  } catch (err) {
    return res.render("error");
  }
};

exports.postEdit = async (req, res) => {
  const id = req.body.studentId;
  const name = capitalize(req.body.name);
  const cls = req.body.cls;
  const roll = req.body.roll;
  const registrationNumber = req.body.registrationNumber;
  const studentData = { _id: id, name, roll, cls, registrationNumber };

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("edit", {
      isNull: false,
      action: "edit",
      button: "Modify Student",
      studentData,
      errors: errors.array(),
    });
  }

  if (req.fileUploadError) {
    const msg = req.fileUploadError;
    req.fileUploadError = "";
    return res.render("edit", {
      isNull: false,
      action: "edit",
      button: "Modify Student",
      studentData,
      errors: [{ param: "avatar", msg: msg }],
    });
  }

  try {
    const student = await Student.findById(id);
    if (student === null) {
      return res.render("edit", {
        studentData,
        action: "edit",
        isNull: true,
      });
    }
    if (req.file) {
      fs.unlink(student.avatar, (err) => {
        if(err){
          console.log(err);
         }
      });
      student.avatar = req.file.path;
    }
    student.name = name;
    student.cls = cls;
    student.roll = roll;
    student.registrationNumber = registrationNumber;
    const updatedStudent = await Student.UpdateOne(student);
    if (!updatedStudent) {
      return res.render("edit", {
        studentData,
        action: "edit",
        isNull: true,
      });
    }
    res.render("success", {
      student: studentData,
      action: "modified",
      msg: "updated successfully",
      isNull: false,
    });
  } catch (err) {
    return res.render("error");
  }
};

exports.postDelete = async (req, res) => {
  try {
    const id = req.body.studentId;
    const student = await Student.deleteById(id);
    if (student === null) {
      return res.render("edit", {
        student: student,
        isNull: true,
      });
    }

    //Removing the student avatar
    fs.unlink(student.avatar, (err) => {
      if(err){
        console.log(err);
       }
    });

    res.render("success", {
      student: student,
      action: "delete",
      msg: "deleted successfully",
      isNull: false,
    });
  } catch (err) {
    return res.render("error", { path: "" });
  }
};

exports.getAllRecords = async (req, res) => {
  try {
    const total = await Student.totalDoc();

    // Pagination Logic
    const ITEMS_PER_PAGE = 3;
    const currentPage = parseInt(req.query.page);
    let skip = ITEMS_PER_PAGE * (currentPage - 1);
    if (skip < 0) skip = 0;
    const totalPage = Math.ceil(total / ITEMS_PER_PAGE);
    let pages = [];
    for (let i = 1; i <= totalPage; i++) {
      pages.push(i);
    }

    const students = await Student.findAll(skip);
    if (students === null) {
      return res.render("error", { path: "" });
    }

    res.render("studentList", {
      students: students,
      msg: "Studentlist is Empty",
      pages,
      currentPage,
    });
  } catch (err) {
    console.log(err);
    res.render("error");
  }
};

exports.getSearch = async (req, res) => {
  try {
    const key = capitalize(req.query.name.trim());
    const students = await Student.findByName(key);
    if (students === null) {
      return res.render("error");
    }
    res.render("searchResult", {
      students: students,
    });
  } catch (err) {
    console.log(err);
    return res.render("error");
  }
};

exports.postDeleteAll = async (req, res) => {
  const result = await Student.deleteAll();
  if (result === null) {
    return res.render("error");
  }

  // Remove Avatar Dir to remove all the images
  fs.rm("./avatar", { recursive: true }, (err) => {
    console.log("Successfully deleted avatar directory!");
  });

  // Now create a new Avatar Dir again to store images
  if (!fs.existsSync("./avatar")) {
    fs.mkdirSync("./avatar");
  }

  res.render("studentList", { students: [], pages: [], currentPage: 0 });
};
