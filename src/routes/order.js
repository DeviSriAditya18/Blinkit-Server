import { confirmOrder, createOrder, getCustomerOrders, getOrderById, getOrders, updateOrderStatus } from "../controllers/order/order.js";
import { verifyToken } from "../middleware/auth.js";

export const orderRoutes=async(fastify,options)=>{
    fastify.addHook("preHandler", async(req,reply)=>{
        const isAuthenticated=await verifyToken(req,reply);
        if(!isAuthenticated){
            return reply.code(401).send({message:"Unauthenticated"});
        }
    });

    fastify.post('/order', createOrder);
    fastify.get('/order', getOrders);
    fastify.patch('/order/:orderId/status', updateOrderStatus);
    fastify.post('/order/:orderId/confirm', confirmOrder);
    fastify.post('/order/:orderId', getOrderById);
    fastify.get('/customerOrder', getCustomerOrders);
}