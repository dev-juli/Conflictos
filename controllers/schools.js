import School from "../models/schools.js";

const httpSchools = {
    getSchools: async (req, res)=>{
        try {
            const schools = await School.find()
            res.json(schools);
        } catch (error) {
            res.status(500).json({message: "Error al obtener las Colegios"});
        }
    },

    getSchoolById : async (req, res)=>{
        try {
            const {id} = req.params;
            console.log(id);
            const school = await School.findById(id)
            if(!school){
                return res.status(404).json({message: "Colegio no encontrada"});
            }
            res.json({school});
        } catch (error) {
            res.status(500).json({message: "Error al obtener la escuela"});
        }
    },

    createSchool: async (req, res)=>{
        try {
            const { core_address } = req.body;
            
            if (!core_address) {
                return res.status(400).json({ message: "El core_address es requerido" });
            }

            const school = new School(req.body);
            await school.save();
            res.status(201).json({ message: "Colegio creada correctamente", school });
        } catch (error) {
            res.status(500).json({message: "Error al crear la escuela", error: error.message});
        }
    },
    updateSchool: async (req, res)=>{
        try {
            const {id} = req.params;
            const { core_address } = req.body;
            const school = await School.findByIdAndUpdate(id, req.body, {new: true}) 
            if(!school){
                return res.status(404).json({message: "Colegio no encontrado"});
            }
            res.json({ message: "Colegio actualizada correctamente", school});

        } catch (error) {
            res.status(500).json({message:"Error al actualizar el Colegio", error: error.message})
        }
    },


    activateSchool: async (req, res)=>{
        try {
         const {id} = req.params;
         const school = await School.findByIdAndUpdate(
             id,
             {active: true},
             {new: true}
         )
         if(!school){
            return res.status(404).json({ message: "Colegio no Ecnotrado"})
         }
         res.json({message: "Colegio activado correctamente", school})


        } catch (error) {
            res.status(500).json({message:"Error al activar el Colegio"})
        }

    },

    deactivateSchool: async(req, res)=>{
        try {
        const { id } = req.params;
    const school = await School.findByIdAndUpdate(
            id,
            { active: false },
            { new: true }
        );
        if (!school) {
            return res.status(404).json({ message: "Colegio no encontrado" });
        }
    res.json({ message: "Colegio desactivado correctamente", school });
    } catch (error) {
    res.status(500).json({ message: "Error al desactivar el Colegio" });
    }

    },


    deleteSchool: async (req, res)=>{

        try {
            const {id} = req.params;
            const school = await School.findByIdAndDelete(id);
            res.json({ message: "colegio borrado correctamente", school});
            
        } catch (error) {
            res.status(500).json({message: "Error al borrar el colegio"});
        }
    }



}

export default httpSchools;
