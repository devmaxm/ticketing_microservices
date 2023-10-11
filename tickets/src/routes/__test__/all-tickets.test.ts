import request from "supertest";
import app from "../../app";
import {Ticket} from "../../models/ticket";

const createTicket =  () => {
    return request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({title: 'test', price: 10})
}

it('should succeed if no tickets', async () => {
    const tickets = await Ticket.find({})
    expect(tickets.length).toEqual(0)

    const response = await request(app)
        .get('/api/tickets')
        .expect(200)

    expect(response.body.tickets).toEqual([])
})

it('should return list of tickets', async () => {
    await createTicket()
    await createTicket()
    await createTicket()

    const response = await request(app)
        .get('/api/tickets')
        .expect(200)

    expect(response.body.tickets.length).toEqual(3)
})
