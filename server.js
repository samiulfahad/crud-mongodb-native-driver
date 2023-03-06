const express = require('express')
const path = require('path')
const {connect} = require('./dbConnection')
const Student = require('./studentModel')

const app = express()
app.set('view engine', 'ejs')
app.set('views', 'views')
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res)=>{
    res.render('index', {actionUrl: '/', path: '/add'})
})

app.get('/add', async (req, res)=>{
    res.render('index', {  path: '/add'})
})

app.post('/add', async (req, res)=>{
    const name = req.body.name.trim().toLowerCase()
    const cls = req.body.cls.trim()
    const regiNumber = req.body.registrationNumber.trim()
    const std = new Student(name, cls, regiNumber)
    try{
        const student = await std.save()
        console.log(student);
        res.render('success', { student: student, path: '', action: '', msg: 'added to Database' })  
    } catch (err) {
        return res.render('error', {path: ''})
    }
})

app.get('/edit', async (req, res)=> {
    const id = req.query.studentId
    try{
        const student = await Student.findById(id)
        if (student === null) {
           return res.render('edit', {student: student, path: '/update', isNull: true}) 
        }
        res.render('edit', {student: student, path: '/update', isNull: false})  
    } catch (err) {
        return res.render('error', {path: ''})
    }
})

app.post('/edit', async (req, res)=> {
    const id = req.body.studentId
    const name = req.body.name
    const cls = req.body.cls
    const regiNumber = req.body.registrationNumber
    try{
        const student = await Student.updateOne(id, name, cls, regiNumber)
        if (student === null) {
           return res.render('edit', {student: student, path: '/update', action: '', msg: '', isNull: true}) 
        }
        res.render('success', {student: student, path: '/update', action: '', msg: 'updated successfully',isNull: false})  
    } catch (err) {
        return res.render('error', {path: ''})
    }
})

app.post('/delete', async (req, res)=> {
    const id = req.body.studentId
    try{
        const student = await Student.deleteById(id)
        if (student === null) {
           return res.render('edit', {student: student, path: '/update', isNull: true}) 
        }
        res.render('success', {student: student, path: '/', action: 'delete', msg: 'deleted successfully', isNull: false})  
    } catch (err) {
        return res.render('error', {path: ''})
    }
})

app.get('/all-records', async (req, res)=>{
    const students = await Student.findAll()
    if(students === null) {
            return res.render('error', {path: ''})
        }
    res.render('studentList', { students: students, msg: 'Studentlist is Empty', path: '/all-records'})
})

app.post('/deleteAll', async (req, res)=>{
    const result = await Student.deleteAll()
    if(result === null ) {
            return res.render('error', {path: ''})
        }
    res.render('studentList', { students: [], path: '/all'})
})

app.get('/search', async (req, res)=>{
    try {
        const key = req.query.name.trim().toLowerCase()
        const students = await Student.findByName(key)
        if( students === null) {
            return res.render('error', {path: ''})
        }
        res.render('studentList', { students: students, msg:`No Student Found with name=${key}` ,path: '/all-records'})
    } catch (err) {
        return res.render('error', {path: ''})
    }
})

app.listen(3000, async () => {
    const db = await connect()
    console.log("Server is up on port 3000")
})
