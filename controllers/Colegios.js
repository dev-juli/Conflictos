import Colegio from "../models/Colegios.js";
import CoreDirection from "../models/DireccionNucleo.js"; 

const httppColegios = {
    obtenerColegios: async (req, res)=>{
        try {
            const colegios = await Colegio.find()
            res.json(colegios);
        } catch (error) {
            res.status(500).json({message: "Error al obtener los colegios"});
        }
    },

    obtenerColegioId : async (req, res)=>{
        try {
            const {id} = req.params;
            console.log(id);
            const colegio = await Colegio.findById(id)
            if(!colegio){
                return res.status(404).json({message: "Colegio no encontrado"});
            }
            res.json({colegio});
        } catch (error) {
            res.status(500).json({message: "Error al obtener el colegio"});
        }
    },

    crearColegio: async (req, res)=>{
        try {
            const { core_address } = req.body;

            // 1. Validar que la Dirección de Núcleo exista
            const direccionExistente = await CoreDirection.findById(core_address);
            if (!direccionExistente) {
                return res.status(404).json({ message: "La Dirección de Núcleo especificada no existe." });
            }

            const colegio = new Colegio(req.body);
            await colegio.save();
            res.status(201).json({ message: "Colegio creado correctamente", colegio });
        } catch (error) {
            res.status(500).json({message: "Error al crear el colegio", error: error.message});
        }
    },
    actualizarColegio: async (req, res)=>{
        try {
            const {id} = req.params;
            const { core_address } = req.body;
            const colegio = await Colegio.findByIdAndUpdate(id, req.body, {new: true}) 
            if(!colegio){
                return res.status(404).json({message: "Colegio no encontrado"});
            }
            res.json({ message: "Colegio actualizado correctamente", colegio});

        } catch (error) {
            res.status(500).json({message:"Error al actualizar el Colegio", error: error.message})
        }
    },


    activarColegio: async (req, res)=>{
        try {
         const {id} = req.params;
         const colegio = await Colegio.findByIdAndUpdate(
             id,
             {active: true},
             {new: true}
         )
         if(!colegio){
            return res.status(404).json({ message: "Colegio no Encontrado"})
         }
         res.json({message: "Colegio Activado Correctamente", colegio})


        } catch (error) {
            res.status(500).json({message:"Error al Activar el Colegio"})
        }

    },

    desactivarColegio: async(req, res)=>{
        try {
        const { id } = req.params;
        const colegio = await Colegio.findByIdAndUpdate(
            id,
            { active: false },
            { new: true }
        );
        if (!colegio) {
            return res.status(404).json({ message: "Colegio no encontrado" });
        }
        res.json({ message: "Colegio desactivado correctamente", colegio });
    } catch (error) {
        res.status(500).json({ message: "Error al desactivar el colegio" });
    }

    },


    borrarColegio: async (req, res)=>{

        try {
            const {id} = req.params;
            const colegio = await Colegio.findByIdAndDelete(id);
            res.json({ message: "Colegio borrado correctamente", colegio});
            
        } catch (error) {
            res.status(500).json({message: "Error al borrar el colegio"});
        }
    }



}

export default httppColegios;
