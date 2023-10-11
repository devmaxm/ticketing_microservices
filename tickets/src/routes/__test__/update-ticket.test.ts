import mongoose from "mongoose";
import request from "supertest";
import app from "../../app";


const createTicket =  () => {
    return request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({title: 'test', price: 10})
}

const updateData = {
    title: 'updated ticket',
    price: 10
}

it('should fail if ticket doesnt exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString()

    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send(updateData)
        .expect(404)
})

it('should fail if unauthorized', async () => {
    const response = await createTicket()

    await request(app)
        .put(`/api/tickets/${response.body.ticket.id}`)
        .send(updateData)
        .expect(401)
})

it('should fail if user aren\'t author of ticket', async () => {
    const response = await createTicket()

    await request(app)
        .put(`/api/tickets/${response.body.ticket.id}`)
        .set('Cookie', global.signin())
        .send(updateData)
        .expect(401)
})


it('should fail if wrong title', async () => {
    const ticket = await createTicket()

    await request(app)
        .put(`/api/tickets/${ticket.body.ticket.id}`)
        .set('Cookie', global.signin())
        .send({title: '', price: 10})
        .expect(400)
})


it('should fail if wrong price', async () => {
    const ticket = await createTicket()

    await request(app)
        .put(`/api/tickets/${ticket.body.ticket.id}`)
        .set('Cookie', global.signin())
        .send({title: 'title', price: -10})
        .expect(400)
})


it('should succeed if valid inputs', async () => {
    const cookie = global.signin()

    const ticket = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({title: 'test', price: 10})

    await request(app)
        .put(`/api/tickets/${ticket.body.ticket.id}`)
        .set('Cookie', cookie)
        .send(updateData)
        .expect(200)

    const updatedTicket = await request(app)
        .get(`/api/tickets/${ticket.body.ticket.id}`)
        .send()
        .expect(200)

    expect(updatedTicket.body.ticket.id).toEqual(ticket.body.ticket.id)
    expect(updatedTicket.body.ticket.price).toEqual(updateData.price)
    expect(updatedTicket.body.ticket.title).toEqual(updateData.title)
})
