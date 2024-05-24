const db = require("../database/models");
const EventosModel = db.getModel("Eventos");
const crearEvento = async (req, res) => {
    try {
      const nuevoEvento = await EventosModel.create({
        Nombre: req.body.Nombre,
        FechaRealizacion: req.body.FechaRealizacion,
        Geolocalizacion: req.body.Geolocalizacion,
        Descripcion: req.body.Descripcion,
        FechaCierreInscripcion: req.body.FechaCierreInscripcion,
      });
  
      res.status(201).json(nuevoEvento);
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.error(error);
    }
  };

  const obtenerEventos = async (req, res) => {
    try {
      const eventos = await EventosModel.findAll();
      return res.status(200).json(eventos);
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.error(error);
    }
  };

  const obtenerEventosId = async (req, res) => {
    try {
      const { id } = req.params;
      const evento = await EventosModel.findByPk(id);
      if (!evento) {
        return res.status(404).json({ error: "Evento no encontrado" });
      }
  
      return res.status(200).json(evento);
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.error(error);
    }
  };

  const actualizarEvento = async (req, res) => {
    const { id } = req.params; 
    const datosActualizados = req.body;
  
    try {
      const [filasActualizadas] = await EventosModel.update(datosActualizados, {
        where: { id: id }
      });
  
      if (filasActualizadas === 0) {
        return res.status(200).json({ mensaje: "No se realizaron cambios en el evento." });
      }
  
      const eventoActualizado = await EventosModel.findByPk(id);
  
      return res.status(200).json(eventoActualizado);
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.error(error);
    }
  };

  const eliminarEvento = async (req, res) => {
    try {
      const { id } = req.params;
  
      const eventoEliminado = await EventosModel.destroy({
        where: { id: id }
      });
      if (eventoEliminado === 0) {
        return res.status(404).json({ error: "Evento no encontrado o ya fue eliminado" });
      }

      return res.status(200).json({ mensaje: "Evento eliminado exitosamente" });
    } catch (error) {
      
      res.status(500).json({ error: error.message });
      console.error(error);
    }
  };

  module.exports ={
    crearEvento,
    obtenerEventos,
    obtenerEventosId,
    actualizarEvento,
    eliminarEvento
  }