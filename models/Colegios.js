import mongoose from "mongoose";

const ColegioEsquema = new mongoose.Schema({
    core_address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DireccionNucleo',
        required: true
    },
    name: { type: String, required: true,},
    code: { type: String, required: true, unique: true},
    address: { type: String, required: true},
    phone: { type: String},
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
     active: { type: Boolean, default: true }
}, {
});

const Colegio = mongoose.model('Colegio', ColegioEsquema);

export default Colegio;