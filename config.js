

module.exports.token = process.env.BOT_TOKEN ;
module.exports.adminId = process.env.ADMIN_ID ;
module.exports.mongoConnectionString = 'mongodb://'+ (process.env.MONGO_ADD || 'localhost') + ':27017/myBot';
module.exports.basicOptions =   { "parse_mode": "Markdown" };
module.exports.helpMessage = "Hola.\nEste bot te muestra los cupones activos actualmente y te da la opción de avisarte cuando se creen otros nuevos. \n\nPara ver la lista de cupones activos usa /list.\n\nPara ser notificado cuando se creen nuevos cupones usa /subscribe. Si quieres detener las notificaciones puedes hacer /unsubscribe en cualquier momento. \n\nPuedes enviar un mensaje con sugerencias usando /suggest \"mensaje\" (evita usar saltos de linea).\n\n Finalmente puedes ver que nuevas características están en desarrollo con /about.";