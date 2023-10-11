import request from "supertest";
import app from "../../app";
import {Ticket} from "../../models/ticket";
import mongoose from "mongoose";


it('should fail if ticket doesn\'t exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app).get(`/api/tickets/${id}`).send().expect(404);
})

it('should succeed if ticket exists', async () => {
    const title = 'test'
    const price = 20
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({title, price})
        .expect(201)

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.ticket.id}`)
        .send()
        .expect(200)

    expect(ticketResponse.body.ticket.id).toEqual(response.body.ticket.id)
    expect(ticketResponse.body.ticket.price).toEqual(price)
    expect(ticketResponse.body.ticket.title).toEqual(title)
})
