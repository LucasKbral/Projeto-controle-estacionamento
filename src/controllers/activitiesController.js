import { openDatabase } from "../database.js";

export const activityCheckin = async (request, response) => {
    const { label } = request.body;
    
    const db = await openDatabase();
    const vehicle = await db.get(`
    SELECT * FROM vehicles WHERE label = ?
    `, [label]);
  
    if(vehicle) {
      const checkinAt = (new Date()).getTime();
      const data = await db.run(`
          INSERT INTO activities (vehicle_id, checkin_at)
          VALUES (?, ?)
      `, [vehicle.id, checkinAt]);
      db.close();
      response.send({
        vehicle_id: vehicle.id,
        checkin_at: checkinAt,
        message: `veículo [${vehicle.label}] entrou no estacionamento`
      });
      return;
    }
      db.close();
      response.send({
        message: `veículo [${label}] não cadastrado`
      });
  
  };

  export const activityCheckout = async (request, response) => {
    const { label, price } = request.body;
    
    const db = await openDatabase();
    const vehicle = await db.get(`
    SELECT * FROM vehicles WHERE label = ?
    `, [label]);
  
    
    if(vehicle) {
      const activityOpen = await db.get(`
          SELECT * 
          FROM activities 
          WHERE label = ?
          AND checkout_at IS NULL
    `, [vehicle.id]);
  
    if(activityOpen) {
      const checkoutAt = (new Date()).getTime();
      const data = await db.run(`
          UPDATE activities
          SET checkout_at = ?,
          price = ?
          WHERE id = ?
      `, [chekoutAt, price, activityOpen.id]);
      db.close();
      response.send({
        vehicle_id: vehicle.id,
        checkout_at: checkoutAt,
        price: price,
        message: `veículo [${vehicle.label}] saiu no estacionamento`
      });
      return;
  }
    }
      
      db.close();
      response.send({
        message: `veículo [${label}] não cadastrado`
    });
  };

  export const removeActivity = async (request, response) => {
    const { id } = request.params;
    const db = await openDatabase();
    const data = await db.run(`
        DELETE FROM activities
        WHERE id = ?  
    `, [id]);
    response.send({
      id,
      message: `Atividade [${id}] removida com sucesso`
    });
    
  
  };
  
  export const listActivities = async (request, response) => {
    const db = await openDatabase();
    const activities = await db.all(`
       SELECT * FROM activities
    `);
    db.close();
    response.send(activities);
  
  };