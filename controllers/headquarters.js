import Headquarters from "../models/headquarters.js";

const httpSede = {
    listAll: async (req, res) => {
        try {
            const headquarters = await Headquarters.find()
            res.status(200).json({ headquarters })
            
        } catch (error) {
            console.log(error);
            res.status(400).json({ msg: "Error al listar todas las Sedes" });
        }
    },

    listById: async (req, res) => {
        try {
            const { id } = req.params;
            const sedeId = await Headquarters.findById(id);
            res.status(200).json({ data: sedeId })

        } catch (error) {
            console.log(error);
            res.status(400).json({ msg: "Error al listar la sede" }); 
        }
    },

    headquartersBySchool: async (req, res) => {
        const { colegioId } = req.params;
        console.log(colegioId);

        try {
            const sedes = await Headquarters.find({ school: colegioId });

            if (!sedes || sedes.length === 0) {
                return res.status(404).json({ msg: "No se encontraron sedes para este colegio" });
            }

            res.status(200).json({ data: sedes })

        } catch (error) {
            console.log(error);
            res.status(400).json({ msg: "Error al listar la sede por colegio" });
        }
    },

    createHeadquarters: async (req, res) => {
        const { school, name, abbreviation, code, address, phone } = req.body;

        try {
            const sede = new Headquarters({ school, name, abbreviation, code, address, phone });
            await sede.save();
            res.json({ msg: "Sede creada con exito", data: sede });
            
        } catch (error) {
            console.log(error);
            res.status(400).json({ msg: "Error al guardar la sede" });
        } 
    },

    updateHeadquarters: async (req, res) => {
        const { id } = req.params;
        const { school, name, abbreviation, code, address, phone, } = req.body;

        try {
            const sedeUpdated = await Headquarters.findByIdAndUpdate(id, {
                    school,
                    name,
                    abbreviation,
                    code,
                    address,
                    phone,
                    updatedAt: Date.now(),
                },
                {new: true});
                res.json({ msg: "Sede actualizada con exito", data: sedeUpdated });
            
            if (!sedeUpdated){
                return res.status(404).json({ msg: "Esta Sede no existe" });
            }

        } catch (error) {
            console.log(error);
            res.status(400).json({ msg: "Error al actualizar la sede" })
        }
    },

    activateHeadquarters: async (req, res) => {
        const { id } = req.params;
        
    
        try {
            const buscarSedeActiva = await Headquarters.findByIdAndUpdate(id, 
                {isActive: true},
                {new: true}
            );

            if(!buscarSedeActiva){
                return res.status(404).json({ msg: "Esta Sede no existe" });
            }

            res.status(200).json({ msg: "Sede inactiva", data: buscarSedeActiva })

        } catch (error) {
            console.log(error);
            res.status(400).json({ msg: "Error al cambiar el estado 'Activa' de la sede" })
        }
        
    },

    deactivateHeadquarters: async (req, res) => {
        const { id } = req.params;
        
        try {
            const buscarSedeInactiva = await Headquarters.findByIdAndUpdate(id, 
                {isActive: false},
                {new: true}
            );

            if(!buscarSedeInactiva) {
                return res.status(404).json({ msg: "Esta Sede no existe" });
            }

            res.status(200).json({ msg: "Sede inactiva", data: buscarSedeInactiva });

        } catch (error) {
            console.log(error);
            res.status(400).json({ msg: "Error al cambiar el estado 'Inactiva' de la sede" })
        }
    },

    deleteHeadquaters: async(req, res) => {
        const { id } = req.params;

        try {
            const eliminarSede = await Headquarters.findByIdAndDelete(id)

            if (!eliminarSede){
                return res.status(404).json({ msg: "Esta Sede no existe" });
            };

            res.status(200).json({ msg: "Sede eliminada correctamente" })

        } catch (error) {
            console.log(error);
            res.status(400).json({ msg: "Error al eliminar la sede" }) 
        }
    }
};

export default httpSede