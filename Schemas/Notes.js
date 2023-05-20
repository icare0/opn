const { model, Schema } = require('mongoose')
 
let NotesSchema = new Schema({
    GuildID: String,
    UserID: String,
    Notes: Array
})
 
module.exports = model('NotesSchema', NotesSchema)