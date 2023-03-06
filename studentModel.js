const { ObjectId, CURSOR_FLAGS } = require('mongodb')
const {connect} = require('./dbConnection')

class Student {
    constructor(name, cls, regiNumber) {
        this.name = name
        this.cls = cls
        this.registrationNumber = regiNumber
    }

    async save(){
        const db = await connect()
        const result = await db.collection('students').insertOne({name: this.name, cls: this.cls, registrationNumber: this.registrationNumber})
        const student = await db.collection('students').findOne({_id: result.insertedId})
        console.log(student);
        return student

    }

    static async findByName(name) {
        try {
            const db = await connect()
            const students = await db.collection('students').find({name: name}).toArray()
            // throw new Error('555')
            if (students.length === 0) {
                return []
            } 
            return students
        } catch (err) {
            console.log('Error in Student Class, findByName method');
            console.log(err);
            return null
        }
    }

    static async findById(id) {
        try {
            const db = await connect()
            const student = await db.collection('students').findOne({_id: new ObjectId(id)})
            if ( !student ) {
                console.log('Not Found');
                return null
            }
            return student
        } catch (err) {
            console.log('Error in Student Class, findById method...');
            console.log(err);
            return null
        }
    }

    static async updateOne(id, name, cls, regiNumber) {
        try {
            const db = await connect()
            const filter = {_id: new ObjectId(id)}
            const updateDoc = {$set: {name: name, class: cls, regiNumber: regiNumber}}
            const result = await db.collection('students').updateOne(filter, updateDoc)
            if ( result.modifiedCount === 0 ) {
                console.log('Not Found');
                return null
            }
            const updatedStudent = await db.collection('students').findOne(filter)
            return updatedStudent
        } catch (err) {
            console.log('Error in Student Class, updateOne method');
            console.log(err);
            return null
        }
    }

    static async findAll () {
        try {
            const db = await connect()
            const students = await db.collection('students').find({}).toArray()
            if (students.length === 0) {
                return []
            }
            return students
        } catch (err) {
            console.log('Error in Student Class, findAll method');
            console.log(err);
            return null
        }
    }

    static async deleteById(id) {
        try {
            const db = await connect()
            const student = await this.findById(id)
            const result = await db.collection('students').deleteOne({_id: new ObjectId(id)})
            if (result.deletedCount === 0) {
                return null
            }
            return student
        } catch (err) {
            console.log('Error in Student Class, deleteById method');
            console.log(err);
            return 0
        }
    } 
    
    static async deleteAll() {
        try {
            const db = await connect()
            await db.collection('students').deleteMany({})
            return true
        } catch (err) {
            console.log('Error in Student Class, deleteMany method');
            console.log(err);
            return null
        }
    } 


    
}

module.exports = Student